import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;


export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// supabaseAdmin should ONLY be used in Server Components or API Routes
// It will be null in the browser to prevent leaking the Service Role Key
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey) 
  : null;
