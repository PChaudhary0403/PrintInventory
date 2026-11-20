'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

type OrderStatus =
  | 'pending' | 'confirmed' | 'artwork_review' | 'proof_sent'
  | 'in_production' | 'ready' | 'dispatched' | 'delivered' | 'cancelled';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending', confirmed: 'Confirmed', artwork_review: 'Artwork Review',
  proof_sent: 'Proof Sent', in_production: 'In Production', ready: 'Ready',
  dispatched: 'Dispatched', delivered: 'Delivered', cancelled: 'Cancelled',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-gray-100 text-gray-700', confirmed: 'bg-blue-50 text-blue-700',
  artwork_review: 'bg-purple-50 text-purple-700', proof_sent: 'bg-amber-50 text-amber-700',
  in_production: 'bg-orange-50 text-orange-700', ready: 'bg-teal-50 text-teal-700',
  dispatched: 'bg-indigo-50 text-indigo-700', delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
};

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">Orders</h2>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-48 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by order # or customer…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
        >
          <option value="">All Statuses</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Order #</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Customer</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Items</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Status</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Date</th>
              <th className="px-4 py-3 text-right font-medium text-text-secondary">Total</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={7} className="px-4 py-14 text-center text-text-secondary">
                <p className="font-medium">No orders yet</p>
                <p className="mt-1 text-xs text-text-muted">
                  Orders will appear here once customers start placing them. Connect Supabase to load real data.
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
