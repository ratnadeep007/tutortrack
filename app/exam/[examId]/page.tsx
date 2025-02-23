import { createClient } from '@/lib/supabase/server';
import { BookOpen } from 'lucide-react';
import OnboardingForm from '@/app/exam/[examId]/onboarding-form';
import StartExam from '@/app/exam/[examId]/start-exam';

interface PageProps {
  params: Promise<{ examId: string }>;
}

export default async function ExamPage({ params }: PageProps) {
  const { examId } = await params;
  const supabase = await createClient();

  // Check if exam exists
  const { data: exam, error: examError } = await supabase
    .from('exams')
    .select('*')
    .eq('id', examId)
    .single();

  console.log('Exam', examError, exam);

  if (examError || !exam) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a
            href="#"
            className="flex items-center gap-2 self-center font-medium"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <BookOpen className="size-4" />
            </div>
            TutorTrack
          </a>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Exam Not Found</h1>
            <p className="mt-2 text-gray-600">
              The exam you&apos;re looking for doesn&apos;t exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Get current user's data
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userEmail = user?.email;

  console.log('User', await supabase.auth.getUser());
  console.log('User', await supabase.auth.getSession());

  if (user) {
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', user.id)
      .single();

    if (userData?.role === 'student') {
      console.log('User is a student');
    }
  }

  // Check if student is already registered for this exam
  const { data: registration } = await supabase
    .from('exam_registrations')
    .select('*')
    .eq('exam_id', examId)
    .eq('email', userEmail)
    .single();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <BookOpen className="size-4" />
          </div>
          TutorTrack
        </a>
        <div className="flex flex-col gap-6">
          <h1 className="text-center text-2xl font-bold">{exam.title}</h1>
          {registration ? (
            <StartExam examId={examId} registration={registration} />
          ) : (
            <OnboardingForm examId={examId} userEmail={userEmail} />
          )}
        </div>
      </div>
    </div>
  );
}
