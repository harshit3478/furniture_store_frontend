"use client"

import { useWishlist } from "@/lib/wishlist-context"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"
import Link from "next/link"

export default function WishlistPage() {
  const { wishlist } = useWishlist()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Save items you love to your wishlist and review them anytime.</p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

