import React from 'react';

interface BasicEmailProps {
  title: string;
  message: string;
  buttonText?: string;
  buttonUrl?: string;
}

export const BasicEmail: React.FC<BasicEmailProps> = ({
  title,
  message,
  buttonText,
  buttonUrl,
}) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
      <h1 style={{ color: '#4f46e5' }}>{title}</h1>
      <p style={{ fontSize: '16px', lineHeight: '1.5' }}>{message}</p>

      {buttonText && buttonUrl && (
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <a
            href={buttonUrl}
            style={{
              backgroundColor: '#4f46e5',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '5px',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            {buttonText}
          </a>
        </div>
      )}

      <div
        style={{
          marginTop: '30px',
          borderTop: '1px solid #eaeaea',
          paddingTop: '20px',
          fontSize: '14px',
          color: '#666',
        }}
      >
        <p>© {new Date().getFullYear()} TutorTrack. All rights reserved.</p>
      </div>
    </div>
  );
};
