"use client";

import Link from "next/link";
import Image from "next/image";
import { Product, formatPrice } from "@/lib/medusa";
import { useCart } from "@/context/CartContext";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const { addItem, isLoading } = useCart();

  const firstVariant = product.variants?.[0];
  const price = firstVariant?.prices?.[0];

  async function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!firstVariant) return;
    await addItem(firstVariant.id, 1);
  }

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative overflow-hidden bg-noir-card aspect-[3/4] card-hover">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-display text-4xl text-noir-border tracking-widest">N</span>
          </div>
        )}

        {/* Quick add overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleQuickAdd}
            disabled={isLoading || !firstVariant}
            className="w-full bg-noir-white text-noir-black py-3 text-xs tracking-widest uppercase font-medium hover:bg-noir-light transition-colors disabled:opacity-50"
          >
            {isLoading ? "Adding..." : "Quick Add"}
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-1">
        {product.collection && (
          <p className="text-xs tracking-widest uppercase text-noir-muted">
            {product.collection.title}
          </p>
        )}
        <h3 className="text-sm tracking-wider text-noir-white group-hover:text-noir-light transition-colors">
          {product.title}
        </h3>
        {price && (
          <p className="text-sm text-noir-light">
            {formatPrice(price.amount, price.currency_code)}
          </p>
        )}
      </div>
    </Link>
  );
}
