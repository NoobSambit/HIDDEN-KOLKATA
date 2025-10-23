import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Pin = {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  image_url: string;
  created_by: string | null;
  created_at: string;
};
