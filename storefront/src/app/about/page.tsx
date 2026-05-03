import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — NOIRMEN",
  description: "The story behind NOIRMEN. Built on simplicity, confidence, and the quiet power of black.",
};

export default function AboutPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-32 px-4 md:px-8 bg-noir-dark text-center">
        <p className="label tracking-[0.4em] mb-6">Our Story</p>
        <h1 className="font-display text-5xl md:text-7xl font-light tracking-[0.2em] uppercase">
          NOIRMEN
        </h1>
        <div className="w-16 h-px bg-noir-muted mx-auto mt-8" />
      </section>

      {/* Story */}
      <section className="py-24 px-4 md:px-8 max-w-3xl mx-auto">
        <div className="space-y-8 text-base text-noir-light leading-relaxed">
          <p>
            NOIR MEN was built on a simple belief:{" "}
            <span className="text-noir-white italic">what you wear should speak without saying too much.</span>
          </p>
          <p>In a world full of noise, we chose simplicity.</p>
          <p>
            The name <strong className="text-noir-white font-medium">Noir</strong> comes from the French word for
            black — a color that has always stood apart. Timeless, versatile, and powerful in its own quiet way.
            Black doesn't compete. It complements. It works with everything, yet always holds its own.
          </p>
          <p>That idea became our foundation.</p>
          <p>
            As part of a generation where appearance carries meaning, we saw how style could shape perception. But
            we also saw how fashion became overcomplicated — chasing trends instead of building identity.
          </p>
          <p>
            NOIR MEN was created to bring it back to what matters: clean design, confident silhouettes, and pieces
            that move effortlessly between classic and modern wear.
          </p>
          <p>
            From refined essentials to elevated streetwear, every piece is designed with intention — to be worn
            across moments, ages, and lifestyles.
          </p>
        </div>

        <blockquote className="mt-16 border-l-2 border-noir-border pl-8 font-display text-2xl md:text-3xl font-light tracking-wider text-noir-white leading-relaxed">
          "Black doesn't compete. It complements. It works with everything, yet always holds its own."
        </blockquote>
      </section>

      {/* Values */}
      <section className="py-24 bg-noir-card">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="section-title text-center mb-16">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Intentional Design",
                body: "Every cut, fabric, and silhouette is chosen with purpose. No excess. No noise.",
              },
              {
                title: "Timeless Over Trend",
                body: "We build identity, not hype. Pieces that last beyond seasons.",
              },
              {
                title: "For Every Moment",
                body: "From the everyday to the elevated — our collection moves with you.",
              },
            ].map((v) => (
              <div key={v.title} className="space-y-4">
                <div className="w-8 h-px bg-noir-white" />
                <h3 className="text-sm tracking-widest uppercase text-noir-white">{v.title}</h3>
                <p className="text-sm text-noir-muted leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 text-center">
        <p className="label mb-6">Ready to wear NOIRMEN?</p>
        <Link href="/products" className="btn-primary">
          Shop the Collection
        </Link>
      </section>
    </div>
  );
}
