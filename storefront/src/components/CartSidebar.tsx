"use client";

import { X, Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/medusa";

export default function CartSidebar() {
  const { cart, isOpen, closeCart, updateItem, removeItem, isLoading } = useCart();

  if (!isOpen) return null;

  const items = cart?.items ?? [];
  const currency = cart?.region?.currency_code ?? "eur";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-noir-dark z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-noir-border">
          <h2 className="text-xs tracking-widest uppercase">
            Cart {items.length > 0 && `(${items.length})`}
          </h2>
          <button onClick={closeCart} className="text-noir-muted hover:text-noir-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <p className="text-noir-muted text-sm tracking-wider">Your cart is empty</p>
              <button onClick={closeCart} className="btn-outline text-xs px-6 py-2">
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative w-20 h-24 bg-noir-card flex-shrink-0 overflow-hidden">
                  {item.thumbnail ? (
                    <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-display text-noir-border text-xl">N</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm tracking-wide truncate">{item.title}</p>
                  <p className="text-xs text-noir-muted mt-1">{item.variant?.title}</p>
                  <p className="text-sm mt-2">{formatPrice(item.unit_price, currency)}</p>

                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => updateItem(item.id, item.quantity - 1)}
                      disabled={isLoading || item.quantity <= 1}
                      className="text-noir-muted hover:text-noir-white disabled:opacity-30 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateItem(item.id, item.quantity + 1)}
                      disabled={isLoading}
                      className="text-noir-muted hover:text-noir-white disabled:opacity-30 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={isLoading}
                      className="ml-auto text-noir-muted hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-noir-border px-6 py-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-noir-muted tracking-wider uppercase text-xs">Subtotal</span>
              <span>{formatPrice(cart?.subtotal ?? 0, currency)}</span>
            </div>
            <p className="text-xs text-noir-muted">Shipping calculated at checkout</p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full text-center block"
            >
              Checkout
            </Link>
            <Link
              href="/cart"
              onClick={closeCart}
              className="btn-ghost w-full text-center block py-2"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
