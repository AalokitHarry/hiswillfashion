import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getProductBySlug } from "@/data/products";
import { saveOrder } from "@/lib/orders";
import { SITE } from "@/lib/site";
import type { CartLine, CustomerDetails, Order, OrderItem, PaymentMethod } from "@/lib/types";

interface CreateOrderBody {
  items: CartLine[];
  customer: CustomerDetails;
  paymentMethod: PaymentMethod;
}

const REQUIRED_CUSTOMER_FIELDS: (keyof CustomerDetails)[] = [
  "name",
  "email",
  "phone",
  "address",
  "city",
  "state",
  "pincode",
];

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(request: Request) {
  let body: CreateOrderBody;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body.");
  }

  const { items, customer, paymentMethod } = body ?? {};

  if (!Array.isArray(items) || items.length === 0) {
    return badRequest("Cart is empty.");
  }
  if (!customer || typeof customer !== "object") {
    return badRequest("Missing customer details.");
  }
  for (const field of REQUIRED_CUSTOMER_FIELDS) {
    if (!customer[field] || typeof customer[field] !== "string" || !customer[field].trim()) {
      return badRequest(`Missing required field: ${field}`);
    }
  }
  if (!/^\d{6}$/.test(customer.pincode.trim())) {
    return badRequest("Pincode must be 6 digits.");
  }
  if (!/^\d{10}$/.test(customer.phone.replace(/\D/g, "").slice(-10))) {
    return badRequest("Please provide a valid 10-digit phone number.");
  }
  if (!["cod", "whatsapp", "razorpay"].includes(paymentMethod)) {
    return badRequest("Invalid payment method.");
  }

  const orderItems: OrderItem[] = [];
  for (const line of items) {
    const product = getProductBySlug(line.slug);
    if (!product) return badRequest(`Unknown product: ${line.slug}`);
    if (!product.sizes.includes(line.size)) {
      return badRequest(`Invalid size "${line.size}" for ${product.name}.`);
    }
    const quantity = Number(line.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      return badRequest(`Invalid quantity for ${product.name}.`);
    }
    orderItems.push({
      slug: product.slug,
      name: product.name,
      size: line.size,
      price: product.price,
      quantity,
    });
  }

  const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal >= SITE.freeShippingThreshold ? 0 : SITE.shippingFee;
  const total = subtotal + shipping;

  const order: Order = {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    items: orderItems,
    subtotal,
    shipping,
    total,
    customer: {
      name: customer.name.trim(),
      email: customer.email.trim(),
      phone: customer.phone.trim(),
      address: customer.address.trim(),
      city: customer.city.trim(),
      state: customer.state.trim(),
      pincode: customer.pincode.trim(),
      notes: customer.notes?.trim() || undefined,
    },
    paymentMethod,
    paymentStatus: paymentMethod === "whatsapp" ? "awaiting_confirmation" : "pending",
  };

  await saveOrder(order);

  return NextResponse.json({ order }, { status: 201 });
}
