'use client';

import Link from 'next/link';
import { Package, FileCheck, Palette, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';

const stats = [
  { label: 'Total Orders', value: '0', icon: Package, color: 'text-blue-600 bg-blue-50' },
  { label: 'Active Proofs', value: '0', icon: FileCheck, color: 'text-amber-600 bg-amber-50' },
  { label: 'Saved Designs', value: '0', icon: Palette, color: 'text-purple-600 bg-purple-50' },
  { label: 'Account Status', value: 'Active', icon: Shield, color: 'text-green-600 bg-green-50' },
];

const quickActions = [
  { label: 'Browse Products', href: '/products' },
  { label: 'View Orders', href: '/account/orders' },
  { label: 'Saved Designs', href: '/account/designs' },
];

export default function AccountDashboard() {
  const { user, profile } = useAuth();

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'there';

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-text-primary">
          Welcome back, {displayName}
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Here&apos;s a summary of your account activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-xl border border-border bg-white p-5"
          >
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">{label}</p>
                <p className="text-lg font-semibold text-text-primary">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-text-primary">Recent Orders</h3>
        <div className="rounded-xl border border-border bg-white p-8 text-center">
          <Package className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm font-medium text-text-primary">No orders yet</p>
          <p className="mt-1 text-sm text-text-secondary">
            Browse our products to get started.
          </p>
          <Link
            href="/products"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Browse Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-text-primary">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          {quickActions.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-gray-50"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
