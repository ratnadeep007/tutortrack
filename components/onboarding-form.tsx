'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { updateUserProfile } from '@/lib/actions/auth/action';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  addStudent,
  getInvitedByUser,
  updateStudentInvitationStatus,
} from '@/lib/actions/teacher-student/action';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
interface OnboardingFormProps {
  user: User | null;
  className?: string;
}

export default function OnboardingForm({ className }: OnboardingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const role = searchParams.get('role');
  console.log('role', role);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const fullName = formData.get('fullName') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const supabase = getSupabaseBrowserClient();
    const user = await supabase.auth.getUser();

    try {
      // Check if user already exists in users table
      const { data: existingUser, error: userCheckError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', user.data.user?.id)
        .single();

      if (userCheckError && userCheckError.code !== 'PGRST116') {
        // PGRST116 is "not found" which is expected for new users
        throw new Error(userCheckError.message);
      }

      console.log('role 1', role, existingUser);
      await updateUserProfile({
        fullName,
        phoneNumber,
        invitedBy: existingUser.user_id || '',
        role: role || undefined,
      });
      console.log('role 2', role);
      if (role === 'student') {
        const emailId = user.data.user?.email || '';
        console.log('emailId', emailId);
        const { error: inviteError } =
          await updateStudentInvitationStatus(emailId);
        if (inviteError) {
          throw new Error(inviteError);
        }
        console.log('completed student update', inviteError);
        const result = await getInvitedByUser(emailId);
        console.log('result', result);
        if ('user_id' in result && result.user_id) {
          await addStudent(result.user_id, user.data.user?.id || '');
        }
      }
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Complete Your Profile</CardTitle>
          <CardDescription>
            {role === 'student'
              ? 'Please provide your details to join as a student'
              : 'Please provide your details to continue'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              {error && (
                <div className="bg-destructive/15 text-destructive text-center p-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" name="fullName" type="text" required />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Saving...' : 'Complete Profile'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        By continuing, you agree to our <a href="#">Terms of Service</a> and{' '}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
