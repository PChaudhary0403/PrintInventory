import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductConfigurator from '@/components/product/ProductConfigurator';
import { PRODUCTS, DIVISIONS, getProductBySlug, getDivisionForProduct } from '@/lib/catalogue-data';

export function generateStaticParams() {
  return PRODUCTS.filter((p) => p.is_active).map((p) => ({ slug: p.slug }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const division = getDivisionForProduct(product);
  const divisionName = division?.name ?? '';
  const divisionSlug = division?.slug ?? '';

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
          href={`/products/${divisionSlug}`}
          className="transition-colors hover:text-primary"
        >
          {divisionName}
        </Link>
        <span>/</span>
        <span className="text-text-primary">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          {/* Main product image */}
          <div className="aspect-square rounded-xl border border-border bg-surface overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full">
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
            )}
          </div>

          {/* Product info below image */}
          <div className="mt-8">
            <h1 className="text-2xl font-bold text-text-primary">{product.name}</h1>
            <p className="mt-3 leading-relaxed text-text-secondary">{product.description}</p>

            {/* Quick specs */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border bg-surface px-4 py-3">
                <p className="text-xs text-text-secondary">Division</p>
                <p className="text-sm font-medium text-text-primary">{divisionName}</p>
              </div>
              <div className="rounded-lg border border-border bg-surface px-4 py-3">
                <p className="text-xs text-text-secondary">Starting from</p>
                <p className="text-sm font-medium text-text-primary">₹{product.base_price.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <ProductConfigurator
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              base_price: product.base_price,
              has_size_modifier: product.has_size_modifier ?? false,
              options: product.options,
            }}
            divisionName={divisionName}
          />
        </div>
      </div>
    </div>
  );
}
