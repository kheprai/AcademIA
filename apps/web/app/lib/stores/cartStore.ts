import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  courseId: string;
  slug: string | null;
  title: string;
  thumbnailUrl: string | null;
  authorName: string;
  categoryName: string | null;
  priceInCents: number;
  mercadopagoPriceInCents: number;
  currency: string;
  stripePriceId: string | null;
  mercadopagoProductId: string | null;
  hasFreeChapters: boolean;
  addedAt: string;
}

interface CartState {
  items: CartItem[];
  buyItems: Record<string, boolean>;
  selectedPaymentMethod: "stripe" | "mercadopago" | null;
  isCartSidebarOpen: boolean;
  lastCheckoutItems: CartItem[] | null;
  lastCheckoutBuyItems: Record<string, boolean>;

  addItem: (item: CartItem) => void;
  removeItem: (courseId: string) => void;
  clearCart: () => void;
  replaceCart: (items: CartItem[]) => void;
  setBuyItem: (courseId: string, buy: boolean) => void;
  setSelectedPaymentMethod: (method: "stripe" | "mercadopago" | null) => void;
  setCartSidebarOpen: (open: boolean) => void;
  toggleCartSidebar: () => void;
  setLastCheckout: (items: CartItem[], buyItems: Record<string, boolean>) => void;
  clearLastCheckout: () => void;

  getItemCount: () => number;
  isInCart: (courseId: string) => boolean;
  getGuestCourseIds: () => string[];
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      buyItems: {},
      selectedPaymentMethod: null,
      isCartSidebarOpen: false,
      lastCheckoutItems: null,
      lastCheckoutBuyItems: {},

      addItem: (item) =>
        set((state) => {
          if (state.items.some((i) => i.courseId === item.courseId)) {
            return state;
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (courseId) =>
        set((state) => {
          const { [courseId]: _, ...restBuyItems } = state.buyItems;
          return {
            items: state.items.filter((i) => i.courseId !== courseId),
            buyItems: restBuyItems,
          };
        }),

      clearCart: () => set({ items: [], buyItems: {}, selectedPaymentMethod: null }),

      replaceCart: (items) => set({ items }),

      setBuyItem: (courseId, buy) =>
        set((state) => ({
          buyItems: { ...state.buyItems, [courseId]: buy },
        })),

      setSelectedPaymentMethod: (method) => set({ selectedPaymentMethod: method }),

      setCartSidebarOpen: (open) => set({ isCartSidebarOpen: open }),

      toggleCartSidebar: () => set((state) => ({ isCartSidebarOpen: !state.isCartSidebarOpen })),

      setLastCheckout: (items, buyItems) =>
        set({ lastCheckoutItems: items, lastCheckoutBuyItems: buyItems }),

      clearLastCheckout: () => set({ lastCheckoutItems: null, lastCheckoutBuyItems: {} }),

      getItemCount: () => get().items.length,

      isInCart: (courseId) => get().items.some((i) => i.courseId === courseId),

      getGuestCourseIds: () => get().items.map((i) => i.courseId),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        items: state.items,
        buyItems: state.buyItems,
        selectedPaymentMethod: state.selectedPaymentMethod,
        lastCheckoutItems: state.lastCheckoutItems,
        lastCheckoutBuyItems: state.lastCheckoutBuyItems,
      }),
    },
  ),
);
