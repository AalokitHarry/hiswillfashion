import type { Product } from "@/lib/types";

const SIZES = ["S", "M", "L", "XL", "XXL"];

export const PRODUCTS: Product[] = [
  {
    slug: "lion-of-judah-tee",
    name: "Lion of Judah Oversized Tee",
    price: 799,
    description:
      "An oversized tee in heavyweight cotton, printed with a bold Lion of Judah design.",
    verse: "Behold, the Lion of the tribe of Judah has triumphed. — Revelation 5:5",
    sizes: SIZES,
    featured: true,
    image: "/products/lion-of-judah-tee.jpg",
  },
  {
    slug: "heavenly-influencer-tee",
    name: "Heavenly Influencer Oversized Tee",
    price: 799,
    description:
      "A royal blue oversized tee carrying a simple daily reminder to lead with light.",
    verse: "Let your light shine before others. — Matthew 5:16",
    sizes: SIZES,
    featured: true,
    image: "/products/heavenly-influencer-tee.jpg",
  },
  {
    slug: "jesus-little-princess-tee",
    name: "Jesus' Little Princess Tee",
    price: 799,
    description:
      "A soft cream oversized tee with a sweet, hand-illustrated design — a gentle reminder of who you are.",
    verse: "I am fearfully and wonderfully made. — Psalm 139:14",
    sizes: SIZES,
    featured: true,
    image: "/products/jesus-little-princess-tee.jpg",
  },
  {
    slug: "kingdom-mindset-tee",
    name: "Kingdom Mindset Oversized Tee",
    price: 799,
    description:
      "A red oversized tee with a bold crest print — a declaration of identity for those who think and live like royalty in God's kingdom.",
    verse: "Kingdom Mindset.",
    sizes: SIZES,
    image: "/products/kingdom-mindset-tee.jpg",
  },
  {
    slug: "philippians-4-7-tee",
    name: "Philippians 4:7 Oversized Tee",
    price: 799,
    description:
      "A cream oversized tee with the full verse printed vertically down the back — a quiet, constant reminder of peace.",
    verse:
      "And the peace of God, which surpasses all understanding, will guard your hearts and minds through Christ Jesus. — Philippians 4:7",
    sizes: SIZES,
    image: "/products/philippians-4-7-tee.jpg",
  },
  {
    slug: "grace-changed-my-story-tee",
    name: "Grace Changed My Story Oversized Tee",
    price: 799,
    description:
      "A royal blue oversized tee with a hand-lettered back print — a personal testimony you can wear.",
    verse: "Grace changed my story.",
    sizes: SIZES,
    featured: true,
    image: "/products/grace-changed-my-story-tee.jpg",
  },
  {
    slug: "i-ace-my-race-tee",
    name: "I Ace My Race Oversized Tee",
    price: 799,
    description:
      "A black oversized tee with a bold back print — worn by those who run their race by God's grace, not their own strength.",
    verse: "I ace my race by God's grace.",
    sizes: SIZES,
    featured: true,
    image: "/products/i-ace-my-race-tee.jpg",
  },
  {
    slug: "plain-eggplant-tee",
    name: "Plain Eggplant Oversized Tee",
    price: 699,
    description:
      "No print, no slogan — just a clean, oversized essential in a deep eggplant shade, built on the same heavyweight cotton as the rest of the collection.",
    sizes: SIZES,
    image: "/products/plain-eggplant-tee.jpg",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}
