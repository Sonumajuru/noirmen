"use client";

import { useState } from "react";
import Link from "next/link";

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="pt-16">
      <section className="py-24 px-4 md:px-8 bg-noir-dark text-center">
        <p className="label tracking-[0.4em] mb-6">Shipping</p>
        <h1 className="font-display text-4xl md:text-6xl font-light tracking-[0.2em] uppercase">
          Track Your Order
        </h1>
        <p className="text-noir-muted text-sm mt-6 max-w-md mx-auto leading-relaxed">
          Enter your order number and email address to check your delivery status.
        </p>
      </section>

      <section className="py-20 px-4 md:px-8 max-w-lg mx-auto">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label block mb-2">Order Number</label>
              <input
                required
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. NM-00123"
                className="w-full bg-noir-card border border-noir-border px-4 py-3 text-sm text-noir-white placeholder:text-noir-muted outline-none focus:border-noir-white transition-colors"
              />
            </div>

            <div>
              <label className="label block mb-2">Email Address</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-noir-card border border-noir-border px-4 py-3 text-sm text-noir-white placeholder:text-noir-muted outline-none focus:border-noir-white transition-colors"
              />
            </div>

            <button type="submit" className="btn-primary w-full">
              Track Order
            </button>
          </form>
        ) : (
          <div className="space-y-8">
            <div className="bg-noir-card border border-noir-border p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="label mb-1">Order</p>
                  <p className="text-noir-white text-sm font-medium">{orderId}</p>
                </div>
                <span className="text-xs tracking-widest uppercase border border-noir-border px-3 py-1 text-noir-muted">
                  Processing
                </span>
              </div>

              <div className="divider" />

              {/* Status steps */}
              <div className="space-y-6">
                {[
                  { label: "Order Confirmed", done: true },
                  { label: "Preparing Your Order", done: false },
                  { label: "Shipped", done: false },
                  { label: "Out for Delivery", done: false },
                  { label: "Delivered", done: false },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        step.done ? "bg-noir-white" : "bg-noir-border"
                      }`}
                    />
                    <p
                      className={`text-sm tracking-wide ${
                        step.done ? "text-noir-white" : "text-noir-muted"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-noir-muted text-center leading-relaxed">
              For more details on your shipment, check the confirmation email sent to{" "}
              <span className="text-noir-white">{email}</span>. Need help?{" "}
              <Link href="/contact" className="text-noir-white hover:underline">
                Contact us
              </Link>
              .
            </p>

            <button
              onClick={() => { setSubmitted(false); setOrderId(""); setEmail(""); }}
              className="btn-ghost w-full text-center"
            >
              Track Another Order
            </button>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-noir-border text-center space-y-2">
          <p className="text-xs text-noir-muted">
            Can't find your order number? Check your order confirmation email.
          </p>
          <p className="text-xs text-noir-muted">
            Still need help?{" "}
            <Link href="/contact" className="text-noir-white hover:underline">
              Contact support
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
