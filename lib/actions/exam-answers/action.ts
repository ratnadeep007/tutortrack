'use server';

import { createClient } from '@/lib/supabase/server';
import { getUserIdFromSession } from '@/lib/common';

interface ExamAnswer {
  questionId: string;
  answer: string;
  selectedOptions?: string[];
  timeSpent?: number;
}

interface SubmitExamAnswersParams {
  examId: string;
  answers: Record<string, ExamAnswer>;
}

export async function submitExamAnswers({
  examId,
  answers,
}: SubmitExamAnswersParams) {
  const supabase = await createClient();
  const sessionUser = await getUserIdFromSession();

  if (!sessionUser) {
    return { error: 'User not authenticated' };
  }

  // Check if exam exists
  const { data: exam, error: examError } = await supabase
    .from('exams')
    .select('id')
    .eq('id', examId)
    .single();

  if (examError || !exam) {
    return { error: 'Exam not found' };
  }

  // Check if user has already submitted answers
  const { data: existingAnswer } = await supabase
    .from('exam_answers')
    .select('id')
    .eq('exam_id', examId)
    .eq('user_id', sessionUser)
    .single();

  try {
    if (existingAnswer) {
      // Update existing answers
      const { error: updateError } = await supabase
        .from('exam_answers')
        .update({
          answers,
          updated_at: new Date().toISOString(),
          submitted_at: new Date().toISOString(),
        })
        .eq('id', existingAnswer.id);

      if (updateError) {
        throw updateError;
      }
    } else {
      // Insert new answers
      const { error: insertError } = await supabase
        .from('exam_answers')
        .insert({
          exam_id: examId,
          user_id: sessionUser,
          answers,
        });

      if (insertError) {
        throw insertError;
      }
    }

    return { success: true };
  } catch (error: unknown) {
    console.error('Error submitting exam answers:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to submit exam answers';
    return { error: errorMessage };
  }
}

export async function getExamAnswers(examId: string) {
  const supabase = await createClient();
  const sessionUser = await getUserIdFromSession();

  if (!sessionUser) {
    return { error: 'User not authenticated' };
  }

  const { data, error } = await supabase
    .from('exam_answers')
    .select('*')
    .eq('exam_id', examId)
    .eq('user_id', sessionUser)
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data };
}
