"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Search, User, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import CartSidebar from "./CartSidebar";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const { itemCount, openCart } = useCart();
  const { customer } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { label: "All", href: "/products" },
    { label: "Essentials", href: "/products?collection=essentials" },
    { label: "Streetwear", href: "/products?collection=streetwear" },
    { label: "Accessories", href: "/products?collection=accessories" },
    { label: "About", href: "/about" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-noir-black/95 backdrop-blur-sm border-b border-noir-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          {/* Mobile menu button */}
          <button
            className="md:hidden text-noir-white p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="font-display text-2xl tracking-[0.3em] uppercase text-noir-white absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0"
          >
            NOIRMEN
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs tracking-widest uppercase text-noir-light hover:text-noir-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-noir-light hover:text-noir-white transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            <Link
              href={customer ? "/account" : "/login"}
              className="text-noir-light hover:text-noir-white transition-colors"
              aria-label="Account"
            >
              <User size={18} />
            </Link>

            <button
              onClick={openCart}
              className="relative text-noir-light hover:text-noir-white transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={18} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-noir-white text-noir-black text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="md:hidden bg-noir-dark border-t border-noir-border px-4 py-6 flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs tracking-widest uppercase text-noir-light hover:text-noir-white transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-noir-border" />
            <Link
              href="/help"
              className="text-xs tracking-widest uppercase text-noir-muted hover:text-noir-white transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Help
            </Link>
          </nav>
        )}
      </header>

      <CartSidebar />
      {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}
    </>
  );
}
