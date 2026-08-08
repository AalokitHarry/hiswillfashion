import Link from "next/link";
import { Logo } from "@/components/Logo";
import { SITE, whatsappLink } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-accent-navy text-accent-navy-fg/85">
      <div className="container-lg grid gap-10 py-16 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <div className="[&_.text-navy]:text-accent-navy-fg [&_.text-gold]:text-gold-soft">
            <Logo />
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-accent-navy-fg/70">
            {SITE.tagline} Premium Christian clothing and faith-inspired apparel,
            shipped Pan India.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href={SITE.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-accent-navy-fg/20 transition-colors hover:border-gold hover:text-gold-soft"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4.5 w-4.5">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href={whatsappLink("Hi! I'd like to know more about His Will Fashion Club.")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-accent-navy-fg/20 transition-colors hover:border-gold hover:text-gold-soft"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5">
                <path d="M12.04 2c-5.5 0-10 4.5-10 10 0 1.77.46 3.45 1.28 4.9L2 22l5.25-1.37A9.96 9.96 0 0012.04 22c5.5 0 10-4.5 10-10s-4.5-10-10-10zm5.86 14.3c-.25.7-1.24 1.28-2.02 1.45-.55.11-1.26.2-3.66-.78-3.08-1.27-5.06-4.35-5.21-4.55-.15-.2-1.24-1.65-1.24-3.15 0-1.5.78-2.23 1.06-2.54.28-.31.6-.38.8-.38h.58c.19 0 .44-.07.68.53.25.6.85 2.08.92 2.24.07.15.12.33.02.53-.1.2-.15.33-.3.5-.15.18-.32.4-.45.53-.15.15-.31.32-.14.62.18.31.79 1.31 1.7 2.13 1.17 1.06 2.15 1.39 2.46 1.55.31.15.49.13.67-.08.19-.2.79-.9 1-1.22.21-.31.42-.26.7-.15.28.1 1.79.85 2.1 1 .3.15.5.23.58.36.08.13.08.75-.18 1.45z" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold text-accent-navy-fg">Shop</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-accent-navy-fg/70">
            <li><Link href="/shop" className="hover:text-gold-soft">All Products</Link></li>
            <li><Link href="/about" className="hover:text-gold-soft">Our Story</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold text-accent-navy-fg">Support</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-accent-navy-fg/70">
            <li><Link href="/cart" className="hover:text-gold-soft">Cart &amp; Checkout</Link></li>
            <li><Link href="/about" className="hover:text-gold-soft">Our Story</Link></li>
            <li>
              <a href={whatsappLink("Hi! I need help with an order.")} target="_blank" rel="noopener noreferrer" className="hover:text-gold-soft">
                Order via WhatsApp
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold text-accent-navy-fg">Get in Touch</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-accent-navy-fg/70">
            <li>Pan India Shipping</li>
            <li>WhatsApp: +91 90391 99382</li>
            <li>@{SITE.instagramHandle}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-accent-navy-fg/10 py-6">
        <div className="container-lg flex flex-col items-center justify-between gap-3 text-xs text-accent-navy-fg/50 sm:flex-row">
          <span>&copy; {new Date().getFullYear()} His Will Fashion Club. All rights reserved.</span>
          <span>Faith + Purpose, worn daily.</span>
        </div>
      </div>
    </footer>
  );
}
