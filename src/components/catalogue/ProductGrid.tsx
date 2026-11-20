import { ProductCard } from './ProductCard'
import type { CatalogueProduct, Division } from '@/lib/catalogue-data'

interface Props {
  products: CatalogueProduct[]
  divisions: Division[]
}

export function ProductGrid({ products, divisions }: Props) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-[#6B7280] text-sm">No products found in this category.</p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-xs text-[#9CA3AF] mb-4">Showing {products.length} product{products.length !== 1 ? 's' : ''}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map(product => {
          const division = divisions.find(d => d.id === product.division_id)
          return <ProductCard key={product.id} product={product} divisionName={division?.name} />
        })}
      </div>
    </div>
  )
}
