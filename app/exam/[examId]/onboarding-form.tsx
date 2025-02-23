'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

interface UserData {
  user_id: string;
  full_name: string;
  phone_number: string;
  role: string;
}

interface OnboardingFormProps {
  examId: string;
  userEmail?: string;
  userData?: UserData | null;
}

export default function OnboardingForm({
  examId,
  userEmail,
  userData,
}: OnboardingFormProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const studentName = userData?.full_name || (formData.get('name') as string);
    const phoneNumber =
      userData?.phone_number || (formData.get('phone') as string);
    const email = userEmail || (formData.get('email') as string);

    try {
      const { error } = await supabase.from('exam_registrations').insert([
        {
          exam_id: examId,
          user_id: userData?.user_id,
          student_name: studentName,
          phone_number: phoneNumber,
          email: email,
          status: 'registered',
        },
      ]);

      if (error) throw error;

      // Refresh the page to show the start exam screen
      router.refresh();
    } catch (err) {
      setError('Failed to register. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6 rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          Student Registration
        </h2>
        <p className="text-sm text-muted-foreground">
          Please enter your details to start the exam
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {!userData && (
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium leading-none">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Enter your full name"
            />
          </div>
        )}

        {!userEmail && (
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium leading-none">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Enter your email address"
            />
          </div>
        )}

        {!userData && (
          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="text-sm font-medium leading-none">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Enter your phone number"
            />
          </div>
        )}

        {userData && (
          <div className="rounded-md bg-muted p-4">
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Name:</span> {userData.full_name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {userEmail}
              </p>
              <p>
                <span className="font-medium">Phone:</span>{' '}
                {userData.phone_number}
              </p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          {loading ? 'Registering...' : 'Register & Start Exam'}
        </button>
      </form>
    </div>
  );
}
