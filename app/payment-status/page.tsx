"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { useCart } from "@/lib/cartContext";

enum PaymentStatus {
  SUCCESS = "success",
  FAILURE = "failure",
  PENDING = "pending",
}

// Create a client component that uses useSearchParams
function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const {  token } = useAuth();
  const { clearCart } = useCart();

  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        setIsLoading(true);

        // Get parameters from URL
        const paymentId = searchParams.get("razorpay_payment_id");
        const razorpayOrderId = searchParams.get("razorpay_order_id");
        const razorpaySignature = searchParams.get("razorpay_signature");
        const orderIdParam = searchParams.get("orderId");
        const statusParam = searchParams.get("status");

        if (orderIdParam) {
          setOrderId(orderIdParam);
        }

        // If we have all Razorpay parameters, verify the payment
        if (paymentId && razorpayOrderId && razorpaySignature && orderIdParam) {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              orderId: orderIdParam,
              razorpay_payment_id: paymentId,
              razorpay_order_id: razorpayOrderId,
              razorpay_signature: razorpaySignature,
            }),
          });

          const data = await response.json();

          if (response.ok) {
            setStatus(PaymentStatus.SUCCESS);
            setOrderDetails(data.order);
            if (data.success) {
              // Clear the cart on successful payment
              // clearCart();
            }
          } else {
            setStatus(PaymentStatus.FAILURE);
            setError(data.error || "Payment verification failed");
          }
        } else if (statusParam) {
          // If we have a status parameter, use it
          if (statusParam === "success") {
            setStatus(PaymentStatus.SUCCESS);
            // Clear cart on success status
            // clearCart();
          } else if (statusParam === "failure") {
            setStatus(PaymentStatus.FAILURE);
          } else {
            setStatus(PaymentStatus.PENDING);
          }

          // Fetch order details if we have an order ID
          if (orderIdParam) {
            try {
              const orderResponse = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${orderIdParam}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (orderResponse.ok) {
                const orderData = await orderResponse.json();
                setOrderDetails(orderData.order);
              }
            } catch (orderError) {
              console.error("Error fetching order details:", orderError);
            }
          }
        } else {
          // No parameters, show error
          setStatus(PaymentStatus.FAILURE);
          setError("Invalid payment status URL");
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        setStatus(PaymentStatus.FAILURE);
        setError("An error occurred while verifying your payment");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentStatus();
  }, [searchParams, token, clearCart]);

  // Format date for better readability
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="max-w-3xl mx-auto p-8">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <h2 className="text-xl font-semibold mb-2">Verifying Payment</h2>
          <p className="text-gray-500">
            Please wait while we verify your payment...
          </p>
        </div>
      ) : status === PaymentStatus.SUCCESS ? (
        <div className="flex flex-col items-center text-center">
          <div className="bg-green-100 p-4 rounded-full mb-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Your order has been placed successfully.
          </p>

          {orderDetails && (
            <div className="w-full bg-gray-50 p-4 rounded-md mb-6 text-left">
              <h3 className="font-semibold text-lg mb-4 text-center">Order Details</h3>
              
              <div className="grid grid-cols-2 gap-2 text-sm mb-4 border-b pb-4">
                <div className="text-gray-500">Order Number:</div>
                <div className="text-right font-medium">{orderDetails.orderNumber}</div>
                <div className="text-gray-500">Order Date:</div>
                <div className="text-right font-medium">
                  {formatDate(orderDetails.createdAt)}
                </div>
                <div className="text-gray-500">Status:</div>
                <div className="text-right font-medium">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    {orderDetails.status}
                  </span>
                </div>
              </div>
              
              <h4 className="font-medium mb-2 text-sm uppercase text-gray-500">Items</h4>
              {orderDetails.orderItems?.map((item: any, index: number) => (
                <div key={item.id || index} className="border-b pb-3 mb-3">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.product?.name || 'Product'}</span>
                    <span>₹{item.subtotal?.toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-gray-500 flex justify-between mt-1">
                    <span>Qty: {item.quantity} × ₹{item.pricePerUnit?.toFixed(2)}</span>
                    {item.duration && (
                      <span>Duration: {item.duration} {item.duration === 1 ? 'month' : 'months'}</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Status: <span className="font-medium">{item.status}</span>
                  </div>
                </div>
              ))}
              
              <div className="mt-4 border-t pt-3">
                <h4 className="font-medium mb-2 text-sm uppercase text-gray-500">Payment Summary</h4>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <div className="text-gray-500">Subtotal:</div>
                  <div className="text-right">₹{orderDetails.totalAmount?.toFixed(2)}</div>
                  
                  {orderDetails.discountAmount > 0 && (
                    <>
                      <div className="text-gray-500">Discount:</div>
                      <div className="text-right text-green-600">-₹{orderDetails.discountAmount?.toFixed(2)}</div>
                    </>
                  )}
                  
                  <div className="text-gray-500">Delivery Fee:</div>
                  <div className="text-right">₹{orderDetails.deliveryFee?.toFixed(2)}</div>
                  
                  <div className="text-gray-500">Tax:</div>
                  <div className="text-right">₹{orderDetails.taxAmount?.toFixed(2)}</div>
                  
                  <div className="text-gray-800 font-semibold border-t pt-1 mt-1">Total:</div>
                  <div className="text-right font-semibold border-t pt-1 mt-1">₹{orderDetails.finalAmount?.toFixed(2)}</div>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t">
                <h4 className="font-medium mb-2 text-sm uppercase text-gray-500">Payment Information</h4>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <div className="text-gray-500">Payment Method:</div>
                  <div className="text-right">{orderDetails.paymentMethod}</div>
                  <div className="text-gray-500">Payment ID:</div>
                  <div className="text-right text-xs">{orderDetails.paymentId}</div>
                  <div className="text-gray-500">Payment Status:</div>
                  <div className="text-right">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      {orderDetails.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Button asChild className="flex-1">
              <Link href={`/profile/orders${orderId ? `/${orderId}` : ""}`}>
                View Order Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      ) : status === PaymentStatus.FAILURE ? (
        <div className="flex flex-col items-center text-center">
          <div className="bg-red-100 p-4 rounded-full mb-4">
            <XCircle className="h-16 w-16 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
          <p className="text-gray-600 mb-6">
            {error || "Your payment could not be processed."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Button asChild className="flex-1">
              <Link href="/cart">Try Again</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center">
          <div className="bg-yellow-100 p-4 rounded-full mb-4">
            <Loader2 className="h-16 w-16 text-yellow-600 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Payment Pending</h1>
          <p className="text-gray-600 mb-6">
            Your payment is being processed. Please wait...
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Button asChild className="flex-1">
              <Link href="/profile/orders">View Orders</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

// Loading fallback component
function PaymentStatusLoading() {
  return (
    <Card className="max-w-3xl mx-auto p-8">
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <h2 className="text-xl font-semibold mb-2">Loading payment details...</h2>
        <p className="text-gray-500">Please wait a moment.</p>
      </div>
    </Card>
  );
}

// Main page component with Suspense boundary
export default function PaymentStatusPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-8">
        <Suspense fallback={<PaymentStatusLoading />}>
          <PaymentStatusContent />
        </Suspense>
      </main>
    </div>
  );
}
