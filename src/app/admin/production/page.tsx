'use client';

const STAGES = [
  { key: 'artwork_review', label: 'Artwork Review', borderColor: 'border-purple-200', bgColor: 'bg-purple-50', textColor: 'text-purple-700', dotColor: 'bg-purple-500' },
  { key: 'proof_sent', label: 'Proof Sent', borderColor: 'border-amber-200', bgColor: 'bg-amber-50', textColor: 'text-amber-700', dotColor: 'bg-amber-500' },
  { key: 'approved', label: 'Proof Approved', borderColor: 'border-teal-200', bgColor: 'bg-teal-50', textColor: 'text-teal-700', dotColor: 'bg-teal-500' },
  { key: 'in_production', label: 'In Production', borderColor: 'border-orange-200', bgColor: 'bg-orange-50', textColor: 'text-orange-700', dotColor: 'bg-orange-500' },
  { key: 'quality_check', label: 'Quality Check', borderColor: 'border-blue-200', bgColor: 'bg-blue-50', textColor: 'text-blue-700', dotColor: 'bg-blue-500' },
  { key: 'dispatched', label: 'Dispatched', borderColor: 'border-green-200', bgColor: 'bg-green-50', textColor: 'text-green-700', dotColor: 'bg-green-500' },
];

export default function AdminProductionPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">Production Pipeline</h2>
        <p className="text-sm text-text-secondary">Jobs are created automatically on proof approval.</p>
      </div>

      {/* Pipeline kanban */}
      <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {STAGES.map(({ key, label, borderColor, bgColor, textColor, dotColor }) => (
          <div key={key} className={`rounded-xl border ${borderColor} ${bgColor} p-4`}>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${dotColor}`} />
              <h3 className={`text-xs font-semibold ${textColor}`}>{label}</h3>
            </div>
            <p className="mt-3 text-2xl font-bold text-text-primary">0</p>
            <p className="text-xs text-text-muted">jobs</p>
            <div className="mt-4 min-h-20 rounded-lg border border-dashed border-gray-200 bg-white/50 p-2">
              <p className="pt-4 text-center text-xs text-text-muted">Empty</p>
            </div>
          </div>
        ))}
      </div>

      {/* Jobs table */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4">
          <h3 className="text-base font-semibold text-text-primary">Production Jobs</h3>
          <p className="mt-0.5 text-xs text-text-secondary">
            Each job maps to one order item. Production is locked until the customer approves the digital proof.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Job ID</th>
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Order #</th>
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Product</th>
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Stage</th>
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Assigned To</th>
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Due Date</th>
                <th className="px-4 py-3 text-right font-medium text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-text-secondary">
                  No production jobs yet.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
