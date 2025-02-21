import { LoginForm } from '@/components/login-form';
import getUserSession from '@/lib/getUserSession';
import { redirect } from 'next/navigation';

export default async function Home() {
  const { data: session } = await getUserSession();

  if (session) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm />
    </div>
  );
}
