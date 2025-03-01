'use client';
import { BookOpen } from 'lucide-react';
import { Suspense } from 'react';
import { LoginForm } from '@/components/login-form';
import { Toaster } from '@/components/ui/toaster';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

function LoginContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    if (searchParams.get('toast') === 'success_signup') {
      toast({
        title: 'Account created successfully',
        description: 'Please check your email to verify your account.',
      });
    }
    if (searchParams.get('toast') === 'success_login') {
      toast({
        title: 'Login successful',
        description: 'Please check your email to login to your account.',
      });
    }
    if (searchParams.get('error') === 'no-session') {
      toast({
        title: 'No session found',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
    if (searchParams.get('error') === 'sign-in-failed') {
      toast({
        title: 'Sign in failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
    if (searchParams.get('error') === 'verification-failed') {
      toast({
        title: 'Verification failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  }, [searchParams, toast]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <BookOpen className="size-4" />
          </div>
          TutorTrack
        </a>
        <LoginForm />
        <Toaster />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
