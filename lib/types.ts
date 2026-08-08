export interface Product {
  slug: string;
  name: string;
  price: number;
  description: string;
  verse?: string;
  sizes: string[];
  featured?: boolean;
  image: string;
}

export interface CartLine {
  slug: string;
  size: string;
  quantity: number;
}

export interface OrderItem {
  slug: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
}

export type PaymentMethod = "cod" | "whatsapp" | "razorpay";
export type PaymentStatus = "pending" | "awaiting_confirmation" | "paid";

export interface Order {
  id: string;
  createdAt: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: CustomerDetails;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
}
