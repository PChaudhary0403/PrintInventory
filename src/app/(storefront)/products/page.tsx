import { DIVISIONS, PRODUCTS } from '@/lib/catalogue-data'
import { CatalogueSidebar } from '@/components/catalogue/CatalogueSidebar'
import { FilteredProductGrid } from '@/components/catalogue/FilteredProductGrid'
import { Breadcrumbs } from '@/components/catalogue/Breadcrumbs'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>
}) {
  const { q, category } = await searchParams
  const activeProducts = PRODUCTS.filter(p => p.is_active)

  // Filter by search query
  let filtered = activeProducts
  if (q && q.trim()) {
    const query = q.trim().toLowerCase()
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.short_description.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    )
  }

  // Filter by category (division name)
  if (category && category !== 'All Categories') {
    const division = DIVISIONS.find(d => d.name === category)
    if (division) {
      filtered = filtered.filter(p => p.division_id === division.id)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Print Products' }]} />
      <div className="mt-4 mb-6">
        <h1 className="text-2xl font-bold text-[#1F2937]">
          {q ? `Search results for "${q}"` : 'Print Products'}
        </h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          {q
            ? `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found${category && category !== 'All Categories' ? ` in ${category}` : ''}.`
            : 'Configure any product to your exact specifications and get an instant price.'}
        </p>
      </div>
      <div className="flex gap-8">
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <CatalogueSidebar divisions={DIVISIONS} />
        </aside>
        <div className="flex-1 min-w-0">
          <FilteredProductGrid products={filtered} divisions={DIVISIONS} query={q} />
        </div>
      </div>
    </div>
  )
}
