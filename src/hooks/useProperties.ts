import { useQuery } from '@tanstack/react-query';
import { supabase, Property } from '../lib/supabase';

const PROPERTY_CARD_COLUMNS = `
  id, title, description, price, location, address,
  property_type, transaction_type, bedrooms, bathrooms,
  area, uzitkova_plocha, stav, featured, rezervovane, predane,
  vytah, pivnica, balkon, terasa, vlastny_pozemok, vlastny_parking,
  garaz, parkovacie_miesto, zahradka, image_url, created_at
`.trim();

export function useProperties() {
  return useQuery<Property[]>({
    queryKey: ['properties', 'list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(PROPERTY_CARD_COLUMNS)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    staleTime: 15 * 60 * 1000,
  });
}

export function useProperty(id: string | undefined) {
  return useQuery<Property | null>({
    queryKey: ['properties', 'detail', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
    staleTime: 30 * 60 * 1000,
  });
}

interface PropertyImage {
  id: string;
  image_url: string;
  display_order: number;
  is_primary: boolean;
}

export function usePropertyImages(propertyId: string | undefined) {
  return useQuery<PropertyImage[]>({
    queryKey: ['property_images', propertyId],
    queryFn: async () => {
      if (!propertyId) return [];
      const { data, error } = await supabase
        .from('property_images')
        .select('id, image_url, display_order, is_primary')
        .eq('property_id', propertyId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!propertyId,
    staleTime: 30 * 60 * 1000,
  });
}
