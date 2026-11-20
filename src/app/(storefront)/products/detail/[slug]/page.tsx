import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductConfigurator from '@/components/product/ProductConfigurator';

const sampleProducts = [
  {
    id: 'p1',
    slug: 'custom-vinyl-stickers',
    name: 'Custom Vinyl Stickers',
    division: { name: 'Labels & Stickers', slug: 'labels-stickers' },
    description:
      'High-quality vinyl stickers printed to your specifications. Perfect for branding, packaging, and promotional use. Available in multiple shapes, sizes, and finishes.',
    base_price: 500,
    has_size_modifier: true,
    images: ['/images/products/vinyl-stickers-1.jpg', '/images/products/vinyl-stickers-2.jpg', '/images/products/vinyl-stickers-3.jpg'],
    options: [
      {
        key: 'shape',
        name: 'Shape',
        type: 'select' as const,
        required: true,
        values: [
          { label: 'Rectangle', value: 'rectangle', modifier: 0 },
          { label: 'Circle', value: 'circle', modifier: 50 },
          { label: 'Oval', value: 'oval', modifier: 50 },
          { label: 'Custom Die-Cut', value: 'custom', modifier: 200 },
        ],
      },
      {
        key: 'width',
        name: 'Width (cm)',
        type: 'number' as const,
        required: true,
        validation: { min: 2, max: 50, step: 0.5 },
      },
      {
        key: 'height',
        name: 'Height (cm)',
        type: 'number' as const,
        required: true,
        validation: { min: 2, max: 50, step: 0.5 },
      },
      {
        key: 'material',
        name: 'Material',
        type: 'select' as const,
        required: true,
        values: [
          { label: 'White Vinyl', value: 'white-vinyl', modifier: 0 },
          { label: 'Clear Vinyl', value: 'clear-vinyl', modifier: 100 },
          { label: 'Metallic', value: 'metallic', modifier: 200 },
        ],
      },
      {
        key: 'finish',
        name: 'Finish',
        type: 'select' as const,
        required: true,
        values: [
          { label: 'Matte', value: 'matte', modifier: 0 },
          { label: 'Gloss', value: 'gloss', modifier: 0 },
          { label: 'Soft-Touch', value: 'soft-touch', modifier: 100 },
        ],
      },
      {
        key: 'quantity',
        name: 'Quantity',
        type: 'number' as const,
        required: true,
        validation: { min: 25, max: 10000, step: 25 },
      },
    ],
  },
  {
    id: 'p2',
    slug: 'standard-race-numbers',
    name: 'Standard Race Numbers',
    division: { name: 'Event Products', slug: 'event-products' },
    description:
      'Durable race numbers for marathons, triathlons, and cycling events. Tear-resistant materials with clear, bold numbering. Available in standard paper sizes with sequential or custom numbering.',
    base_price: 300,
    has_size_modifier: false,
    images: ['/images/products/race-numbers-1.jpg', '/images/products/race-numbers-2.jpg'],
    options: [
      {
        key: 'size',
        name: 'Size',
        type: 'select' as const,
        required: true,
        values: [
          { label: 'A5 (148 × 210 mm)', value: 'a5', modifier: 0 },
          { label: 'A4 (210 × 297 mm)', value: 'a4', modifier: 100 },
          { label: 'A3 (297 × 420 mm)', value: 'a3', modifier: 250 },
        ],
      },
      {
        key: 'material',
        name: 'Material',
        type: 'select' as const,
        required: true,
        values: [
          { label: 'Tyvek', value: 'tyvek', modifier: 0 },
          { label: 'Paper', value: 'paper', modifier: -50 },
          { label: 'Synthetic', value: 'synthetic', modifier: 150 },
        ],
      },
      {
        key: 'numbering',
        name: 'Numbering',
        type: 'select' as const,
        required: true,
        values: [
          { label: 'Sequential', value: 'sequential', modifier: 0 },
          { label: 'Custom', value: 'custom', modifier: 100 },
        ],
      },
      {
        key: 'quantity',
        name: 'Quantity',
        type: 'number' as const,
        required: true,
        validation: { min: 25, max: 10000, step: 25 },
      },
    ],
  },
  {
    id: 'p3',
    slug: 'self-inking-stamps',
    name: 'Self-Inking Stamps',
    division: { name: 'Office Products', slug: 'office-products' },
    description:
      'Professional self-inking stamps for office use, return addresses, and business branding. Built-in ink pad delivers thousands of crisp impressions. Customise with your text and layout.',
    base_price: 800,
    has_size_modifier: false,
    images: ['/images/products/stamps-1.jpg', '/images/products/stamps-2.jpg'],
    options: [
      {
        key: 'size',
        name: 'Size',
        type: 'select' as const,
        required: true,
        values: [
          { label: 'Small (38 × 14 mm)', value: 'small', modifier: 0 },
          { label: 'Medium (58 × 22 mm)', value: 'medium', modifier: 200 },
          { label: 'Large (76 × 38 mm)', value: 'large', modifier: 450 },
        ],
      },
      {
        key: 'ink_color',
        name: 'Ink Colour',
        type: 'select' as const,
        required: true,
        values: [
          { label: 'Black', value: 'black', modifier: 0 },
          { label: 'Blue', value: 'blue', modifier: 0 },
          { label: 'Red', value: 'red', modifier: 0 },
          { label: 'Green', value: 'green', modifier: 50 },
        ],
      },
      {
        key: 'lines',
        name: 'Number of Lines',
        type: 'number' as const,
        required: true,
        validation: { min: 1, max: 6, step: 1 },
      },
      {
        key: 'quantity',
        name: 'Quantity',
        type: 'number' as const,
        required: true,
        validation: { min: 1, max: 500, step: 1 },
      },
    ],
  },
];

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = sampleProducts.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-8 flex items-center gap-2 text-sm text-text-secondary">
        <Link href="/" className="transition-colors hover:text-primary">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="transition-colors hover:text-primary">
          Print Products
        </Link>
        <span>/</span>
        <Link
          href={`/products/${product.division.slug}`}
          className="transition-colors hover:text-primary"
        >
          {product.division.name}
        </Link>
        <span>/</span>
        <span className="text-text-primary">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <div className="flex aspect-square items-center justify-center rounded-xl border border-border bg-surface">
            <div className="text-center">
              <svg
                className="mx-auto h-16 w-16 text-text-secondary/40"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
                />
              </svg>
              <p className="mt-3 text-sm text-text-secondary">Product image</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-3">
            {product.images.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`flex aspect-square items-center justify-center rounded-lg border bg-surface text-xs text-text-secondary transition-colors ${
                  index === 0 ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <div className="mt-8">
            <h1 className="text-2xl font-bold text-text-primary">{product.name}</h1>
            <p className="mt-3 leading-relaxed text-text-secondary">{product.description}</p>
          </div>
        </div>

        <div>
          <ProductConfigurator product={product} />
        </div>
      </div>
    </div>
  );
}
