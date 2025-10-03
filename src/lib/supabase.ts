import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://iwagvefnbitotrsggthy.supabase.co';
const supabaseKey = 'sb_publishable_qyI6vf25kNHISEuS1ha1PA_1Z-3k6ZE';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };