"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/authContext"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { Loader2, CheckCircle, XCircle, Tag } from "lucide-react"
import { useCoupons, type Coupon } from "@/lib/couponContext"

interface CouponType {
  id: string;
  code: string;
  description: string;
  discountType: string;
  discountValue: number;
  discountAmount: number;
  minOrderValue: number;
  maxDiscountAmount: number | null;
}

interface OrderSummaryProps {
  total: number
  gst: number
  deliveryFee: number
  grandTotal: number
  selectedItemsCount: number
  isMobile?: boolean
  onCouponApplied?: (coupon: CouponType | null) => void;
}

export function OrderSummary({
  total,
  gst,
  deliveryFee,
  grandTotal,
  selectedItemsCount,
  isMobile = false,
  onCouponApplied,
}: OrderSummaryProps) {
  const {token, user } = useAuth()
  const router = useRouter()
  const { 
    getCouponByCode, 
    calculateDiscount, 
    isCouponValid, 
    getValidCouponsForOrder,
    loading: couponsLoading 
  } = useCoupons()
  
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)
  const [couponError, setCouponError] = useState('')
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)
  const [isProcessingOrder, setIsProcessingOrder] = useState(false)

  // Calculate discount amount using context method
  const discountAmount = appliedCoupon ? calculateDiscount(appliedCoupon, total) : 0

  // Calculate final total after discount
  const finalTotal = grandTotal - discountAmount

  // Get valid coupons for current order
  const validCoupons = getValidCouponsForOrder(total).slice(0, 3) // Show top 3 valid coupons

  // Apply coupon using context
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code')
      return
    }

    setIsValidatingCoupon(true)
    setCouponError('')

    try {
      // Find coupon using context
      const coupon = getCouponByCode(couponCode)
      
      if (!coupon) {
        setCouponError('Invalid coupon code')
        setAppliedCoupon(null)
        if (onCouponApplied) onCouponApplied(null)
        return
      }

      // Validate coupon using context
      const validation = isCouponValid(coupon, total)
      
      if (!validation.valid) {
        setCouponError(validation.reason || 'Invalid coupon')
        setAppliedCoupon(null)
        if (onCouponApplied) onCouponApplied(null)
        return
      }

      // Calculate discount
      const discount = calculateDiscount(coupon, total)
      
      // Create coupon object for callback compatibility
      const couponForCallback: CouponType = {
        id: coupon.id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: discount,
        minOrderValue: coupon.minOrderValue,
        maxDiscountAmount: coupon.maxDiscountAmount,
      }

      setAppliedCoupon(coupon)
      if (onCouponApplied) onCouponApplied(couponForCallback)
      toast.success(`Coupon applied! You saved ₹${discount.toFixed(2)}`)
    } catch (error) {
      console.error('Error validating coupon:', error)
      setCouponError('Failed to validate coupon')
      setAppliedCoupon(null)
      if (onCouponApplied) onCouponApplied(null)
    } finally {
      setIsValidatingCoupon(false)
    }
  }

  // Remove coupon
  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
    setCouponError('')
    if (onCouponApplied) onCouponApplied(null)
    toast.success('Coupon removed')
  }

  // Apply coupon by clicking on suggestion
  const applySuggestedCoupon = (coupon: Coupon) => {
    setCouponCode(coupon.code)
    setCouponError('')
    
    // Auto-apply the coupon
    const discount = calculateDiscount(coupon, total)
    const couponForCallback: CouponType = {
      id: coupon.id,
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount: discount,
      minOrderValue: coupon.minOrderValue,
      maxDiscountAmount: coupon.maxDiscountAmount,
    }

    setAppliedCoupon(coupon)
    if (onCouponApplied) onCouponApplied(couponForCallback)
    toast.success(`Coupon ${coupon.code} applied! You saved ₹${discount.toFixed(2)}`)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-gilroySemibold mb-4">Total Rent:</h2>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Rent ({selectedItemsCount} items)</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">GST (0%)</span>
            <span>₹{gst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span>₹{deliveryFee.toFixed(2)}</span>
          </div>

          {appliedCoupon && discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                Discount ({appliedCoupon.code})
              </span>
              <span>-₹{discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="border-t pt-3 flex justify-between font-gilroySemibold">
            <span>Total Amount</span>
            <span>₹{finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </Card>

      <Button
        className="w-full font-gilroyMedium text-base bg-primary hover:bg-primary/90 text-white py-3"
        disabled={selectedItemsCount === 0 || isProcessingOrder}
        onClick={async () => {
          if (!user) {
            // Save the current URL to localStorage to redirect back after login
            localStorage.setItem('redirectAfterLogin', '/cart')
            toast.success("Please login to continue with your purchase")
            router.push('/login')
          } else {
            // User is logged in, proceed to checkout with selected items
            if (selectedItemsCount > 0) {
              // Get selected cart item IDs from localStorage
              const selectedItemIds = JSON.parse(localStorage.getItem('selectedCartItems') || '[]')

              if (selectedItemIds.length === 0) {
                toast.error("Please select at least one item to proceed")
                return
              }

              try {
                setIsProcessingOrder(true)
                // Validate the order first
                // convert cartitem ids to number
                selectedItemIds.forEach((id: string, index: number) => {
                  selectedItemIds[index] = parseInt(id)
                })
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/validate`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({
                    cartItemIds: selectedItemIds,
                    couponCode: appliedCoupon?.code || ''
                  })
                })

                const data = await response.json()

                if (!response.ok) {
                  toast.error(data.error || 'Failed to validate order')
                  return
                }

                // Store order summary in localStorage for checkout page
                localStorage.setItem('orderSummary', JSON.stringify(data.orderSummary))
      

                // Navigate to checkout
                router.push('/checkout')
              } catch (error) {
                console.error('Error validating order:', error)
                toast.error('Failed to proceed to checkout. Please try again.')
              } finally {
                setIsProcessingOrder(false)
              }
            } else {
              toast.error("Please select at least one item to proceed")
            }
          }
        }}
      >
        {isProcessingOrder ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            <span>Processing...</span>
          </div>
        ) : (
          isMobile ? "Proceed to pay ₹" + finalTotal.toFixed(2) : "Proceed with the purchase"
        )}
      </Button>
      
      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="font-gilroySemibold mb-4">Apply Coupon</h3>

          {appliedCoupon ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-green-50 p-3 rounded-md border border-green-200">
                <div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="font-gilroyMedium">{appliedCoupon.code}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{appliedCoupon.description}</p>
                  <p className="text-sm text-green-600 mt-1">Saved ₹{discountAmount.toFixed(2)}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={removeCoupon} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    id="couponCode"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="uppercase"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        applyCoupon()
                      }
                    }}
                  />
                </div>
                <Button
                  onClick={applyCoupon}
                  disabled={isValidatingCoupon || !couponCode.trim() || couponsLoading}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isValidatingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
                </Button>
              </div>

              {couponError && (
                <div className="flex items-center text-red-500 text-sm">
                  <XCircle className="h-4 w-4 mr-1" />
                  {couponError}
                </div>
              )}

              {/* Dynamic Available Coupons */}
              {!couponsLoading && validCoupons.length > 0 && (
                <div className="bg-purple-50 rounded-lg p-3">
                  <h4 className="font-gilroyMedium text-primary text-sm mb-2 flex items-center">
                    <Tag className="h-4 w-4 mr-1" />
                    Available Coupons for You
                  </h4>
                  <div className="space-y-2">
                    {validCoupons.map((coupon) => {
                      const discount = calculateDiscount(coupon, total)
                      const discountText = coupon.discountType === 'percentage' 
                        ? `${coupon.discountValue}% off` 
                        : `₹${coupon.discountValue} off`
                      
                      return (
                        <div 
                          key={coupon.id}
                          className="flex items-center justify-between bg-white p-2 rounded border cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => applySuggestedCoupon(coupon)}
                        >
                          <div>
                            <p className="text-xs font-gilroyMedium text-primary">
                              {coupon.code}: {discountText}
                            </p>
                            <p className="text-xs text-gray-600">{coupon.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-green-600 font-gilroyMedium">
                              Save ₹{discount.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Click on any coupon to apply</p>
                </div>
              )}

              {couponsLoading && (
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-sm text-primary">Loading available coupons...</span>
                  </div>
                </div>
              )}

              {!couponsLoading && validCoupons.length === 0 && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 text-center">
                    No coupons available for your current order value
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}