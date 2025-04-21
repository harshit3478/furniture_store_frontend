"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, MinusIcon, PlusIcon, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { CartItemType, LocalCartItemType } from "@/types/product"
import { useCart } from "@/lib/cartContext"

interface CartItemProps {
  item: CartItemType | LocalCartItemType
  isSelected?: boolean
  onSelect?: () => void
}

export const CartItem = ({ item, isSelected = false, onSelect = () => {} }: CartItemProps) => {
  const { updateQuantity, removeFromCart, isLoading } = useCart()

  // Calculate delivery date based on delivery time (in days)
  const calculateDeliveryDate = () => {
    // Default to 3 days delivery time if not specified
    const days = item.product.deliveryTime ? parseInt(item.product.deliveryTime) : 3;
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
    <Card className="p-4 relative">
      <div className="flex items-start gap-2">
        {/* Checkbox for item selection */}
        <div className="pt-1 hidden md:block">
          <Checkbox checked={isSelected} onCheckedChange={onSelect} className="h-5 w-5" />
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full">
          {/* Mobile checkbox */}
          <div className="flex items-center md:hidden mb-2">
            <Checkbox checked={isSelected} onCheckedChange={onSelect} className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Select item</span>
          </div>

          <div className="flex-shrink-0">
            <Link href={`/products/${item.product.id}`} className="block">
              <Image
                src={item.product.heroImage || item.product.image || "/placeholder.svg?height=120&width=120"}
                alt={item.product.name}
                width={140}
                height={140}
                className="rounded-none object-cover hover:opacity-90 transition-opacity"
              />
            </Link>
          </div>

          <div className="flex-grow">
            <div className="flex flex-col gap-3 justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <Link href={`/products/${item.product.id}`} className="hover:text-primary transition-colors">
                    <h2 className="text-lg font-semibold">{item.product.name}</h2>
                  </Link>
                  <p className="text-primary text-sm font-medium">
                    ₹{item.pricePerMonth}/month
                  </p>
                </div>

                {/* Quantity controls for desktop */}
                <div className="hidden md:flex items-center">
                  {!isLoading ? (
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 bg-secondary hover:bg-secondary-foreground"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <MinusIcon className="h-4 w-4" />
                      </Button>
                      <span className="mx-3 w-4 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 bg-secondary hover:bg-secondary-foreground"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 hover:bg-muted"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="text-muted-foreground h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Info grid - desktop */}
              <div className="hidden md:grid grid-cols-4 items-center w-full mt-4">
                <div className="flex flex-col border-r border-slate-300 items-left pr-2 py-1">
                  <p className="text-slate-600 text-xs">Renting for</p>
                  <p className="text-black font-medium text-sm">{item.duration} Months</p>
                </div>
                <div className="flex flex-col border-r border-slate-300 items-left px-2 py-1 pl-4">
                  <p className="text-slate-600 text-xs">Quantity</p>
                  <p className="text-black font-medium text-sm">{item.quantity}</p>
                </div>
                <div className="flex flex-col border-r border-slate-300 items-left px-2 py-1 pl-4">
                  <p className="text-slate-600 text-xs">Total Rent</p>
                  <p className="text-black font-medium text-sm">₹{(item.total)}</p>
                </div>
                <div className="flex flex-col items-left px-2 py-1 pl-4">
                  <p className="text-slate-600 text-xs">Delivered By</p>
                  <p className="text-black font-medium text-sm">{calculateDeliveryDate()}</p>
                </div>
              </div>

              {/* Info grid - mobile */}
              <div className="grid grid-cols-2 md:hidden gap-2 mt-2">
                <div className="flex flex-col border border-slate-200 rounded p-2">
                  <p className="text-slate-600 text-xs">Renting for</p>
                  <p className="text-black font-medium text-sm">{item.duration} Months</p>
                </div>
                <div className="flex flex-col border border-slate-200 rounded p-2">
                  <p className="text-slate-600 text-xs">Quantity</p>
                  <p className="text-black font-medium text-sm">{item.quantity}</p>
                </div>
                <div className="flex flex-col border border-slate-200 rounded p-2">
                  <p className="text-slate-600 text-xs">Total Rent</p>
                  <p className="text-black font-medium text-sm">₹{(item.total)}</p>
                </div>
                <div className="flex flex-col border border-slate-200 rounded p-2">
                  <p className="text-slate-600 text-xs">Delivered By</p>
                  <p className="text-black font-medium text-sm">{calculateDeliveryDate()}</p>
                </div>
              </div>

              {/* Mobile quantity controls and remove button */}
              <div className="flex justify-between items-center mt-3 md:hidden">
                <div className="flex items-center">
                  {!isLoading ? (
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-secondary hover:bg-secondary-foreground"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <MinusIcon className="h-4 w-4" />
                      </Button>
                      <span className="mx-3 w-6 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-secondary hover:bg-secondary-foreground"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10 text-xs"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

