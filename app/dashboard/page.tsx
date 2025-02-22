'use client';

import useSupabaseClient from '@/lib/supabase/client';
import { ExamDetailCard } from '@/components/ui/exam-detail-card';
import { Exam } from '@/lib/interfaces/exam';
import { getExams } from '@/lib/actions/exams/action';
import { useEffect, useState } from 'react';
import NewExam from '@/components/new-exam';
import { useExamStore } from '@/lib/store';

export default function DashboardPage() {
  const supabase = useSupabaseClient();
  const exams = useExamStore((state) => state.exams);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch exams
    const fetchData = async () => {
      try {
        const { data: examsData, error: examsErr } = await getExams();
        if (examsErr) {
          throw examsErr;
        }
        useExamStore.getState().setExams(examsData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch exams');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        <div>
          <NewExam />
        </div>
        <div className="text-center py-10">Loading exams...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-2">
        <div>
          <NewExam />
        </div>
        <div className="text-center py-10 text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div>
        <NewExam />
      </div>
      {exams?.length === 0 ? (
        <div className="text-center py-10">
          No exams found. Create your first exam!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {exams?.map((exam: Exam) => (
            <ExamDetailCard
              key={exam.id}
              id={exam.id}
              title={exam.name}
              duration_minutes={exam.duration_minutes}
            />
          ))}
        </div>
      )}
    </div>
  );
}
