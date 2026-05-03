import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help & FAQ — NOIRMEN",
  description: "Customer support and frequently asked questions for NOIRMEN.",
};

const faqs = [
  {
    category: "Orders",
    items: [
      {
        q: "How do I track my order?",
        a: "Once your order ships, you'll receive a confirmation email with a tracking number. You can also visit our Order Tracking page.",
      },
      {
        q: "Can I cancel or modify my order?",
        a: "Orders can be cancelled or modified within 1 hour of placement. Contact us immediately at noirmen27@gmail.com with your order number.",
      },
      {
        q: "I received the wrong item — what do I do?",
        a: "We're sorry about that. Email us at noirmen27@gmail.com with your order number and a photo of the item received. We'll sort it out quickly.",
      },
    ],
  },
  {
    category: "Shipping",
    items: [
      {
        q: "How long does delivery take?",
        a: "Standard delivery takes 3–7 business days depending on your location. You'll receive tracking details once your order ships.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship internationally. Delivery times and costs may vary by destination.",
      },
    ],
  },
  {
    category: "Returns & Exchanges",
    items: [
      {
        q: "What is your return policy?",
        a: "You have 3 days after delivery to return an item for a full refund. After 3 days, exchanges are available but no refunds will be issued.",
      },
      {
        q: "How do I start a return?",
        a: "Email noirmen27@gmail.com within 3 days of delivery with your order number and reason for return. We'll guide you through the process.",
      },
      {
        q: "When will I receive my refund?",
        a: "Refunds are processed within 5–7 business days after we receive and inspect your return.",
      },
    ],
  },
  {
    category: "Payments",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept Visa, Mastercard, PayPal, iDEAL, and Credit Cards.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes. All payments are processed through secure, encrypted payment gateways. We never store your full card details.",
      },
    ],
  },
  {
    category: "Account",
    items: [
      {
        q: "Do I need an account to shop?",
        a: "You can browse without an account, but creating one lets you track orders, save your address, and check out faster.",
      },
      {
        q: "How do I reset my password?",
        a: "On the login page, click 'Forgot password' and follow the instructions sent to your email.",
      },
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="pt-16">
      <section className="py-24 px-4 md:px-8 bg-noir-dark text-center">
        <p className="label tracking-[0.4em] mb-6">Support</p>
        <h1 className="font-display text-4xl md:text-6xl font-light tracking-[0.2em] uppercase">
          Help & FAQ
        </h1>
        <p className="text-noir-muted text-sm mt-6 max-w-md mx-auto leading-relaxed">
          Find answers to common questions below. If you still need help, reach out to us directly.
        </p>
      </section>

      <section className="py-20 px-4 md:px-8 max-w-3xl mx-auto space-y-16">
        {faqs.map((section) => (
          <div key={section.category}>
            <h2 className="text-xs tracking-widest uppercase text-noir-white mb-8 pb-4 border-b border-noir-border">
              {section.category}
            </h2>
            <div className="space-y-8">
              {section.items.map((item) => (
                <div key={item.q} className="space-y-2">
                  <p className="text-sm text-noir-white font-medium">{item.q}</p>
                  <p className="text-sm text-noir-muted leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Still need help */}
        <div className="bg-noir-card border border-noir-border p-8 text-center space-y-4">
          <p className="text-xs tracking-widest uppercase text-noir-white">Still Need Help?</p>
          <p className="text-sm text-noir-muted">
            Our team is available via email, Instagram DM, or WhatsApp.
          </p>
          <Link href="/contact" className="btn-outline inline-block mt-2">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
