
import { supabase } from './supabase'

export async function getPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('id', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error.message)
    return []
  }

  return data
}
