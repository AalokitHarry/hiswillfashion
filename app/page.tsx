import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { PRODUCTS } from "@/data/products";
import { SITE } from "@/lib/site";

const PILLARS = [
  {
    title: "Faith-Inspired Design",
    body: "Every drop carries a verse, a truth, or a declaration — apparel with a message worth wearing.",
  },
  {
    title: "Premium Fabric",
    body: "Heavyweight cotton and brushed fleece, built for everyday comfort and a fit that lasts.",
  },
  {
    title: "Pan India Shipping",
    body: "From Indore to every corner of the country — tracked delivery, wherever you are.",
  },
];

export default function Home() {
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 4);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-line bg-cream">
        <div className="container-lg grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2">
          <div>
            <span className="eyebrow">{SITE.description}</span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] text-navy sm:text-5xl lg:text-[3.4rem]">
              Wear Your Faith.
              <br />
              <span className="text-gold">Live His Will.</span>
            </h1>
            <p className="mt-5 max-w-md text-[0.98rem] leading-relaxed text-navy/70">
              Premium Christian clothing designed to carry scripture, conviction,
              and purpose into every room you walk into. Shipped Pan India.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/shop" className="btn btn-primary">
                Shop the Collection
              </Link>
              <Link href="/about" className="btn btn-outline">
                Our Story
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-8 border-t border-line pt-6 text-sm text-navy/60">
              <div>
                <strong className="block font-display text-xl text-navy">8</strong>
                Faith-Inspired Designs
              </div>
              <div>
                <strong className="block font-display text-xl text-navy">Pan India</strong>
                Shipping
              </div>
              <div>
                <strong className="block font-display text-xl text-navy">COD</strong>
                Available
              </div>
            </div>
          </div>

          <div className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-4">
            <div className="relative col-span-2 aspect-16/10 w-full overflow-hidden rounded-2xl shadow-xl shadow-navy/20">
              <Image
                src="/products/lion-of-judah-tee.jpg"
                alt="Lion of Judah Oversized Tee"
                fill
                sizes="(min-width: 1024px) 400px, 90vw"
                priority
                className="object-cover"
              />
            </div>
            <div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl shadow-lg shadow-navy/10">
              <Image
                src="/products/grace-changed-my-story-tee.jpg"
                alt="Grace Changed My Story Oversized Tee"
                fill
                sizes="(min-width: 1024px) 200px, 45vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl shadow-lg shadow-navy/10">
              <Image
                src="/products/jesus-little-princess-tee.jpg"
                alt="Jesus' Little Princess Tee"
                fill
                sizes="(min-width: 1024px) 200px, 45vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container-lg py-16 md:py-20">
        <Reveal className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="eyebrow">Featured</span>
            <h2 className="mt-3 font-display text-2xl font-semibold text-navy sm:text-3xl">
              This Season&apos;s Collection
            </h2>
          </div>
          <Link href="/shop" className="btn btn-outline">
            View All Products
          </Link>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {featured.map((product, i) => (
            <Reveal key={product.slug} delay={i * 80}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-cream-soft">
        <div className="container-lg grid gap-8 py-16 sm:grid-cols-3 md:py-20">
          {PILLARS.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 100} className="flex flex-col items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-navy text-gold-soft">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-semibold text-navy">{pillar.title}</h3>
              <p className="text-sm leading-relaxed text-navy/65">{pillar.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-lg py-16 md:py-20">
        <Reveal className="card flex flex-col items-center gap-5 bg-accent-navy px-6 py-14 text-center text-accent-navy-fg sm:px-16">
          <span className="eyebrow text-gold-soft [&::before]:bg-gold-soft">Join the Family</span>
          <h2 className="max-w-xl font-display text-2xl font-semibold sm:text-3xl">
            Follow @{SITE.instagramHandle} for new drops &amp; faith-inspired stories
          </h2>
          <a
            href={SITE.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            Follow on Instagram
          </a>
        </Reveal>
      </section>
    </div>
  );
}
