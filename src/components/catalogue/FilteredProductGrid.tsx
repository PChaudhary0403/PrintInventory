import { ProductCard } from './ProductCard'
import type { CatalogueProduct, Division } from '@/lib/catalogue-data'
import Link from 'next/link'

interface Props {
  products: CatalogueProduct[]
  divisions: Division[]
  query?: string
}

export function FilteredProductGrid({ products, divisions, query }: Props) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <svg
          className="mx-auto h-12 w-12 text-[#9CA3AF]"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        <p className="mt-3 text-[#6B7280] text-sm">
          {query
            ? `No products match "${query}". Try a different search term.`
            : 'No products found in this category.'}
        </p>
        {query && (
          <Link
            href="/products"
            className="mt-4 inline-flex items-center text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
          >
            ← View all products
          </Link>
        )}
      </div>
    )
  }

  return (
    <div>
      <p className="text-xs text-[#9CA3AF] mb-4">
        Showing {products.length} product{products.length !== 1 ? 's' : ''}
        {query ? ` for "${query}"` : ''}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map(product => {
          const division = divisions.find(d => d.id === product.division_id)
          return <ProductCard key={product.id} product={product} divisionName={division?.name} />
        })}
      </div>
    </div>
  )
}
