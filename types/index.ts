import { ProductType } from './product';
import { Address } from './profile';

// Shipping information
export interface ShippingInfo {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  addressId?: string;
}

// Coupon types
export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  minOrderValue: number;
  maxDiscountAmount: number | null;
}

// Payment types
export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// Order types
export enum OrderStatus {
  PLACED = 'Placed',
  PROCESSING = 'Processing',
  SHIPPED = 'Shipped',
  OUT_FOR_DELIVERY = 'OutForDelivery',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
  RETURNED = 'Returned',
  PAYMENT_PENDING = 'PaymentPending',
  PAID = 'PAID',
  PAYMENT_FAILED = 'PAYMENT_FAILED'
}

export enum PaymentMethod {
  RAZORPAY = 'Razorpay',
  COD = 'COD',
  BANK_TRANSFER = 'BankTransfer'
}

export interface OrderItem {
  id: string;
  productId: string;
  product: ProductType;
  quantity: number;
  price: number;
  duration: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  amount: number;
  originalAmount?: number;
  discount?: number;
  couponCode?: string;
  duration: number;
  orderItems: OrderItem[];
  userId: string;
  deliveryAddressId?: string;
  deliveryAddress?: Address;
  paymentMethod: PaymentMethod;
  paymentId?: string;
  razorpayOrderId?: string;
  createdAt: string;
  updatedAt: string;
}

// Note: CartItemType is imported from product.ts
// We don't define CartItem here to avoid conflicts

// Form types
export interface FormError {
  field: string;
  message: string;
}
