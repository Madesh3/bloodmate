// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xtstmdsvaddrcaueskir.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0c3RtZHN2YWRkcmNhdWVza2lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc2MTIzNDYsImV4cCI6MjA1MzE4ODM0Nn0.JaTtCnyKdUb-Pgyb0VFy_oM15JVHABJlHPs51qdp7hg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);