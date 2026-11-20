'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Division } from '@/lib/catalogue-data'

interface Props {
  divisions: Division[]
  activeDivision?: string
}

export function CatalogueSidebar({ divisions, activeDivision }: Props) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(true)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) router.push(`/products?q=${encodeURIComponent(search.trim())}`)
  }

  return (
    <div className="space-y-5">
      {/* Search */}
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9CA3AF]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full h-9 pl-8 pr-3 text-sm text-[#1F2937] border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
          />
        </div>
      </form>

      {/* Categories */}
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-2"
        >
          Product Categories
          {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </button>

        {expanded && (
          <ul className="space-y-0.5">
            <li>
              <Link
                href="/products"
                className={cn(
                  'block px-2 py-1.5 text-sm rounded transition-colors',
                  !activeDivision
                    ? 'text-[#2563EB] font-medium bg-blue-50'
                    : 'text-[#6B7280] hover:text-[#1F2937] hover:bg-gray-50'
                )}
              >
                All Products
              </Link>
            </li>
            {divisions.map(d => (
              <li key={d.id}>
                <Link
                  href={`/products/${d.slug}`}
                  className={cn(
                    'block px-2 py-1.5 text-sm rounded transition-colors',
                    activeDivision === d.slug
                      ? 'text-[#2563EB] font-medium bg-blue-50'
                      : 'text-[#6B7280] hover:text-[#1F2937] hover:bg-gray-50'
                  )}
                >
                  {d.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Quick Quote CTA */}
      <div className="pt-3 border-t border-[#E5E7EB]">
        <Link
          href="/quote"
          className="block w-full text-center px-3 py-2 text-xs font-medium text-[#2563EB] border border-[#2563EB] rounded-md hover:bg-blue-50 transition-colors"
        >
          Request a Custom Quote
        </Link>
      </div>
    </div>
  )
}
