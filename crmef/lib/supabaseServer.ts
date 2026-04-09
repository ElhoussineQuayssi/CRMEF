import { createClient } from "@supabase/supabase-js";

export function createSupabaseServerClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase environment variables. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY."
    );
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}
