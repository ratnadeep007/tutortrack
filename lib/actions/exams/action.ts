'use server';

import { createClient } from '@/lib/supabase/server';
import { getUserIdFromSession } from '@/lib/common';

export async function createExam(data: { name: string; duration: string }) {
  console.log('Creating exam...', data);
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
