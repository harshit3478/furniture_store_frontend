"use client";

import { useCart } from "@/lib/cartContext";

import { useEffect, useState } from "react";
import { EmptyCart } from "./components/EmptyCart";
import { CartItem } from "./components/CartItem";
import { OrderSummary } from "./components/OrderSummary";

export default function Cart() {
  const { cart, localCart,  isLoading , error } = useCart();
  const [displayCart, setDisplayCart] = useState<any[]>([]);
  
  // Convert localCart to the same format as cart for guest users
  useEffect(() => {
    // If cart is empty but localCart has items, we're dealing with a guest user
    if (cart.length === 0 && localCart.length > 0) {
      // Create a display-friendly version of localCart
      console.log("localCart", localCart);
      
      setDisplayCart(localCart);
    } else {
      setDisplayCart(cart);
    }
  }, [cart, localCart]);

  // Calculate totals
  const total = displayCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const gst = total * 0.18; // Assuming 18% GST
  const deliveryFee = total > 0 ? 499 : 0;
  const grandTotal = total + gst + deliveryFee;

  if (displayCart.length === 0 && !isLoading && !error && localCart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Cart:</h1>
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* <Breadcrumb /> */}
      <h1 className="text-3xl font-bold mb-8">Cart:</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {displayCart.map((item) => (
            
            <CartItem
              key={item.id}
              item={item}
             
            />
          ))}
        </div>

        <div className="lg:col-span-1">
          <OrderSummary
            total={total}
            gst={gst}
            deliveryFee={deliveryFee}
            grandTotal={grandTotal}
          />
        </div>
      </div>
    </div>
  );
}