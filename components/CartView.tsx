"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getProductBySlug } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { SITE } from "@/lib/site";
import { useCart } from "@/lib/cart-context";

const REMOVE_TRANSITION_MS = 320;

export function CartView() {
  const { resolvedLines, isReady, updateQuantity, removeItem, subtotal, shipping, total } =
    useCart();
  const [removingKeys, setRemovingKeys] = useState<Set<string>>(new Set());

  function handleRemove(slug: string, size: string) {
    const key = `${slug}-${size}`;
    setRemovingKeys((prev) => new Set(prev).add(key));
    setTimeout(() => {
      removeItem(slug, size);
      setRemovingKeys((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }, REMOVE_TRANSITION_MS);
  }

  if (isReady && resolvedLines.length === 0) {
    return (
      <div className="container-lg flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold text-navy">Your cart is empty</h1>
        <p className="max-w-sm text-sm text-navy/60">
          Looks like you haven&apos;t added anything yet. Explore the collection
          and find something that speaks to you.
        </p>
        <Link href="/shop" className="btn btn-primary mt-2">
          Shop the Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="container-lg py-10 md:py-14">
      <h1 className="font-display text-3xl font-semibold text-navy">Your Cart</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          {resolvedLines.map((line) => {
            const product = getProductBySlug(line.slug);
            if (!product) return null;
            const key = `${line.slug}-${line.size}`;
            const removing = removingKeys.has(key);
            return (
              <div
                key={key}
                className={`cart-line card mb-4 flex gap-4 p-4 ${removing ? "cart-line-removing" : ""}`}
              >
                <Link
                  href={`/product/${product.slug}`}
                  className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-sand"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </Link>

                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/product/${product.slug}`}
                        className="font-display text-sm font-semibold text-navy hover:text-gold"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-1 text-xs text-navy/50">Size: {line.size}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(line.slug, line.size)}
                      aria-label="Remove item"
                      className="text-navy/40 transition-all duration-150 hover:scale-110 hover:text-red-600"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4.5 w-4.5">
                        <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center rounded-lg border border-line">
                      <button
                        type="button"
                        onClick={() => updateQuantity(line.slug, line.size, line.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center text-navy transition-transform duration-150 hover:text-gold active:scale-75"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span
                        key={line.quantity}
                        className="animate-pop w-8 text-center text-sm font-semibold text-navy"
                      >
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(line.slug, line.size, line.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center text-navy transition-transform duration-150 hover:text-gold active:scale-75"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-semibold text-navy transition-all duration-300">
                      {formatPrice(line.lineTotal)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="card h-fit space-y-4 p-6">
          <h2 className="font-display text-lg font-semibold text-navy">Order Summary</h2>
          <div className="space-y-2 text-sm text-navy/70">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-navy transition-all duration-300">
                {formatPrice(subtotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-medium text-navy">
                {shipping === 0 ? "Free" : formatPrice(shipping)}
              </span>
            </div>
            {shipping > 0 ? (
              <p className="text-xs text-gold">
                Add {formatPrice(SITE.freeShippingThreshold - subtotal)} more for free shipping
              </p>
            ) : null}
          </div>
          <div className="flex justify-between border-t border-line pt-4 text-base font-semibold text-navy">
            <span>Total</span>
            <span className="transition-all duration-300">{formatPrice(total)}</span>
          </div>
          <Link href="/checkout" className="btn btn-primary btn-block">
            Proceed to Checkout
          </Link>
          <Link href="/shop" className="btn btn-outline btn-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
