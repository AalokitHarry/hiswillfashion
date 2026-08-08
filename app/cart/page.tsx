import type { Metadata } from "next";
import { CartView } from "@/components/CartView";

export const metadata: Metadata = {
  title: "Your Cart | His Will Fashion Club",
};

export default function CartPage() {
  return <CartView />;
}
