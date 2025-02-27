'use client';

import React from 'react';
// import { EmailPreview } from '@/components/email-preview';
// import { WelcomeEmail } from '@/lib/email-templates/welcome-email';
// import { sendTemplateEmail } from '@/lib/actions/email/action';

// Define the props type based on the WelcomeEmail component
// type WelcomeEmailProps = {
//   userName: string;
//   userRole?: 'student' | 'teacher' | 'admin';
//   dashboardUrl?: string;
//   previewText?: string;
// };

export default function WelcomeEmailPreviewPage() {
  // Default props for the welcome email template
  // const defaultProps: WelcomeEmailProps = {
  //   userName: 'John Doe',
  //   userRole: 'student',
  //   dashboardUrl: 'https://tutortrack.theskylab.in/dashboard',
  //   previewText: 'Welcome to TutorTrack! Get started with your account.',
  // };

  // // Function to send a test email
  // const sendTestEmail = async (to: string, props: Record<string, unknown>) => {
  //   try {
  //     // Cast the props to the correct type
  //     const emailProps: WelcomeEmailProps = {
  //       userName: props.userName as string,
  //       userRole: props.userRole as 'student' | 'teacher' | 'admin',
  //       dashboardUrl: props.dashboardUrl as string,
  //       previewText: props.previewText as string,
  //     };

  //     const result = await sendTemplateEmail({
  //       to,
  //       subject: 'Welcome to TutorTrack!',
  //       react: React.createElement(WelcomeEmail, emailProps),
  //     });

  //     if (result.error) {
  //       return {
  //         success: false,
  //         message: result.error,
  //       };
  //     }

  //     return {
  //       success: true,
  //       message: 'Test email sent successfully!',
  //     };
  //   } catch (error) {
  //     return {
  //       success: false,
  //       message:
  //         error instanceof Error ? error.message : 'Failed to send test email',
  //     };
  //   }
  // };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Welcome Email Template</h2>
        <p className="text-muted-foreground">
          This email is sent to users when they first sign up for TutorTrack.
        </p>
      </div>

      {/* <EmailPreview
        template={<WelcomeEmail {...defaultProps} />}
        defaultProps={defaultProps}
        sendTestEmail={sendTestEmail}
      /> */}
    </div>
  );
}
