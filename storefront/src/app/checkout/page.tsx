"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { medusa, formatPrice, Order } from "@/lib/medusa";
import Image from "next/image";

type Step = "address" | "payment";

type Address = {
  first_name: string; last_name: string; email: string; phone: string;
  address_1: string; city: string; postal_code: string; country_code: string;
};

type CardFields = { number: string; expiry: string; cvc: string; name: string };

function formatCardNumber(val: string) {
  return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(val: string) {
  const digits = val.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

function validateCard(card: CardFields): string | null {
  if (card.number.replace(/\s/g, "").length < 16) return "Enter a valid 16-digit card number.";
  const [mm, yy] = card.expiry.split("/");
  const now = new Date();
  const expMonth = parseInt(mm, 10);
  const expYear = 2000 + parseInt(yy ?? "0", 10);
  if (!mm || !yy || expMonth < 1 || expMonth > 12) return "Enter a valid expiry (MM/YY).";
  if (expYear < now.getFullYear() || (expYear === now.getFullYear() && expMonth < now.getMonth() + 1))
    return "Your card has expired.";
  if (card.cvc.length < 3) return "Enter a valid CVC.";
  if (!card.name.trim()) return "Enter the name on your card.";
  return null;
}

export default function CheckoutPage() {
  const { cart } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<Step>("address");
  const [address, setAddress] = useState<Address>({
    first_name: "", last_name: "", email: "", phone: "",
    address_1: "", city: "", postal_code: "", country_code: "NL",
  });
  const [card, setCard] = useState<CardFields>({ number: "", expiry: "", cvc: "", name: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const currency = cart?.region?.currency_code ?? "eur";
  const items = cart?.items ?? [];

  function handleAddressSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep("payment");
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const cardError = validateCard(card);
    if (cardError) { setError(cardError); return; }
    if (!cart) { setError("Cart not found."); return; }

    setLoading(true);
    try {
      const result = await medusa.carts.complete(cart.id, {
        email: address.email,
        shipping_address: {
          first_name: address.first_name,
          last_name: address.last_name,
          address_1: address.address_1,
          city: address.city,
          postal_code: address.postal_code,
          country_code: address.country_code,
        },
      });
      if (result.type === "order") {
        setOrder(result.data);
        localStorage.removeItem("noirmen_cart_id");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  // ── Order success ──────────────────────────────────────────────────────────
  if (order) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-12 h-12 border border-noir-white flex items-center justify-center mx-auto">
            <svg className="w-5 h-5 text-noir-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl tracking-widest uppercase mb-2">Order Confirmed</h1>
            <p className="text-noir-muted text-sm">Thank you, {address.first_name}. Your order has been placed.</p>
          </div>
          <div className="bg-noir-card border border-noir-border p-6 text-sm space-y-3 text-left">
            <div className="flex justify-between">
              <span className="text-noir-muted">Order</span>
              <span>#{order.display_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-noir-muted">Email</span>
              <span>{order.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-noir-muted">Total</span>
              <span>{formatPrice(order.total, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-noir-muted">Status</span>
              <span className="capitalize">{order.payment_status}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => router.push("/orders/track")} className="btn-ghost flex-1 text-sm">
              Track Order
            </button>
            <button onClick={() => router.push("/products")} className="btn-primary flex-1 text-sm">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Checkout form ──────────────────────────────────────────────────────────
  return (
    <div className="pt-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left: Form */}
          <div>
            <div className="mb-10">
              <a href="/" className="font-display text-2xl tracking-[0.3em] uppercase">NOIRMEN</a>
            </div>

            {/* Steps */}
            <div className="flex items-center gap-3 mb-10 text-xs tracking-widest uppercase">
              {(["address", "payment"] as const).map((s, i) => (
                <span key={s} className="flex items-center gap-3">
                  {i > 0 && <span className="text-noir-border">/</span>}
                  <button
                    onClick={() => s === "address" && setStep("address")}
                    className={step === s ? "text-noir-white" : "text-noir-muted hover:text-noir-light transition-colors"}
                  >
                    {s}
                  </button>
                </span>
              ))}
            </div>

            {/* Address step */}
            {step === "address" && (
              <form onSubmit={handleAddressSubmit} className="space-y-5">
                <h2 className="text-xs tracking-widest uppercase mb-6">Shipping Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label block mb-2">First Name</label>
                    <input required value={address.first_name}
                      onChange={(e) => setAddress({ ...address, first_name: e.target.value })}
                      className="input w-full" />
                  </div>
                  <div>
                    <label className="label block mb-2">Last Name</label>
                    <input required value={address.last_name}
                      onChange={(e) => setAddress({ ...address, last_name: e.target.value })}
                      className="input w-full" />
                  </div>
                </div>
                <div>
                  <label className="label block mb-2">Email</label>
                  <input required type="email" value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })}
                    className="input w-full" />
                </div>
                <div>
                  <label className="label block mb-2">Phone</label>
                  <input type="tel" value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="input w-full" />
                </div>
                <div>
                  <label className="label block mb-2">Address</label>
                  <input required value={address.address_1}
                    onChange={(e) => setAddress({ ...address, address_1: e.target.value })}
                    className="input w-full" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label block mb-2">City</label>
                    <input required value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="input w-full" />
                  </div>
                  <div>
                    <label className="label block mb-2">Postal Code</label>
                    <input required value={address.postal_code}
                      onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
                      className="input w-full" />
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full mt-4">
                  Continue to Payment
                </button>
              </form>
            )}

            {/* Payment step */}
            {step === "payment" && (
              <form onSubmit={handlePlaceOrder} className="space-y-6">
                <h2 className="text-xs tracking-widest uppercase mb-6">Payment Details</h2>

                {/* Test mode notice */}
                <div className="bg-noir-card border border-noir-border p-4 text-xs text-noir-muted space-y-1">
                  <p className="text-noir-light font-medium tracking-wider uppercase">Test Mode</p>
                  <p>Card: <span className="text-noir-white font-mono">4242 4242 4242 4242</span></p>
                  <p>Expiry: any future date &nbsp;·&nbsp; CVC: any 3 digits</p>
                </div>

                <div>
                  <label className="label block mb-2">Card Number</label>
                  <input
                    required
                    inputMode="numeric"
                    placeholder="4242 4242 4242 4242"
                    value={card.number}
                    onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                    className="input w-full font-mono tracking-widest"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label block mb-2">Expiry</label>
                    <input
                      required
                      placeholder="MM/YY"
                      inputMode="numeric"
                      value={card.expiry}
                      onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                      className="input w-full font-mono"
                    />
                  </div>
                  <div>
                    <label className="label block mb-2">CVC</label>
                    <input
                      required
                      placeholder="123"
                      inputMode="numeric"
                      maxLength={4}
                      value={card.cvc}
                      onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                      className="input w-full font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="label block mb-2">Name on Card</label>
                  <input
                    required
                    placeholder="John Doe"
                    value={card.name}
                    onChange={(e) => setCard({ ...card, name: e.target.value })}
                    className="input w-full"
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm border border-red-400/30 bg-red-400/10 px-4 py-3">
                    {error}
                  </p>
                )}

                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? "Processing..." : `Pay ${formatPrice(cart?.total ?? 0, currency)}`}
                </button>

                <button type="button" onClick={() => setStep("address")} className="btn-ghost w-full">
                  Back to Address
                </button>
              </form>
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
                <span>{formatPrice(cart?.shipping_total ?? 0, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-noir-muted">Tax (21%)</span>
                <span>{formatPrice(cart?.tax_total ?? 0, currency)}</span>
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
