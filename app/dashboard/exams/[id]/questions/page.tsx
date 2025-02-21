import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Question {
  id: string;
  question_text: string;
  score: number;
  is_multiple_choice: boolean;
  created_at: string;
  answers: {
    id: string;
    answer_text: string;
    is_correct: boolean;
  }[];
}

export default async function QuestionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createServerComponentClient({ cookies });

  // Fetch questions for this exam
  const { data: questions, error } = await supabase
    .from('exam_questions')
    .select(
      `
            question:questions (
                id,
                question_text,
                score,
                is_multiple_choice,
                created_at,
                answers (
                    id,
                    answer_text,
                    is_correct
                )
            )
        `
    )
    .eq('exam_id', id)
    .returns<{ question: Question }[]>();

  if (error) {
    return <div className="p-4">Error loading questions: {error.message}</div>;
  }

  const formattedQuestions = questions?.map((q) => q.question) || [];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Exam Questions</h1>

      {formattedQuestions.length === 0 ? (
        <div className="text-center py-10">
          No questions found for this exam.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead className="w-[100px] text-center">Score</TableHead>
                <TableHead className="w-[100px] text-center">Options</TableHead>
                <TableHead className="w-[150px] text-right">Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formattedQuestions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell className="max-w-[400px] py-2">
                    {question.question_text.replace(/<[^>]*>/g, '')}
                  </TableCell>
                  <TableCell className="text-center">
                    {question.score}
                  </TableCell>
                  <TableCell className="text-center">
                    {question.answers?.length || 0}
                  </TableCell>
                  <TableCell className="text-right">
                    {question.is_multiple_choice
                      ? 'Multiple correct'
                      : 'Single correct'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
