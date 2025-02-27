# Email Functionality with Resend and React Email

This directory contains server actions for sending emails using [Resend](https://resend.com) and [React Email](https://react.email/).

## Setup

1. Sign up for a Resend account at [resend.com](https://resend.com)
2. Get your API key from the Resend dashboard
3. Add the API key to your `.env` file:

```
RESEND_API_KEY=re_your_api_key_here
```

4. Make sure to add this environment variable to your deployment environment as well.

## Usage

### Basic Text Email

```typescript
import { sendEmail } from '@/lib/actions/email/action';

// In a server component or server action
await sendEmail({
  to: 'recipient@example.com',
  subject: 'Hello from TutorTrack',
  text: 'This is a plain text email',
});
```

### HTML Email

```typescript
import { sendHtmlEmail } from '@/lib/actions/email/action';

// In a server component or server action
await sendHtmlEmail({
  to: 'recipient@example.com',
  subject: 'Hello from TutorTrack',
  html: '<h1>Hello</h1><p>This is an HTML email</p>',
});
```

### React Email Template

```typescript
import React from 'react';
import { sendTemplateEmail } from '@/lib/actions/email/action';
import { WelcomeEmail } from '@/lib/email-templates/welcome-email';

// In a server component or server action
await sendTemplateEmail({
  to: 'recipient@example.com',
  subject: 'Welcome to TutorTrack',
  react: React.createElement(WelcomeEmail, {
    userName: 'John Doe',
    userRole: 'student',
    dashboardUrl: 'https://example.com/dashboard',
  }),
});
```

## Available Email Templates

We have several pre-built email templates:

### Basic Email

A simple template with a title, message, and optional button.

```typescript
import { BasicEmail } from '@/lib/email-templates/basic-email';

React.createElement(BasicEmail, {
  title: 'Your Title',
  message: 'Your message content here',
  buttonText: 'Optional Button',
  buttonUrl: 'https://example.com/action',
});
```

### Welcome Email

A comprehensive welcome email with role-specific content.

```typescript
import { WelcomeEmail } from '@/lib/email-templates/welcome-email';

React.createElement(WelcomeEmail, {
  userName: 'John Doe',
  userRole: 'student', // 'student', 'teacher', or 'admin'
  dashboardUrl: 'https://example.com/dashboard',
  previewText: 'Custom preview text for email clients',
});
```

### Exam Notification Email

An email template for notifying students about upcoming exams.

```typescript
import { ExamNotificationEmail } from '@/lib/email-templates/exam-notification';

React.createElement(ExamNotificationEmail, {
  studentName: 'John Doe',
  examName: 'Mathematics Final',
  examDate: 'June 15, 2023',
  examTime: '10:00 AM',
  duration: '2 hours',
  loginUrl: 'https://example.com/login',
});
```

## Example Functions

Check out the `examples.ts` file for more usage examples:

- `sendWelcomeTextEmail`: Sends a simple text welcome email
- `sendExamReminderHtmlEmail`: Sends an HTML exam reminder
- `sendPasswordResetEmail`: Sends a password reset link using the basic template
- `sendWelcomeTemplateEmail`: Sends a welcome email using the welcome template
- `sendExamNotificationEmail`: Sends an exam notification using the exam template

## Creating Custom Email Templates

To create a new email template:

1. Create a new React component in the `lib/email-templates` directory
2. Use the `@react-email/components` package for email-safe components
3. Import and use it with the `sendTemplateEmail` function

### React Email Components

React Email provides a set of components that are designed to work well in email clients:

- `<Body>`: The body of the email
- `<Button>`: A button element
- `<Container>`: A container for content
- `<Head>`: The head of the email
- `<Heading>`: A heading element
- `<Hr>`: A horizontal rule
- `<Html>`: The root HTML element
- `<Link>`: A link element
- `<Preview>`: The preview text shown in email clients
- `<Section>`: A section of content
- `<Text>`: A text element

For more information, see the [React Email documentation](https://react.email/docs/introduction) and [Resend documentation](https://resend.com/docs/introduction).
