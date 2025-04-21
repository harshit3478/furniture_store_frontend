"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { CartItemType } from "@/types/product";

interface CartItemsListProps {
  cartItems: CartItemType[];
}

export function CartItemsList({ cartItems }: CartItemsListProps) {
  // Calculate delivery date based on delivery time (in days)
  const calculateDeliveryDate = (deliveryTime?: string) => {
    const days = parseInt(deliveryTime || "3");
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + days);

    // Format the date as "Day, Month Date"
    return deliveryDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
      <div className="space-y-4">
        {cartItems.map((item) => {
        
          return (
            <div key={item.id} className="flex border-b pb-4">
              <div className="flex-shrink-0 w-20 h-20 relative">
                <Link href={`/products/${item.product.id}`}>
                  <Image
                    src={item.product.heroImage || item.product.image || "/placeholder.svg"}
                    alt={item.product.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </Link>
              </div>
              <div className="ml-4 flex-1">
                <Link href={`/products/${item.product.id}`} className="hover:text-primary transition-colors">
                  <h3 className="font-medium">{item.product.name}</h3>
                </Link>
                <div className="flex justify-between mt-1">
                  <div>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-600">Duration: {item.duration} months</p>
                    <p className="text-sm text-gray-600">Delivered by: {calculateDeliveryDate(item.product.deliveryTime)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{item.pricePerMonth.toFixed(2)}/month</p>
                    <p className="text-sm text-gray-600">Total: ₹{(item.pricePerMonth * item.duration * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {cartItems.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Your cart is empty</p>
            <Link href="/" className="text-primary hover:underline mt-2 inline-block">
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}
