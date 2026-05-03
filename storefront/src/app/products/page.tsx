import { medusa, Product } from "@/lib/medusa";
import ProductCard from "@/components/ProductCard";

type Props = {
  searchParams: { q?: string; collection?: string };
};

export default async function ProductsPage({ searchParams }: Props) {
  const params: Record<string, string> = { limit: "20" };
  if (searchParams.q) params.q = searchParams.q;

  let products: Product[] = [];
  try {
    const res = await medusa.products.list(params);
    products = res.products;
  } catch {
    products = [];
  }

  const heading = searchParams.q
    ? `Results for "${searchParams.q}"`
    : searchParams.collection
    ? searchParams.collection.charAt(0).toUpperCase() + searchParams.collection.slice(1)
    : "All Products";

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <p className="label mb-3">NOIRMEN Collection</p>
          <h1 className="section-title">{heading}</h1>
          {products.length > 0 && (
            <p className="text-noir-muted text-sm mt-3">{products.length} pieces</p>
          )}
        </div>

        {/* Filter bar */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-2">
          {[
            { label: "All", href: "/products" },
            { label: "Essentials", href: "/products?collection=essentials" },
            { label: "Streetwear", href: "/products?collection=streetwear" },
            { label: "Accessories", href: "/products?collection=accessories" },
          ].map((cat) => (
            <a
              key={cat.href}
              href={cat.href}
              className="whitespace-nowrap text-xs tracking-widest uppercase px-5 py-2 border border-noir-border text-noir-muted hover:border-noir-white hover:text-noir-white transition-colors flex-shrink-0"
            >
              {cat.label}
            </a>
          ))}
        </div>

        {/* Grid */}
        {products.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-3xl tracking-wider text-noir-muted mb-4">
              No products found
            </p>
            <a href="/products" className="btn-outline inline-block mt-4">
              View All Products
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
