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

interface ExamNotificationEmailProps {
  studentName: string;
  examName: string;
  examDate: string;
  examTime: string;
  duration: string;
  previewText?: string;
  loginUrl?: string;
}

export const ExamNotificationEmail: React.FC<ExamNotificationEmailProps> = ({
  studentName,
  examName,
  examDate,
  examTime,
  duration,
  previewText = 'Your upcoming exam information',
  loginUrl = 'https://tutortrack.theskylab.in/login',
}) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Exam Notification</Heading>

          <Section style={section}>
            <Text style={text}>Hello {studentName},</Text>
            <Text style={text}>
              This is a notification about your upcoming exam. Please review the
              details below:
            </Text>

            <Section style={examInfoBox}>
              <Text style={examInfoItem}>
                <strong>Exam:</strong> {examName}
              </Text>
              <Text style={examInfoItem}>
                <strong>Date:</strong> {examDate}
              </Text>
              <Text style={examInfoItem}>
                <strong>Time:</strong> {examTime}
              </Text>
              <Text style={examInfoItem}>
                <strong>Duration:</strong> {duration}
              </Text>
            </Section>

            <Text style={text}>
              Please ensure you are prepared and ready to take the exam at the
              scheduled time. Make sure your device is charged and you have a
              stable internet connection.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={loginUrl}>
                Login to Your Account
              </Button>
            </Section>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            © {new Date().getFullYear()} TutorTrack. All rights reserved.
          </Text>
          <Text style={footer}>
            If you have any questions, please contact your teacher or{' '}
            <Link href={`mailto:support@tutortrack.theskylab.in`} style={link}>
              support@tutortrack.theskylab.in
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

const examInfoBox = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e6ebf1',
  borderRadius: '5px',
  margin: '20px 0',
  padding: '15px',
};

const examInfoItem = {
  margin: '8px 0',
  fontSize: '15px',
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
  padding: '12px 20px',
  textDecoration: 'none',
  textAlign: 'center' as const,
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '12px 0',
  textAlign: 'center' as const,
};

const link = {
  color: '#4f46e5',
  textDecoration: 'underline',
};

export default ExamNotificationEmail;
