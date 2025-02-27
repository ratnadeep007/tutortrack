import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Email Templates Preview',
  description: 'Preview and test email templates',
};

export default function EmailTemplatesPage() {
  const templates = [
    {
      id: 'welcome',
      name: 'Welcome Email',
      description: 'Sent to new users when they sign up',
      path: '/dashboard/admin/email-templates/welcome',
    },
    {
      id: 'magic-link',
      name: 'Magic Link',
      description:
        'Sent to users to verify their email address during registration',
      path: '/dashboard/admin/email-templates/magic-link',
    },
    {
      id: 'exam-notification',
      name: 'Exam Notification',
      description: 'Sent to students when an exam is scheduled',
      path: '/dashboard/admin/email-templates/exam-notification',
    },
    {
      id: 'password-reset',
      name: 'Password Reset',
      description: 'Sent when a user requests a password reset',
      path: '/dashboard/admin/email-templates/password-reset',
    },
    // Add more templates as needed
  ];

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Email Templates</h1>
        <p className="text-muted-foreground">
          Preview and test email templates used in the application.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Link
            key={template.id}
            href={template.path}
            className="group relative rounded-lg border p-6 hover:bg-muted"
          >
            <h3 className="font-semibold">{template.name}</h3>
            <p className="text-sm text-muted-foreground">
              {template.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
