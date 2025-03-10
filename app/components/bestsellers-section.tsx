"use client"

import { ProductCard } from "@/components/product-card"
import { useToast } from "@/components/ui/use-toast"
import type { ProductType } from "@/types/product"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

async function getBestSellers(): Promise<ProductType[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`, {
    cache: "no-store",
    next: { revalidate: 3600 }, // Optional: revalidate every hour
  })
  const result = await res.json()
  if (!res.ok) throw new Error("Failed to fetch similar products")
  return result.products
}

export function BestsellersSection() {
  const [products, setProducts] = useState<ProductType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function loadProducts() {
      try {
        const products = await getBestSellers()
        setProducts(products)
      } catch (err) {
        console.error(err)
        toast({
          title: "Error",
          description: "Failed to load similar products. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [toast])

  return (
    <section className="py-6 px-4 md:py-8 md:px-8 w-full">
      <div className="container px-0 mx-auto">
        <div className="mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold">Weekly Bestsellers</h2>
          <p className="text-sm text-muted-foreground">Checkout what&apos;s hot in the market!</p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => <ProductCardSkeleton key={index} />)
            : products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </section>
  )
}

function ProductCardSkeleton() {
  return (
    <div className="rounded-md overflow-hidden border border-gray-200">
      <Skeleton className="h-40 md:h-48 w-full" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-8 w-full mt-2" />
      </div>
    </div>
  )
}

