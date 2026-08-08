import crypto from "crypto";
import { NextResponse } from "next/server";
import { getOrder, updateOrder } from "@/lib/orders";
import { isRazorpayConfigured } from "@/lib/razorpay";

export async function POST(request: Request) {
  if (!isRazorpayConfigured()) {
    return NextResponse.json({ error: "Razorpay is not configured." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body ?? {};

  if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing payment verification fields." }, { status: 400 });
  }

  const order = await getOrder(orderId);
  if (!order || order.razorpayOrderId !== razorpay_order_id) {
    return NextResponse.json({ error: "Order mismatch." }, { status: 400 });
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
  }

  const updated = await updateOrder(orderId, {
    paymentStatus: "paid",
    razorpayPaymentId: razorpay_payment_id,
  });

  return NextResponse.json({ order: updated });
}
