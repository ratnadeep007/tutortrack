import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'TutorTrack Admin Dashboard',
};

export default function AdminDashboardPage() {
  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your TutorTrack application settings and resources.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/email-templates"
          className="group relative rounded-lg border p-6 hover:bg-muted"
        >
          <h3 className="font-semibold">Email Templates</h3>
          <p className="text-sm text-muted-foreground">
            Preview and test email templates used in the application.
          </p>
        </Link>

        {/* Add more admin features as needed */}
      </div>
    </div>
  );
}
