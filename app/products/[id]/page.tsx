"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import type { ProductType } from "@/types/product"
import { ProductImageGallery } from "./components/ProductImageGallery"
import { ProductDetails } from "./components/ProductDetails"
import { ProductSkeleton } from "./components/ProductSkeleton"
import { useToast } from "@/components/ui/use-toast"
import { Reviews } from "./components/Reviews"
import { SimilarProducts } from "./components/SimilarProduct"
import { Badge } from "@/components/ui/badge";

async function getProduct(id: string): Promise<ProductType> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${id}`, {
    cache: "no-store",
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error("Failed to fetch product")
  const data = await res.json()
  return data.product
}



export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<ProductType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()


  useEffect(() => {
    async function loadProduct() {
      try {
        if (typeof id !== "string") throw new Error("Invalid product ID")
        const productData = await getProduct(id)
        setProduct(productData)
      } catch (err) {
        console.error(err)
        setError("Failed to load product. Please try again later.")
        toast({
          title: "Error",
          description: "Failed to load product. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [id, toast])


  if (isLoading) return <ProductSkeleton />

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Oops! Something went wrong.
          </h1>
          <p className="mt-4 text-base text-gray-500">{error}</p>
          <div className="mt-6">
            <Link href="/" className="text-base font-medium text-indigo-600 hover:text-indigo-500">
              Go back home<span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-2 border-b">
        <nav className="flex items-center text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />
          <Link href="/bed-room" className="text-gray-500 hover:text-gray-700">
            Bed Room
          </Link>
          <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />
          <span className="text-gray-900">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProductImageGallery
            images={[product.heroImage, ...product.images]}
            name={product.name}
          />
          <ProductDetails product={product} />
        </div>

        {/* Product Description */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Product Description:</h2>
            <div className="text-gray-700 whitespace-pre-line">
              {product.description || "No description available for this product."}
            </div>

            <div className="mt-6">
              <h3 className="text-md font-medium mb-2">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags && product.tags.length > 0 ? (
                  product.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="px-2 py-1">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No tags</span>
                )}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Offers:</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((index) => (
                <div key={index} className="bg-purple-50 rounded-md p-4 flex items-center gap-4">
                  <div className="text-purple-700 font-semibold">Code10</div>
                  <div className="border-l border-purple-200 pl-4">
                    <p className="text-sm">Get 10% off upto ₹200</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <SimilarProducts />

        {/* Reviews Section */}
        <Reviews />

      </div>
    </div>
  )
}

