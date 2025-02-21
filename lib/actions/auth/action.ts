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
}

export async function updateUserProfile({
  fullName,
  phoneNumber,
}: UpdateUserProfileParams) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('users')
    .update({
      full_name: fullName,
      phone_number: phoneNumber,
      updated_at: new Date().toISOString(),
    })
    .eq('auth_user_id', (await supabase.auth.getUser()).data.user?.id);

  if (error) {
    console.log('updateUserProfile error', error);
    throw new Error(error.message);
  }
}
