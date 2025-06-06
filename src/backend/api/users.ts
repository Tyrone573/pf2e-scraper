import { supabase } from '../lib/supabase'

export type User = {
  id: string
  email: string
  name: string
  created_at: string
}

export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')

  if (error) {
    console.error('Error fetching users:', error)
    return []
  }

  return data || []
}

export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error(`Error fetching user with id ${id}:`, error)
    return null
  }

  return data
}

export async function createUser(user: Omit<User, 'id' | 'created_at'>): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .insert([user])
    .select()

  if (error) {
    console.error('Error creating user:', error)
    return null
  }

  return data?.[0] || null
}

export async function updateUser(id: string, user: Partial<Omit<User, 'id' | 'created_at'>>): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .update(user)
    .eq('id', id)
    .select()

  if (error) {
    console.error(`Error updating user with id ${id}:`, error)
    return null
  }

  return data?.[0] || null
}

export async function deleteUser(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(`Error deleting user with id ${id}:`, error)
    return false
  }

  return true
}
