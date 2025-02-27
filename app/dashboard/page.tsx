'use client';

import { useEffect, useState } from 'react';
import { ExamCard } from '@/components/exam-card';
import { getExams } from '@/lib/actions/exams/action';
import { Loader2 } from 'lucide-react';

interface Exam {
  id: string;
  name: string;
  duration_minutes: number;
  created_at: string;
}

export default function DashboardPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await getExams();
        if ('error' in response) {
          console.log('Failed to fetch exams:', response.error);
          // throw new Error(response.error);
        }
        setExams(response.data || []);
      } catch (error) {
        console.error('Failed to fetch exams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">My Exams</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <ExamCard key={exam.id} exam={exam} />
        ))}
      </div>
    </div>
  );
}
