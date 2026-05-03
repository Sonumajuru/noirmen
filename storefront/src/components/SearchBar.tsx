"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { medusa, Product, formatPrice } from "@/lib/medusa";

type Props = {
  onClose: () => void;
};

export default function SearchBar({ onClose }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const { products } = await medusa.products.list({ q: query, limit: "5" });
        setResults(products);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-noir-black/95 backdrop-blur-sm flex flex-col">
      <div className="max-w-2xl w-full mx-auto px-4 pt-20">
        <form onSubmit={handleSubmit} className="relative">
          <Search size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-noir-muted" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-transparent border-b border-noir-border pl-8 pr-10 py-4 text-lg text-noir-white placeholder:text-noir-muted outline-none focus:border-noir-white transition-colors"
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-noir-muted hover:text-noir-white transition-colors"
          >
            <X size={20} />
          </button>
        </form>

        {/* Results */}
        {isSearching && (
          <p className="text-xs text-noir-muted tracking-widest uppercase mt-8 text-center">
            Searching...
          </p>
        )}

        {results.length > 0 && (
          <div className="mt-8 space-y-4">
            {results.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                onClick={onClose}
                className="flex gap-4 group p-3 hover:bg-noir-card transition-colors"
              >
                <div className="relative w-16 h-20 bg-noir-card flex-shrink-0 overflow-hidden">
                  {product.thumbnail ? (
                    <Image src={product.thumbnail} alt={product.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-display text-noir-border text-lg">N</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 py-1">
                  <p className="text-sm tracking-wide group-hover:text-noir-light transition-colors">
                    {product.title}
                  </p>
                  {product.variants?.[0]?.prices?.[0] && (
                    <p className="text-xs text-noir-muted mt-1">
                      {formatPrice(
                        product.variants[0].prices[0].amount,
                        product.variants[0].prices[0].currency_code
                      )}
                    </p>
                  )}
                </div>
              </Link>
            ))}

            <Link
              href={`/products?q=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="block text-xs tracking-widest uppercase text-noir-muted hover:text-noir-white transition-colors pt-2 text-center"
            >
              View all results for "{query}"
            </Link>
          </div>
        )}

        {!isSearching && query.trim() && results.length === 0 && (
          <p className="text-xs text-noir-muted tracking-widest uppercase mt-8 text-center">
            No products found for "{query}"
          </p>
        )}
      </div>
    </div>
  );
}
