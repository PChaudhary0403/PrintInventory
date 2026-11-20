'use client';

import Link from 'next/link';
import { FileCheck, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Breadcrumbs } from '@/components/catalogue/Breadcrumbs';

type ProofStatus = 'pending' | 'approved' | 'changes_requested';

const STATUS_CONFIG: Record<ProofStatus, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  pending: { label: 'Awaiting Review', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  approved: { label: 'Approved', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  changes_requested: { label: 'Changes Requested', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
};

export default function AccountProofsPage() {
  // In production: fetch from Supabase proof_versions table filtered by user
  const proofs: any[] = [];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'My Account', href: '/account' }, { label: 'Proofs' }]} />

      <div>
        <h1 className="text-xl font-bold text-text-primary">Digital Proofs</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Review and approve digital proofs before your order enters production.
        </p>
      </div>

      {proofs.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-white py-16 text-center">
          <FileCheck className="h-12 w-12 text-gray-200" />
          <div>
            <p className="font-medium text-text-primary">No proofs yet</p>
            <p className="mt-1 text-sm text-text-secondary">
              Digital proofs will appear here once your order artwork has been reviewed.
            </p>
          </div>
          <Link
            href="/account/orders"
            className="text-sm font-medium text-primary hover:underline"
          >
            View my orders
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {proofs.map((proof) => {
            const status = STATUS_CONFIG[proof.status as ProofStatus] ?? STATUS_CONFIG.pending;
            const StatusIcon = status.icon;
            return (
              <div key={proof.id} className="rounded-xl border border-border bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{proof.product_name}</p>
                    <p className="text-xs text-text-muted">Order {proof.order_number} · Version {proof.version}</p>
                  </div>
                  <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${status.color} ${status.bg}`}>
                    <StatusIcon className="h-3.5 w-3.5" />
                    {status.label}
                  </span>
                </div>
                {proof.status === 'pending' && (
                  <div className="mt-4 flex gap-2">
                    <button className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
                      Approve Proof
                    </button>
                    <button className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface">
                      Request Changes
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
        <p className="font-medium">About digital proofs</p>
        <p className="mt-0.5 text-xs">
          Your order will not enter production until you approve the digital proof. If you request
          changes, our design team will revise and re-send within 1–2 business days.
        </p>
      </div>
    </div>
  );
}
