'use client';

import React from 'react';
import { EmailPreview } from '@/components/email-preview';
import { BasicEmail } from '@/lib/email-templates/basic-email';
import { sendTemplateEmail } from '@/lib/actions/email/action';

// Define the props type based on the BasicEmail component
type BasicEmailProps = {
  title: string;
  message: string;
  buttonText?: string;
  buttonUrl?: string;
};

export default function PasswordResetEmailPreviewPage() {
  // Default props for the password reset email template
  const defaultProps: BasicEmailProps = {
    title: 'Reset Your Password',
    message:
      "Hello John, we received a request to reset your password. Click the button below to set a new password. If you didn't request this, you can safely ignore this email.",
    buttonText: 'Reset Password',
    buttonUrl:
      'https://tutortrack.theskylab.in/reset-password?token=example-token',
  };

  // Function to send a test email
  const sendTestEmail = async (to: string, props: Record<string, unknown>) => {
    try {
      // Cast the props to the correct type
      const emailProps: BasicEmailProps = {
        title: props.title as string,
        message: props.message as string,
        buttonText: props.buttonText as string,
        buttonUrl: props.buttonUrl as string,
      };

      const result = await sendTemplateEmail({
        to,
        subject: 'Reset Your Password',
        react: React.createElement(BasicEmail, emailProps),
      });

      if (result.error) {
        return {
          success: false,
          message: result.error,
        };
      }

      return {
        success: true,
        message: 'Test email sent successfully!',
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to send test email',
      };
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Password Reset Email Template</h2>
        <p className="text-muted-foreground">
          This email is sent when a user requests a password reset.
        </p>
      </div>

      <EmailPreview
        template={<BasicEmail {...defaultProps} />}
        defaultProps={defaultProps}
        sendTestEmail={sendTestEmail}
      />
    </div>
  );
}
