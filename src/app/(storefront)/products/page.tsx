import { notFound } from 'next/navigation'
import { DIVISIONS, PRODUCTS } from '@/lib/catalogue-data'
import { CatalogueSidebar } from '@/components/catalogue/CatalogueSidebar'
import { ProductGrid } from '@/components/catalogue/ProductGrid'
import { Breadcrumbs } from '@/components/catalogue/Breadcrumbs'

export default function ProductsPage() {
  const activeProducts = PRODUCTS.filter(p => p.is_active)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Print Products' }]} />
      <div className="mt-4 mb-6">
        <h1 className="text-2xl font-bold text-[#1F2937]">Print Products</h1>
        <p className="mt-1 text-sm text-[#6B7280]">Configure any product to your exact specifications and get an instant price.</p>
      </div>
      <div className="flex gap-8">
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <CatalogueSidebar divisions={DIVISIONS} />
        </aside>
        <div className="flex-1 min-w-0">
          <ProductGrid products={activeProducts} divisions={DIVISIONS} />
        </div>
      </div>
    </div>
  )
}
