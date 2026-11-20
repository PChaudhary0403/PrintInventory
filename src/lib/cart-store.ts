// Cart store using Zustand with localStorage persistence
// Server-side pricing is re-verified at order creation – this client store is display-only

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type PriceBreakdown } from './pricing';
import { formatPrice } from './utils';

export interface CartItem {
  id: string; // unique cart item id (uuid)
  product_id: string;
  product_name: string;
  division_name: string;
  configuration: Record<string, string | number>;
  quantity: number;
  pricing: PriceBreakdown;
  added_at: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id' | 'added_at'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number, pricing: PriceBreakdown) => void;
  clearCart: () => void;
  itemCount: () => number;
  grandTotal: () => number;
  grandTotalFormatted: () => string;
}

function uuid() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const newItem: CartItem = {
          ...item,
          id: uuid(),
          added_at: new Date().toISOString(),
        };
        set((state) => ({ items: [...state.items, newItem] }));
      },

      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
      },

      updateQuantity: (id, quantity, pricing) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity, pricing } : i,
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      grandTotal: () => get().items.reduce((sum, i) => sum + i.pricing.total, 0),

      grandTotalFormatted: () => formatPrice(get().grandTotal()),
    }),
    { name: 'dh-cart' },
  ),
);
