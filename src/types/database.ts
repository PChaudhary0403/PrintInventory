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
      profiles: {
        Row: {
          id: string
          full_name: string
          phone: string | null
          company_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string
          phone?: string | null
          company_name?: string | null
          avatar_url?: string | null
        }
        Update: {
          full_name?: string
          phone?: string | null
          company_name?: string | null
          avatar_url?: string | null
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: 'customer' | 'admin'
          created_at: string
        }
        Insert: {
          user_id: string
          role: 'customer' | 'admin'
        }
        Update: {
          role?: 'customer' | 'admin'
        }
      }
      product_divisions: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          display_order?: number
          is_active?: boolean
        }
        Update: {
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          display_order?: number
          is_active?: boolean
        }
      }
      products: {
        Row: {
          id: string
          division_id: string
          name: string
          slug: string
          description: string | null
          short_description: string | null
          base_price: number
          currency: string
          configuration_schema: Json
          image_url: string | null
          gallery_images: Json
          is_active: boolean
          is_featured: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          division_id: string
          name: string
          slug: string
          description?: string | null
          short_description?: string | null
          base_price?: number
          currency?: string
          configuration_schema?: Json
          image_url?: string | null
          gallery_images?: Json
          is_active?: boolean
          is_featured?: boolean
          display_order?: number
        }
        Update: {
          division_id?: string
          name?: string
          slug?: string
          description?: string | null
          short_description?: string | null
          base_price?: number
          currency?: string
          configuration_schema?: Json
          image_url?: string | null
          gallery_images?: Json
          is_active?: boolean
          is_featured?: boolean
          display_order?: number
        }
      }
      product_option_definitions: {
        Row: {
          id: string
          product_id: string
          option_name: string
          option_key: string
          input_type: 'select' | 'radio' | 'number' | 'text' | 'checkbox' | 'color'
          is_required: boolean
          display_order: number
          validation_rules: Json
          created_at: string
        }
        Insert: {
          product_id: string
          option_name: string
          option_key: string
          input_type: 'select' | 'radio' | 'number' | 'text' | 'checkbox' | 'color'
          is_required?: boolean
          display_order?: number
          validation_rules?: Json
        }
        Update: {
          option_name?: string
          option_key?: string
          input_type?: 'select' | 'radio' | 'number' | 'text' | 'checkbox' | 'color'
          is_required?: boolean
          display_order?: number
          validation_rules?: Json
        }
      }
      product_option_values: {
        Row: {
          id: string
          option_id: string
          label: string
          value: string
          price_modifier: number
          display_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          option_id: string
          label: string
          value: string
          price_modifier?: number
          display_order?: number
          is_active?: boolean
        }
        Update: {
          label?: string
          value?: string
          price_modifier?: number
          display_order?: number
          is_active?: boolean
        }
      }
      product_templates: {
        Row: {
          id: string
          product_id: string
          name: string
          description: string | null
          template_data: Json
          preview_url: string | null
          is_active: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          product_id: string
          name: string
          description?: string | null
          template_data?: Json
          preview_url?: string | null
          is_active?: boolean
          display_order?: number
        }
        Update: {
          name?: string
          description?: string | null
          template_data?: Json
          preview_url?: string | null
          is_active?: boolean
          display_order?: number
        }
      }
      print_zones: {
        Row: {
          id: string
          product_id: string
          zone_name: string
          width: number
          height: number
          unit: 'mm' | 'cm' | 'in' | 'px'
          position_data: Json
          constraints: Json
          bleed: number
          resolution_dpi: number
          created_at: string
          updated_at: string
        }
        Insert: {
          product_id: string
          zone_name: string
          width: number
          height: number
          unit?: 'mm' | 'cm' | 'in' | 'px'
          position_data?: Json
          constraints?: Json
          bleed?: number
          resolution_dpi?: number
        }
        Update: {
          zone_name?: string
          width?: number
          height?: number
          unit?: 'mm' | 'cm' | 'in' | 'px'
          position_data?: Json
          constraints?: Json
          bleed?: number
          resolution_dpi?: number
        }
      }
    }
  }
}
