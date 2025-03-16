"use client"

import { useCart } from "@/lib/cartContext"
import { useEffect, useState } from "react"
import { EmptyCart } from "./components/EmptyCart"
import { CartItem } from "./components/CartItem"
import { OrderSummary } from "./components/OrderSummary"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Cart() {
  const { cart, localCart, isLoading, error } = useCart()
  const [displayCart, setDisplayCart] = useState<any[]>([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  useEffect(() => {
    if (cart.length === 0 && localCart.length > 0) {
      setDisplayCart(localCart)
      // Auto-select all items initially
      setSelectedItems(localCart.map((item) => item.id.toString()))
    } else if (cart.length > 0) {
      setDisplayCart(cart)
      // Auto-select all items initially
      setSelectedItems(cart.map((item) => item.id.toString()))
    }
  }, [cart, localCart])

  // Calculate totals for selected items only
  const total = displayCart
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const gst = total * 0.18
  const deliveryFee = total > 0 ? 499 : 0
  const grandTotal = total + gst + deliveryFee

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  if (displayCart.length === 0 && !isLoading && !error && localCart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Cart:</h1>
        <EmptyCart />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 lg:pb-12">
      <h1 className="text-3xl font-bold mb-8">Cart:</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {displayCart.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              isSelected={selectedItems.includes(item.id)}
              onSelect={() => toggleItemSelection(item.id)}
            />
          ))}
        </div>

        {/* Desktop Order Summary */}
        <div className="hidden lg:block lg:col-span-1">
          <OrderSummary
            total={total}
            gst={gst}
            deliveryFee={deliveryFee}
            grandTotal={grandTotal}
            selectedItemsCount={selectedItems.length}
          />
        </div>
      </div>

      {/* Mobile Checkout Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t z-10">
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-white py-6"
          onClick={() => setIsCheckoutOpen(true)}
          disabled={selectedItems.length === 0}
        >
          Checkout ({selectedItems.length} items)
        </Button>
      </div>

      {/* Mobile Checkout Sheet */}
      <Sheet open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <SheetContent side="bottom" className="h-[85vh] p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Cart Details</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-full p-4">
            <OrderSummary
              total={total}
              gst={gst}
              deliveryFee={deliveryFee}
              grandTotal={grandTotal}
              selectedItemsCount={selectedItems.length}
              isMobile
            />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  )
}

