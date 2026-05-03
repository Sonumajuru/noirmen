import type { Metadata } from "next";
import { Instagram, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact — NOIRMEN",
  description: "Get in touch with NOIRMEN. We're here to help.",
};

export default function ContactPage() {
  return (
    <div className="pt-16">
      <section className="py-24 px-4 md:px-8 bg-noir-dark text-center">
        <p className="label tracking-[0.4em] mb-6">Get In Touch</p>
        <h1 className="font-display text-4xl md:text-6xl font-light tracking-[0.2em] uppercase">
          Contact Us
        </h1>
        <p className="text-noir-muted text-sm mt-6 max-w-md mx-auto leading-relaxed">
          Have a question about your order or our products? We're here to help.
        </p>
      </section>

      <section className="py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Email */}
          <a
            href="mailto:noirmen27@gmail.com"
            className="group bg-noir-card border border-noir-border p-8 space-y-4 hover:border-noir-white transition-colors duration-300"
          >
            <Mail size={20} className="text-noir-muted group-hover:text-noir-white transition-colors" />
            <div>
              <p className="text-xs tracking-widest uppercase text-noir-white mb-2">Email</p>
              <p className="text-sm text-noir-muted group-hover:text-noir-light transition-colors">
                noirmen27@gmail.com
              </p>
            </div>
            <p className="text-xs text-noir-muted">We aim to respond within 24 hours.</p>
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com/noirm_en27"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-noir-card border border-noir-border p-8 space-y-4 hover:border-noir-white transition-colors duration-300"
          >
            <Instagram size={20} className="text-noir-muted group-hover:text-noir-white transition-colors" />
            <div>
              <p className="text-xs tracking-widest uppercase text-noir-white mb-2">Instagram</p>
              <p className="text-sm text-noir-muted group-hover:text-noir-light transition-colors">
                @noirm_en27
              </p>
            </div>
            <p className="text-xs text-noir-muted">DM us for quick support.</p>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-noir-card border border-noir-border p-8 space-y-4 hover:border-noir-white transition-colors duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-noir-muted group-hover:text-noir-white transition-colors"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <div>
              <p className="text-xs tracking-widest uppercase text-noir-white mb-2">WhatsApp</p>
              <p className="text-sm text-noir-muted group-hover:text-noir-light transition-colors">
                Message us directly
              </p>
            </div>
            <p className="text-xs text-noir-muted">Available for order queries.</p>
          </a>
        </div>

        {/* Response info */}
        <div className="mt-16 border-t border-noir-border pt-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-noir-muted">
          <div className="space-y-2">
            <p className="text-xs tracking-widest uppercase text-noir-white">Order Issues</p>
            <p>For complaints, missing items, or damaged goods — email us with your order number and we'll resolve it promptly.</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs tracking-widest uppercase text-noir-white">Returns & Exchanges</p>
            <p>
              Please review our{" "}
              <a href="/return-policy" className="text-noir-white hover:underline">
                Return Policy
              </a>{" "}
              before reaching out. Returns must be initiated within 3 days of delivery.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
