'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return {
      error: 'Email and password are required',
    };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log(error.code);
    if (error.code === 'email_not_confirmed') {
      return {
        error: 'Email not confirmed',
      };
    } else {
      return {
        error: 'Invalid login credentials',
      };
    }
  }

  revalidatePath('/', 'layout');
  redirect('/onboarding');
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // Basic input validation
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return {
      error: 'Email and password are required',
    };
  }

  const { data: user, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding`,
    },
  });

  if (error) {
    // Return a user-friendly error message
    // console.log(error)
    if (error.code == 'unexpected_failure') {
      return {
        error: 'An unexpected error occurred',
      };
    }
    return {
      error: error.message,
    };
  }

  // Check if email confirmation is required
  if (user?.user?.identities?.length === 0) {
    return {
      error: 'Email already registered',
    };
  }

  revalidatePath('/', 'layout');
  redirect('/login?toast=success_signup');
}

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      error: 'Error signing out',
    };
  }

  revalidatePath('/', 'layout');
  redirect('/login');
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;

  if (!email) {
    return {
      error: 'Email is required',
    };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  });

  if (error) {
    return {
      error: 'Error sending reset password email',
    };
  }

  return { success: true };
}

interface UpdateUserProfileParams {
  fullName: string;
  phoneNumber: string;
  role?: string;
  invitedBy?: string;
}

// Define a type for the update data
interface UserUpdateData {
  full_name: string;
  phone_number: string;
  updated_at: string;
  role?: string;
}

export async function updateUserProfile({
  fullName,
  phoneNumber,
  role,
  invitedBy,
}: UpdateUserProfileParams) {
  const supabase = await createClient();
  const authUser = await supabase.auth.getUser();
  const userId = authUser.data.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  // Prepare update data
  const updateData: UserUpdateData = {
    full_name: fullName,
    phone_number: phoneNumber,
    updated_at: new Date().toISOString(),
  };

  // Add role if provided
  if (role) {
    updateData.role = role;
  }

  const { error } = await supabase
    .from('users')
    .update(updateData)
    .eq('auth_user_id', userId);

  if (error) {
    console.log('updateUserProfile error', error);
    throw new Error(error.message);
  }

  // If this is a student being invited by a teacher, create the teacher-student relationship
  if (role === 'student' && invitedBy) {
    const { error: relationError } = await supabase
      .from('teacher_students')
      .insert({
        teacher_id: invitedBy,
        student_id: userId,
      });

    if (relationError) {
      console.log('Error creating teacher-student relationship', relationError);
      // Don't throw error here, as the profile update was successful
    }

    // Update the invitation status if it exists
    const { data: userRecord } = await supabase
      .from('users')
      .select('email')
      .eq('auth_user_id', userId)
      .single();

    if (userRecord?.email) {
      await supabase
        .from('student_invitations')
        .update({ status: 'accepted' })
        .eq('email', userRecord.email)
        .eq('invited_by', invitedBy);
    }
  }
}
