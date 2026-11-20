'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DIVISIONS, PRODUCTS } from '@/lib/catalogue-data';
import { Plus, Edit, Eye } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminProductsPage() {
  const [divisionFilter, setDivisionFilter] = useState('');

  const filtered = divisionFilter
    ? PRODUCTS.filter((p) => p.division_id === divisionFilter)
    : PRODUCTS;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">Products</h2>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {/* Division filter tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setDivisionFilter('')}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            divisionFilter === ''
              ? 'bg-primary text-white'
              : 'border border-gray-200 bg-white text-text-secondary hover:border-primary hover:text-primary'
          }`}
        >
          All ({PRODUCTS.length})
        </button>
        {DIVISIONS.map((d) => {
          const count = PRODUCTS.filter((p) => p.division_id === d.id).length;
          return (
            <button
              key={d.id}
              onClick={() => setDivisionFilter(d.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                divisionFilter === d.id
                  ? 'bg-primary text-white'
                  : 'border border-gray-200 bg-white text-text-secondary hover:border-primary hover:text-primary'
              }`}
            >
              {d.name} ({count})
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Product</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Division</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Base Price</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Options</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Status</th>
              <th className="px-4 py-3 text-right font-medium text-text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((product) => {
              const division = DIVISIONS.find((d) => d.id === product.division_id);
              return (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-text-primary">{product.name}</p>
                    <p className="text-xs text-text-muted">{product.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{division?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-text-secondary">{formatPrice(product.base_price)}</td>
                  <td className="px-4 py-3 text-text-secondary">{product.options.length} options</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        product.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {product.is_active ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/products/detail/${product.slug}`}
                        className="rounded p-1.5 text-text-muted hover:bg-gray-100 hover:text-text-primary"
                        title="View on storefront"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        className="rounded p-1.5 text-text-muted hover:bg-gray-100 hover:text-text-primary"
                        title="Edit product"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-text-muted">
        * Products are currently seeded from <code className="rounded bg-gray-100 px-1">catalogue-data.ts</code>.
        Once Supabase is connected, they will be managed via the database.
      </p>
    </div>
  );
}
