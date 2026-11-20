'use client';

import { DIVISIONS } from '@/lib/catalogue-data';
import { FileSpreadsheet, Plus } from 'lucide-react';

export default function AdminTemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">Design Templates</h2>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
          <Plus className="h-4 w-4" />
          Upload Template
        </button>
      </div>

      <p className="text-sm text-text-secondary">
        Templates are pre-built design starting points for each product. Customers can select a
        template in the design editor and customise it with their own text and artwork.
      </p>

      {/* Per-division sections */}
      <div className="space-y-6">
        {DIVISIONS.map((division) => (
          <div key={division.id} className="rounded-xl border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h3 className="text-sm font-semibold text-text-primary">{division.name}</h3>
              <span className="text-xs text-text-muted">0 templates</span>
            </div>
            <div className="flex flex-col items-center gap-3 px-5 py-10 text-center">
              <FileSpreadsheet className="h-8 w-8 text-gray-300" />
              <p className="text-sm text-text-secondary">No templates yet for this division.</p>
              <button className="text-xs font-medium text-primary hover:underline">
                Upload first template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
