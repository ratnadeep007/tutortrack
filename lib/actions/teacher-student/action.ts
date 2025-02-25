'use server';

import { createClient } from '@/lib/supabase/server';
import { getUserIdFromSession } from '@/lib/common';

export async function getStudents() {
  const supabase = await createClient();
  const sessionUser = await getUserIdFromSession();

  // First get the list of student IDs that are already in teacher's class
  const { data: existingStudents, error: existingError } = await supabase
    .from('teacher_students')
    .select('student_id')
    .eq('teacher_id', sessionUser);

  if (existingError) {
    return { error: existingError.message };
  }

  // Handle case where existingStudents is null
  const existingStudentIds = existingStudents?.map((s) => s.student_id) || [];

  // Then get all students except those already in teacher's class
  const { data: students, error } = await supabase
    .from('users')
    .select('user_id, full_name, email, phone_number')
    .eq('role', 'student');

  if (error) {
    return { error: error.message };
  }

  // Filter out existing students if there are any
  const availableStudents =
    existingStudentIds.length > 0
      ? students?.filter(
          (student) => !existingStudentIds.includes(student.user_id)
        )
      : students;

  return { data: availableStudents || [] };
}

export async function getMyStudents() {
  const supabase = await createClient();
  const sessionUser = await getUserIdFromSession();

  const { data: students, error } = await supabase
    .from('teacher_students')
    .select(
      `
      student:student_id(
        user_id,
        full_name,
        email,
        phone_number
      )
    `
    )
    .eq('teacher_id', sessionUser);

  if (error) {
    return { error: error.message };
  }

  return { data: students.map((s) => s.student) };
}

export async function addStudent(studentId: string) {
  const supabase = await createClient();
  const sessionUser = await getUserIdFromSession();

  const { error } = await supabase.from('teacher_students').insert({
    teacher_id: sessionUser,
    student_id: studentId,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function removeStudent(studentId: string) {
  const supabase = await createClient();
  const sessionUser = await getUserIdFromSession();

  const { error } = await supabase
    .from('teacher_students')
    .delete()
    .eq('teacher_id', sessionUser)
    .eq('student_id', studentId);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function inviteStudentByEmail(email: string) {
  const supabase = await createClient();
  const sessionUser = await getUserIdFromSession();

  // Check if a user with this email already exists
  const { data: existingUser, error: userError } = await supabase
    .from('users')
    .select('user_id')
    .eq('email', email)
    .single();

  if (userError && userError.code !== 'PGRST116') {
    // PGRST116 is "not found" which is ok
    return { error: userError.message };
  }

  if (existingUser) {
    return { error: 'A user with this email already exists' };
  }

  // Check if an invitation is already pending
  const { data: existingInvite, error: inviteError } = await supabase
    .from('student_invitations')
    .select('*')
    .eq('email', email)
    .eq('invited_by', sessionUser)
    .single();

  if (inviteError && inviteError.code !== 'PGRST116') {
    return { error: inviteError.message };
  }

  if (existingInvite) {
    return { error: 'An invitation has already been sent to this email' };
  }

  // Create invitation record
  const { error: createError } = await supabase
    .from('student_invitations')
    .insert({
      email: email,
      invited_by: sessionUser,
      status: 'pending',
    });

  if (createError) {
    return { error: createError.message };
  }

  // Send magic link for signup
  const { error: magicLinkError } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding?role=student&invited_by=${sessionUser}`,
      shouldCreateUser: true,
    },
  });

  if (magicLinkError) {
    // If sending magic link fails, still return success since the invitation was created
    console.error('Error sending magic link:', magicLinkError);
    return {
      success: true,
      warning:
        'Invitation created but there was an issue sending the magic link email',
    };
  }

  return { success: true };
}
