import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ywbsvpnhjewywfcisonm.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3YnN2cG5oamV3eXdmY2lzb25tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4OTkwMTgsImV4cCI6MjEwNTQ3NTAxOH0.fEzO7atNzCdnCyYZMNnVuNDBUDuE_sg5E9iUVGA7hVg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

export default supabase;
