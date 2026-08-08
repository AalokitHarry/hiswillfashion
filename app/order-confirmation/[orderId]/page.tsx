import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { getOrder } from "@/lib/orders";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Order Confirmed | His Will Fashion Club",
};

const PAYMENT_LABEL: Record<string, string> = {
  cod: "Cash on Delivery",
  whatsapp: "WhatsApp Order",
  razorpay: "Paid Online",
};

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrder(orderId);
  if (!order) notFound();

  const shortId = order.id.slice(0, 8).toUpperCase();
  const confirmMessage = `Hi! Confirming my order #${shortId} placed on His Will Fashion Club. Total: ${formatPrice(order.total)}.`;

  return (
    <div className="container-lg py-14 md:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <div className="animate-pop mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-navy text-gold-soft">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-7 w-7">
            <path
              d="M20 6L9 17l-5-5"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              className="check-mark"
            />
          </svg>
        </div>
        <h1 className="mt-6 animate-[fade-up_0.5s_cubic-bezier(0.16,1,0.3,1)_0.2s_both] font-display text-3xl font-semibold text-navy">
          Thank you, {order.customer.name.split(" ")[0]}!
        </h1>
        <p className="mt-2 animate-[fade-up_0.5s_cubic-bezier(0.16,1,0.3,1)_0.3s_both] text-sm text-navy/60">
          Your order has been placed successfully.
        </p>
        <p className="mt-1 animate-[fade-up_0.5s_cubic-bezier(0.16,1,0.3,1)_0.35s_both] text-xs uppercase tracking-[0.14em] text-gold">
          Order #{shortId}
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-2xl space-y-6">
        <div className="card animate-[fade-up_0.5s_cubic-bezier(0.16,1,0.3,1)_0.4s_both] p-6">
          <h2 className="font-display text-lg font-semibold text-navy">Order Details</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {order.items.map((item, i) => (
              <li key={i} className="flex justify-between text-navy/70">
                <span>
                  {item.name} <span className="text-navy/40">({item.size} × {item.quantity})</span>
                </span>
                <span className="font-medium text-navy">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm text-navy/70">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
            </div>
            <div className="flex justify-between border-t border-line pt-2 text-base font-semibold text-navy">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="card animate-[fade-up_0.5s_cubic-bezier(0.16,1,0.3,1)_0.48s_both] grid gap-6 p-6 sm:grid-cols-2">
          <div>
            <h3 className="font-display text-sm font-semibold text-navy">Shipping To</h3>
            <p className="mt-2 text-sm leading-relaxed text-navy/70">
              {order.customer.name}
              <br />
              {order.customer.address}
              <br />
              {order.customer.city}, {order.customer.state} - {order.customer.pincode}
              <br />
              {order.customer.phone}
            </p>
          </div>
          <div>
            <h3 className="font-display text-sm font-semibold text-navy">Payment</h3>
            <p className="mt-2 text-sm text-navy/70">
              {PAYMENT_LABEL[order.paymentMethod]}
              <br />
              <span className="capitalize">
                Status: {order.paymentStatus.replace("_", " ")}
              </span>
            </p>
          </div>
        </div>

        <div className="flex animate-[fade-up_0.5s_cubic-bezier(0.16,1,0.3,1)_0.56s_both] flex-col gap-3 sm:flex-row">
          <a
            href={whatsappLink(confirmMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold btn-block transition-transform duration-200 hover:scale-[1.02] active:scale-95"
          >
            Confirm on WhatsApp
          </a>
          <Link href="/shop" className="btn btn-outline btn-block transition-transform duration-200 hover:scale-[1.02] active:scale-95">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
