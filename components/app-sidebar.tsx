'use client';

import * as React from 'react';
import {
  File,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  Users,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
// import { NavProjects } from "@/components/nav-projects"
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import useSupabaseClient from '@/lib/supabase/client';

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    // {
    //   name: "Acme Corp.",
    //   logo: AudioWaveform,
    //   plan: "Startup",
    // },
    // {
    //   name: "Evil Corp.",
    //   logo: Command,
    //   plan: "Free",
    // },
  ],
  navMain: [
    {
      title: 'Exams',
      url: '#',
      icon: File,
      isActive: true,
      items: [
        {
          title: 'Exam',
          url: '/dashboard',
        },
        {
          title: 'Questions',
          url: '/dashboard/questions',
        },
        {
          title: 'Results',
          url: '#',
        },
      ],
    },
    {
      title: 'Students',
      url: '#',
      icon: Users,
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Exams',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const supabase = useSupabaseClient();
  const [user, setUser] = React.useState<{
    email: string;
    name: string;
    avatar: string;
  } | null>(null);

  React.useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data: users } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', user?.id)
        .limit(1);
      if (user) {
        setUser({
          email: user.email || '',
          name: users?.[0].full_name || '',
          avatar: '/avatars/shadcn.jpg',
        });
      }
    }
    getUser();
  }, [supabase]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
