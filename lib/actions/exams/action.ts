'use server';

import { createClient } from '@/lib/supabase/server';
import { getUserIdFromSession } from '@/lib/common';

export async function createExam(data: { name: string; duration: string }) {
  const supabase = await createClient();

  const name = data.name;
  const duration = data.duration;

  const slug = name.toLowerCase().replace(/ /g, '-');

  if (!name || !duration) {
    return { error: 'Name and duration are required' };
  }

  const sessionUser = await getUserIdFromSession();

  const { data: exam, error } = await supabase
    .from('exams')
    .insert({
      name,
      duration_minutes: parseInt(duration),
      slug,
      created_by: sessionUser,
    })
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: exam };
}

export async function getExams() {
  const supabase = await createClient();

  const sessionUser = await getUserIdFromSession();

  const { data, error } = await supabase
    .from('exams')
    .select('*')
    .eq('created_by', sessionUser);

  if (error) {
    return { error: error.message };
  }

  return { data };
}

export async function deleteExam(examId: string) {
  const supabase = await createClient();
  const sessionUser = await getUserIdFromSession();

  const { error } = await supabase
    .from('exams')
    .delete()
    .eq('id', examId)
    .eq('created_by', sessionUser);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function registerStudentForExam(
  examId: string,
  student: {
    user_id: string;
    full_name: string | null;
    email: string;
    phone_number: string | null;
  }
) {
  const supabase = await createClient();
  const sessionUser = await getUserIdFromSession();

  // Check if the exam exists and belongs to the teacher
  const { data: exam, error: examError } = await supabase
    .from('exams')
    .select('*')
    .eq('id', examId)
    .eq('created_by', sessionUser)
    .single();

  if (examError || !exam) {
    return {
      error:
        'Exam not found or you do not have permission to register students',
    };
  }

  // Check if student is already registered
  const { data: existingRegistration } = await supabase
    .from('exam_registrations')
    .select('*')
    .eq('exam_id', examId)
    .eq('email', student.email)
    .single();

  if (existingRegistration) {
    return { error: 'Student is already registered for this exam' };
  }

  // Register the student
  const { data: registration, error } = await supabase
    .from('exam_registrations')
    .insert({
      exam_id: examId,
      user_id: student.user_id,
      student_name: student.full_name || 'Unknown',
      email: student.email,
      phone_number: student.phone_number || '',
      status: 'registered',
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data: registration };
}
