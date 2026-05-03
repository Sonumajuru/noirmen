"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { medusa, Product, formatPrice } from "@/lib/medusa";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem, isLoading } = useCart();

  useEffect(() => {
    async function load() {
      try {
        const { product } = await medusa.products.retrieve(id);
        setProduct(product);
        if (product.variants?.[0]) {
          setSelectedVariantId(product.variants[0].id);
        }
        const { products } = await medusa.products.list({ limit: "4" });
        setRelated(products.filter((p) => p.id !== id));
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="w-px h-16 bg-gradient-to-b from-transparent to-noir-white animate-pulse" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center text-center">
        <div>
          <p className="font-display text-3xl tracking-wider text-noir-muted">Product not found</p>
          <a href="/products" className="btn-outline inline-block mt-8">Back to Shop</a>
        </div>
      </div>
    );
  }

  const images = product.images?.length > 0
    ? product.images
    : product.thumbnail
    ? [{ url: product.thumbnail }]
    : [];

  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId);
  const price = selectedVariant?.prices?.[0];

  const sizeOption = product.options?.find(
    (o) => o.title.toLowerCase() === "size"
  );

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Images */}
          <div className="space-y-3">
            <div className="relative aspect-[3/4] bg-noir-card overflow-hidden">
              {images[selectedImage] ? (
                <Image
                  src={images[selectedImage].url}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-display text-6xl text-noir-border">N</span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative flex-shrink-0 w-20 h-24 bg-noir-card overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? "border-noir-white" : "border-transparent"
                    }`}
                  >
                    <Image src={img.url} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-8 pt-4">
            {product.collection && (
              <p className="label">{product.collection.title}</p>
            )}
            <h1 className="font-display text-4xl md:text-5xl font-light tracking-wider">
              {product.title}
            </h1>
            {price && (
              <p className="text-xl tracking-wider">
                {formatPrice(price.amount, price.currency_code)}
              </p>
            )}

            <hr className="border-noir-border" />

            {/* Size selector */}
            {sizeOption && (
              <div className="space-y-4">
                <p className="label">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants?.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariantId(variant.id)}
                      disabled={variant.inventory_quantity === 0}
                      className={`px-5 py-2 text-xs tracking-widest uppercase border transition-colors ${
                        selectedVariantId === variant.id
                          ? "border-noir-white text-noir-white bg-noir-card"
                          : "border-noir-border text-noir-muted hover:border-noir-light"
                      } disabled:opacity-30 disabled:cursor-not-allowed`}
                    >
                      {variant.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to cart */}
            <button
              onClick={() => addItem(selectedVariantId, 1)}
              disabled={isLoading || !selectedVariantId}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isLoading ? "Adding to Cart..." : "Add to Cart"}
            </button>

            <hr className="border-noir-border" />

            {/* Description */}
            {product.description && (
              <div className="space-y-3">
                <p className="label">Description</p>
                <p className="text-sm text-noir-muted leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Policies */}
            <div className="space-y-3 text-xs text-noir-muted">
              <p>✓ Free shipping on orders over €75</p>
              <p>✓ 3-day returns after delivery</p>
              <p>✓ Secure checkout — Visa, PayPal, iDEAL</p>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-24">
            <h2 className="section-title mb-12">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
