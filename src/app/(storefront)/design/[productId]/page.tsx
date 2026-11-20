'use client';

import { useEffect, useRef, useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PRODUCTS, DIVISIONS } from '@/lib/catalogue-data';
import {
  Type, Image as ImageIcon, Square, Trash2, Download,
  Undo, Redo, ZoomIn, ZoomOut, Save, ChevronLeft,
} from 'lucide-react';

// Design Studio – Fabric.js canvas editor
// Fabric.js is loaded lazily to avoid SSR issues

export default function DesignStudioPage({ params }: { params: { productId: string } }) {
  const product = PRODUCTS.find((p) => p.id === params.productId || p.slug === params.productId);
  if (!product) notFound();

  const division = DIVISIONS.find((d) => d.id === product.division_id);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<any>(null);
  const [zoom, setZoom] = useState(100);
  const [activeColor, setActiveColor] = useState('#1F2937');
  const [activeFontSize, setActiveFontSize] = useState(24);
  const [saved, setSaved] = useState(false);
  const [fabricLoaded, setFabricLoaded] = useState(false);

  // Dynamically import fabric to avoid SSR
  useEffect(() => {
    let canvas: any;
    import('fabric').then(({ Canvas, Rect, IText, FabricImage }) => {
      if (!canvasRef.current) return;
      canvas = new Canvas(canvasRef.current, {
        width: 600,
        height: 400,
        backgroundColor: '#ffffff',
        selection: true,
      });
      fabricRef.current = canvas;
      setFabricLoaded(true);

      // Print zone guide
      const guide = new Rect({
        left: 20, top: 20, width: 560, height: 360,
        fill: 'transparent', stroke: '#3B82F6',
        strokeDashArray: [6, 4], strokeWidth: 1.5,
        selectable: false, evented: false,
        name: 'print-zone-guide',
      });
      canvas.add(guide);
      canvas.renderAll();
    });

    return () => { canvas?.dispose(); };
  }, []);

  const addText = () => {
    import('fabric').then(({ IText }) => {
      const text = new IText('Your Text Here', {
        left: 100, top: 100, fontSize: activeFontSize,
        fill: activeColor, fontFamily: 'Inter, sans-serif',
      });
      fabricRef.current?.add(text);
      fabricRef.current?.setActiveObject(text);
      fabricRef.current?.renderAll();
    });
  };

  const addRect = () => {
    import('fabric').then(({ Rect }) => {
      const rect = new Rect({
        left: 150, top: 150, width: 120, height: 80,
        fill: activeColor, opacity: 0.8,
      });
      fabricRef.current?.add(rect);
      fabricRef.current?.setActiveObject(rect);
      fabricRef.current?.renderAll();
    });
  };

  const deleteSelected = () => {
    const obj = fabricRef.current?.getActiveObject();
    if (obj && obj.name !== 'print-zone-guide') {
      fabricRef.current?.remove(obj);
      fabricRef.current?.renderAll();
    }
  };

  const handleZoom = (dir: 'in' | 'out') => {
    const newZoom = dir === 'in' ? Math.min(zoom + 10, 200) : Math.max(zoom - 10, 50);
    setZoom(newZoom);
    fabricRef.current?.setZoom(newZoom / 100);
    fabricRef.current?.renderAll();
  };

  const handleSave = () => {
    if (!fabricRef.current) return;
    const json = fabricRef.current.toJSON();
    // TODO: POST to /api/designs with json + product_id
    console.log('Design JSON:', json);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = () => {
    if (!fabricRef.current) return;
    const dataURL = fabricRef.current.toDataURL({ format: 'png', multiplier: 3 });
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `${product.slug}-design.png`;
    link.click();
  };

  const COLORS = ['#1F2937', '#2563EB', '#DC2626', '#16A34A', '#D97706', '#7C3AED', '#FFFFFF', '#F3F4F6'];

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      {/* Top bar */}
      <header className="flex h-13 items-center justify-between border-b border-gray-200 bg-white px-4">
        <div className="flex items-center gap-3">
          <Link
            href={`/products/detail/${product.slug}`}
            className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-text-secondary hover:bg-gray-100 hover:text-text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
          <div className="h-4 w-px bg-gray-200" />
          <div>
            <h1 className="text-sm font-semibold text-text-primary">{product.name}</h1>
            <p className="text-xs text-text-muted">{division?.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              saved ? 'bg-green-50 text-green-700' : 'border border-border text-text-secondary hover:bg-gray-50'
            }`}
          >
            <Save className="h-3.5 w-3.5" />
            {saved ? 'Saved!' : 'Save Design'}
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            <Download className="h-3.5 w-3.5" />
            Export PNG
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left toolbar */}
        <aside className="flex w-56 flex-col border-r border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Tools</p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            <button
              onClick={addText}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-text-secondary hover:bg-gray-50 hover:text-text-primary"
            >
              <Type className="h-4 w-4" />
              Add Text
            </button>
            <button
              onClick={addRect}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-text-secondary hover:bg-gray-50 hover:text-text-primary"
            >
              <Square className="h-4 w-4" />
              Add Shape
            </button>
            <label className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-text-secondary hover:bg-gray-50 hover:text-text-primary">
              <ImageIcon className="h-4 w-4" />
              Upload Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    import('fabric').then(({ FabricImage }) => {
                      FabricImage.fromURL(ev.target?.result as string).then((img) => {
                        img.scaleToWidth(200);
                        fabricRef.current?.add(img);
                        fabricRef.current?.renderAll();
                      });
                    });
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </label>
            <button
              onClick={deleteSelected}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-red-500 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected
            </button>
          </div>

          {/* Color picker */}
          <div className="border-t border-gray-200 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">Colour</p>
            <div className="grid grid-cols-4 gap-1.5">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveColor(c)}
                  style={{ backgroundColor: c }}
                  className={`h-7 w-7 rounded-md border transition-transform hover:scale-110 ${
                    activeColor === c ? 'ring-2 ring-primary ring-offset-1' : 'border-gray-200'
                  }`}
                  title={c}
                />
              ))}
            </div>
          </div>

          {/* Font size */}
          <div className="border-t border-gray-200 p-3">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-text-muted">
              Font Size
            </label>
            <input
              type="number"
              min={8}
              max={120}
              value={activeFontSize}
              onChange={(e) => setActiveFontSize(Number(e.target.value))}
              className="w-full rounded-lg border border-border px-3 py-1.5 text-sm text-text-primary focus:border-primary focus:outline-none"
            />
          </div>
        </aside>

        {/* Canvas area */}
        <main className="flex flex-1 flex-col items-center justify-center overflow-auto bg-gray-200 p-8">
          {!fabricLoaded && (
            <div className="mb-4 text-sm text-text-secondary">Loading editor…</div>
          )}

          {/* Print zone legend */}
          <div className="mb-3 flex items-center gap-2 text-xs text-text-muted">
            <span className="inline-block h-2.5 w-5 rounded border border-dashed border-blue-400" />
            Print zone boundary (3 mm bleed excluded)
          </div>

          <div className="rounded-lg shadow-lg" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}>
            <canvas ref={canvasRef} />
          </div>
        </main>

        {/* Right panel: Zoom + Notes */}
        <aside className="flex w-48 flex-col border-l border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">View</p>
          </div>
          <div className="p-3 space-y-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleZoom('out')}
                className="rounded-lg border border-gray-200 p-1.5 hover:bg-gray-50"
              >
                <ZoomOut className="h-4 w-4 text-text-secondary" />
              </button>
              <span className="flex-1 text-center text-sm font-medium text-text-primary">{zoom}%</span>
              <button
                onClick={() => handleZoom('in')}
                className="rounded-lg border border-gray-200 p-1.5 hover:bg-gray-50"
              >
                <ZoomIn className="h-4 w-4 text-text-secondary" />
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 p-3 mt-auto">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">Notes</p>
            <ul className="space-y-1.5 text-xs text-text-secondary">
              <li>• Min. resolution: 300 DPI</li>
              <li>• Bleed: 3 mm all sides</li>
              <li>• Safe zone: 5 mm from edge</li>
              <li>• Colour mode: CMYK</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
