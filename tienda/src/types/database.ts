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
      products: {
        Row: {
          id: string
          nombre: string
          descripcion: string | null
          precio: number
          stock: number
          categoria: string | null
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          nombre: string
          descripcion?: string | null
          precio: number
          stock?: number
          categoria?: string | null
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          descripcion?: string | null
          precio?: number
          stock?: number
          categoria?: string | null
          image_url?: string | null
          created_at?: string
        }
      }
      hero_gallery: {
        Row: {
          id: string
          image_url: string
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          image_url: string
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          image_url?: string
          active?: boolean
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          role: string
          created_at: string
        }
        Insert: {
          id: string
          email: string
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: string
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          cliente_email: string | null
          total: number | null
          estado: string | null
          direccion_envio: Json | null
          items: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          cliente_email?: string | null
          total?: number | null
          estado?: string | null
          direccion_envio?: Json | null
          items?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          cliente_email?: string | null
          total?: number | null
          estado?: string | null
          direccion_envio?: Json | null
          items?: Json | null
          created_at?: string
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Tipos auxiliares para facilitar su uso en componentes
export type Product = Database['public']['Tables']['products']['Row'];
export type InsertProduct = Database['public']['Tables']['products']['Insert'];
export type UpdateProduct = Database['public']['Tables']['products']['Update'];

export type Order = Database['public']['Tables']['orders']['Row'];
export type InsertOrder = Database['public']['Tables']['orders']['Insert'];
export type UpdateOrder = Database['public']['Tables']['orders']['Update'];
