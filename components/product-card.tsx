"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

import AddToCartButton from "@/app/products/[id]/components/AddToCartButton"
import { WishlistButton } from "./ui/wishlist-button"
import type { ProductType } from "@/types/product"

interface ProductCardProps {
  product: ProductType
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className={cn("overflow-hidden shadow-sm border border-gray-200 h-full")}>
      <div className="relative">
        {product.discount && (
          <Badge className="absolute top-2 left-2 bg-amber-500 hover:bg-amber-600 text-white font-medium px-2 py-1 rounded-sm">
            30% off
          </Badge>
        )}

        <WishlistButton product={product} className="absolute top-2 right-2 bg-white/80 hover:bg-white" />

        <Link href={`/products/${product.id}`} className="block overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={250}
            height={250}
            className="w-full h-40 md:h-48 object-cover"
          />
        </Link>
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium text-sm">{product.name}</h3>
        <div className="flex items-baseline mt-1 mb-3">
          <span className="text-sm font-semibold">₹{product.price}</span>
          <span className="text-xs text-gray-500 ml-1">/month</span>
          <span className="text-xs text-gray-400 line-through ml-2">₹{Math.round(product.price * 1.2)}/month</span>
        </div>
        <AddToCartButton product={product} />
      </CardContent>
    </Card>
  )
}

