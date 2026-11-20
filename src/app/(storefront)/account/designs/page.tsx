'use client';

import { Palette, Pencil, RotateCcw, Trash2 } from 'lucide-react';

interface SavedDesign {
  id: string;
  name: string;
  productType: string;
  lastModified: string;
  thumbnailUrl?: string;
}

export default function SavedDesignsPage() {
  const designs: SavedDesign[] = [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-text-primary">Saved Designs</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Manage your saved designs and artwork.
        </p>
      </div>

      {designs.length === 0 ? (
        <div className="rounded-xl border border-border bg-white p-12 text-center">
          <Palette className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm font-medium text-text-primary">
            No saved designs yet
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            Create a design to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {designs.map((design) => (
            <div
              key={design.id}
              className="overflow-hidden rounded-xl border border-border bg-white"
            >
              <div className="flex h-40 items-center justify-center bg-gray-100">
                {design.thumbnailUrl ? (
                  <img
                    src={design.thumbnailUrl}
                    alt={design.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Palette className="h-8 w-8 text-gray-300" />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-text-primary">{design.name}</h3>
                <p className="mt-0.5 text-xs text-text-secondary">{design.productType}</p>
                <p className="mt-1 text-xs text-text-secondary">
                  Modified {design.lastModified}
                </p>
                <div className="mt-3 flex gap-2">
                  <button className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-blue-50">
                    <Pencil className="h-3 w-3" />
                    Edit
                  </button>
                  <button className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-text-secondary hover:bg-gray-50">
                    <RotateCcw className="h-3 w-3" />
                    Reorder
                  </button>
                  <button className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
