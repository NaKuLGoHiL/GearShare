import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { Gear } from "@/components/ReserveModal";

export interface CartItem {
  gear: Gear;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (gear: Gear, quantity?: number) => void;
  removeFromCart: (gearName: string) => void;
  updateQuantity: (gearName: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (gearName: string) => boolean;
  itemCount: number;
  totalDailyRate: number;
  toastMessage: string | null;
  dismissToast: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "gearshare_production_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (err) {
      console.warn("[Cart] Failed to restore cart from localStorage:", err);
    }
    return [];
  });

  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.warn("[Cart] Failed to persist cart to localStorage:", err);
    }
  }, [items]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);
  const dismissToast = useCallback(() => setToastMessage(null), []);

  const addToCart = useCallback((gear: Gear, quantity = 1) => {
    setItems((prev) => {
      const existingIdx = prev.findIndex((item) => item.gear.name === gear.name);
      if (existingIdx >= 0) {
        const updated = [...prev];
        const existing = updated[existingIdx];
        if (existing) {
          updated[existingIdx] = {
            ...existing,
            quantity: existing.quantity + quantity,
          };
        }
        return updated;
      }
      return [...prev, { gear, quantity }];
    });

    setToastMessage(`Added "${gear.name}" to Production Kit`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  const removeFromCart = useCallback((gearName: string) => {
    setItems((prev) => prev.filter((item) => item.gear.name !== gearName));
  }, []);

  const updateQuantity = useCallback((gearName: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.gear.name !== gearName));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.gear.name === gearName ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const isInCart = useCallback(
    (gearName: string) => {
      return items.some((item) => item.gear.name === gearName);
    },
    [items]
  );

  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const totalDailyRate = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + item.gear.rate * item.quantity,
      0
    );
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        itemCount,
        totalDailyRate,
        toastMessage,
        dismissToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
