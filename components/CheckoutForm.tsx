"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { SITE, whatsappLink } from "@/lib/site";
import { useCart } from "@/lib/cart-context";
import type { CustomerDetails, PaymentMethod } from "@/lib/types";

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const RAZORPAY_ENABLED = Boolean(RAZORPAY_KEY_ID);

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const EMPTY_CUSTOMER: CustomerDetails = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  notes: "",
};

const PAYMENT_OPTIONS: {
  id: PaymentMethod;
  title: string;
  body: string;
  disabled?: boolean;
}[] = [
  {
    id: "cod",
    title: "Cash on Delivery",
    body: "Pay in cash when your order arrives at your doorstep.",
  },
  {
    id: "whatsapp",
    title: "Order via WhatsApp",
    body: "We'll open WhatsApp with your order summary to confirm payment directly with our team.",
  },
  {
    id: "razorpay",
    title: "Pay Online (UPI / Card / Netbanking)",
    body: RAZORPAY_ENABLED
      ? "Secure online payment powered by Razorpay."
      : "Coming soon — online payments aren't configured yet.",
    disabled: !RAZORPAY_ENABLED,
  },
];

export function CheckoutForm() {
  const { resolvedLines, isReady, lines, subtotal, shipping, total, clear } = useCart();
  const router = useRouter();

  const [customer, setCustomer] = useState<CustomerDetails>(EMPTY_CUSTOMER);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [status, setStatus] = useState<"idle" | "submitting" | "payment-pending">("idle");
  const [error, setError] = useState<string | null>(null);
  const [pendingOrder, setPendingOrder] = useState<{
    id: string;
    razorpayOrderId: string;
    amount: number;
    currency: string;
  } | null>(null);

  useEffect(() => {
    if (isReady && resolvedLines.length === 0 && status === "idle") {
      router.replace("/cart");
    }
  }, [isReady, resolvedLines.length, status, router]);

  const canSubmit = useMemo(() => {
    return (
      customer.name.trim() &&
      customer.email.trim() &&
      customer.phone.trim() &&
      customer.address.trim() &&
      customer.city.trim() &&
      customer.state.trim() &&
      /^\d{6}$/.test(customer.pincode.trim())
    );
  }, [customer]);

  function updateField<K extends keyof CustomerDetails>(key: K, value: string) {
    setCustomer((prev) => ({ ...prev, [key]: value }));
  }

  async function createOrder() {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: lines, customer, paymentMethod }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Could not place order.");
    return data.order as { id: string };
  }

  async function startRazorpay(orderId: string) {
    const createRes = await fetch("/api/razorpay/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });
    const createData = await createRes.json();
    if (!createRes.ok) throw new Error(createData.error || "Could not start payment.");

    setPendingOrder({
      id: orderId,
      razorpayOrderId: createData.razorpayOrderId,
      amount: createData.amount,
      currency: createData.currency,
    });

    await openRazorpayCheckout(orderId, createData);
  }

  async function openRazorpayCheckout(
    orderId: string,
    payment: { razorpayOrderId: string; amount: number; currency: string; keyId?: string }
  ) {
    const loaded = await loadRazorpayScript();
    if (!loaded || !window.Razorpay) {
      setError("Could not load payment gateway. Please try Cash on Delivery instead.");
      setStatus("payment-pending");
      return;
    }

    const rzp = new window.Razorpay({
      key: payment.keyId || RAZORPAY_KEY_ID,
      amount: payment.amount,
      currency: payment.currency,
      name: SITE.name,
      description: "Order payment",
      order_id: payment.razorpayOrderId,
      prefill: {
        name: customer.name,
        email: customer.email,
        contact: customer.phone,
      },
      theme: { color: "#16233d" },
      handler: async (response: unknown) => {
        const r = response as {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        };
        try {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId, ...r }),
          });
          if (!verifyRes.ok) throw new Error("Payment verification failed.");
          clear();
          router.push(`/order-confirmation/${orderId}`);
        } catch {
          setError("Payment succeeded but verification failed. Please contact us on WhatsApp with your order ID.");
          setStatus("payment-pending");
        }
      },
    });

    rzp.on("payment.failed", () => {
      setError("Payment failed or was cancelled. You can try again below.");
      setStatus("payment-pending");
    });

    setStatus("payment-pending");
    rzp.open();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!canSubmit) {
      setError("Please fill in all required fields correctly.");
      return;
    }

    setStatus("submitting");
    try {
      const order = await createOrder();

      if (paymentMethod === "razorpay") {
        await startRazorpay(order.id);
        return;
      }

      if (paymentMethod === "whatsapp") {
        const itemLines = resolvedLines
          .map((l) => `• ${l.name} (${l.size}) x${l.quantity} — ${formatPrice(l.lineTotal)}`)
          .join("\n");
        const message = [
          `New order: #${order.id.slice(0, 8).toUpperCase()}`,
          "",
          itemLines,
          "",
          `Total: ${formatPrice(total)}`,
          "",
          `Name: ${customer.name}`,
          `Phone: ${customer.phone}`,
          `Address: ${customer.address}, ${customer.city}, ${customer.state} - ${customer.pincode}`,
        ].join("\n");
        window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
      }

      clear();
      router.push(`/order-confirmation/${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("idle");
    }
  }

  async function retryPayment() {
    if (!pendingOrder) return;
    setError(null);
    setStatus("submitting");
    await openRazorpayCheckout(pendingOrder.id, {
      razorpayOrderId: pendingOrder.razorpayOrderId,
      amount: pendingOrder.amount,
      currency: pendingOrder.currency,
      keyId: RAZORPAY_KEY_ID,
    });
  }

  if (!isReady || resolvedLines.length === 0) {
    return <div className="container-lg py-24 text-center text-navy/50">Loading checkout…</div>;
  }

  return (
    <div className="container-lg py-10 md:py-14">
      <h1 className="font-display text-3xl font-semibold text-navy">Checkout</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <form onSubmit={handleSubmit} className="space-y-8">
          <fieldset className="card space-y-4 p-6">
            <legend className="px-1 font-display text-lg font-semibold text-navy">
              Shipping Details
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-navy/80 sm:col-span-2">
                Full Name *
                <input
                  required
                  className="input mt-1.5"
                  value={customer.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />
              </label>
              <label className="text-sm font-medium text-navy/80">
                Email *
                <input
                  required
                  type="email"
                  className="input mt-1.5"
                  value={customer.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />
              </label>
              <label className="text-sm font-medium text-navy/80">
                Phone *
                <input
                  required
                  type="tel"
                  className="input mt-1.5"
                  value={customer.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="10-digit mobile number"
                />
              </label>
              <label className="text-sm font-medium text-navy/80 sm:col-span-2">
                Address *
                <input
                  required
                  className="input mt-1.5"
                  value={customer.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  placeholder="House no., street, locality"
                />
              </label>
              <label className="text-sm font-medium text-navy/80">
                City *
                <input
                  required
                  className="input mt-1.5"
                  value={customer.city}
                  onChange={(e) => updateField("city", e.target.value)}
                />
              </label>
              <label className="text-sm font-medium text-navy/80">
                State *
                <input
                  required
                  className="input mt-1.5"
                  value={customer.state}
                  onChange={(e) => updateField("state", e.target.value)}
                />
              </label>
              <label className="text-sm font-medium text-navy/80">
                Pincode *
                <input
                  required
                  className="input mt-1.5"
                  value={customer.pincode}
                  onChange={(e) => updateField("pincode", e.target.value.replace(/\D/g, ""))}
                  maxLength={6}
                  placeholder="6-digit PIN"
                />
              </label>
              <label className="text-sm font-medium text-navy/80 sm:col-span-2">
                Order Notes (optional)
                <textarea
                  className="input mt-1.5"
                  rows={2}
                  value={customer.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                />
              </label>
            </div>
          </fieldset>

          <fieldset className="card space-y-3 p-6">
            <legend className="px-1 font-display text-lg font-semibold text-navy">
              Payment Method
            </legend>
            {PAYMENT_OPTIONS.map((option) => (
              <label
                key={option.id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all duration-200 ease-out ${
                  option.disabled
                    ? "cursor-not-allowed border-line opacity-50"
                    : paymentMethod === option.id
                      ? "border-navy bg-cream scale-[1.01] shadow-sm"
                      : "border-line hover:border-gold hover:-translate-y-0.5"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  className="mt-1"
                  disabled={option.disabled}
                  checked={paymentMethod === option.id}
                  onChange={() => setPaymentMethod(option.id)}
                />
                <span>
                  <span className="block text-sm font-semibold text-navy">{option.title}</span>
                  <span className="block text-xs text-navy/60">{option.body}</span>
                </span>
              </label>
            ))}
          </fieldset>

          {error ? (
            <div className="animate-[fade-up_0.35s_cubic-bezier(0.16,1,0.3,1)_both] rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {status === "payment-pending" && pendingOrder ? (
            <button
              type="button"
              onClick={retryPayment}
              className="btn btn-gold btn-block animate-[fade-up_0.4s_cubic-bezier(0.16,1,0.3,1)_both]"
            >
              Retry Payment
            </button>
          ) : (
            <button
              type="submit"
              disabled={status === "submitting" || !canSubmit}
              className={`btn btn-primary btn-block ${status === "submitting" ? "animate-pulse" : ""}`}
            >
              {status === "submitting"
                ? "Placing Order…"
                : paymentMethod === "razorpay"
                  ? `Pay ${formatPrice(total)}`
                  : "Place Order"}
            </button>
          )}
        </form>

        <div className="card h-fit space-y-4 p-6">
          <h2 className="font-display text-lg font-semibold text-navy">Order Summary</h2>
          <ul className="space-y-3 text-sm">
            {resolvedLines.map((line) => (
              <li key={`${line.slug}-${line.size}`} className="flex justify-between gap-2 text-navy/70">
                <span>
                  {line.name} <span className="text-navy/40">({line.size} × {line.quantity})</span>
                </span>
                <span className="shrink-0 font-medium text-navy">{formatPrice(line.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <div className="space-y-2 border-t border-line pt-4 text-sm text-navy/70">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-navy">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-medium text-navy">
                {shipping === 0 ? "Free" : formatPrice(shipping)}
              </span>
            </div>
          </div>
          <div className="flex justify-between border-t border-line pt-4 text-base font-semibold text-navy">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
