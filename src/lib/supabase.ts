import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  address: string;
  property_type: string;
  transaction_type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  area_sqm?: number;
  uzitkova_plocha?: number | null;
  zastavana_plocha?: number | null;
  stav?: string | null;
  vytah?: boolean;
  pivnica?: boolean;
  balkon?: boolean;
  terasa?: boolean;
  rezervovane?: boolean;
  pridane?: boolean;
  year_built: number | null;
  floor: number | null;
  latitude: number | null;
  longitude: number | null;
  image_url: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}
