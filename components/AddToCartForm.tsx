"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";

export function AddToCartForm({
  slug,
  sizes,
}: {
  slug: string;
  sizes: string[];
}) {
  const { addItem } = useCart();
  const router = useRouter();
  const [size, setSize] = useState(sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2.5 text-sm font-semibold text-navy">
          Size {size ? <span className="text-navy/50">— {size}</span> : null}
        </p>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={`min-w-11 rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200 ease-out active:scale-90 ${
                size === s
                  ? "border-accent-navy bg-accent-navy text-accent-navy-fg scale-105"
                  : "border-line bg-cream-soft text-navy/70 hover:border-navy hover:-translate-y-0.5"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2.5 text-sm font-semibold text-navy">Quantity</p>
        <div className="inline-flex items-center rounded-lg border border-line">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-10 w-10 items-center justify-center text-navy transition-transform duration-150 hover:text-gold active:scale-75"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span key={quantity} className="animate-pop w-10 text-center text-sm font-semibold text-navy">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
            className="flex h-10 w-10 items-center justify-center text-navy transition-transform duration-150 hover:text-gold active:scale-75"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => {
            addItem(slug, size, quantity);
            setJustAdded(true);
            setTimeout(() => setJustAdded(false), 1800);
          }}
          className="btn btn-outline btn-block overflow-hidden"
        >
          <span key={justAdded ? "added" : "idle"} className="animate-pop inline-block">
            {justAdded ? "Added to Cart ✓" : "Add to Cart"}
          </span>
        </button>
        <button
          type="button"
          onClick={() => {
            addItem(slug, size, quantity);
            router.push("/checkout");
          }}
          className="btn btn-primary btn-block"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
