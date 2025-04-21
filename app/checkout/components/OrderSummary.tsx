"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Coupon } from "@/types";
import { CartItemType } from "@/types/product";

interface OrderSummaryProps {
  cartItems: CartItemType[];
  total: number;
  gst: number;
  deliveryFee: number;
  appliedCoupon: Coupon | null;
  discountAmount: number;
  finalTotal: number;
  isProcessing: boolean;
  isAddressSelected: boolean; // Added new prop
  onCouponApplied?: (coupon: Coupon | null) => void;
  onPlaceOrder: () => void;
}

export function OrderSummary({
  cartItems,
  total,
  gst,
  deliveryFee,
  appliedCoupon,
  discountAmount,
  finalTotal,
  isProcessing,
  isAddressSelected, // Destructure the new prop
  onPlaceOrder,
}: OrderSummaryProps) {
  console.log("cart items :", cartItems);
  return (
    <Card className="p-6 sticky top-8">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total Rent ({cartItems.length} items)</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">GST (18%)</span>
          <span>₹{gst.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Delivery Fee</span>
          <span>₹{deliveryFee.toFixed(2)}</span>
        </div>

        {/* Show discount if coupon is applied */}
        {appliedCoupon && (
          <div className="flex justify-between text-green-600">
            <span className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              Discount ({appliedCoupon.code})
            </span>
            <span>-₹{discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="border-t pt-3 flex justify-between font-semibold">
          <span>Total Amount</span>
          <span>₹{finalTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Message when no address is selected */}
      {!isAddressSelected && (
        <p className="text-red-500 text-sm mt-2">Please select a delivery address to proceed.</p>
      )}

      <Button
        className="w-full mt-6 bg-primary hover:bg-primary/90 text-white py-3"
        onClick={onPlaceOrder}
        disabled={isProcessing || !isAddressSelected} // Updated disable condition
      >
        {isProcessing ? "Processing..." : `Place Order - ₹${finalTotal.toFixed(2)}`}
      </Button>

      <p className="mt-4 text-sm text-muted-foreground text-center">
        By placing your order, you agree to our Terms of Service and Privacy Policy
      </p>
    </Card>
  );
}