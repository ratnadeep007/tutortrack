'use client';

import React from 'react';
import { EmailPreview } from '@/components/email-preview';
import { ExamNotificationEmail } from '@/lib/email-templates/exam-notification';
import { sendTemplateEmail } from '@/lib/actions/email/action';

// Define the props type based on the ExamNotificationEmail component
type ExamNotificationEmailProps = {
  studentName: string;
  examName: string;
  examDate: string;
  examTime: string;
  duration: string;
  previewText?: string;
  loginUrl?: string;
};

export default function ExamNotificationEmailPreviewPage() {
  // Default props for the exam notification email template
  const defaultProps: ExamNotificationEmailProps = {
    studentName: 'John Doe',
    examName: 'Mathematics Final',
    examDate: 'June 15, 2023',
    examTime: '10:00 AM',
    duration: '2 hours',
    previewText: 'Your upcoming exam information',
    loginUrl: 'https://tutortrack.theskylab.in/login',
  };

  // Function to send a test email
  const sendTestEmail = async (to: string, props: Record<string, unknown>) => {
    try {
      // Cast the props to the correct type
      const emailProps: ExamNotificationEmailProps = {
        studentName: props.studentName as string,
        examName: props.examName as string,
        examDate: props.examDate as string,
        examTime: props.examTime as string,
        duration: props.duration as string,
        previewText: props.previewText as string,
        loginUrl: props.loginUrl as string,
      };

      const result = await sendTemplateEmail({
        to,
        subject: `Upcoming Exam: ${emailProps.examName}`,
        react: React.createElement(ExamNotificationEmail, emailProps),
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
        <h2 className="text-2xl font-bold">Exam Notification Email Template</h2>
        <p className="text-muted-foreground">
          This email is sent to students when an exam is scheduled.
        </p>
      </div>

      <EmailPreview
        template={<ExamNotificationEmail {...defaultProps} />}
        defaultProps={defaultProps}
        sendTestEmail={sendTestEmail}
      />
    </div>
  );
}
