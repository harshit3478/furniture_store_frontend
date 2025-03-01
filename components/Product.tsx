"use client";

import { useState } from "react";
import { ProductType } from "@/types/product";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cartContext";
import { ShoppingCartIcon} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

interface ProductProps {
  product: ProductType;
}

export default function Product({ product }: ProductProps) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  // const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  const handleRedirect = () => {
    router.push(`/products/${product.id}`);
  };

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    try {
      console.log("Adding to cart:", product);
      addToCart(product.id);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error("Failed to add to cart" + error, { duration: 5000 });
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="relative">
      {/* Product Image */}
      <div className="w-full min-h-80  bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none cursor-pointer">
        <Image
          src={product.image}
          alt={product.name}
          className="w-full h-full object-center bg-red-300 object-cover cursor-pointer lg:w-full lg:h-full"
          width={300}
          height={300}
          onClick={handleRedirect}
        />
      </div>

      {/* Product Details */}
      <div className="mt-4 flex justify-between  bg-green-400 items-center">
        <div>
          <h3 className="text-sm text-gray-700 ">{product.name}</h3>
        </div>
        <p className="text-sm font-medium text-gray-900">
          ${product.price.toFixed(2)}
        </p>
      </div>

      {/* Buttons */}
      <div className="mt-2 flex justify-between items-center">
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className={`flex items-center space-x-1 px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            isAddingToCart ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <ShoppingCartIcon className="h-5 w-5" />
          <span>{isAddingToCart ? "Adding..." : "Add to Cart"}</span>
        </button>
      </div>
    </div>
  );
}
