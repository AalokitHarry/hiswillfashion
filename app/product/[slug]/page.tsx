import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { AddToCartForm } from "@/components/AddToCartForm";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS, getProductBySlug } from "@/data/products";
import { formatPrice } from "@/lib/format";

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} | His Will Fashion Club`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = PRODUCTS.filter((p) => p.slug !== product.slug).slice(0, 4);

  return (
    <div className="container-lg py-10 md:py-14">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-sand">
          <ViewTransition name={`product-image-${product.slug}`}>
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
              className="object-cover"
            />
          </ViewTransition>
        </div>

        <div className="animate-[fade-up_0.6s_cubic-bezier(0.16,1,0.3,1)_both]">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            Oversized Tee
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-navy sm:text-4xl">
            {product.name}
          </h1>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-semibold text-navy">
              {formatPrice(product.price)}
            </span>
          </div>

          <p className="mt-5 max-w-lg text-sm leading-relaxed text-navy/70">
            {product.description}
          </p>

          {product.verse ? (
            <blockquote className="mt-5 border-l-2 border-gold pl-4 font-display text-base italic text-navy/80">
              &ldquo;{product.verse}&rdquo;
            </blockquote>
          ) : null}

          <div className="mt-8 border-t border-line pt-8">
            <AddToCartForm slug={product.slug} sizes={product.sizes} />
          </div>

          <div className="mt-8 grid gap-3 rounded-xl border border-line bg-cream-soft p-4 text-sm text-navy/70 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <span aria-hidden>📦</span> Pan India shipping
            </div>
            <div className="flex items-center gap-2">
              <span aria-hidden>💵</span> Cash on Delivery available
            </div>
            <div className="flex items-center gap-2">
              <span aria-hidden>🔒</span> Secure checkout
            </div>
            <div className="flex items-center gap-2">
              <span aria-hidden>💬</span> Order support on WhatsApp
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <div className="mt-20">
          <h2 className="mb-6 font-display text-2xl font-semibold text-navy">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
