"use client"

import { useState } from "react"
import { Star, StarHalf, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import type { ProductType } from "@/types/product"
import AddToCartButton from "./AddToCartButton"

interface ProductDetailsProps {
  product: ProductType
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1)
  const [months, setMonths] = useState(3)

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  return (
    <div>
      <div className="mb-4">
        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 mb-2">
          Best Seller
        </Badge>
        <h1 className="text-3xl font-bold">{product.name}</h1>

        <div className="flex items-center mt-2">
          <div className="flex text-amber-400">
            {[...Array(Math.floor(product.rating))].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
            {product.rating % 1 !== 0 && <StarHalf className="w-4 h-4 fill-current" />}
          </div>
          <span className="text-sm ml-2">{product.reviews} reviews</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-purple-800">₹{product.price}</span>
          <span className="text-gray-600 ml-1">/month</span>
        </div>

        <div className="mt-4">
          <p className="text-sm mb-2">How many months would you like to rent this?</p>
          <Slider
            defaultValue={[3]}
            max={12}
            min={1}
            step={1}
            onValueChange={(value) => setMonths(value[0])}
            className="max-w-md"
          />
          <div className="flex justify-end mt-1 text-sm text-gray-600">
            <span>{months} Months</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center">
          <Button variant="outline" size="icon" onClick={decreaseQuantity} className="h-8 w-8 rounded-l-md">
            <Minus className="h-4 w-4" />
          </Button>
          <div className="h-8 w-12 flex items-center justify-center border-y">{quantity}</div>
          <Button variant="outline" size="icon" onClick={increaseQuantity} className="h-8 w-8 rounded-r-md">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm">Quantity</span>
      </div>

      {/* Desktop Action Buttons */}
      <div className="hidden md:flex flex-col space-y-3">
        <AddToCartButton product={product}  duration={months}/>
        <Button variant="outline" className="w-full">
          Rent Now
        </Button>
      </div>

      {/* Mobile Fixed Bottom Buttons */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 grid grid-cols-2 gap-0.5 bg-white border-t z-50">
        <AddToCartButton product={product}  className="py-4 px-4 bg-primary text-white font-medium text-md rounded-none" duration={months}/>
        
        <button onClick={() => {}} className="py-4 px-4 bg-primary text-white font-medium text-md border-l">
          Rent Now
        </button>
      </div>

      {/* Mobile Bottom Padding */}
      <div className="h-16 md:hidden" />
    </div>
  )
}

