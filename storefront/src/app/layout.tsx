import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "NOIRMEN — Modern Essentials for Men",
  description:
    "Clean design. Confident silhouettes. Pieces that move effortlessly between classic and modern wear.",
  keywords: ["men fashion", "noir", "minimalist", "essentials", "menswear"],
  openGraph: {
    title: "NOIRMEN",
    description: "Modern Essentials for Men",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-noir-black text-noir-white font-sans antialiased">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
