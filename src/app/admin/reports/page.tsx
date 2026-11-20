'use client';

import { BarChart3, TrendingUp, Package, IndianRupee } from 'lucide-react';

const REPORT_CARDS = [
  {
    title: 'Total Revenue',
    value: '₹0',
    description: 'All time (incl. GST)',
    icon: IndianRupee,
    color: 'text-blue-600 bg-blue-50',
  },
  {
    title: 'Orders This Month',
    value: '0',
    description: 'November 2026',
    icon: Package,
    color: 'text-green-600 bg-green-50',
  },
  {
    title: 'Avg. Order Value',
    value: '₹0',
    description: 'All time average',
    icon: TrendingUp,
    color: 'text-amber-600 bg-amber-50',
  },
  {
    title: 'Active Customers',
    value: '0',
    description: 'Registered accounts',
    icon: BarChart3,
    color: 'text-purple-600 bg-purple-50',
  },
];

export default function AdminReportsPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-text-primary">Reports</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {REPORT_CARDS.map(({ title, value, description, icon: Icon, color }) => (
          <div key={title} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-text-secondary">{title}</p>
              <span className={`rounded-lg p-2 ${color}`}>
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold text-text-primary">{value}</p>
            <p className="mt-0.5 text-xs text-text-muted">{description}</p>
          </div>
        ))}
      </div>

      {/* Revenue by division placeholder */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-base font-semibold text-text-primary">Revenue by Division</h3>
        <p className="mt-1 text-xs text-text-secondary">
          Connect Supabase to see revenue broken down by Labels &amp; Stickers, Race &amp; Event
          Numbers, MTB Boards, Stamps, Trophies, and Laser-Cut Work.
        </p>
        <div className="mt-6 space-y-3">
          {['Labels & Stickers', 'Race & Event Numbers', 'MTB Boards', 'Stamps', 'Trophies', 'Laser-Cut Work'].map((div) => (
            <div key={div} className="flex items-center gap-3">
              <span className="w-40 shrink-0 text-xs text-text-secondary">{div}</span>
              <div className="h-2 flex-1 rounded-full bg-gray-100">
                <div className="h-2 w-0 rounded-full bg-primary" />
              </div>
              <span className="w-12 text-right text-xs text-text-muted">₹0</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity table */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4">
          <h3 className="text-base font-semibold text-text-primary">Monthly Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Month</th>
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Orders</th>
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Revenue (excl. GST)</th>
                <th className="px-4 py-3 text-left font-medium text-text-secondary">GST Collected</th>
                <th className="px-4 py-3 text-right font-medium text-text-secondary">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-text-secondary">
                  No data yet. Reports will populate once orders are placed.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
