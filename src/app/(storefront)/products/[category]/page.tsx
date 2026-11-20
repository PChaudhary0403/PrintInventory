import { notFound } from 'next/navigation'
import { DIVISIONS, getDivisionBySlug, getProductsByDivision } from '@/lib/catalogue-data'
import { CatalogueSidebar } from '@/components/catalogue/CatalogueSidebar'
import { ProductGrid } from '@/components/catalogue/ProductGrid'
import { Breadcrumbs } from '@/components/catalogue/Breadcrumbs'

interface Props { params: Promise<{ category: string }> }

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const division = getDivisionBySlug(category)
  if (!division) notFound()

  const products = getProductsByDivision(division.id)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Print Products', href: '/products' }, { label: division.name }]} />
      <div className="mt-4 mb-6">
        <h1 className="text-2xl font-bold text-[#1F2937]">{division.name}</h1>
        {division.description && <p className="mt-1 text-sm text-[#6B7280] max-w-2xl">{division.description}</p>}
      </div>
      <div className="flex gap-8">
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <CatalogueSidebar divisions={DIVISIONS} activeDivision={category} />
        </aside>
        <div className="flex-1 min-w-0">
          <ProductGrid products={products} divisions={DIVISIONS} />
        </div>
      </div>
    </div>
  )
}

export function generateStaticParams() {
  return DIVISIONS.map(d => ({ category: d.slug }))
}
