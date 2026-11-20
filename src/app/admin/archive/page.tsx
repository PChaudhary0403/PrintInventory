'use client';

import { Archive } from 'lucide-react';

export default function AdminArchivePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">Archive</h2>
      </div>

      <p className="text-sm text-text-secondary">
        Completed and cancelled orders are archived here for record-keeping. Archived orders cannot
        be modified but remain accessible for reference and re-ordering.
      </p>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Order #</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Customer</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Status</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Completed</th>
              <th className="px-4 py-3 text-right font-medium text-text-secondary">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="px-4 py-14 text-center">
                <Archive className="mx-auto h-10 w-10 text-gray-200" />
                <p className="mt-3 text-sm text-text-secondary font-medium">Archive is empty</p>
                <p className="mt-1 text-xs text-text-muted">
                  Delivered and cancelled orders will appear here automatically.
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
