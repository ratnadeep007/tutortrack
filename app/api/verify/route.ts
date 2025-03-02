import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { redis } from '@/lib/redis';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get('token_hash');
  let role = searchParams.get('role');
  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash || '',
    type: 'email',
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { error: userError } = await supabase.auth.getUser();

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 });
  }

  // Get user email from auth
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const email = user?.email;

  if (email) {
    try {
      const redisData = await redis.get(`student:${email}`);
      if (redisData) {
        // If email exists in Redis, override role to student
        role = 'student';
      }
    } catch (redisError) {
      console.error('Error checking Redis:', redisError);
    }
  }

  // Get user from users table
  const { data: existingUser, error: userCheckError } = await supabase
    .from('users')
    .select('*')
    .eq('auth_user_id', user?.id)
    .single();

  if (userCheckError && userCheckError.code !== 'PGRST116') {
    // PGRST116 is "not found" which is expected for new users
    return NextResponse.json(
      { error: userCheckError.message },
      { status: 500 }
    );
  }

  const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/onboarding?role=${role}&invited_by=${existingUser?.user_id}`;
  return NextResponse.redirect(redirectUrl);
}
