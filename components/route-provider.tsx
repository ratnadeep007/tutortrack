'use client';

import { redirect, usePathname, useSearchParams } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { useEffect } from 'react';

const routesRedirected = ['/onboarding', '/login'];

export default function RouteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = getSupabaseBrowserClient();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleRouting = async () => {
      const { data: user, error: userError } = await supabase.auth.getUser();

      if (
        routesRedirected.includes(pathname) &&
        searchParams.get('redirected') === 'true'
      ) {
        return <>{children}</>;
      }

      if (userError) {
        console.log('Error fetching user:', userError);
        redirect('/login?redirected=true');
      }

      const { data: userData, error: userDataError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', user.user?.id)
        .single();

      if (userDataError || !userData) {
        console.log('Error fetching user:', userDataError);
        redirect('/login?redirected=true');
      }

      const { data: isComplete, error: profileError } = await supabase.rpc(
        'is_profile_complete',
        { user_auth_id: user.user?.id }
      );

      console.log('isComplete', isComplete);

      if (profileError) {
        console.log('Error checking profile:', profileError);
        redirect('/login?redirected=true');
      }

      if (!isComplete) {
        const role = searchParams.get('role');
        console.log('Redirecting to onboarding');
        redirect(`/onboarding?role=${role}`);
      }

      if (isComplete) {
        console.log('Redirecting to dashboard');
        if (routesRedirected.includes(pathname)) {
          redirect('/dashboard');
        } else {
          redirect(pathname);
        }
      }
    };

    handleRouting();
  }, [supabase, pathname, searchParams, children]);

  return <>{children}</>;
}
