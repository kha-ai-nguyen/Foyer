import { createClient } from '@supabase/supabase-js'

// Browser client — safe to use in client components
export const supabaseBrowser = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Server-only client — NEVER import this in client components
// SUPABASE_SERVICE_KEY is not prefixed NEXT_PUBLIC_ so it is never bundled to the browser
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )
}
