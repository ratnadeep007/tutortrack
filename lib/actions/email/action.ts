'use server';

import { Resend } from 'resend';
import { ReactElement } from 'react';
import { render } from '@react-email/render';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send a simple text email
 */
export async function sendEmail({
  to,
  subject,
  text,
  from = 'TutorTrack <no-reply@tutortrack.theskylab.in>',
}: {
  to: string | string[];
  subject: string;
  text: string;
  from?: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      text,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { error: error.message };
    }

    return { data };
  } catch (error: unknown) {
    console.error('Exception sending email:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to send email';
    return { error: errorMessage };
  }
}

/**
 * Send an HTML email
 */
export async function sendHtmlEmail({
  to,
  subject,
  html,
  from = 'TutorTrack <no-reply@tutortrack.theskylab.in>',
}: {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Error sending HTML email:', error);
      return { error: error.message };
    }

    return { data };
  } catch (error: unknown) {
    console.error('Exception sending HTML email:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to send HTML email';
    return { error: errorMessage };
  }
}

/**
 * Send an email with React template
 */
export async function sendTemplateEmail({
  to,
  subject,
  react,
  from = 'TutorTrack <no-reply@tutortrack.theskylab.in>',
}: {
  to: string | string[];
  subject: string;
  react: ReactElement;
  from?: string;
}) {
  try {
    // Render the React component to HTML
    const html = await render(react);

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Error sending template email:', error);
      return { error: error.message };
    }

    return { data };
  } catch (error: unknown) {
    console.error('Exception sending template email:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to send template email';
    return { error: errorMessage };
  }
}
