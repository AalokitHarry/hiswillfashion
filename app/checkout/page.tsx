import type { Metadata } from "next";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout | His Will Fashion Club",
};

export default function CheckoutPage() {
  return <CheckoutForm />;
}
