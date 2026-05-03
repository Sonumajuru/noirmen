import Link from "next/link";
import { medusa } from "@/lib/medusa";
import ProductCard from "@/components/ProductCard";

async function getFeaturedProducts() {
  try {
    const { products } = await medusa.products.list({ limit: "8" });
    return products;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-noir-dark">
        <div className="absolute inset-0 bg-gradient-to-b from-noir-black/20 via-transparent to-noir-black/80" />
        <div className="relative z-10 text-center px-4 space-y-8">
          <p className="label tracking-[0.4em]">Modern Essentials for Men</p>
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-light tracking-[0.2em] uppercase">
            NOIRMEN
          </h1>
          <p className="text-noir-muted text-sm md:text-base max-w-md mx-auto leading-relaxed">
            What you wear should speak without saying too much.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="btn-primary">
              Shop Collection
            </Link>
            <Link href="/about" className="btn-outline">
              Our Story
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-noir-muted" />
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">All Categories</h2>
          <p className="text-noir-muted text-sm mt-4 tracking-wider">
            Designed with intention — worn across moments, ages, and lifestyles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Essentials", sub: "Timeless basics", href: "/products?collection=essentials" },
            { label: "Streetwear", sub: "Elevated urban", href: "/products?collection=streetwear" },
            { label: "Accessories", sub: "The finishing touch", href: "/products?collection=accessories" },
          ].map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="group relative aspect-square bg-noir-card overflow-hidden flex items-end p-8"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-noir-black/80 to-transparent group-hover:from-noir-black/90 transition-all duration-500" />
              <div className="relative z-10">
                <p className="text-xs text-noir-muted tracking-widest uppercase mb-2">{cat.sub}</p>
                <h3 className="font-display text-3xl tracking-wider uppercase">{cat.label}</h3>
                <div className="mt-3 w-0 group-hover:w-12 h-px bg-noir-white transition-all duration-500" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="pb-24 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="section-title">New Arrivals</h2>
            <Link href="/products" className="btn-ghost">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Brand Statement */}
      <section className="py-24 bg-noir-card">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-8">
          <p className="label tracking-[0.4em]">The NOIRMEN Philosophy</p>
          <blockquote className="font-display text-2xl md:text-4xl font-light tracking-wider leading-relaxed">
            "Black doesn't compete. It complements. It works with everything,
            yet always holds its own."
          </blockquote>
          <Link href="/about" className="btn-outline inline-block">
            Read Our Story
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { title: "Free Shipping", sub: "On all orders over €75" },
            { title: "3-Day Returns", sub: "Easy returns within 3 days of delivery" },
            { title: "Secure Payment", sub: "Visa, PayPal, iDEAL & more" },
          ].map((f) => (
            <div key={f.title} className="space-y-3">
              <div className="w-8 h-px bg-noir-white mx-auto" />
              <h3 className="text-xs tracking-widest uppercase">{f.title}</h3>
              <p className="text-sm text-noir-muted">{f.sub}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
