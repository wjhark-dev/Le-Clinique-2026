import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ctnifwflxnapqoudazgd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0bmlmd2ZseG5hcHFvdWRhemdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3NDUwNTksImV4cCI6MjA4MTMyMTA1OX0.LAdBHi8AMaIDIL16SwhWMSFsdMH40ZIFsAW8lF5mA5I'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)