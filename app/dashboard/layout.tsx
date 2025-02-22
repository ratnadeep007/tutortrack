'use client';

import { useEffect, useState } from 'react';

import { AppSidebar } from '@/components/app-sidebar';
import { Button } from '@/components/ui/button';
import {
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import { SidebarProvider } from '@/components/ui/sidebar';
import { signOut } from '@/lib/actions/auth/action';
import useSupabaseClient from '@/lib/supabase/client';
import { redirect } from 'next/navigation';
import { ThemeSwitcher } from '@/components/theme-switcher';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = useSupabaseClient();
  const [pathname, setPathname] = useState<string>('');
  const [profileComplete, setProfileComplete] = useState<boolean | null>(null);
  useEffect(() => {
    // Get pathname from URL and format it
    const path = window.location.pathname.split('/').pop() || 'dashboard';
    setPathname(path.charAt(0).toUpperCase() + path.slice(1));
  }, []);

  useEffect(() => {
    // Check profile completion
    const checkProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log('user', user);
      if (user) {
        try {
          const { data: isComplete, error: profileError } = await supabase.rpc(
            'is_profile_complete',
            { user_auth_id: user.id }
          );

          if (profileError) {
            console.error('Error checking profile:', profileError);
          } else {
            setProfileComplete(isComplete);
          }
        } catch (error) {
          console.error('Error checking profile:', error);
        }
      } else {
        setProfileComplete(false);
      }
    };
    checkProfile();
  }, [supabase]);

  // Redirect if profile is not complete
  useEffect(() => {
    if (profileComplete === false) {
      redirect('/onboarding');
    }
  }, [profileComplete]);

  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SidebarContent>
            <SidebarHeader>
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row justify-start items-center">
                  <SidebarTrigger size="default" />
                  <h1 className="text-lg font-semibold">
                    {pathname || 'Dashboard'}
                  </h1>
                </div>
                <div className="flex flex-row justify-start items-center gap-2">
                  <ThemeSwitcher />
                  <form
                    action={async () => {
                      await signOut();
                    }}
                  >
                    <Button className="text-sm p-2" variant="outline">
                      Sign out
                    </Button>
                  </form>
                </div>
              </div>
            </SidebarHeader>
            <div className="px-3">{children}</div>
          </SidebarContent>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
