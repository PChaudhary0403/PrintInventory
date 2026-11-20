import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import type { CatalogueProduct } from '@/lib/catalogue-data'

interface Props {
  product: CatalogueProduct
  divisionName?: string
}

export function ProductCard({ product, divisionName }: Props) {
  return (
    <Link
      href={`/products/detail/${product.slug}`}
      className="group block border border-[#E5E7EB] rounded-lg overflow-hidden hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
    >
      {/* Product image */}
      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <span className="text-sm text-[#9CA3AF] px-4 text-center">{product.name}</span>
          </div>
        )}
      </div>

      <div className="p-4">
        {divisionName && (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
            {divisionName}
          </span>
        )}
        <h3 className="mt-0.5 font-semibold text-[#1F2937] text-sm group-hover:text-[#2563EB] transition-colors leading-snug">
          {product.name}
        </h3>
        <p className="mt-1 text-xs text-[#6B7280] line-clamp-2 leading-relaxed">
          {product.short_description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-[#1F2937]">
            From {formatPrice(product.base_price)}
          </span>
          <span className="text-xs font-medium text-[#2563EB] group-hover:translate-x-0.5 transition-transform inline-block">
            Configure →
          </span>
        </div>
      </div>
    </Link>
  )
}
