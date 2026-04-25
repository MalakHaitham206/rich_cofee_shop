// ============================================================
// supabase.ts
// Supabase client — used ONLY for Realtime subscriptions.
// All data reads/writes go through the Fastify backend API.
// The anon key is safe here because:
//   1. This is an internal admin-only tool.
//   2. We only use this client to LISTEN to table changes,
//      not to read or write data.
// ============================================================

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
