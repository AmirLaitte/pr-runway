// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bfrixwwpujpzyzktnqng.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmcml4d3dwdWpwenl6a3RucW5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwNDY4MDcsImV4cCI6MjA1NjYyMjgwN30.tkDCBomb4io3A6CjJLw5gyiwQM7hHjz-ULzlJ1PfKcw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);