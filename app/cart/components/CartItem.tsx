"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit, Loader2, MinusIcon, PlusIcon, Trash2 } from "lucide-react"
import Image from "next/image"
import type { CartItem as CartItemType } from "@/types/product"
import { useCart } from "@/lib/cartContext"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface CartItemProps {
  item: CartItemType | any
  isSelected?: boolean
  onSelect?: () => void
}

export const CartItem = ({ item, isSelected = false, onSelect = () => {} }: CartItemProps) => {
  const { updateQuantity, removeFromCart, isLoading } = useCart()
  const [isEditing, setIsEditing] = useState(false)
  const [editedDuration, setEditedDuration] = useState(Number.parseInt(item.duration) || 3)

  const handleDurationChange = (value: number[]) => {
    setEditedDuration(value[0])
  }

  const saveChanges = () => {
    // Here you would update the duration in your cart context
    // For example: updateDuration(item.id, editedDuration);
    setIsEditing(false)
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
            <Image
              src={item.product.image || "/placeholder.svg?height=120&width=120"}
              alt={item.product.name}
              width={140}
              height={140}
              className="rounded-none object-cover"
            />
          </div>

          <div className="flex-grow">
            <div className="flex flex-col gap-3 justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{item.product.name}</h2>
                  <p className="text-primary text-sm font-medium">₹{item.product.price}/month</p>
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
                  <p className="text-black font-medium text-sm">₹{item.product.price * item.quantity}</p>
                </div>
                <div className="flex flex-col items-left px-2 py-1 pl-4">
                  <p className="text-slate-600 text-xs">Expected Delivery</p>
                  <p className="text-black font-medium text-sm">10 March</p>
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
                  <p className="text-black font-medium text-sm">₹{item.product.price * item.quantity}</p>
                </div>
                <div className="flex flex-col border border-slate-200 rounded p-2">
                  <p className="text-slate-600 text-xs">Expected Delivery</p>
                  <p className="text-black font-medium text-sm">10 March</p>
                </div>
              </div>

              {/* Mobile controls */}
              <div className="flex justify-between items-center mt-3 md:hidden">
                <Button variant="outline" size="sm" className="text-xs" onClick={() => setIsEditing(true)}>
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>

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

      {/* Edit Sheet for Mobile */}
      <Sheet open={isEditing} onOpenChange={setIsEditing}>
        <SheetContent side="bottom" className="h-[50vh]">
          <SheetHeader className="border-b pb-4">
            <SheetTitle>Edit {item.product.name}</SheetTitle>
          </SheetHeader>

          <div className="py-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Quantity</h3>
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <MinusIcon className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Duration (months)</h3>
              <Slider
                min={1}
                max={12}
                value={[editedDuration]}
                onValueChange={handleDurationChange}
                className="w-full"
              />
              <p className="text-sm text-center">{editedDuration} months</p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={saveChanges}>
                Save Changes
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </Card>
  )
}

