import { createClient } from '@supabase/supabase-js'

// Sustituye con las credenciales de tu proyecto Supabase Auth
const supabaseUrl = 'https://tu-proyecto.supabase.co'
const supabaseAnonKey = 'tu-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)