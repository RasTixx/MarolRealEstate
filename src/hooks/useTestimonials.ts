import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

interface Testimonial {
  id: string;
  customer_name: string;
  customer_role: string | null;
  testimonial_text: string;
  rating: number;
  featured: boolean;
  approved: boolean;
  created_at: string;
}

export function useFeaturedTestimonials() {
  return useQuery<Testimonial[]>({
    queryKey: ['testimonials', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('id, customer_name, customer_role, testimonial_text, rating, created_at')
        .eq('approved', true)
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      return data || [];
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useAllTestimonials() {
  return useQuery<Testimonial[]>({
    queryKey: ['testimonials', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('id, customer_name, customer_role, testimonial_text, rating, created_at')
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useAdminTestimonials() {
  return useQuery<Testimonial[]>({
    queryKey: ['testimonials', 'admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    staleTime: 1 * 60 * 1000,
  });
}
