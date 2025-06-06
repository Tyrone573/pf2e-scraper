import { supabase } from '../lib/supabase';
import type { Trait } from '../lib/supabase';
import { TraitsScraper } from '../scraping/traits-scraper';

// CRUD functions for traits
export async function getAllTraits(): Promise<Trait[]> {
  const { data, error } = await supabase
    .from('traits')
    .select('*')
    .order('name');
  if (error) {
    console.error('Error fetching traits:', error);
    return [];
  }
  return data || [];
}

export async function getTraitById(id: string): Promise<Trait | null> {
  const { data, error } = await supabase
    .from('traits')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    console.error(`Error fetching trait with id ${id}:`, error);
    return null;
  }
  return data;
}

export async function createTrait(trait: Omit<Trait, 'id' | 'created_at' | 'updated_at'>): Promise<Trait | null> {
  const { data, error } = await supabase
    .from('traits')
    .insert([trait])
    .select();
  if (error) {
    console.error('Error creating trait:', error);
    return null;
  }
  return data?.[0] || null;
}

export async function updateTrait(id: string, trait: Partial<Omit<Trait, 'id' | 'created_at' | 'updated_at'>>): Promise<Trait | null> {
  const { data, error } = await supabase
    .from('traits')
    .update(trait)
    .eq('id', id)
    .select();
  if (error) {
    console.error(`Error updating trait with id ${id}:`, error);
    return null;
  }
  return data?.[0] || null;
}

export async function deleteTrait(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('traits')
    .delete()
    .eq('id', id);
  if (error) {
    console.error(`Error deleting trait with id ${id}:`, error);
    return false;
  }
  return true;
}

// Trigger the full traits scraping process
export async function triggerScrapeAllTraits() {
  try {
    const scraper = new TraitsScraper();
    await scraper.fetchAndSaveAllTraits();
    return { status: 'done' };
  } catch (error: any) {
    return { status: 'error', message: error.message || 'Unknown error' };
  }
}

// ... keep utility functions if needed ... 