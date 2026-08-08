import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="card group block overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-navy/10"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-sand">
        <ViewTransition name={`product-image-${product.slug}`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </ViewTransition>
      </div>
      <div className="p-4">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-gold">
          Oversized Tee
        </p>
        <h3 className="mt-1 font-display text-base font-semibold leading-snug text-navy">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center gap-2">
          <span className="font-semibold text-navy">{formatPrice(product.price)}</span>
        </div>
      </div>
    </Link>
  );
}
