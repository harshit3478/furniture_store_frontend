"use client";

import { Card } from "@/components/ui/card";

export function PaymentInfo() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
      <div className="p-4 bg-purple-50 rounded-md">
        <div className="flex items-center">
          <img src="/razorpay-logo.png" alt="Razorpay" className="h-6 mr-2" />
          <p className="font-medium">Secure Payment via Razorpay</p>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          You&apos;ll be redirected to Razorpay&apos;s secure payment gateway to complete your purchase.
        </p>
        <p className="text-sm text-gray-600 mt-1">
          We accept Credit/Debit Cards, UPI, Netbanking, and Wallets.
        </p>
      </div>
    </Card>
  );
}
