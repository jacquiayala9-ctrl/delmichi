import { Client } from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = new Client({
  connectionString: process.env.DATABASE_URL,
})

async function run() {
  await client.connect()
  console.log('Connected to DB')

  const res = await client.query(`
    SELECT tablename, policyname, cmd, roles, qual, with_check 
    FROM pg_policies 
    WHERE tablename = 'categories';
  `)
  
  console.log('Current policies for categories:')
  console.table(res.rows)

  // Add policy to allow public select on categories if missing
  console.log('Adding SELECT policy for public...')
  try {
    await client.query(`
      CREATE POLICY "Permitir SELECT a todos en categorias" 
      ON categories FOR SELECT 
      USING (true);
    `)
    console.log('SELECT policy added.')
  } catch (err) {
    console.log('Could not add SELECT policy (might already exist):', err.message)
  }

  // Add policy to allow all actions for admin
  try {
    await client.query(`
      CREATE POLICY "Permitir TODO a admin en categorias" 
      ON categories FOR ALL 
      USING (
        auth.uid() IN (
          SELECT id FROM profiles WHERE role = 'admin'
        )
      );
    `)
    console.log('Admin policy added.')
  } catch (err) {
    console.log('Could not add Admin policy (might already exist):', err.message)
  }
  
  // Enable RLS just in case
  await client.query(`ALTER TABLE categories ENABLE ROW LEVEL SECURITY;`)

  const res2 = await client.query(`
    SELECT tablename, policyname, cmd, roles, qual, with_check 
    FROM pg_policies 
    WHERE tablename = 'categories';
  `)
  
  console.log('New policies for categories:')
  console.table(res2.rows)

  // Verify there are categories
  const res3 = await client.query(`SELECT * FROM categories`)
  console.log('Categories in DB:')
  console.table(res3.rows)

  await client.end()
}

run()
