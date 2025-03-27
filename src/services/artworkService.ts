import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import type { Database } from '../types/supabase';

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  image_url: string;
  price: number;
  medium?: string;
  style?: string;
  description?: string | null;
  gallery?: string | null;
  year?: number;
  width?: number;
  height?: number;
  dimension_unit?: string;
  created_at?: string;
  product_url: string;
}

export interface ArtworkFilters {
  searchQuery?: string;
  style?: string;
  medium?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'popularity' | 'price_asc' | 'price_desc' | 'newest';
  page?: number;
  limit?: number;
}

/**
 * Helper function to split comma-separated values and create a unique, sanitized set
 */
const splitAndSanitizeValues = (values: string[]): string[] => {
  // Create a Set to store unique values
  const uniqueValues = new Set<string>();
  
  // Process each value
  values.forEach(value => {
    if (!value) return;
    
    // Split by comma and process each part
    value.split(',').forEach(part => {
      // Clean up the part
      const cleaned = part.trim()
        // Remove any extra whitespace
        .replace(/\s+/g, ' ')
        // Convert to sentence case
        .toLowerCase()
        .replace(/^\w/, c => c.toUpperCase());
      
      if (cleaned) {
        uniqueValues.add(cleaned);
      }
    });
  });
  
  // Convert Set back to sorted array
  return Array.from(uniqueValues).sort();
};

/**
 * Fetch artworks from the database with optional filtering and pagination
 */
export const fetchArtworks = async (filters: ArtworkFilters = {}): Promise<{
  artworks: Artwork[];
  count: number;
}> => {
  try {
    const {
      searchQuery,
      style,
      medium,
      minPrice,
      maxPrice,
      sortBy = 'popularity',
      page = 1,
      limit = 12
    } = filters;

    // Calculate pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Start building the query
    let query = supabase
      .from('demo_artworks')
      .select('*', { count: 'exact' });

    // Apply filters
    if (searchQuery) {
      query = query.or(
        `title.ilike.%${searchQuery}%,artist.ilike.%${searchQuery}%`
      );
    }

    if (style && style !== 'All Styles') {
      // Match style as a substring, case-insensitive
      query = query.ilike('style', `%${style}%`);
    }

    if (medium && medium !== 'All Mediums') {
      // Match medium as a substring, case-insensitive
      query = query.ilike('medium', `%${medium}%`);
    }

    if (minPrice !== undefined) {
      query = query.gte('price', minPrice);
    }

    if (maxPrice !== undefined && maxPrice < Infinity) {
      query = query.lte('price', maxPrice);
    }

    // Apply sorting
    switch (sortBy) {
      case 'popularity':
        //query = query.order('popularity', { ascending: false });
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
      default:
        //query = query.order('popularity', { ascending: false });
    }

    // Apply pagination
    query = query.range(from, to);

    // Execute the query
    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    return {
      artworks: data || [],
      count: count || 0
    };
  } catch (error) {
    console.error('Error fetching artworks:', error);
    toast.error('Failed to load artworks');
    return { artworks: [], count: 0 };
  }
};

/**
 * Fetch a single artwork by ID
 */
export const fetchArtworkById = async (id: string): Promise<Artwork | null> => {
  try {
    const { data, error } = await supabase
      .from('demo_artworks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching artwork by ID:', error);
    toast.error('Failed to load artwork details');
    return null;
  }
};

/**
 * Fetch multiple artworks by their IDs
 */
export const fetchArtworksByIds = async (ids: string[]): Promise<Artwork[]> => {
  try {
    const { data, error } = await supabase
      .from('demo_artworks')
      .select('*')
      .in('id', ids);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching artworks by IDs:', error);
    toast.error('Failed to load artwork details');
    return [];
  }
};

/**
 * Fetch popular artworks
 */
export const fetchPopularArtworks = async (limit = 6): Promise<Artwork[]> => {
  try {
    const { data, error } = await supabase
      .from('demo_artworks')
      .select('*')
      //.order('popularity', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching popular artworks:', error);
    toast.error('Failed to load popular artworks');
    return [];
  }
};

/**
 * Fetch similar artworks based on embedding similarity
 */
export const fetchSimilarArtworks = async (
  artwork: Artwork,
  limit = 4
): Promise<Artwork[]> => {
  try {
    // First get the embedding for the source artwork
    const { data: embeddingData, error: embeddingError } = await supabase
      .from('artwork')
      .select('embedding')
      .eq('artwork_id', artwork.id)
      .single();

    if (embeddingError || !embeddingData) {
      throw new Error('Could not find embedding for artwork');
    }

    // Use the embedding to find similar artworks
    const { data: similarArtworks, error: similarError } = await supabase
      .rpc('match_artworks', {
        query_embedding: embeddingData.embedding,
        match_threshold: 0.2, // Adjust similarity threshold as needed
        match_count: limit
      })
      .neq('id', artwork.id); // Exclude the source artwork

    if (similarError) {
      throw similarError;
    }

    return similarArtworks || [];
  } catch (error) {
    console.error('Error fetching similar artworks:', error);
    return [];
  }
};

/**
 * Get all available styles from the database
 */
export const fetchArtworkStyles = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('demo_artworks')
      .select('style');

    if (error) {
      throw error;
    }

    // Extract and process styles
    const styles = data
      .map(item => item.style)
      .filter(style => style !== null) as string[];

    return splitAndSanitizeValues(styles);
  } catch (error) {
    console.error('Error fetching artwork styles:', error);
    return [];
  }
};

/**
 * Get all available mediums from the database
 */
export const fetchArtworkMediums = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('demo_artworks')
      .select('medium');

    if (error) {
      throw error;
    }

    // Extract and process mediums
    const mediums = data
      .map(item => item.medium)
      .filter(medium => medium !== null) as string[];

    return splitAndSanitizeValues(mediums);
  } catch (error) {
    console.error('Error fetching artwork mediums:', error);
    return [];
  }
};