import React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface WelcomeEmailProps {
  userName: string;
  userRole?: 'student' | 'teacher' | 'admin';
  dashboardUrl?: string;
  previewText?: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({
  userName,
  userRole = 'student',
  dashboardUrl = 'https://tutortrack.theskylab.in/dashboard',
  previewText = 'Welcome to TutorTrack! Get started with your account.',
}) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            {/* You can replace this with your actual logo */}
            <Heading style={logoText}>TutorTrack</Heading>
          </Section>

          <Heading style={h1}>Welcome to TutorTrack!</Heading>

          <Section style={section}>
            <Text style={text}>Hello {userName},</Text>
            <Text style={text}>
              Thank you for joining TutorTrack! We&apos;re excited to have you
              on board as a {userRole}.
            </Text>

            <Text style={text}>
              {userRole === 'student' &&
                'As a student, you can access your courses, view upcoming exams, and track your progress.'}
              {userRole === 'teacher' &&
                'As a teacher, you can manage your students, create exams, and track student performance.'}
              {userRole === 'admin' &&
                'As an admin, you have full access to manage the platform, users, and settings.'}
            </Text>

            <Text style={text}>
              To get started, click the button below to access your dashboard:
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={dashboardUrl}>
                Go to Dashboard
              </Button>
            </Section>

            <Text style={text}>
              If you have any questions or need assistance, please don&apos;t
              hesitate to contact our support team.
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Text style={helpText}>Need help getting started?</Text>
            <ul style={featureList}>
              <li style={featureItem}>
                <Link href="#" style={link}>
                  View our getting started guide
                </Link>
              </li>
              <li style={featureItem}>
                <Link href="#" style={link}>
                  Explore the knowledge base
                </Link>
              </li>
              <li style={featureItem}>
                <Link href="#" style={link}>
                  Contact support
                </Link>
              </li>
            </ul>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            © {new Date().getFullYear()} TutorTrack. All rights reserved.
          </Text>
          <Text style={footer}>
            <Link
              href="https://tutortrack.theskylab.in/terms"
              style={smallLink}
            >
              Terms of Service
            </Link>{' '}
            •{' '}
            <Link
              href="https://tutortrack.theskylab.in/privacy"
              style={smallLink}
            >
              Privacy Policy
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
  padding: '20px 0',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #e6ebf1',
  borderRadius: '5px',
  margin: '0 auto',
  padding: '20px',
  maxWidth: '600px',
};

const logoContainer = {
  textAlign: 'center' as const,
  marginBottom: '20px',
};

const logoText = {
  color: '#4f46e5',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
};

const section = {
  padding: '0',
};

const h1 = {
  color: '#4f46e5',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '30px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const buttonContainer = {
  margin: '30px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#4f46e5',
  borderRadius: '5px',
  color: '#fff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: 'bold',
  padding: '12px 24px',
  textDecoration: 'none',
  textAlign: 'center' as const,
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const helpText = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '16px 0',
};

const featureList = {
  margin: '16px 0',
  padding: '0 0 0 20px',
};

const featureItem = {
  margin: '8px 0',
};

const link = {
  color: '#4f46e5',
  textDecoration: 'underline',
};

const footer = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '12px 0',
  textAlign: 'center' as const,
};

const smallLink = {
  color: '#666',
  textDecoration: 'underline',
};

export default WelcomeEmail;
