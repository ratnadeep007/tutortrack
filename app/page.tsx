import { LoginForm } from '@/components/login-form';
import { getUserIdFromSession } from '@/lib/common';
import { redirect } from 'next/navigation';

export default async function Home() {
  const userId = await getUserIdFromSession();

  if (userId) {
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
