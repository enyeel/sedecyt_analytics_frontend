import { createClient } from '@supabase/supabase-js'

// ¡IMPORTANTE! Asegúrate de tener estas variables definidas en tu archivo .env.local
// y en tu configuración de Firebase Hosting (GitHub Actions)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL; //
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; //

// Inicializa el cliente de Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY) //