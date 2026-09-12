import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/types/database'

export interface CartItem extends Product {
  quantity: number
}

interface CartState {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  get totalItems(): number
  get totalPrice(): number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => set((state) => {
        const qty = Math.max(1, quantity)
        const existing = state.items.find((item) => item.id === product.id)
        if (existing) {
          return {
            items: state.items.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
            ),
          }
        }
        return { items: [...state.items, { ...product, quantity: qty }] }
      }),
      removeItem: (productId) => set((state) => ({
        items: state.items.filter((item) => item.id !== productId)
      })),
      updateQuantity: (productId, quantity) => set((state) => ({
        items: state.items.map((item) =>
          item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
        )
      })),
      clearCart: () => set({ items: [] }),
      get totalItems() {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      get totalPrice() {
        return get().items.reduce((total, item) => total + (item.precio * item.quantity), 0)
      }
    }),
    {
      name: 'delmichi-cart', // Clave en localStorage
    }
  )
)
