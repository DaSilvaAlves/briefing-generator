import { createClient } from '@supabase/supabase-js';
import type { BriefingOutput } from './SmartAI';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Client only initialised when credentials are present — prevents white screen on missing .env
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/** Saves a BriefingOutput to the 'briefings' table. Returns the created record (with id) or null. */
export const saveBriefing = async (briefing: BriefingOutput): Promise<{ id: string } | null> => {
  if (!supabase) {
    console.warn('Supabase not initialised — skipping persist. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('briefings')
      .insert([briefing])
      .select();

    if (error) {
      console.error('Supabase insert error:', error.message);
      return null;
    }

    console.log('✅ Briefing saved:', data?.[0]?.id);
    return data && data.length > 0 ? data[0] : null;
  } catch (err) {
    console.error('saveBriefing failed:', err);
    return null;
  }
};

/** Fetches a single briefing by id (for shareable URLs). */
export const getBriefingById = async (id: string): Promise<BriefingOutput | null> => {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('briefings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data as BriefingOutput;
  } catch {
    return null;
  }
};
