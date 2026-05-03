"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/medusa";

export default function CartPage() {
  const { cart, updateItem, removeItem, isLoading } = useCart();

  const items = cart?.items ?? [];
  const currency = cart?.region?.currency_code ?? "eur";

  if (items.length === 0) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <p className="font-display text-4xl tracking-wider text-noir-muted">Your cart is empty</p>
          <p className="text-sm text-noir-muted">Add something to start your order</p>
          <Link href="/products" className="btn-primary inline-block">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-16">
        <h1 className="section-title mb-12">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex gap-5 py-6 border-b border-noir-border">
                <div className="relative w-24 h-32 bg-noir-card flex-shrink-0 overflow-hidden">
                  {item.thumbnail ? (
                    <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-display text-noir-border text-2xl">N</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-sm tracking-wide">{item.title}</p>
                      <p className="text-xs text-noir-muted mt-1">{item.variant?.title}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={isLoading}
                      className="text-noir-muted hover:text-red-400 transition-colors flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center gap-4 border border-noir-border">
                      <button
                        onClick={() => updateItem(item.id, item.quantity - 1)}
                        disabled={isLoading || item.quantity <= 1}
                        className="px-3 py-2 text-noir-muted hover:text-noir-white disabled:opacity-30 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateItem(item.id, item.quantity + 1)}
                        disabled={isLoading}
                        className="px-3 py-2 text-noir-muted hover:text-noir-white disabled:opacity-30 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="text-sm">{formatPrice(item.subtotal, currency)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-noir-card p-8 space-y-5 h-fit">
            <h2 className="text-xs tracking-widest uppercase mb-6">Order Summary</h2>

            <div className="flex justify-between text-sm">
              <span className="text-noir-muted">Subtotal</span>
              <span>{formatPrice(cart?.subtotal ?? 0, currency)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-noir-muted">Shipping</span>
              <span className="text-noir-muted">Calculated at checkout</span>
            </div>
            <hr className="border-noir-border" />
            <div className="flex justify-between font-medium">
              <span className="text-xs tracking-widest uppercase">Total</span>
              <span>{formatPrice(cart?.total ?? 0, currency)}</span>
            </div>

            <Link href="/checkout" className="btn-primary w-full text-center block mt-4">
              Proceed to Checkout
            </Link>

            <Link href="/products" className="btn-ghost w-full text-center block">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
