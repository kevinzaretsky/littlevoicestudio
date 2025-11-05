'use client';
import { create } from 'zustand';
type Item = { productId: string; name: string; priceCents: number; quantity: number; color?: string; size?: string; imageUrl?: string | null; customizationUrl?: string | null; }
type CartState = { items: Item[]; add: (item: Item) => void; remove: (productId: string) => void; clear: () => void; }
export const useCartStore = create<CartState>((set) => ({
  items: [],
  add: (item) => set((state) => {
    const existing = state.items.find(i => i.productId === item.productId && i.color===item.color && i.size===item.size && i.customizationUrl===item.customizationUrl);
    if (existing) { existing.quantity += item.quantity; return { items: [...state.items] }; }
    return { items: [...state.items, item] };
  }),
  remove: (productId) => set((state) => ({ items: state.items.filter(i => i.productId !== productId) })),
  clear: () => set({ items: [] })
}));
