"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/medusa";
import Image from "next/image";

type Step = "address" | "shipping" | "payment";

export default function CheckoutPage() {
  const { cart } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<Step>("address");
  const [address, setAddress] = useState({
    first_name: "", last_name: "", email: "", phone: "",
    address_1: "", city: "", postal_code: "", country_code: "NL",
  });

  const currency = cart?.region?.currency_code ?? "eur";
  const items = cart?.items ?? [];

  function handleAddressSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep("payment");
  }

  return (
    <div className="pt-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Form */}
          <div>
            <div className="mb-10">
              <a href="/" className="font-display text-2xl tracking-[0.3em] uppercase">
                NOIRMEN
              </a>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-3 mb-10 text-xs tracking-widest uppercase">
              {(["address", "payment"] as const).map((s, i) => (
                <span key={s} className="flex items-center gap-3">
                  {i > 0 && <span className="text-noir-border">/</span>}
                  <span className={step === s ? "text-noir-white" : "text-noir-muted"}>
                    {s}
                  </span>
                </span>
              ))}
            </div>

            {step === "address" && (
              <form onSubmit={handleAddressSubmit} className="space-y-5">
                <h2 className="text-xs tracking-widest uppercase mb-6">Shipping Information</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label block mb-2">First Name</label>
                    <input
                      required
                      value={address.first_name}
                      onChange={(e) => setAddress({ ...address, first_name: e.target.value })}
                      className="w-full bg-noir-card border border-noir-border px-4 py-3 text-sm text-noir-white outline-none focus:border-noir-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="label block mb-2">Last Name</label>
                    <input
                      required
                      value={address.last_name}
                      onChange={(e) => setAddress({ ...address, last_name: e.target.value })}
                      className="w-full bg-noir-card border border-noir-border px-4 py-3 text-sm text-noir-white outline-none focus:border-noir-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="label block mb-2">Email</label>
                  <input
                    required
                    type="email"
                    value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })}
                    className="w-full bg-noir-card border border-noir-border px-4 py-3 text-sm text-noir-white outline-none focus:border-noir-white transition-colors"
                  />
                </div>

                <div>
                  <label className="label block mb-2">Phone</label>
                  <input
                    type="tel"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full bg-noir-card border border-noir-border px-4 py-3 text-sm text-noir-white outline-none focus:border-noir-white transition-colors"
                  />
                </div>

                <div>
                  <label className="label block mb-2">Address</label>
                  <input
                    required
                    value={address.address_1}
                    onChange={(e) => setAddress({ ...address, address_1: e.target.value })}
                    className="w-full bg-noir-card border border-noir-border px-4 py-3 text-sm text-noir-white outline-none focus:border-noir-white transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label block mb-2">City</label>
                    <input
                      required
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full bg-noir-card border border-noir-border px-4 py-3 text-sm text-noir-white outline-none focus:border-noir-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="label block mb-2">Postal Code</label>
                    <input
                      required
                      value={address.postal_code}
                      onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
                      className="w-full bg-noir-card border border-noir-border px-4 py-3 text-sm text-noir-white outline-none focus:border-noir-white transition-colors"
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full mt-4">
                  Continue to Payment
                </button>
              </form>
            )}

            {step === "payment" && (
              <div className="space-y-6">
                <h2 className="text-xs tracking-widest uppercase mb-6">Payment</h2>
                <p className="text-sm text-noir-muted">
                  Payment is processed securely via Stripe. We accept:
                </p>
                <div className="flex flex-wrap gap-3">
                  {["Visa", "Mastercard", "PayPal", "iDEAL"].map((m) => (
                    <span key={m} className="border border-noir-border px-4 py-2 text-xs text-noir-muted tracking-wider">
                      {m}
                    </span>
                  ))}
                </div>
                <div className="bg-noir-card border border-noir-border p-6 text-sm text-noir-muted space-y-2">
                  <p>🔒 Your payment is encrypted and secure.</p>
                  <p>Stripe handles all card data — NOIRMEN never stores payment details.</p>
                </div>
                <button className="btn-primary w-full">
                  Place Order
                </button>
                <button
                  onClick={() => setStep("address")}
                  className="btn-ghost w-full"
                >
                  Back to Address
                </button>
              </div>
            )}
          </div>

          {/* Right: Order summary */}
          <div className="lg:border-l lg:border-noir-border lg:pl-12">
            <h2 className="text-xs tracking-widest uppercase mb-8">Order Summary</h2>

            <div className="space-y-5 mb-8">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-16 h-20 bg-noir-card flex-shrink-0 overflow-hidden">
                    <span className="absolute -top-1 -right-1 bg-noir-muted text-noir-black text-[9px] w-5 h-5 flex items-center justify-center rounded-full z-10">
                      {item.quantity}
                    </span>
                    {item.thumbnail ? (
                      <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-display text-noir-border">N</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex justify-between items-center">
                    <div>
                      <p className="text-sm">{item.title}</p>
                      <p className="text-xs text-noir-muted">{item.variant?.title}</p>
                    </div>
                    <p className="text-sm">{formatPrice(item.subtotal, currency)}</p>
                  </div>
                </div>
              ))}
            </div>

            <hr className="border-noir-border mb-6" />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-noir-muted">Subtotal</span>
                <span>{formatPrice(cart?.subtotal ?? 0, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-noir-muted">Shipping</span>
                <span className="text-noir-muted">TBD</span>
              </div>
              <hr className="border-noir-border" />
              <div className="flex justify-between font-medium text-base">
                <span>Total</span>
                <span>{formatPrice(cart?.total ?? 0, currency)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
