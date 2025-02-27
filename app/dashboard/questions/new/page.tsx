'use client';

import { useState } from 'react';
import { QuestionEditor } from '@/components/question-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import useSupabaseClient from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getUserIdFromBrowser } from '@/lib/common-browser';

interface Answer {
  id: string;
  content: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  content: string;
  answers: Answer[];
  score: number;
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: '1',
    content: '',
    answers: [],
    score: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  const addAnswer = () => {
    setCurrentQuestion((prev) => ({
      ...prev,
      answers: [
        ...prev.answers,
        {
          id: Date.now().toString(),
          content: '',
          isCorrect: false,
        },
      ],
    }));
  };

  const updateAnswerContent = (answerId: string, content: string) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      answers: prev.answers.map((answer) =>
        answer.id === answerId ? { ...answer, content } : answer
      ),
    }));
  };

  const toggleCorrectAnswer = (answerId: string) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      answers: prev.answers.map((answer) =>
        answer.id === answerId
          ? { ...answer, isCorrect: !answer.isCorrect }
          : answer
      ),
    }));
  };

  const saveQuestion = async () => {
    if (currentQuestion.content.trim() === '') {
      toast({
        title: 'Error',
        description: 'Question content cannot be empty',
        variant: 'destructive',
      });
      return;
    }

    if (currentQuestion.answers.length < 2) {
      toast({
        title: 'Error',
        description: 'Add at least two answers',
        variant: 'destructive',
      });
      return;
    }

    if (!currentQuestion.answers.some((answer) => answer.isCorrect)) {
      toast({
        title: 'Error',
        description: 'Mark at least one answer as correct',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Get the current user
      const user = await getUserIdFromBrowser();

      // Insert the question
      const { data: questionData, error: questionError } = await supabase
        .from('questions')
        .insert({
          question_text: currentQuestion.content,
          score: currentQuestion.score,
          created_by: user,
          is_multiple_choice:
            currentQuestion.answers.filter((a) => a.isCorrect).length > 1,
        })
        .select()
        .single();

      if (questionError) throw questionError;

      // Insert all answers
      const answersToInsert = currentQuestion.answers.map((answer) => ({
        question_id: questionData.id,
        answer_text: answer.content,
        is_correct: answer.isCorrect,
      }));

      const { error: answersError } = await supabase
        .from('answers')
        .insert(answersToInsert);

      if (answersError) throw answersError;

      setQuestions((prev) => [...prev, currentQuestion]);
      setCurrentQuestion({
        id: Date.now().toString(),
        content: '',
        answers: [],
        score: 1,
      });

      //   toast({
      //     title: "Success",
      //     description: "Question saved successfully",
      //   })
    } catch (error) {
      console.error('Error saving question:', error);
      toast({
        title: 'Error',
        description: 'Failed to save question. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Question Management</h1>

      <div className="space-y-6">
        <Accordion
          type="single"
          defaultValue="add-question"
          collapsible
          className="w-full"
        >
          <AccordionItem value="add-question">
            <AccordionTrigger className="text-left">
              <div className="flex flex-col items-start gap-1">
                <div className="text-lg font-semibold">Add New Question</div>
                <div className="text-xs text-muted-foreground">
                  Create a new multiple choice question
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card className="border-0 shadow-none">
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div>
                      <Label>Question</Label>
                      <QuestionEditor
                        content={currentQuestion.content}
                        onChange={(content) =>
                          setCurrentQuestion((prev) => ({ ...prev, content }))
                        }
                        placeholder="Type your question here..."
                      />
                    </div>

                    <div>
                      <Label>Score</Label>
                      <Input
                        type="number"
                        min="1"
                        step="0.5"
                        value={currentQuestion.score}
                        onChange={(e) =>
                          setCurrentQuestion((prev) => ({
                            ...prev,
                            score: parseFloat(e.target.value) || 1,
                          }))
                        }
                        className="w-32"
                      />
                    </div>

                    <div className="space-y-4">
                      <Label>Answers</Label>
                      {currentQuestion.answers.map((answer) => (
                        <div
                          key={answer.id}
                          className="flex items-center gap-4"
                        >
                          <Input
                            value={answer.content}
                            onChange={(e) =>
                              updateAnswerContent(answer.id, e.target.value)
                            }
                            placeholder="Type answer..."
                            className="flex-1"
                          />
                          <Button
                            variant={answer.isCorrect ? 'default' : 'outline'}
                            onClick={() => toggleCorrectAnswer(answer.id)}
                          >
                            {answer.isCorrect ? 'Correct' : 'Mark as Correct'}
                          </Button>
                        </div>
                      ))}
                      <Button
                        onClick={addAnswer}
                        className="ml-2"
                        variant="outline"
                      >
                        Add Answer
                      </Button>
                    </div>

                    <Button
                      onClick={saveQuestion}
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save Question'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {questions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Saved Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {questions.map((question) => (
                  <AccordionItem key={question.id} value={question.id}>
                    <AccordionTrigger className="text-left">
                      <div className="flex flex-col items-start gap-1">
                        <div className="text-sm">
                          {question.content
                            .replace(/<[^>]*>/g, '')
                            .slice(0, 100)}
                          {question.content.length > 100 ? '...' : ''}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {question.answers.length} options •
                          {question.answers.filter((a) => a.isCorrect).length >
                          1
                            ? ' Multiple correct'
                            : ' Single correct'}{' '}
                          • Score: {question.score}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-4">
                        <div
                          dangerouslySetInnerHTML={{ __html: question.content }}
                        />
                        <div className="mt-2 space-y-2">
                          {question.answers.map((answer) => (
                            <div
                              key={answer.id}
                              className={`p-2 rounded ${
                                answer.isCorrect
                                  ? 'bg-green-100 dark:bg-green-900'
                                  : ''
                              }`}
                            >
                              {answer.content}
                            </div>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
