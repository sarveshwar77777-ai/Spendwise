import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-ref') && 
  !supabaseAnonKey.includes('your-anon-publishable-key')
);

if (!isSupabaseConfigured) {
  console.warn(
    'SpendWise Supabase Notice: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not configured yet. ' +
    'Please set up your .env.local file to enable live authentication and cloud database persistence.'
  );
}

// Fallback dummy client if credentials not provided to avoid instantiation crash
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-anon-key');
