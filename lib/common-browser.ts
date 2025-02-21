import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export const getUserIdFromBrowser = async () => {
  const supabase = getSupabaseBrowserClient();
  const sessionUser = (await supabase.auth.getUser()).data.user?.id;
  const user = await supabase
    .from('users')
    .select('*')
    .eq('auth_user_id', sessionUser)
    .single();
  return user?.data?.user_id;
};
