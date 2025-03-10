// components/cart/CartItem.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {  Loader2, MinusIcon, PlusIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import { CartItem as CartItemType } from "@/types/product";
import { useCart } from "@/lib/cartContext";


interface CartItemProps {
  item: CartItemType | any; 
 
}

export const CartItem = ({ item}: CartItemProps) => {
    const {updateQuantity , removeFromCart , isLoading} = useCart();
    console.log("CartItem", item);
  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-shrink-0">
          <Image
            src={item.product.image || "/placeholder.svg?height=120&width=120"}
            alt={item.product.name}
            width={120}
            height={120}
            className="rounded-md object-cover"
          />
        </div>
        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row justify-between">
            <div>
              <h2 className="text-lg font-medium">{item.product.name}</h2>
              <p className="text-primary font-semibold">₹{item.product.price}/month</p>
              <p className="text-sm text-muted-foreground">Duration: {item.duration || "monthly"}</p>
            </div>
            {
                !isLoading ? 
                <div className="flex items-center mt-4 sm:mt-0">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <MinusIcon className="h-4 w-4" />
              </Button>
              <span className="mx-3 w-8 text-center">{item.quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
            :
            <div className="flex items-center mt-4 sm:mt-0 justify-center"> 
            <Loader2 className="h-6 w-6 text-slate-800  animate-spin" color="gray" />
            </div>
            }
          </div>
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm font-medium">
              Subtotal: ₹{(item.product.price * item.quantity).toFixed(2)}
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => removeFromCart(item.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};