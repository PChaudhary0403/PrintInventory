'use client';

import { Package, IndianRupee, Briefcase, Users } from 'lucide-react';

const stats = [
  { label: 'Total Orders', value: '0', icon: Package, change: '' },
  { label: 'Revenue', value: '₹0', icon: IndianRupee, change: '' },
  { label: 'Active Jobs', value: '0', icon: Briefcase, change: '' },
  { label: 'Customers', value: '0', icon: Users, change: '' },
];

const pipelineStages = [
  { label: 'Quote', count: 0, color: 'bg-gray-100 text-gray-700' },
  { label: 'Order', count: 0, color: 'bg-blue-50 text-blue-700' },
  { label: 'Artwork', count: 0, color: 'bg-purple-50 text-purple-700' },
  { label: 'Proof', count: 0, color: 'bg-amber-50 text-amber-700' },
  { label: 'Production', count: 0, color: 'bg-orange-50 text-orange-700' },
  { label: 'Completed', count: 0, color: 'bg-green-50 text-green-700' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-text-primary">Dashboard</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-text-secondary">{label}</p>
              <Icon className="h-4 w-4 text-text-secondary" />
            </div>
            <p className="mt-2 text-2xl font-semibold text-text-primary">{value}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="mb-4 text-base font-semibold text-text-primary">
          Production Pipeline
        </h3>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {pipelineStages.map(({ label, count, color }) => (
            <div
              key={label}
              className="rounded-xl border border-gray-200 bg-white p-4 text-center"
            >
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}
              >
                {label}
              </span>
              <p className="mt-3 text-2xl font-bold text-text-primary">{count}</p>
              <p className="text-xs text-text-secondary">jobs</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-base font-semibold text-text-primary">Recent Orders</h3>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Order #</th>
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Customer</th>
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Status</th>
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Date</th>
                <th className="px-4 py-3 text-right font-medium text-text-secondary">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-text-secondary">
                  No orders yet.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
