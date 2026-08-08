import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Story | His Will Fashion Club",
  description: "The story behind His Will Fashion Club — premium Christian clothing.",
};

export default function AboutPage() {
  return (
    <div>
      <section className="container-lg grid items-center gap-12 py-16 md:py-20 lg:grid-cols-2">
        <div className="animate-[fade-up_0.7s_cubic-bezier(0.16,1,0.3,1)_both]">
          <span className="eyebrow">Our Story</span>
          <h1 className="mt-3 font-display text-3xl font-semibold text-navy sm:text-4xl">
            Faith you can wear, purpose you can live.
          </h1>
          <p className="mt-5 text-[0.98rem] leading-relaxed text-navy/70">
            His Will Fashion Club began with a simple conviction — that what we wear
            can carry what we believe. Every piece we design starts with scripture,
            not a trend. Each oversized tee is built to remind you, and everyone
            around you, of a truth worth carrying.
          </p>
          <p className="mt-4 text-[0.98rem] leading-relaxed text-navy/70">
            We&apos;re a small, faith-first apparel brand shipping premium Christian
            clothing Pan India — from our first drop to every order that follows,
            our goal stays the same: wear your faith, live His will.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/shop" className="btn btn-primary">
              Shop the Collection
            </Link>
            <a
              href={SITE.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              Follow @{SITE.instagramHandle}
            </a>
          </div>
        </div>
        <div className="relative mx-auto aspect-4/5 w-full max-w-sm overflow-hidden rounded-2xl shadow-xl shadow-navy/20 animate-[fade-up_0.8s_cubic-bezier(0.16,1,0.3,1)_0.1s_both]">
          <Image
            src="/products/heavenly-influencer-tee.jpg"
            alt="Heavenly Influencer Oversized Tee"
            fill
            sizes="(min-width: 1024px) 384px, 90vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="border-t border-line bg-cream-soft">
        <div className="container-lg grid gap-8 py-16 sm:grid-cols-3">
          {[
            {
              title: "Our Mission",
              body: "To make faith visible — one verse, one design, one wardrobe at a time.",
            },
            {
              title: "Our Craft",
              body: "Premium fabrics, thoughtful fits, and designs meant to be worn daily — not just on Sundays.",
            },
            {
              title: "Our Promise",
              body: "Pan India shipping, Cash on Delivery, and real humans on WhatsApp if you ever need us.",
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 100}>
              <h3 className="font-display text-lg font-semibold text-navy">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy/65">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
