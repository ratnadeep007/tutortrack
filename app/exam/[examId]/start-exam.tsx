'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

interface StartExamProps {
  examId: string;
  registration: {
    id: string;
    student_name: string;
    email: string;
    status: string;
  };
}

export default function StartExam({ examId, registration }: StartExamProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStartExam = async () => {
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase
        .from('exam_registrations')
        .update({ status: 'in_progress', started_at: new Date().toISOString() })
        .eq('id', registration.id);

      if (error) throw error;

      // Redirect to the exam interface
      router.push(`/exam/${examId}/take`);
    } catch (err) {
      setError('Failed to start exam. Please try again.');
      console.error('Start exam error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (registration.status === 'in_progress') {
    return (
      <div className="flex w-full flex-col gap-6 rounded-lg border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            Exam in Progress
          </h2>
          <p className="text-sm text-muted-foreground">
            You have already started this exam. Click below to continue.
          </p>
        </div>
        <button
          onClick={() => router.push(`/exam/${examId}/take`)}
          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Continue Exam
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6 rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          Welcome, {registration.student_name}
        </h2>
        <p className="text-sm text-muted-foreground">
          Please review the instructions before starting your exam
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-md bg-muted p-4">
        <h3 className="mb-2 font-medium">Important Instructions:</h3>
        <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
          <li>Ensure you have a stable internet connection</li>
          <li>Do not refresh or close the browser during the exam</li>
          <li>Complete all questions within the allotted time</li>
          <li>Your responses are automatically saved</li>
        </ul>
      </div>

      <button
        onClick={handleStartExam}
        disabled={loading}
        className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      >
        {loading ? 'Starting...' : 'Start Exam'}
      </button>
    </div>
  );
}
