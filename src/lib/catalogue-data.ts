// Shared product & division data — used by catalogue, detail, and pricing
// Will be replaced with Supabase DB calls once env vars are configured

export interface Division {
  id: string
  name: string
  slug: string
  description: string
  image_url: string | null
  display_order: number
  is_active: boolean
}

export interface ProductOption {
  key: string
  name: string
  type: 'select' | 'number'
  required: boolean
  values?: { label: string; value: string; modifier: number }[]
  validation?: { min: number; max: number; step: number }
}

export interface CatalogueProduct {
  id: string
  division_id: string
  name: string
  slug: string
  short_description: string
  description: string
  base_price: number
  currency: string
  image_url: string | null
  is_active: boolean
  is_featured: boolean
  display_order: number
  has_size_modifier?: boolean
  options: ProductOption[]
}

export const DIVISIONS: Division[] = [
  { id: 'd1', name: 'Labels & Stickers', slug: 'labels-stickers', description: 'Custom printed labels and stickers for every application. From product labels to promotional stickers, configured to your exact specifications.', image_url: 'https://images.unsplash.com/photo-1635405074683-96d6921a2a68?w=600&q=80', display_order: 1, is_active: true },
  { id: 'd2', name: 'Race & Event Numbers', slug: 'race-event-numbers', description: 'Professional race numbers and event identification. Variable data printing for bulk orders with CSV merge support.', image_url: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=600&q=80', display_order: 2, is_active: true },
  { id: 'd3', name: 'MTB Boards', slug: 'mtb-boards', description: 'Custom mountain bike number boards and plates. Durable materials designed for outdoor racing conditions.', image_url: 'https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=600&q=80', display_order: 3, is_active: true },
  { id: 'd4', name: 'Stamps', slug: 'stamps', description: 'Custom rubber and self-inking stamps for business and personal use.', image_url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80', display_order: 4, is_active: true },
  { id: 'd5', name: 'Trophies', slug: 'trophies', description: 'Custom engraved and printed trophies, awards, and recognition items for events and achievements.', image_url: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&q=80', display_order: 5, is_active: true },
  { id: 'd6', name: 'Laser-Cut Work', slug: 'laser-cut-work', description: 'Precision laser-cut signage, decorative items, and custom fabrication in wood, acrylic, and metal.', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80', display_order: 6, is_active: true },
]

export const PRODUCTS: CatalogueProduct[] = [
  // Labels & Stickers
  {
    id: 'p1', division_id: 'd1', name: 'Custom Vinyl Stickers', slug: 'custom-vinyl-stickers',
    short_description: 'High-quality vinyl stickers in any shape or size with premium finishes.',
    description: 'High-quality vinyl stickers printed to your specifications. Perfect for branding, packaging, and promotional use. Available in multiple shapes, sizes, and finishes. UV-resistant inks ensure long-lasting colours.',
    base_price: 500, currency: 'INR', image_url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80', is_active: true, is_featured: true, display_order: 1,
    options: [
      { key: 'shape', name: 'Shape', type: 'select', required: true, values: [{ label: 'Rectangle', value: 'rectangle', modifier: 0 }, { label: 'Circle', value: 'circle', modifier: 50 }, { label: 'Oval', value: 'oval', modifier: 50 }, { label: 'Custom Die-Cut', value: 'custom', modifier: 200 }] },
      { key: 'width', name: 'Width (cm)', type: 'number', required: true, validation: { min: 2, max: 50, step: 0.5 } },
      { key: 'height', name: 'Height (cm)', type: 'number', required: true, validation: { min: 2, max: 50, step: 0.5 } },
      { key: 'material', name: 'Material', type: 'select', required: true, values: [{ label: 'White Vinyl', value: 'white-vinyl', modifier: 0 }, { label: 'Clear Vinyl', value: 'clear-vinyl', modifier: 100 }, { label: 'Metallic', value: 'metallic', modifier: 200 }] },
      { key: 'finish', name: 'Finish', type: 'select', required: true, values: [{ label: 'Matte', value: 'matte', modifier: 0 }, { label: 'Gloss', value: 'gloss', modifier: 0 }, { label: 'Soft-Touch', value: 'soft-touch', modifier: 100 }] },
      { key: 'quantity', name: 'Quantity', type: 'number', required: true, validation: { min: 25, max: 10000, step: 25 } },
    ],
  },
  {
    id: 'p2', division_id: 'd1', name: 'Product Labels', slug: 'product-labels',
    short_description: 'Professional product labels for retail, food, cosmetics, and more.',
    description: 'Professionally designed product labels for retail and packaging. Food-safe materials available. Compatible with bottles, jars, boxes, and flat surfaces.',
    base_price: 400, currency: 'INR', image_url: 'https://images.unsplash.com/photo-1589384267710-7a170981ca78?w=600&q=80', is_active: true, is_featured: true, display_order: 2,
    options: [
      { key: 'width', name: 'Width (cm)', type: 'number', required: true, validation: { min: 2, max: 20, step: 0.5 } },
      { key: 'height', name: 'Height (cm)', type: 'number', required: true, validation: { min: 2, max: 20, step: 0.5 } },
      { key: 'material', name: 'Material', type: 'select', required: true, values: [{ label: 'Paper', value: 'paper', modifier: 0 }, { label: 'Waterproof', value: 'waterproof', modifier: 80 }, { label: 'Kraft', value: 'kraft', modifier: 50 }] },
      { key: 'finish', name: 'Finish', type: 'select', required: true, values: [{ label: 'Matte', value: 'matte', modifier: 0 }, { label: 'Gloss', value: 'gloss', modifier: 0 }] },
      { key: 'quantity', name: 'Quantity', type: 'number', required: true, validation: { min: 50, max: 10000, step: 50 } },
    ],
  },
  {
    id: 'p3', division_id: 'd1', name: 'Bumper Stickers', slug: 'bumper-stickers',
    short_description: 'Durable outdoor bumper stickers with UV-resistant inks.',
    description: 'Tough, weather-resistant bumper stickers that last years outdoors. UV-resistant inks, strong adhesive, available in standard or custom sizes.',
    base_price: 350, currency: 'INR', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80', is_active: true, is_featured: true, display_order: 3,
    options: [
      { key: 'size', name: 'Size', type: 'select', required: true, values: [{ label: '20×6 cm', value: '20x6', modifier: 0 }, { label: '25×8 cm', value: '25x8', modifier: 50 }, { label: '30×10 cm', value: '30x10', modifier: 100 }] },
      { key: 'quantity', name: 'Quantity', type: 'number', required: true, validation: { min: 25, max: 5000, step: 25 } },
    ],
  },
  // Race & Event Numbers
  {
    id: 'p4', division_id: 'd2', name: 'Standard Race Numbers', slug: 'standard-race-numbers',
    short_description: 'Printed race numbers for running, cycling and triathlon events.',
    description: 'High-visibility race numbers for running, cycling, triathlon, and other events. Lightweight, tear-resistant materials. Custom numbering via CSV variable data upload.',
    base_price: 200, currency: 'INR', image_url: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80', is_active: true, is_featured: true, display_order: 1,
    options: [
      { key: 'size', name: 'Size', type: 'select', required: true, values: [{ label: 'A5 (148×210mm)', value: 'a5', modifier: 0 }, { label: 'A4 (210×297mm)', value: 'a4', modifier: 80 }, { label: 'A3 (297×420mm)', value: 'a3', modifier: 180 }] },
      { key: 'material', name: 'Material', type: 'select', required: true, values: [{ label: 'Tyvek (Tear-Resistant)', value: 'tyvek', modifier: 60 }, { label: 'Coated Paper', value: 'paper', modifier: 0 }, { label: 'Synthetic', value: 'synthetic', modifier: 100 }] },
      { key: 'quantity', name: 'Quantity', type: 'number', required: true, validation: { min: 50, max: 5000, step: 50 } },
    ],
  },
  {
    id: 'p5', division_id: 'd2', name: 'Timing Chip Race Bibs', slug: 'timing-chip-race-bibs',
    short_description: 'Race bibs pre-fitted with timing chip slots for timed events.',
    description: 'Professional race bibs with built-in timing chip pockets for chip-timed events. Reinforced corners, two-sided print option, full-colour.',
    base_price: 350, currency: 'INR', image_url: 'https://images.unsplash.com/photo-1461896836934-bd45ba8c3e3b?w=600&q=80', is_active: true, is_featured: true, display_order: 2,
    options: [
      { key: 'size', name: 'Size', type: 'select', required: true, values: [{ label: 'A5', value: 'a5', modifier: 0 }, { label: 'A4', value: 'a4', modifier: 80 }] },
      { key: 'quantity', name: 'Quantity', type: 'number', required: true, validation: { min: 100, max: 5000, step: 100 } },
    ],
  },
  // MTB Boards
  {
    id: 'p6', division_id: 'd3', name: 'MTB Number Boards', slug: 'mtb-number-boards',
    short_description: 'Custom mountain bike number boards for enduro and downhill racing.',
    description: 'Durable mountain bike number boards for enduro, downhill, and XC racing. Rigid plastic with vivid UV-resistant printing. Standard and custom sizes.',
    base_price: 450, currency: 'INR', image_url: 'https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=600&q=80', is_active: true, is_featured: true, display_order: 1,
    options: [
      { key: 'size', name: 'Size', type: 'select', required: true, values: [{ label: 'Standard (20×15cm)', value: 'standard', modifier: 0 }, { label: 'Large (25×20cm)', value: 'large', modifier: 100 }] },
      { key: 'material', name: 'Material', type: 'select', required: true, values: [{ label: 'Rigid Plastic', value: 'plastic', modifier: 0 }, { label: 'Carbon-Look', value: 'carbon', modifier: 150 }] },
      { key: 'quantity', name: 'Quantity', type: 'number', required: true, validation: { min: 20, max: 2000, step: 20 } },
    ],
  },
  // Stamps
  {
    id: 'p7', division_id: 'd4', name: 'Self-Inking Stamps', slug: 'self-inking-stamps',
    short_description: 'Professional self-inking stamps for business and office use.',
    description: 'High-quality self-inking stamps for business, office, and retail use. Fast impression, up to 10,000 impressions before re-inking. Available in multiple sizes.',
    base_price: 600, currency: 'INR', image_url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80', is_active: true, is_featured: true, display_order: 1,
    options: [
      { key: 'size', name: 'Size', type: 'select', required: true, values: [{ label: 'Small (28×9mm)', value: 'small', modifier: 0 }, { label: 'Medium (47×18mm)', value: 'medium', modifier: 150 }, { label: 'Large (58×22mm)', value: 'large', modifier: 250 }] },
      { key: 'ink_color', name: 'Ink Colour', type: 'select', required: true, values: [{ label: 'Black', value: 'black', modifier: 0 }, { label: 'Blue', value: 'blue', modifier: 0 }, { label: 'Red', value: 'red', modifier: 0 }, { label: 'Green', value: 'green', modifier: 0 }] },
      { key: 'lines', name: 'Lines of Text', type: 'number', required: true, validation: { min: 1, max: 6, step: 1 } },
      { key: 'quantity', name: 'Quantity', type: 'number', required: true, validation: { min: 1, max: 100, step: 1 } },
    ],
  },
  {
    id: 'p8', division_id: 'd4', name: 'Rubber Stamps', slug: 'rubber-stamps',
    short_description: 'Traditional rubber stamps for art, craft, and business use.',
    description: 'Custom rubber stamps mounted on wood. Ideal for artists, crafters, and businesses wanting a traditional ink-pad stamp.',
    base_price: 350, currency: 'INR', image_url: 'https://images.unsplash.com/photo-1461896836934-bd45ba8c3e3b?w=600&q=80', is_active: true, is_featured: true, display_order: 2,
    options: [
      { key: 'size', name: 'Size', type: 'select', required: true, values: [{ label: 'Small (up to 4cm²)', value: 'small', modifier: 0 }, { label: 'Medium (up to 9cm²)', value: 'medium', modifier: 100 }, { label: 'Large (up to 16cm²)', value: 'large', modifier: 200 }] },
      { key: 'quantity', name: 'Quantity', type: 'number', required: true, validation: { min: 1, max: 50, step: 1 } },
    ],
  },
  // Trophies
  {
    id: 'p9', division_id: 'd5', name: 'Acrylic Awards', slug: 'acrylic-awards',
    short_description: 'Custom engraved acrylic awards for corporate and sports events.',
    description: 'Premium laser-engraved acrylic awards in a range of shapes and sizes. Full-colour print option available. Ideal for corporate recognition, sports, and academic events.',
    base_price: 800, currency: 'INR', image_url: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&q=80', is_active: true, is_featured: true, display_order: 1,
    options: [
      { key: 'size', name: 'Size', type: 'select', required: true, values: [{ label: 'Small (15cm)', value: 'small', modifier: 0 }, { label: 'Medium (20cm)', value: 'medium', modifier: 200 }, { label: 'Large (25cm)', value: 'large', modifier: 400 }] },
      { key: 'colour', name: 'Acrylic Colour', type: 'select', required: true, values: [{ label: 'Clear', value: 'clear', modifier: 0 }, { label: 'Blue', value: 'blue', modifier: 50 }, { label: 'Gold', value: 'gold', modifier: 100 }] },
      { key: 'quantity', name: 'Quantity', type: 'number', required: true, validation: { min: 1, max: 500, step: 1 } },
    ],
  },
  {
    id: 'p10', division_id: 'd5', name: 'Metal Trophies', slug: 'metal-trophies',
    short_description: 'Classic metal trophies with custom engraving plates.',
    description: 'Traditional metal trophies with custom-engraved brass or aluminium plates. Available in cup, column, and figurine styles.',
    base_price: 1200, currency: 'INR', image_url: 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=600&q=80', is_active: true, is_featured: true, display_order: 2,
    options: [
      { key: 'style', name: 'Style', type: 'select', required: true, values: [{ label: 'Cup', value: 'cup', modifier: 0 }, { label: 'Column', value: 'column', modifier: 100 }, { label: 'Figurine', value: 'figurine', modifier: 200 }] },
      { key: 'size', name: 'Height', type: 'select', required: true, values: [{ label: '20cm', value: '20cm', modifier: 0 }, { label: '30cm', value: '30cm', modifier: 300 }, { label: '40cm', value: '40cm', modifier: 600 }] },
      { key: 'quantity', name: 'Quantity', type: 'number', required: true, validation: { min: 1, max: 200, step: 1 } },
    ],
  },
  // Laser-Cut
  {
    id: 'p11', division_id: 'd6', name: 'Acrylic Signs', slug: 'acrylic-signs',
    short_description: 'Precision laser-cut acrylic signage for offices and retail.',
    description: 'Custom laser-cut and engraved acrylic signs for offices, retail, events, and home. Available in a range of thicknesses and colours with polished edges.',
    base_price: 900, currency: 'INR', image_url: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=600&q=80', is_active: true, is_featured: true, display_order: 1,
    options: [
      { key: 'width', name: 'Width (cm)', type: 'number', required: true, validation: { min: 5, max: 100, step: 1 } },
      { key: 'height', name: 'Height (cm)', type: 'number', required: true, validation: { min: 5, max: 60, step: 1 } },
      { key: 'thickness', name: 'Thickness', type: 'select', required: true, values: [{ label: '3mm', value: '3mm', modifier: 0 }, { label: '5mm', value: '5mm', modifier: 150 }, { label: '10mm', value: '10mm', modifier: 350 }] },
      { key: 'colour', name: 'Acrylic Colour', type: 'select', required: true, values: [{ label: 'Clear', value: 'clear', modifier: 0 }, { label: 'White', value: 'white', modifier: 0 }, { label: 'Black', value: 'black', modifier: 0 }, { label: 'Gold Mirror', value: 'gold-mirror', modifier: 200 }] },
      { key: 'quantity', name: 'Quantity', type: 'number', required: true, validation: { min: 1, max: 200, step: 1 } },
    ],
  },
  {
    id: 'p12', division_id: 'd6', name: 'Wooden Plaques', slug: 'wooden-plaques',
    short_description: 'Custom laser-engraved wooden plaques and name boards.',
    description: 'Laser-engraved wooden plaques in natural timber finishes. Suitable for awards, nameplates, and decorative signage.',
    base_price: 700, currency: 'INR', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80', is_active: true, is_featured: true, display_order: 2,
    options: [
      { key: 'size', name: 'Size', type: 'select', required: true, values: [{ label: 'Small (15×10cm)', value: 'small', modifier: 0 }, { label: 'Medium (20×15cm)', value: 'medium', modifier: 150 }, { label: 'Large (30×20cm)', value: 'large', modifier: 300 }] },
      { key: 'wood', name: 'Wood Type', type: 'select', required: true, values: [{ label: 'MDF', value: 'mdf', modifier: 0 }, { label: 'Bamboo', value: 'bamboo', modifier: 100 }, { label: 'Walnut', value: 'walnut', modifier: 250 }] },
      { key: 'quantity', name: 'Quantity', type: 'number', required: true, validation: { min: 1, max: 200, step: 1 } },
    ],
  },
]

export function getDivisionBySlug(slug: string): Division | undefined {
  return DIVISIONS.find(d => d.slug === slug)
}

export function getProductBySlug(slug: string): CatalogueProduct | undefined {
  return PRODUCTS.find(p => p.slug === slug)
}

export function getProductsByDivision(divisionId: string): CatalogueProduct[] {
  return PRODUCTS.filter(p => p.division_id === divisionId && p.is_active)
}

export function getDivisionForProduct(product: CatalogueProduct): Division | undefined {
  return DIVISIONS.find(d => d.id === product.division_id)
}
