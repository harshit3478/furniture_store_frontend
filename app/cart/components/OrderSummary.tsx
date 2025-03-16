"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface OrderSummaryProps {
  total: number
  gst: number
  deliveryFee: number
  grandTotal: number
  selectedItemsCount: number
  isMobile?: boolean
}

export function OrderSummary({
  total,
  gst,
  deliveryFee,
  grandTotal,
  selectedItemsCount,
  isMobile = false,
}: OrderSummaryProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Total Rent:</h2>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Rent ({selectedItemsCount} items)</span>
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
          <div className="border-t pt-3 flex justify-between font-semibold">
            <span>Total Amount</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        <div className="bg-purple-50 rounded-lg p-4">
          <h3 className="font-medium text-primary mb-2">Coupons Available!</h3>
          <p className="text-sm text-primary">Apply coupons to get additional discounts</p>
        </div>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Delivery Estimate</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="Enter your delivery address" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode</Label>
              <Input id="pincode" placeholder="Enter pincode" />
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              Get it delivered by <span className="text-primary font-medium">10 March</span>
            </div>
          </div>
        </Card>

        <Button
          className="w-full bg-primary hover:bg-primary/90 text-white py-3"
          disabled={selectedItemsCount === 0}
        >
          {isMobile ? "Proceed to pay ₹" + grandTotal.toFixed(2) : "Proceed with the purchase"}
        </Button>
      </div>
    </div>
  )
}

