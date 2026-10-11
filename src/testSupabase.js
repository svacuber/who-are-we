
import { supabase } from './supabase'

async function testConnection() {
  const { data, error } = await supabase
    .from('posts')
    .select('id')
    .limit(1)

  if (error) {
    console.error('Supabase connection test failed:', error.message)
    return
  }

  console.log('Supabase connection successful!')
  console.log('Posts table is accessible:', data)
}

testConnection()
