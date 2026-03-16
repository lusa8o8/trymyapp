import { redirect } from 'next/navigation';
import { createClient } from './supabase-server';
import { User, UserRole } from '@/types';

export async function getUser(): Promise<User | null> {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return null;
  }

  return profile as User;
}

export async function requireAuth(): Promise<User> {
  const user = await getUser();
  
  if (!user) {
    redirect('/login');
  }
  
  return user;
}

export async function requireRole(role: UserRole): Promise<User> {
  const user = await requireAuth();
  
  if (user.role !== role && user.role !== 'admin') {
    redirect('/');
  }
  
  return user;
}

export async function getUserRole(): Promise<UserRole | null> {
  const user = await getUser();
  
  if (!user) {
    return null;
  }
  
  return user.role;
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
}