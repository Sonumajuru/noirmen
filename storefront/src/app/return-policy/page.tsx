import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return Policy — NOIRMEN",
  description: "NOIRMEN return and exchange policy. 3-day return window after delivery.",
};

export default function ReturnPolicyPage() {
  return (
    <div className="pt-16">
      <section className="py-24 px-4 md:px-8 bg-noir-dark text-center">
        <p className="label tracking-[0.4em] mb-6">Legal</p>
        <h1 className="font-display text-4xl md:text-6xl font-light tracking-[0.2em] uppercase">
          Return Policy
        </h1>
        <p className="text-noir-muted text-sm mt-4">Last updated: April 2026</p>
      </section>

      <section className="py-20 px-4 md:px-8 max-w-3xl mx-auto space-y-12 text-sm text-noir-light leading-relaxed">
        <div className="space-y-4">
          <h2 className="text-xs tracking-widest uppercase text-noir-white">Return Window</h2>
          <p>
            Customers have <strong className="text-noir-white">3 days after delivery</strong> to initiate a return
            for a full refund. After the 3-day window has passed, customers are eligible to exchange their purchase
            for another item of equal or greater value — but no refunds will be issued.
          </p>
        </div>

        <div className="bg-noir-card border border-noir-border p-8 space-y-3">
          <div className="flex items-start gap-4">
            <div className="w-8 h-px bg-noir-white mt-3 shrink-0" />
            <div>
              <p className="text-xs tracking-widest uppercase text-noir-white mb-1">Within 3 Days of Delivery</p>
              <p className="text-noir-muted">Full return eligible — refund issued to original payment method.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-px bg-noir-border mt-3 shrink-0" />
            <div>
              <p className="text-xs tracking-widest uppercase text-noir-white mb-1">After 3 Days of Delivery</p>
              <p className="text-noir-muted">Exchange only — no refund. Item must be unused and in original condition.</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xs tracking-widest uppercase text-noir-white">Conditions for Return / Exchange</h2>
          <ul className="list-none space-y-2 pl-4 border-l border-noir-border">
            <li>Item must be unused, unwashed, and in original packaging</li>
            <li>Tags must still be attached</li>
            <li>Proof of purchase (order confirmation) is required</li>
            <li>Sale items are not eligible for return or exchange</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-xs tracking-widest uppercase text-noir-white">How to Initiate a Return</h2>
          <p>
            Contact us within the 3-day window via email at{" "}
            <a href="mailto:noirmen27@gmail.com" className="text-noir-white hover:underline">
              noirmen27@gmail.com
            </a>{" "}
            or reach out on Instagram{" "}
            <a
              href="https://instagram.com/noirm_en27"
              target="_blank"
              rel="noopener noreferrer"
              className="text-noir-white hover:underline"
            >
              @noirm_en27
            </a>
            . Include your order number and reason for return.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xs tracking-widest uppercase text-noir-white">Refund Processing</h2>
          <p>
            Once your return is received and inspected, your refund will be processed within 5–7 business days to
            your original payment method.
          </p>
        </div>

        <div className="pt-4">
          <Link href="/contact" className="btn-outline">
            Contact Us About a Return
          </Link>
        </div>
      </section>
    </div>
  );
}
