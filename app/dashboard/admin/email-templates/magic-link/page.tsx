'use client';

import React from 'react';
import { EmailPreview } from '@/components/email-preview';
import { MagicLinkEmail } from '@/lib/email-templates/magiclink-email';
import { sendTemplateEmail } from '@/lib/actions/email/action';

// Define the props type based on the VerificationEmail component
type VerificationEmailProps = {
  userName: string;
  verificationUrl: string;
  previewText?: string;
};

export default function VerificationEmailPreviewPage() {
  // Default props for the verification email template
  const defaultProps: VerificationEmailProps = {
    userName: 'John Doe',
    verificationUrl:
      'https://tutortrack.theskylab.in/verify-email?token=example-token',
    previewText:
      'Verify your email address to complete your TutorTrack registration',
  };

  // Function to send a test email
  const sendEmail = async (to: string, props: Record<string, unknown>) => {
    try {
      // Cast the props to the correct type
      const emailProps: VerificationEmailProps = {
        userName: props.userName as string,
        verificationUrl: props.verificationUrl as string,
        previewText: props.previewText as string,
      };

      const result = await sendTemplateEmail({
        to,
        subject: 'Verify Your Email Address',
        react: React.createElement(MagicLinkEmail, emailProps),
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
        <h2 className="text-2xl font-bold">Email Verification Template</h2>
        <p className="text-muted-foreground">
          This email is sent to users when they register to verify their email
          address.
        </p>
      </div>

      <EmailPreview
        template={<MagicLinkEmail {...defaultProps} />}
        defaultProps={defaultProps}
        sendTestEmail={sendEmail}
      />
    </div>
  );
}
