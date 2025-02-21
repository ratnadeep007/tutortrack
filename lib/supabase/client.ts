import { useMemo } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export function getSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          if (typeof window === 'undefined') {
            return []
          }
          const cookies = document.cookie.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc.push({
              name: key,
              value: decodeURIComponent(value)
            });
            return acc;
          }, [] as Array<{ name: string; value: string }>)
          return cookies
        },
        setAll(cookiesToSet) {
          if (typeof window === 'undefined') {
            return
          }
          cookiesToSet.forEach(({ name, value, options }) =>
            document.cookie = `${name}=${encodeURIComponent(value)}; ${options?.toString()}`
          )
        }
      }
    }
  );
}

function useSupabaseClient() {
  return useMemo(getSupabaseBrowserClient, []);
}

export default useSupabaseClient;