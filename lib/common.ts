import { createClient } from '@/lib/supabase/server';

export const getUserIdFromSession = async () => {
  const supabase = await createClient();
  const sessionUser = (await supabase.auth.getUser()).data.user?.id;
  const user = await supabase
    .from('users')
    .select('*')
    .eq('auth_user_id', sessionUser)
    .single();
  return user?.data?.user_id;
};
