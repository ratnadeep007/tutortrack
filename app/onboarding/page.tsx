import { GalleryVerticalEnd } from 'lucide-react';
import { redirect } from 'next/navigation';
import OnboardingForm from '@/components/onboarding-form';
import getUserSession from '@/lib/getUserSession';
import { createClient } from '@/lib/supabase/server';

export default async function OnboardingPage() {
  const { data: session } = await getUserSession();
  const supabase = await createClient();

  if (!session) {
    console.error('No session found');
    redirect('/login');
  }

  console.log('session', session.session?.user.id);

  if (!session?.session?.user) {
    redirect('/login');
  }

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.session?.user.id);

  console.log('user', user);

  // Check if profile is already complete
  const { data: isComplete, error: profileError } = await supabase.rpc(
    'is_profile_complete',
    { user_auth_id: session.session?.user.id }
  );

  console.log('isComplete', isComplete);

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
            <GalleryVerticalEnd className="size-4" />
          </div>
          TutorTrack
        </a>
        <OnboardingForm user={session.session.user} />
      </div>
    </div>
  );
}
