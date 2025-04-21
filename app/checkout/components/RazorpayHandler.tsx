"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { RazorpayResponse, ShippingInfo } from "@/types";

interface RazorpayHandlerProps {
  orderId: string | null;
  finalTotal: number;
  shippingInfo: ShippingInfo;
  userEmail: string;
  couponCode?: string;
  token: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function RazorpayHandler({
  orderId,
  finalTotal,
  shippingInfo,
  userEmail,
  couponCode,
  token,
}: RazorpayHandlerProps) {
  const router = useRouter();
  const razorpayInitialized = useRef(false);

  useEffect(() => {
    if (!orderId || razorpayInitialized.current) return;
    
    const initializeRazorpay = async () => {
      if (typeof window === 'undefined' || !window.Razorpay) {
        toast.error("Razorpay SDK failed to load");
        return;
      }
      
      try {
        // Fetch Razorpay order ID from backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments/create-order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            orderId: orderId
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create Razorpay order');
        }
        
        const data = await response.json();
        const razorpayOrderId = data.razorpayOrderId;
        
        if (!razorpayOrderId) {
          toast.error("Failed to get payment details");
          return;
        }
        
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use environment variable
          amount: finalTotal * 100, // Amount is in currency subunits
          currency: "INR",
          name: "The Furniture Project",
          description: "Furniture Rental Payment",
          order_id: razorpayOrderId,
          handler: function (response: RazorpayResponse) {
            handlePaymentSuccess(response, razorpayOrderId);
          },
          prefill: {
            name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
            email: userEmail || "",
            contact: shippingInfo.phone
          },
          notes: {
            address: shippingInfo.address,
            coupon: couponCode || "",
            orderId: orderId // Store our internal order ID in notes
          },
          theme: {
            color: "#6b21a8" // Purple color to match the theme
          },
          modal: {
            ondismiss: function() {
              toast.error("Payment cancelled. You can try again from your orders page.");
              router.push(`/payment-status?orderId=${orderId}&status=cancelled`);
            }
          }
        };
        
        const razorpay = new window.Razorpay(options);
        razorpay.on('payment.failed', function (response: any) {
          toast.error("Payment failed. Please try again.");
          router.push(`/payment-status?orderId=${orderId}&status=failed&error=${response.error.description}`);
        });
        
        razorpay.open();
        razorpayInitialized.current = true;
      } catch (error) {
        console.error('Error initializing Razorpay:', error);
        toast.error('Failed to initialize payment. Please try again.');
        router.push(`/payment-status?orderId=${orderId}&status=error`);
      }
    };
    
    initializeRazorpay();
  }, [orderId, finalTotal, shippingInfo, userEmail, couponCode, token, router]);
  
  const handlePaymentSuccess = async (paymentResponse: RazorpayResponse, razorpayOrderId: string) => {
    try {
      // First verify the payment on our server
      const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId: orderId,
          razorpayOrderId: razorpayOrderId,
          razorpayPaymentId: paymentResponse.razorpay_payment_id,
          razorpaySignature: paymentResponse.razorpay_signature
        })
      });
      
      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        throw new Error(errorData.error || 'Payment verification failed');
      }
      
      const verificationData = await verifyResponse.json();
      
      if (verificationData.success) {
        toast.success("Payment successful!");
        router.push(`/payment-status?orderId=${orderId}&status=success&razorpay_payment_id=${paymentResponse.razorpay_payment_id}`);
      } else {
        throw new Error('Payment could not be verified');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast.error('Payment verification failed. Please check your order status in your profile.');
      router.push(`/payment-status?orderId=${orderId}&status=verification-failed`);
    }
  };
  
  return null; // This component doesn't render anything
}