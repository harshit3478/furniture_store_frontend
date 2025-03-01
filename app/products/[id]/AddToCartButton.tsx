// AddToCartButton.tsx
"use client";

import { useState } from "react";
import { useCart } from "@/lib/cartContext";
import { useRouter } from "next/navigation";
import { ProductType } from "@/types/product";

export default function AddToCartButton({ product }: { product: ProductType }) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    console.log("Adding to cart:", product);
    addToCart(product.id);
    setTimeout(() => {
      setIsAdding(false);
      router.push("/cart");
    }, 300);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding}
      className="w-full bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
    >
      {isAdding ? "Adding..." : "Add to Cart"}
    </button>
  );
}
