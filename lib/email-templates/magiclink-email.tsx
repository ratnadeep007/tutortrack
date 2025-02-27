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
import { BookOpen } from 'lucide-react';

interface MagicLinkEmailProps {
  userName: string;
  verificationUrl: string;
  previewText?: string;
}

export const MagicLinkEmail: React.FC<MagicLinkEmailProps> = ({
  userName,
  verificationUrl,
  previewText = 'Verify your email address to complete your TutorTrack registration',
}) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section
            style={logoContainer}
            className="flex flex-col items-center justify-center gap-2"
          >
            <div className="flex flex-row justify-center w-full">
              <BookOpen className="size-48 fill-green-400" />
            </div>
            <Heading style={logoText}>TutorTrack</Heading>
          </Section>

          <Heading style={h1}>Verify Your Email Address</Heading>

          <Section style={section}>
            <Text style={text}>Hello {userName},</Text>
            <Text style={text}>
              Thank you for registering with TutorTrack! To complete your
              registration and access your account, please verify your email
              address by clicking the button below:
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={verificationUrl}>
                Verify Email Address
              </Button>
            </Section>

            <Text style={text}>
              This link will expire in 24 hours. If you did not create an
              account with TutorTrack, please ignore this email.
            </Text>

            <Text style={text}>
              If you&apos;re having trouble clicking the button, copy and paste
              the following URL into your web browser:
            </Text>

            <Text style={linkText}>{verificationUrl}</Text>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Text style={helpText}>What happens next?</Text>
            <ul style={featureList}>
              <li style={featureItem}>
                Once verified, you&apos;ll be able to log in to your account
              </li>
              <li style={featureItem}>
                Complete your profile to personalize your experience
              </li>
              <li style={featureItem}>
                Start exploring TutorTrack&apos;s features and resources
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

const linkText = {
  color: '#4f46e5',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '16px 0',
  wordBreak: 'break-all' as const,
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

export default MagicLinkEmail;
