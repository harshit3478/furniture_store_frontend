"use client"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWishlist } from "@/lib/wishlist-context"
import { cn } from "@/lib/utils"
import type { ProductType } from "@/types/product"

interface WishlistButtonProps {
  product: ProductType
  className?: string
  variant?: "default" | "outline" | "ghost"
  size?: "icon" | "sm" | "default" | "lg"
}

export function WishlistButton({ product, className, variant = "ghost", size = "icon" }: WishlistButtonProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const inWishlist = isInWishlist(product.id)

  const toggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(className)}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleWishlist()
      }}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className={cn("h-5 w-5 transition-colors", inWishlist ? "fill-red-500 text-red-500" : "fill-none")} />
    </Button>
  )
}

