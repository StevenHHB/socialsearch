import { createServerClient } from "@supabase/ssr";

export const supabase = createServerClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  { cookies: {} }
);
