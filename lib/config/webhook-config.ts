/**
 * Webhook configuration
 */

// Auth webhook events that we handle
export const AUTH_WEBHOOK_EVENTS = {
  SIGNUP: 'signup',
  EMAIL_CONFIRMED: 'email_confirmed',
  PASSWORD_RECOVERY: 'password_recovery',
  USER_DELETED: 'user_deleted',
  USER_UPDATED: 'user_updated',
  MAGIC_LINK: 'magiclink',
};

// Email configuration
export const EMAIL_CONFIG = {
  FROM_EMAIL:
    process.env.EMAIL_FROM || 'TutorTrack <no-reply@tutortrack.theskylab.in>',
  SUPPORT_EMAIL: 'support@tutortrack.theskylab.in',
  VERIFICATION_SUBJECT: 'Verify Your Email Address',
  WELCOME_SUBJECT: 'Welcome to TutorTrack!',
  PASSWORD_RESET_SUBJECT: 'Reset Your Password',
};

// URL configuration
export const URL_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  VERIFICATION_PATH: '/auth/verify',
  DASHBOARD_PATH: '/dashboard',
  RESET_PASSWORD_PATH: '/reset-password',
};

// Generate full URLs
export const URLS = {
  VERIFICATION: `${URL_CONFIG.BASE_URL}${URL_CONFIG.VERIFICATION_PATH}`,
  DASHBOARD: `${URL_CONFIG.BASE_URL}${URL_CONFIG.DASHBOARD_PATH}`,
  RESET_PASSWORD: `${URL_CONFIG.BASE_URL}${URL_CONFIG.RESET_PASSWORD_PATH}`,
};
