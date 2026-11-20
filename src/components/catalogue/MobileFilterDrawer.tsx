'use client';

import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { CatalogueSidebar } from './CatalogueSidebar';

import { type Division } from '@/lib/catalogue-data';

export default function MobileFilterDrawer({
  divisions,
  activeDivision,
}: {
  divisions: Division[];
  activeDivision?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />

          <div className="relative max-h-[85vh] overflow-y-auto rounded-t-xl bg-white p-5 pb-8 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-text-primary">Filters</h2>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-1.5 text-text-muted hover:bg-surface hover:text-text-primary transition-colors"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <CatalogueSidebar
              divisions={divisions}
              activeDivision={activeDivision}
            />
          </div>
        </div>
      )}
    </div>
  );
}
