"use client"

import { useEffect, useState } from "react"
import { useCart } from "@/lib/cartContext"
import { useRouter } from "next/navigation"
import type { ProductType } from "@/types/product"
import { ArrowRight, Loader, ShoppingCart } from "lucide-react"

export default function AddToCartButton({ product }: { product: ProductType }) {
  const { addToCart, cart, localCart } = useCart()
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  useEffect(() => {
    if (
      cart.find((item) => item.product.id === product.id) ||
      localCart.find((item) => item.product.id === product.id)
    ) {
      setIsAdded(true)
    }
  }, [cart, localCart, product.id])

  const handleAddToCart = () => {
    try {
      if (isAdded) {
        router.push("/cart")
        return
      }
      setIsAdding(true)
      console.log("Adding to cart:", product)
      addToCart(product, 1)
      setIsAdded(true)
    } catch (error) {
      console.error("Failed to add item to cart", error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding}
      className="w-full bg-black text-white py-1.5 px-2 flex justify-center gap-2 items-center rounded-md hover:bg-gray-800 disabled:opacity-50 text-sm"
    >
      {isAdding ? (
        <Loader className="animate-spin h-4 w-4" />
      ) : isAdded ? (
        <>
          <span>Go to Cart</span>
          <ArrowRight className="h-4 w-4" />
        </>
      ) : (
        <>
          <span>Add to Cart</span>
          <ShoppingCart className="h-4 w-4" />
        </>
      )}
    </button>
  )
}

