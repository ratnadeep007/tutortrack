import { BookOpen } from 'lucide-react';
import { redirect } from 'next/navigation';
import OnboardingForm from '@/components/onboarding-form';
import getUserSession from '@/lib/getUserSession';
import { createClient } from '@/lib/supabase/server';

interface IPageProps {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{
    role: string;
    invited_by: string;
  }>;
}

export default async function OnboardingPage({ searchParams }: IPageProps) {
  const { data: session } = await getUserSession();
  const supabase = await createClient();

  if (!session || !session.session) {
    redirect('/login?error=no-session');
  }

  // Get role and invited_by from query parameters
  const role = (await searchParams).role as string | undefined;
  const invitedBy = (await searchParams).invited_by as string | undefined;

  if (!session?.session?.user) {
    redirect('/login');
  }

  // Check if profile is already complete
  const { data: isComplete, error: profileError } = await supabase.rpc(
    'is_profile_complete',
    { user_auth_id: session.session?.user.id }
  );

  if (profileError) {
    console.error('Error checking profile:', profileError);
  }

  if (isComplete) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <BookOpen className="size-4" />
          </div>
          TutorTrack
        </a>
        <OnboardingForm
          user={session.session.user}
          role={role}
          invitedBy={invitedBy}
        />
      </div>
    </div>
  );
}
