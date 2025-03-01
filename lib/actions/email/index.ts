'use server';

import React from 'react';
import { sendEmail, sendHtmlEmail, sendTemplateEmail } from './action';
import { BasicEmail } from '@/lib/email-templates/basic-email';
import { WelcomeEmail } from '@/lib/email-templates/welcome-email';
import { ExamNotificationEmail } from '@/lib/email-templates/exam-notification';
import { MagicLinkEmail } from '@/lib/email-templates/magiclink-email';

/**
 * Example of sending a simple text email
 */
export async function sendWelcomeTextEmail(to: string, name: string) {
  return sendEmail({
    to,
    subject: 'Welcome to TutorTrack!',
    text: `Hello ${name},\n\nWelcome to TutorTrack! We're excited to have you on board.\n\nBest regards,\nThe TutorTrack Team`,
  });
}

/**
 * Example of sending an HTML email
 */
export async function sendExamReminderHtmlEmail(
  to: string,
  name: string,
  examName: string,
  examDate: string
) {
  const html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h1 style="color: #4f46e5;">Exam Reminder</h1>
      <p>Hello ${name},</p>
      <p>This is a reminder that your <strong>${examName}</strong> exam is scheduled for <strong>${examDate}</strong>.</p>
      <p>Please make sure you're prepared and ready to take the exam at the scheduled time.</p>
      <p>Good luck!</p>
      <p>Best regards,<br>The TutorTrack Team</p>
    </div>
  `;

  return sendHtmlEmail({
    to,
    subject: `Reminder: ${examName} Exam`,
    html,
  });
}

/**
 * Example of sending a password reset email with the basic template
 */
export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetUrl: string
) {
  return sendTemplateEmail({
    to,
    subject: 'Reset Your Password',
    react: React.createElement(BasicEmail, {
      title: 'Reset Your Password',
      message: `Hello ${name}, we received a request to reset your password. Click the button below to set a new password. If you didn't request this, you can safely ignore this email.`,
      buttonText: 'Reset Password',
      buttonUrl: resetUrl,
    }),
  });
}

/**
 * Example of sending a welcome email with the new react-email template
 */
export async function sendWelcomeTemplateEmail(
  to: string,
  name: string,
  role: 'student' | 'teacher' | 'admin' = 'student',
  dashboardUrl: string = 'https://tutortrack.theskylab.in/dashboard'
) {
  return sendTemplateEmail({
    to,
    subject: 'Welcome to TutorTrack!',
    react: React.createElement(WelcomeEmail, {
      userName: name,
      userRole: role,
      dashboardUrl,
      previewText: `Welcome to TutorTrack, ${name}! Get started with your account.`,
    }),
  });
}

/**
 * Example of sending an exam notification with the new react-email template
 */
export async function sendExamNotificationEmail(
  to: string,
  studentName: string,
  examName: string,
  examDate: string,
  examTime: string,
  duration: string,
  loginUrl: string = 'https://tutortrack.theskylab.in/login'
) {
  return sendTemplateEmail({
    to,
    subject: `Upcoming Exam: ${examName}`,
    react: React.createElement(ExamNotificationEmail, {
      studentName,
      examName,
      examDate,
      examTime,
      duration,
      previewText: `Your upcoming ${examName} exam information`,
      loginUrl,
    }),
  });
}

/**
 * Example of sending a verification email with the react-email template
 */
export async function sendMagicLinkEmail(
  to: string,
  name: string,
  verificationUrl: string,
  role: 'student' | 'teacher' = 'student'
) {
  try {
    return sendTemplateEmail({
      to,
      subject: 'Verify Your Email Address',
      react: React.createElement(MagicLinkEmail, {
        userName: name,
        verificationUrl,
        previewText: `Verify your email address to complete your TutorTrack registration`,
        role,
      }),
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
}
