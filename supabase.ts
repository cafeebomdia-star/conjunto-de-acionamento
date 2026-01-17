import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const supabaseUrl = 'https://boxslrgjnnupvrmprztj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJveHNscmdqbm51cHZybXByenRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzMzUxNzEsImV4cCI6MjA4MzkxMTE3MX0.C4UVT0VubhlA7KtCsRzY2aPNwKOtLyYC_b1tbZZiRfk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);