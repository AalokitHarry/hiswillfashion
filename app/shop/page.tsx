import type { Metadata } from "next";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS } from "@/data/products";

export const metadata: Metadata = {
  title: "Shop All | His Will Fashion Club",
  description: "Browse premium Christian clothing and faith-inspired apparel.",
};

export default function ShopPage() {
  return (
    <div className="container-lg py-12 md:py-16">
      <div className="mb-8">
        <span className="eyebrow">The Collection</span>
        <h1 className="mt-3 font-display text-3xl font-semibold text-navy sm:text-4xl">
          Shop All
        </h1>
        <p className="mt-2 max-w-lg text-sm text-navy/65">
          Faith-inspired oversized tees, made to be worn every day. {PRODUCTS.length}{" "}
          {PRODUCTS.length === 1 ? "design" : "designs"} available.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
