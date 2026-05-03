import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — NOIRMEN",
  description: "How NOIRMEN collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-16">
      <section className="py-24 px-4 md:px-8 bg-noir-dark text-center">
        <p className="label tracking-[0.4em] mb-6">Legal</p>
        <h1 className="font-display text-4xl md:text-6xl font-light tracking-[0.2em] uppercase">
          Privacy Policy
        </h1>
        <p className="text-noir-muted text-sm mt-4">Last updated: April 2026</p>
      </section>

      <section className="py-20 px-4 md:px-8 max-w-3xl mx-auto space-y-12 text-sm text-noir-light leading-relaxed">
        <div className="space-y-4">
          <h2 className="text-xs tracking-widest uppercase text-noir-white">1. Information We Collect</h2>
          <p>
            When you create an account or place an order, we collect personal information such as your name, email
            address, shipping address, and payment details. We may also collect browsing data to improve your
            experience on our site.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xs tracking-widest uppercase text-noir-white">2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="list-none space-y-2 pl-4 border-l border-noir-border">
            <li>Process and fulfil your orders</li>
            <li>Send order confirmations and shipping updates</li>
            <li>Respond to customer service enquiries</li>
            <li>Improve our website and services</li>
            <li>Send promotional communications (only with your consent)</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-xs tracking-widest uppercase text-noir-white">3. Data Sharing</h2>
          <p>
            We do not sell your personal data. We may share information with trusted third-party service providers
            (such as payment processors and shipping partners) solely to operate our business. These parties are
            contractually obligated to protect your data.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xs tracking-widest uppercase text-noir-white">4. Payment Security</h2>
          <p>
            All payments are processed securely via our payment partners (PayPal, Visa, iDEAL, and Mastercard).
            We do not store your full card details on our servers.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xs tracking-widest uppercase text-noir-white">5. Cookies</h2>
          <p>
            We use cookies to maintain your session, remember your cart, and analyse site usage. You may disable
            cookies in your browser settings, though some features may not function correctly.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xs tracking-widest uppercase text-noir-white">6. Your Rights</h2>
          <p>
            You have the right to access, correct, or request deletion of your personal data at any time. To
            exercise these rights, contact us at{" "}
            <a href="mailto:noirmen27@gmail.com" className="text-noir-white hover:underline">
              noirmen27@gmail.com
            </a>
            .
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xs tracking-widest uppercase text-noir-white">7. Contact</h2>
          <p>
            For any privacy-related questions, reach us at{" "}
            <a href="mailto:noirmen27@gmail.com" className="text-noir-white hover:underline">
              noirmen27@gmail.com
            </a>{" "}
            or via Instagram{" "}
            <a
              href="https://instagram.com/noirm_en27"
              target="_blank"
              rel="noopener noreferrer"
              className="text-noir-white hover:underline"
            >
              @noirm_en27
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
