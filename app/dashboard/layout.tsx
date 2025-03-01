'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

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
import { ThemeSwitcher } from '@/components/theme-switcher';
import { useUserStore } from '@/lib/store/user-store';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = useSupabaseClient();
  const pathname = usePathname();
  const { setUser } = useUserStore();

  useEffect(() => {
    // Check profile completion and admin status
    const checkProfile = async () => {
      const userStoreData = {
        role: '',
        isAdmin: false,
        email: '',
        phoneNumber: '',
        id: '',
        profileComplete: false,
        name: '',
      };
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        try {
          userStoreData.email = user.email || '';
          // Check profile completion
          const { data: isComplete, error: profileError } = await supabase.rpc(
            'is_profile_complete',
            { user_auth_id: user.id }
          );

          if (profileError) {
            console.error('Error checking profile:', profileError);
          } else {
            userStoreData.profileComplete = isComplete;
          }

          // Check if user is admin
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('auth_user_id', user.id)
            .single();

          userStoreData.role = userData?.role || '';
          userStoreData.isAdmin = userData?.role === 'admin';
          userStoreData.phoneNumber = userData?.phone_number || '';
          userStoreData.id = user.id || '';
          userStoreData.name = userData?.full_name || '';
          setUser(userStoreData);
        } catch (error) {
          console.error('Error checking profile:', error);
        }
      } else {
        setUser({
          email: '',
          role: '',
          phoneNumber: '',
          id: '',
          profileComplete: false,
        });
      }
    };
    checkProfile();
  }, [supabase, setUser]);

  const formattedPathname = pathname
    ? (pathname.split('/').pop() || 'Dashboard').charAt(0).toUpperCase() +
      (pathname.split('/').pop() || 'Dashboard').slice(1)
    : 'Dashboard';

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
                  <h1 className="text-lg font-semibold">{formattedPathname}</h1>
                </div>
                <div className="flex flex-row justify-start items-center gap-2">
                  <ThemeSwitcher />
                  <form
                    action={async () => {
                      localStorage.removeItem('admin-view');
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
