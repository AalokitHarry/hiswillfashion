export const SITE = {
  name: "His Will Fashion Club",
  tagline: "Wear Your Faith. Live His Will.",
  description:
    "Premium Christian clothing and faith-inspired apparel, shipped Pan India.",
  whatsappNumber: "919039199382",
  instagramHandle: "his_wll_fashion_club",
  instagramUrl: "https://www.instagram.com/his_wll_fashion_club",
  currency: "INR" as const,
  currencySymbol: "₹",
  shippingFee: 99,
  freeShippingThreshold: 1999,
};

export function whatsappLink(message: string, number = SITE.whatsappNumber) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
