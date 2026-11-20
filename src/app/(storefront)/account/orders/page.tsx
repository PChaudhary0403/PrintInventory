'use client';

import Link from 'next/link';
import { Package, ArrowRight } from 'lucide-react';

export default function OrderHistoryPage() {
  const orders: never[] = [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-text-primary">Order History</h2>
        <p className="mt-1 text-sm text-text-secondary">
          View and track all your orders.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-border bg-white p-12 text-center">
          <Package className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm font-medium text-text-primary">
            You haven&apos;t placed any orders yet.
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            Browse our products to find what you need.
          </p>
          <Link
            href="/products"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Browse Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Order #</th>
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Date</th>
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Status</th>
                <th className="px-4 py-3 text-right font-medium text-text-secondary">Total</th>
                <th className="px-4 py-3 text-right font-medium text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((_, i) => (
                <tr
                  key={i}
                  className="border-b border-border last:border-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium text-text-primary">—</td>
                  <td className="px-4 py-3 text-text-secondary">—</td>
                  <td className="px-4 py-3">—</td>
                  <td className="px-4 py-3 text-right text-text-primary">—</td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-primary hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
