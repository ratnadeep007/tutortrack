'use client';
import { GalleryVerticalEnd } from 'lucide-react';
import { Suspense } from 'react';
import { LoginForm } from '@/components/login-form';
import { Toaster } from '@/components/ui/toaster';
import { redirect, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import useSupabaseClient from '@/lib/supabase/client';

function LoginContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const supabase = useSupabaseClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user) {
        redirect('/dashboard');
      }
    };
    checkSession();
  }, [supabase]);

  useEffect(() => {
    if (searchParams.get('toast') === 'success_signup') {
      toast({
        title: 'Account created successfully',
        description: 'Please check your email to verify your account.',
      });
    }
  }, [searchParams, toast]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
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
