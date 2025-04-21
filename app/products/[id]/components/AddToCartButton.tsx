"use client"

import { useEffect, useState } from "react"
import { useCart } from "@/lib/cartContext"
import { useRouter } from "next/navigation"
import type { ProductType } from "@/types/product"
import { ArrowRight, Loader, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"

interface AddToCartButtonProps {
  product: ProductType
  className?: string
  duration?: number
  isProductPage?: boolean
  quantity?: number
}

export default function AddToCartButton({ product, className = "" , duration = 3,quantity = 1, isProductPage = false}: AddToCartButtonProps) {
  const { addToCart, cart, localCart ,isLoading} = useCart()
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const [currentDuration, setCurrentDuration] = useState<number | undefined>(3)
  const [currentQuantity, setCurrentQuantity] = useState<number>(1)

  useEffect(() => {
    if (
      cart.find((item) => item.product.id === product.id) ||
      localCart.find((item) => item.product.id === product.id)
    ) {
      setIsAdded(true)
      const item = cart.find((item) => item.product.id === product.id) || localCart.find((item) => item.product.id === product.id)
      setCurrentDuration(item?.duration)
      setCurrentQuantity(item?.quantity || 1)
    }
  }, [cart, localCart, product.id])

  const handleAddToCart = () => {
    try {
      if(isAdded && !isProductPage) {
        router.push("/cart")
        return
      }
      
      if (isAdded && isProductPage && currentDuration === duration && currentQuantity === quantity) {
        router.push("/cart")
        return
      }
      setIsAdding(true)
      console.log("Adding to cart:", product)
      addToCart(product, quantity, duration)
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
      className={cn(
        "w-full bg-primary text-white py-1.5 px-2 flex justify-center gap-2 items-center rounded-md hover:bg-primary/80 disabled:opacity-50 text-sm",
        className
      )}
    >
      {isLoading ? (
        <Loader className="animate-spin h-4 w-4" />
      ) : isAdded ?
      isProductPage && (currentDuration !== duration || currentQuantity !== quantity) ? (
        <>
        <span>Update Cart</span>
        <ShoppingCart className="h-4 w-4" />
      </>
      ) :
      (
        <>
          <span>Go to Cart</span>
          <ArrowRight className="h-4 w-4" />
        </>
      ): (
        <>
          <span>Add to Cart</span>
          <ShoppingCart className="h-4 w-4" />
        </>
      )}
    </button>
  )
}

