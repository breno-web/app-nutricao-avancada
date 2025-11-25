import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Alimento = {
  id: number
  nome: string
  categoria?: string
  calorias: number
  proteinas: number
  carboidratos: number
  gorduras: number
  porcao: number
  unidade?: string
  codigo_barras?: string
}
