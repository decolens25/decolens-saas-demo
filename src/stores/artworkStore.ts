import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Artwork {
  id: string;
  title: string;
  artist: string;
  image_url: string;
  price: number;
  dimensions: string;
  medium: string;
  style: string;
  description: string | null;
  colors: string[] | null;
  gallery: string | null;
  popularity: number;
  year: number;
  created_at: string;
}

interface ArtworkFilters {
  searchQuery?: string;
  style?: string;
  medium?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'popularity' | 'price_asc' | 'price_desc' | 'newest';
}

interface ArtworkStore {
  artworks: Artwork[];
  popularArtworks: Artwork[];
  selectedArtwork: Artwork | null;
  loading: boolean;
  error: string | null;
  fetchArtworks: (filters?: ArtworkFilters) => Promise<void>;
  fetchPopularArtworks: (limit?: number) => Promise<void>;
  fetchArtworkById: (id: string) => Promise<Artwork | null>;
  getSimilarArtworks: (artwork: Artwork, limit?: number) => Promise<Artwork[]>;
}

export const useArtworkStore = create<ArtworkStore>((set, get) => ({
  artworks: [],
  popularArtworks: [],
  selectedArtwork: null,
  loading: false,
  error: null,
  
  fetchArtworks: async (filters = {}) => {
    try {
      set({ loading: true, error: null });
      
      let query = supabase
        .from('artworks')
        .select('*');
      
      // Apply filters
      if (filters.searchQuery) {
        query = query.or(`title.ilike.%${filters.searchQuery}%,artist.ilike.%${filters.searchQuery}%,style.ilike.%${filters.searchQuery}%`);
      }
      
      if (filters.style && filters.style !== 'All Styles') {
        query = query.eq('style', filters.style);
      }
      
      if (filters.medium && filters.medium !== 'All Mediums') {
        query = query.eq('medium', filters.medium);
      }
      
      if (filters.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }
      
      if (filters.maxPrice !== undefined && filters.maxPrice < Infinity) {
        query = query.lte('price', filters.maxPrice);
      }
      
      // Apply sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'popularity':
            query = query.order('popularity', { ascending: false });
            break;
          case 'price_asc':
            query = query.order('price', { ascending: true });
            break;
          case 'price_desc':
            query = query.order('price', { ascending: false });
            break;
          case 'newest':
            query = query.order('year', { ascending: false });
            break;
        }
      } else {
        // Default sorting by popularity
        query = query.order('popularity', { ascending: false });
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      set({ artworks: data, loading: false });
    } catch (error: any) {
      console.error('Error fetching artworks:', error);
      set({ error: error.message, loading: false });
    }
  },
  
  fetchPopularArtworks: async (limit = 6) => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .order('popularity', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      set({ popularArtworks: data, loading: false });
    } catch (error: any) {
      console.error('Error fetching popular artworks:', error);
      set({ error: error.message, loading: false });
    }
  },
  
  fetchArtworkById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      set({ selectedArtwork: data, loading: false });
      return data;
    } catch (error: any) {
      console.error('Error fetching artwork by ID:', error);
      set({ error: error.message, loading: false });
      return null;
    }
  },
  
  getSimilarArtworks: async (artwork: Artwork, limit = 4) => {
    try {
      // Find similar artworks based on style and medium
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .or(`style.eq.${artwork.style},medium.eq.${artwork.medium}`)
        .neq('id', artwork.id)
        .order('popularity', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching similar artworks:', error);
      return [];
    }
  }
}));