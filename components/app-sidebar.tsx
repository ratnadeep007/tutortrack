import * as React from 'react';
import {
  AudioWaveform,
  Command,
  File,
  GalleryVerticalEnd,
  Users,
  LayoutDashboard,
  UserCog,
  School,
  Mail,
  User,
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
import { NavUser } from './nav-projects';
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
      url: '/dashboard/students',
      icon: Users,
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
      url: '/dashboard/admin/users',
      icon: UserCog,
      items: [
        {
          title: 'All Users',
          url: '/dashboard/admin/users',
        },
        {
          title: 'Teachers',
          url: '/dashboard/admin/users/teachers',
        },
        {
          title: 'Students',
          url: '/dashboard/admin/users/students',
        },
      ],
    },
    {
      title: 'Institutions',
      url: '/dashboard/institutions',
      icon: School,
    },
    {
      title: 'Email Templates',
      url: '/dashboard/admin/email-templates',
      icon: Mail,
      items: [
        {
          title: 'All Templates',
          url: '/dashboard/admin/email-templates',
        },
        {
          title: 'Create Template',
          url: '/dashboard/admin/email-templates/create',
        },
      ],
    },
  ],
  navUser: [
    {
      name: 'Profile',
      url: '/dashboard/profile',
      icon: User,
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
        <NavUser projects={data.navUser} />
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
