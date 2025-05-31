"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/authContext"
import { toast } from "react-hot-toast"
import { Navbar } from "@/components/navbar/navbar"
import { Footer } from "@/components/footer/Footer"
import Script from "next/script"

// Import components
import { AddressSelector } from "./components/AddressSelector"
import { PaymentInfo } from "./components/PaymentInfo"
import { OrderSummary } from "./components/OrderSummary"
import { CartItemsList } from "./components/CartItemsList"
import { RazorpayHandler } from "./components/RazorpayHandler"

// Import types
import { Coupon, ShippingInfo } from "@/types"
import { CartItemType } from "@/types/product"
import { Address } from "@/types/profile"

// Declare Razorpay on window object
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [displayCart, setDisplayCart] = useState<Array<CartItemType>>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: ""
  })
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)

  // Initialize price variables
  const [total, setTotal] = useState(0)
  const [gst, setGst] = useState(0)
  const [deliveryFee, setDeliveryFee] = useState(0)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [grandTotal, setGrandTotal] = useState(0)
  const [finalTotal, setFinalTotal] = useState(0)

  // Update shipping info from selected address
  const updateShippingInfoFromAddress = useCallback((address: Address) => {
    const nameParts = address.fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    setShippingInfo({
      firstName,
      lastName,
      address: `${address.addressLine1}${address.addressLine2 ? ', ' + address.addressLine2 : ''}${address.landmark ? ', ' + address.landmark : ''}`,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      phone: address.phoneNumber,
      addressId: address.id
    });
  }, []);

  // Fetch addresses function
  const fetchAddresses = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/addresses`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch addresses');
      }

      const data = await response.json();
      setAddresses(data.addresses || []);

      // Select default address if available
      const defaultAddress = data.addresses?.find((addr: Address) => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
        updateShippingInfoFromAddress(defaultAddress);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to load your saved addresses');
    }
  }, [token, updateShippingInfoFromAddress]);

  // Handle address selection
  const handleAddressSelect = useCallback((addressId: string) => {
    setSelectedAddressId(addressId);
    const selectedAddress = addresses.find(addr => addr.id === addressId);
    if (selectedAddress) {
      updateShippingInfoFromAddress(selectedAddress);
    }
  }, [addresses, updateShippingInfoFromAddress]);

  useEffect(() => {
    // Redirect to login if not logged in
    // if (!user) {
    //   localStorage.setItem('redirectAfterLogin', '/cart')
    //   router.push('/login')
    //   return
    // }

    // Get order summary from localStorage
    const orderSummaryStr = localStorage.getItem('orderSummary')
    if (!orderSummaryStr) {
      toast.error("No order information found")
      router.push('/cart')
      return
    }

    try {
      // Parse order summary
      const orderSummary = JSON.parse(orderSummaryStr)
      console.log("ordersummary from backend ", orderSummary)

      // Set cart items from order summary
      setDisplayCart(orderSummary.items)

      // Set price variables from order summary
      setTotal(orderSummary.total || 0)
      setGst(orderSummary.gst || 0)
      setDeliveryFee(orderSummary.deliveryFee || 0)
      setDiscountAmount(orderSummary.discountAmount || 0)
      setGrandTotal(orderSummary.grandTotal || 0)
      setFinalTotal(orderSummary.finalTotal || 0)

      // Set coupon if applied
      if (orderSummary.appliedCoupon) {
        setAppliedCoupon(orderSummary.appliedCoupon)
      }

      // Always fetch addresses from API
      fetchAddresses();
    } catch (error) {
      console.error('Error parsing order data:', error)
      toast.error("There was an error processing your order information")
      router.push('/cart')
    }
  }, [user, router, fetchAddresses, updateShippingInfoFromAddress])

  // Create order in backend
  const createOrder = async () => {
    if (!token) {
      toast.error("You must be logged in to place an order");
      router.push('/login');
      return null;
    }

    // Validate address selection
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return null;
    }

    try {
      // Get selected cart item IDs from localStorage
      const selectedItemIds = JSON.parse(localStorage.getItem('selectedCartItems') || '[]');
      console.log("Applied Coupon is : ",appliedCoupon);
      if (selectedItemIds.length === 0) {
        toast.error("No items selected for checkout");
        return null;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cartItemIds: selectedItemIds,
          addressId: selectedAddressId,
          couponCode: appliedCoupon
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      const data = await response.json();
      return data.orderId;
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order. Please try again.');
      return null;
    }
  };

  // Handle place order button click
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    setIsProcessing(true);
    try {
      console.log("APplied coupon : ", appliedCoupon);
      const newOrderId = await createOrder();
      if (newOrderId) {
        // Clear localStorage data after successful order creation
        localStorage.removeItem('selectedCartItems');
        localStorage.removeItem('orderSummary');
        localStorage.removeItem('addresses');

        setOrderId(newOrderId);
        // Payment will be handled by RazorpayHandler component
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Items & Shipping */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Items */}
            <CartItemsList cartItems={displayCart} />

            {/* Shipping Information */}
            <AddressSelector
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onAddressSelect={handleAddressSelect}
              onClearAddressSelection={() => setSelectedAddressId(null)}
            />

            {/* Payment Information */}
            <PaymentInfo />
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              cartItems={displayCart}
              total={total}
              gst={gst}
              deliveryFee={deliveryFee}
              appliedCoupon={appliedCoupon}
              discountAmount={discountAmount}
              finalTotal={finalTotal}
              isProcessing={isProcessing}
              isAddressSelected={!!selectedAddressId} // Add this
              onCouponApplied={setAppliedCoupon}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>

        {/* Razorpay Handler */}
        {orderId && (
          <RazorpayHandler
            orderId={orderId}
            finalTotal={finalTotal}
            shippingInfo={shippingInfo}
            userEmail={user?.email || ""}
            couponCode={appliedCoupon?.code}
            token={token || ""}
          />
        )}
      </main>
      <Footer />

      {/* Razorpay Script */}
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
    </div>
  )
}