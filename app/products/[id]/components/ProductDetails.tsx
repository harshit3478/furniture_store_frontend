"use client"

import { useState, useEffect } from "react"
import { Star, StarHalf, Minus, Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ProductType } from "@/types/product"
import { WishlistButton } from "@/components/ui/wishlist-button"
import AddToCartButton from "./AddToCartButton"

interface ProductDetailsProps {
  product: ProductType
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1)
  const [months, setMonths] = useState(12) // Default to 12 months
  const [currentPrice, setCurrentPrice] = useState(0)

  // Calculate the current price based on the selected duration
  useEffect(() => {
    if (product.websitePrices) {
      if (months === 6) {
        setCurrentPrice(product.websitePrices.sixMonths || 0)
      } else if (months === 9) {
        setCurrentPrice(product.websitePrices.nineMonths || 0)
      } else if (months === 12) {
        setCurrentPrice(product.websitePrices.twelveMonths || 0)
      }
    } else if (product.price) {
      // Fallback to the old price field if websitePrices is not available
      setCurrentPrice(product.price)
    }
  }, [months, product])

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  // Calculate delivery date based on delivery time (in days)
  const calculateDeliveryDate = (deliveryTime?: string) => {
    const days = parseInt(deliveryTime || "3");
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + days);

    // Format the date as "Day, Month Date"
    return deliveryDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }

  return (
    <div>
      <div className="mb-4">
        {product.tags?.includes('premium') && (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 mb-2">
            Premium
          </Badge>
        )}
        {product.tags?.includes('featured') && (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 mb-2">
            Featured
          </Badge>
        )}
        <div className="flex *flex-col justify-between">
        <h1 className="text-3xl font-bold ">{product.name}</h1>
        <WishlistButton product={product} className="  bg-white/80 hover:bg-white"/>
        </div>
        

        <div className="flex items-center mt-2">
          <div className="flex text-amber-400">
            {[...Array(Math.floor(product.rating || 0))].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
            {(product.rating || 0) % 1 !== 0 && <StarHalf className="w-4 h-4 fill-current" />}
          </div>
          <span className="text-sm ml-2">{product.reviewCount || 0} reviews</span>
        </div>

        {/* <div className="flex flex-wrap gap-2 mt-3">
          <Badge variant="secondary">{product.category}</Badge>
          {product.subcategory && <Badge variant="secondary">{product.subcategory}</Badge>}
          <Badge variant="outline">{product.condition}</Badge>
        </div> */}
      </div>

      <div className="mb-6">
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-purple-800">₹{currentPrice}</span>
          <span className="text-gray-600 ml-1">/month</span>
        </div>

        <p className="text-sm text-gray-500 mt-1">
          Total for {months} months: ₹{(currentPrice * months).toLocaleString()}
        </p>

        <div className="mt-6">
          <p className="text-sm font-medium mb-3">Select rental duration:</p>

          <div className="grid grid-cols-3 gap-3">
            <div
              className={`border rounded-md p-3 cursor-pointer transition-all ${months === 6 ? 'border-purple-500 bg-purple-50' : 'hover:border-gray-400'}`}
              onClick={() => setMonths(6)}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">6 Months</span>
                {months === 6 && <Check className="h-4 w-4 text-purple-600" />}
              </div>
              <div className="text-lg font-bold">₹{product.websitePrices?.sixMonths || 0}<span className="text-sm font-normal text-gray-500">/mo</span></div>
              <p className="text-xs text-gray-500 mt-1">Best value for short-term</p>
            </div>

            <div
              className={`border rounded-md p-3 cursor-pointer transition-all ${months === 9 ? 'border-purple-500 bg-purple-50' : 'hover:border-gray-400'}`}
              onClick={() => setMonths(9)}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">9 Months</span>
                {months === 9 && <Check className="h-4 w-4 text-purple-600" />}
              </div>
              <div className="text-lg font-bold">₹{product.websitePrices?.nineMonths || 0}<span className="text-sm font-normal text-gray-500">/mo</span></div>
              <p className="text-xs text-gray-500 mt-1">Most popular choice</p>
            </div>

            <div
              className={`border rounded-md p-3 cursor-pointer transition-all ${months === 12 ? 'border-purple-500 bg-purple-50' : 'hover:border-gray-400'}`}
              onClick={() => setMonths(12)}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">12 Months</span>
                {months === 12 && <Check className="h-4 w-4 text-purple-600" />}
              </div>
              <div className="text-lg font-bold">₹{product.websitePrices?.twelveMonths || 0}<span className="text-sm font-normal text-gray-500">/mo</span></div>
              <p className="text-xs text-gray-500 mt-1">Best long-term value</p>
            </div>
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

      {/* Product Specifications */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="border rounded-md p-4">
          <h3 className="text-sm text-gray-500">Size:</h3>
          <p className="text-sm">{product.size || "Not specified"}</p>
        </div>
        <div className="border rounded-md p-4">
          <h3 className="text-sm text-gray-500">Material:</h3>
          <p className="text-sm">{product.material || "Not specified"}</p>
        </div>
        <div className="border rounded-md p-4">
          <h3 className="text-sm text-gray-500">Delivery Fee:</h3>
          <p className="text-sm">₹{product.deliveryFee || 0}</p>
        </div>
        <div className="border rounded-md p-4">
          <h3 className="text-sm text-gray-500">Delivered By:</h3>
          <p className="text-sm">{calculateDeliveryDate(product.deliveryTime)}</p>
        </div>
      </div>

      {/* Desktop Action Buttons */}
      <div className="hidden md:flex flex-col space-y-3">
        <AddToCartButton product={product} duration={months} isProductPage={true} quantity={quantity}/>
        <Button variant="outline" className="w-full">
          Rent Now
        </Button>
      </div>

      {/* Mobile Fixed Bottom Buttons */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 grid grid-cols-2 gap-0.5 bg-white border-t z-50">
        <AddToCartButton product={product} className="py-4 px-4 bg-primary text-white font-medium text-md rounded-none" duration={months} isProductPage={true} quantity={quantity}/>

        <button onClick={() => {}} className="py-4 px-4 bg-primary text-white font-medium text-md border-l">
          Rent Now
        </button>
      </div>

      {/* Mobile Bottom Padding */}
      <div className="h-16 md:hidden" />
    </div>
  )
}

