import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY // NEED SERVICE ROLE KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.log('Missing env vars')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

async function check() {
  const { data, error } = await supabase.from('categories').select('*')
  console.log('Categories data:', data)
  console.log('Categories error:', error)
}

check()
