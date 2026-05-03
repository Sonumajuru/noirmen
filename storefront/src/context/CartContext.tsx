"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { medusa, Cart, LineItem } from "@/lib/medusa";

type CartContextType = {
  cart: Cart | null;
  isOpen: boolean;
  isLoading: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  itemCount: number;
};

const CartContext = createContext<CartContextType>({} as CartContextType);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initCart();
  }, []);

  async function initCart() {
    const stored = localStorage.getItem("noirmen_cart_id");
    if (stored) {
      try {
        const { cart } = await medusa.carts.retrieve(stored);
        setCart(cart);
      } catch {
        localStorage.removeItem("noirmen_cart_id");
        await createCart();
      }
    } else {
      await createCart();
    }
  }

  async function createCart() {
    const { cart } = await medusa.carts.create();
    setCart(cart);
    localStorage.setItem("noirmen_cart_id", cart.id);
  }

  async function addItem(variantId: string, quantity = 1) {
    if (!cart) return;
    setIsLoading(true);
    try {
      const { cart: updated } = await medusa.carts.addItem(cart.id, variantId, quantity);
      setCart(updated);
      setIsOpen(true);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateItem(lineId: string, quantity: number) {
    if (!cart) return;
    setIsLoading(true);
    try {
      const { cart: updated } = await medusa.carts.updateItem(cart.id, lineId, quantity);
      setCart(updated);
    } finally {
      setIsLoading(false);
    }
  }

  async function removeItem(lineId: string) {
    if (!cart) return;
    setIsLoading(true);
    try {
      const { cart: updated } = await medusa.carts.deleteItem(cart.id, lineId);
      setCart(updated);
    } finally {
      setIsLoading(false);
    }
  }

  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        isLoading,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        updateItem,
        removeItem,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
