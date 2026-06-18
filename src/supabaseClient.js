import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kenakpfiaystsznheylt.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlbmFrcGZpYXlzdHN6bmhleWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2OTYwOTIsImV4cCI6MjA5NzI3MjA5Mn0.ZIuuj4qgTedAIoJ8_XRDGaAvtwDnaFtTR0KBNjUC-HU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
