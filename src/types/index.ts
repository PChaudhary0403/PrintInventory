export type UserRole = 'customer' | 'admin'

export interface UserProfile {
  id: string
  full_name: string
  phone: string | null
  company_name: string | null
  avatar_url: string | null
  roles: UserRole[]
}

export interface ProductDivision {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  display_order: number
  is_active: boolean
}

export interface Product {
  id: string
  division_id: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  base_price: number
  currency: string
  configuration_schema: Record<string, unknown>
  image_url: string | null
  gallery_images: string[]
  is_active: boolean
  is_featured: boolean
  display_order: number
  division?: ProductDivision
}

export interface ProductOptionDefinition {
  id: string
  product_id: string
  option_name: string
  option_key: string
  input_type: 'select' | 'radio' | 'number' | 'text' | 'checkbox' | 'color'
  is_required: boolean
  display_order: number
  validation_rules: Record<string, unknown>
  values?: ProductOptionValue[]
}

export interface ProductOptionValue {
  id: string
  option_id: string
  label: string
  value: string
  price_modifier: number
  display_order: number
  is_active: boolean
}

export type OrderStatus =
  | 'quote'
  | 'pending'
  | 'confirmed'
  | 'artwork'
  | 'proof'
  | 'production'
  | 'completed'
  | 'cancelled'

export type ProofAction = 'approved' | 'changes_requested'

export type ProductionStatus = 'pending' | 'in_progress' | 'completed' | 'failed'
