'use client';

import { useEffect, useState } from 'react';
import { ExamCard } from '@/components/exam-card';
import { getExams } from '@/lib/actions/exams/action';
import { Loader2 } from 'lucide-react';
import NewExam from '@/components/new-exam';
import { useExamStore } from '@/lib/store';

export default function DashboardPage() {
  // const [exams, setExams] = useState<Exam[] | null>(null);
  const [loading, setLoading] = useState(true);
  const exams = useExamStore((state) => state.exams);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await getExams();
        if ('error' in response) {
          console.log('Failed to fetch exams:', response.error);
          // throw new Error(response.error);
        }
        // setExams(response.data || []);
        useExamStore.getState().setExams(response.data || []);
      } catch (error) {
        console.error('Failed to fetch exams:', error);
      } finally {
        setLoading(false);
      }
    };

    if (exams.length === 0 && !fetched) {
      fetchExams();
      setFetched(true);
    }

    console.log('exams', exams);
  }, [exams, loading, fetched]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Exams</h1>
        <NewExam />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams?.map((exam) => <ExamCard key={exam.id} exam={exam} />)}
      </div>
    </div>
  );
}
