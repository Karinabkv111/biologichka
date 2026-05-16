import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mlsbczlayyehhzwxyson.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_PUYruNeLUiD9Gowg45uXWg_kpoMIZ2I'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)