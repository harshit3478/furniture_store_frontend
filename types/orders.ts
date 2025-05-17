import { ProductType } from "./product";
import { Address } from "./profile";

// types.ts
export enum OrderStatus {
    Pending = "Pending",
    PaymentPending = "PaymentPending",
    Paid = "Paid",
    Processing = "Processing",
    Shipped = "Shipped",
    Delivered = "Delivered",
    Cancelled = "Cancelled",
    Returned = "Returned"
  }

  export enum PaymentStatus {
    Pending = "Pending",
    Completed = "Completed",
    Failed = "Failed",
    Refunded = "Refunded"
  }

  export enum PaymentMethod {
    Razorpay = "Razorpay",
    COD = "COD",
    BankTransfer = "BankTransfer"
  }


  export interface OrderItem {
    id: string;
    productId: string;
    quantity: number;
    pricePerUnit: number;
    duration: number;
    subtotal: number;
    status: string;
    deliveryDate?: string;
    returnDate?: string;
    vendorId?: string;
    product: ProductType;
  }


  export interface Order {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    createdAt: string;
    totalAmount: number;
    taxAmount: number;
    deliveryFee: number;
    discountAmount: number;
    finalAmount: number;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    paymentId?: string;
    deliveryAddressId: string;
    deliveryAddress: Address;
    orderItems: OrderItem[];
    userId: string;
  }

  export interface OrderSummary {
    id: string;
    orderNumber: string;
    status: string;
    createdAt: string;
    totalAmount: number;
    itemCount: number;
    mainProductImage: string;
    mainProductName: string;
    rentedFor: number;
    paymentStatus?: string;
    products?: Array<{
      id: string;
      name: string;
      image: string;
    }>;
  }