"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Star } from "lucide-react"

import AddToCartButton from "@/app/products/[id]/components/AddToCartButton"
import { WishlistButton } from "./ui/wishlist-button"
import type { ProductType } from "@/types/product"

interface ProductCardProps {
  product: ProductType
}

export function ProductCard({ product }: ProductCardProps) {
  // Use the 12-month price as the default display price
  const displayPrice = product.websitePrices?.twelveMonths || product.price || 0;
  const originalPrice = Math.round(displayPrice * 1.2); // For display purposes

  return (
    <Card className={cn("overflow-hidden shadow-sm border border-gray-200 h-full")}>
      <div className="relative">
        {product.tags?.includes('premium') && (
          <Badge className="absolute top-2 left-2 bg-amber-500 hover:bg-amber-600 text-white font-medium px-2 py-1 rounded-sm">
            Premium
          </Badge>
        )}

        <WishlistButton product={product} className="absolute top-2 right-2 bg-white/80 hover:bg-white" />

        <Link href={`/products/${product.id}`} className="block overflow-hidden">
          <Image
            src={product.heroImage || product.image || "/placeholder.svg"}
            alt={product.name}
            width={250}
            height={250}
            className="w-full h-40 md:h-48 object-cover"
          />
        </Link>
      </div>
      <CardContent className="p-3">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
          <div className="flex items-center text-amber-500 ml-1">
            <Star className="h-3 w-3 fill-current" />
            <span className="text-xs ml-0.5">{product.rating || 0}</span>
          </div>
        </div>

        <div className="text-xs text-gray-500 mb-2">{product.category}{product.subcategory ? ` - ${product.subcategory}` : ''}</div>

        <div className="flex items-baseline mt-1 mb-3">
          <span className="text-sm font-semibold">₹{displayPrice}</span>
          <span className="text-xs text-gray-500 ml-1">/month</span>
          <span className="text-xs text-gray-400 line-through ml-2">₹{originalPrice}/month</span>
        </div>

        <AddToCartButton product={product} duration={12} />
      </CardContent>
    </Card>
  )
}

