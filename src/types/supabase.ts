export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      artworks: {
        Row: {
          id: string
          created_at: string
          title: string
          artist: string
          image_url: string
          price: number
          dimensions: string
          medium: string
          style: string
          description: string | null
          colors: string[] | null
          gallery: string | null
          popularity: number
          year: number
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          artist: string
          image_url: string
          price: number
          dimensions: string
          medium: string
          style: string
          description?: string | null
          colors?: string[] | null
          gallery?: string | null
          popularity?: number
          year: number
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          artist?: string
          image_url?: string
          price?: number
          dimensions?: string
          medium?: string
          style?: string
          description?: string | null
          colors?: string[] | null
          gallery?: string | null
          popularity?: number
          year?: number
        }
      }
      favorites: {
        Row: {
          id: string
          created_at: string
          user_id: string
          artwork_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          artwork_id: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          artwork_id?: string
        }
      }
      room_scans: {
        Row: {
          id: string
          created_at: string
          user_id: string
          room_name: string
          image_url: string
          style: string | null
          colors: string[] | null
          lighting: string | null
          size: string | null
          features: string[] | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          room_name: string
          image_url: string
          style?: string | null
          colors?: string[] | null
          lighting?: string | null
          size?: string | null
          features?: string[] | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          room_name?: string
          image_url?: string
          style?: string | null
          colors?: string[] | null
          lighting?: string | null
          size?: string | null
          features?: string[] | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}