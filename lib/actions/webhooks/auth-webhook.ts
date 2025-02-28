import { createClient } from '@/lib/supabase/server';
import {
  sendWelcomeTemplateEmail,
  sendPasswordResetEmail,
  sendMagicLinkEmail,
  // sendVerificationEmail,
} from '@/lib/actions/email';
import { AUTH_WEBHOOK_EVENTS, URLS } from '@/lib/config/webhook-config';

// Define types for the webhook payload
export interface WebhookPayload {
  user: {
    id: string;
    email: string;
    [key: string]: unknown;
  };
  email_data: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: string;
    site_url: string;
  };
  [key: string]: unknown;
}

/**
 * Process an auth webhook event
 */
export async function processAuthWebhook(
  payload: WebhookPayload
): Promise<void> {
  const eventType = payload.email_data.email_action_type;

  // Handle different event types
  switch (eventType) {
    case AUTH_WEBHOOK_EVENTS.SIGNUP:
      // A new user has signed up - just log it, don't send emails
      // Supabase will handle the verification email
      await handleSignup(payload);
      break;

    case AUTH_WEBHOOK_EVENTS.MAGIC_LINK:
      await handleSignup(payload);
      break;

    case AUTH_WEBHOOK_EVENTS.EMAIL_CONFIRMED:
      // User has confirmed their email - now we can send welcome email
      await handleEmailConfirmation(payload);
      break;

    case AUTH_WEBHOOK_EVENTS.PASSWORD_RECOVERY:
      // Password recovery requested
      await handlePasswordRecovery(payload);
      break;

    case AUTH_WEBHOOK_EVENTS.USER_DELETED:
      // User has been deleted
      console.log(`User deleted: ${payload.user.email}`);
      break;

    case AUTH_WEBHOOK_EVENTS.USER_UPDATED:
      // User has been updated
      console.log(`User updated: ${payload.user.email}`);
      break;

    default:
      // Unhandled event type
      console.log(`Unhandled webhook event: ${eventType}`);
  }
}

/**
 * Handle user signup event
 */
export async function handleSignup(payload: WebhookPayload): Promise<void> {
  try {
    const { email } = payload.user;
    const { token } = payload.email_data;

    // Just log the signup, don't send a verification email
    // Supabase will handle sending the verification email
    console.log(`User signed up: ${email}`);
    const tokenHash = payload.email_data.token_hash;
    const invitedBy = payload.user.invited_by;
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/verify?token_hash=${tokenHash}&role=teacher&invited_by=${invitedBy}&token=${token}`;
    console.log('verificationUrl', verificationUrl);
    // await sendMagicLinkEmail(email, email, verificationUrl);
  } catch (error) {
    console.error('Error handling signup:', error);
  }
}

/**
 * Handle email confirmation event
 */
export async function handleEmailConfirmation(
  payload: WebhookPayload
): Promise<void> {
  try {
    const { email, id } = payload.user;

    // Get user metadata if available
    const supabase = await createClient();
    const { data: userData } = await supabase
      .from('users')
      .select('full_name, role')
      .eq('auth_user_id', id)
      .single();

    const name = userData?.full_name || email.split('@')[0];
    const role = userData?.role || 'student';

    // Send welcome email
    await sendWelcomeTemplateEmail(
      email,
      name,
      role as 'student' | 'teacher' | 'admin',
      URLS.DASHBOARD
    );

    console.log(`Sent welcome email to ${email}`);
  } catch (error) {
    console.error('Error handling email confirmation:', error);
  }
}

/**
 * Handle password recovery event
 */
export async function handlePasswordRecovery(
  payload: WebhookPayload
): Promise<void> {
  try {
    const { email } = payload.user;

    // Get user metadata if available
    const supabase = await createClient();
    const { data: userData } = await supabase
      .from('users')
      .select('full_name')
      .eq('email', email)
      .single();

    const name = userData?.full_name || email.split('@')[0];

    // Send password reset email
    await sendPasswordResetEmail(email, name, URLS.RESET_PASSWORD);

    console.log(`Sent password reset email to ${email}`);
  } catch (error) {
    console.error('Error handling password recovery:', error);
  }
}
