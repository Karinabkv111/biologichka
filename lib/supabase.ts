import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mlsbczlayyehhzwxyson.supabase.co'
const supabaseAnonKey = 'sb_publishable_PUYruNeLUiD9Gowg45uXWg_kpoMIZ2I'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)