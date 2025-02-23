import * as React from 'react';
import {
  AudioWaveform,
  Command,
  File,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  Users,
  LayoutDashboard,
  UserCog,
  School,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
// import { NavProjects } from "@/components/nav-projects"
// import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
// import { useUserStore } from '@/lib/store/user-store';

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'MentorTrack',
      logo: GalleryVerticalEnd,
      plan: 'Mentor',
    },
    {
      name: 'StudentTrack',
      logo: AudioWaveform,
      plan: 'Student',
    },
    {
      name: 'AdminTrack',
      logo: Command,
      plan: 'Admin',
    },
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
  adminNav: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'User Management',
      url: '/dashboard/users',
      icon: UserCog,
      items: [
        {
          title: 'All Users',
          url: '/dashboard/users',
        },
        {
          title: 'Teachers',
          url: '/dashboard/users/teachers',
        },
        {
          title: 'Students',
          url: '/dashboard/users/students',
        },
      ],
    },
    {
      title: 'Institutions',
      url: '/dashboard/institutions',
      icon: School,
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '/dashboard/settings',
        },
        {
          title: 'Security',
          url: '/dashboard/settings/security',
        },
        {
          title: 'Billing',
          url: '/dashboard/settings/billing',
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
  const [activeTrack, setActiveTrack] = React.useState('MentorTrack');
  // const { getUser } = useUserStore();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} onTrackChange={setActiveTrack} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={activeTrack === 'AdminTrack' ? data.adminNav : data.navMain}
        />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        {/* {getUser()?.email && (
          <NavUser
            user={{
              name: getUser()?.name,
              email: getUser()?.email,
              avatar: '/avatars/shadcn.jpg',
            }}
          />
        )} */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
