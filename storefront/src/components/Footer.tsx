import Link from "next/link";
import { Instagram, Mail } from "lucide-react";

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-noir-dark border-t border-noir-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h2 className="font-display text-2xl tracking-[0.3em] uppercase mb-4">NOIRMEN</h2>
            <p className="text-noir-muted text-sm leading-relaxed">
              What you wear should speak without saying too much.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://instagram.com/noirm_en27"
                target="_blank"
                rel="noopener noreferrer"
                className="text-noir-muted hover:text-noir-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="mailto:noirmen27@gmail.com"
                className="text-noir-muted hover:text-noir-white transition-colors"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-noir-muted hover:text-noir-white transition-colors"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon size={18} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="label mb-5">Shop</h3>
            <ul className="space-y-3">
              {[
                { label: "All Products", href: "/products" },
                { label: "Essentials", href: "/products?collection=essentials" },
                { label: "Streetwear", href: "/products?collection=streetwear" },
                { label: "Accessories", href: "/products?collection=accessories" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-noir-muted hover:text-noir-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="label mb-5">Info</h3>
            <ul className="space-y-3">
              {[
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Help & FAQ", href: "/help" },
                { label: "Order Tracking", href: "/orders/track" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-noir-muted hover:text-noir-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="label mb-5">Policies</h3>
            <ul className="space-y-3">
              {[
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Return Policy", href: "/return-policy" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-noir-muted hover:text-noir-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <h3 className="label mb-4">We Accept</h3>
              <div className="flex flex-wrap gap-2 text-xs text-noir-muted">
                <span className="border border-noir-border px-3 py-1">Visa</span>
                <span className="border border-noir-border px-3 py-1">PayPal</span>
                <span className="border border-noir-border px-3 py-1">iDEAL</span>
                <span className="border border-noir-border px-3 py-1">Mastercard</span>
              </div>
            </div>
          </div>
        </div>

        <div className="divider mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-noir-muted tracking-wider">
            © {new Date().getFullYear()} NOIRMEN. All rights reserved.
          </p>
          <p className="text-xs text-noir-muted">
            <a href="mailto:noirmen27@gmail.com" className="hover:text-noir-white transition-colors">
              noirmen27@gmail.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
