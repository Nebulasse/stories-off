import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Временное решение для разработки
const mockSupabase = {
  auth: {
    signIn: async () => ({ user: null, error: null }),
    signUp: async () => ({ user: null, error: null }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: null } }),
  },
  from: () => ({
    insert: async () => ({ error: null }),
    select: async () => ({ data: [], error: null }),
  }),
};

export const supabase = !supabaseUrl || !supabaseAnonKey 
  ? mockSupabase 
  : createClient(supabaseUrl, supabaseAnonKey); 