'use client';

import { useState } from 'react';
import { Search, Shield } from 'lucide-react';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">Users</h2>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Name</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Email</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Role</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Joined</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Orders</th>
              <th className="px-4 py-3 text-right font-medium text-text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="px-4 py-14 text-center text-text-secondary">
                <p className="font-medium">No users yet</p>
                <p className="mt-1 text-xs text-text-muted">
                  Users appear here once they sign up.
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm">
        <div className="flex items-start gap-3">
          <Shield className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
          <div className="text-blue-700">
            <p className="font-medium">Role Management</p>
            <p className="mt-0.5 text-xs">
              To promote a customer to admin, update their row in the{' '}
              <code className="rounded bg-blue-100 px-1 py-0.5">user_roles</code> table in
              Supabase with <code className="rounded bg-blue-100 px-1 py-0.5">role = &apos;admin&apos;</code>.
              Row Level Security policies automatically enforce admin-only access to this panel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
