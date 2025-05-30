"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { User } from "firebase/auth"
import { ShoppingCart, UserIcon, LogIn, Heart } from "lucide-react"
import { useWishlist } from "@/lib/wishlist-context"
import { useCart } from "@/lib/cartContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { auth } from "@/lib/firebase"

interface UserNavProps {
  user: User | null
}

export function UserNav({ user }: UserNavProps) {
  const router = useRouter()
  const { wishlist } = useWishlist()
  const { cart } = useCart()
  
  const wishlistCount = wishlist?.length || 0
  const cartCount = cart?.length || 0

  const handleSignOut = async () => {
    try {
      await auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <div className="flex items-center gap-1 md:gap-2">
      <Link href="/wishlist">
        <Button variant="ghost" size="icon" className="h-10 w-10 relative" aria-label="Wishlist">
          <Heart className="h-6 w-6 text-gray-500" />
          {wishlistCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[1.25rem]">
              {wishlistCount > 99 ? '99+' : wishlistCount}
            </span>
          )}
        </Button>
      </Link>
      <Link href="/cart">
        <Button variant="ghost" size="icon" className="h-10 w-10 relative" aria-label="Cart">
          <ShoppingCart className="h-6 w-6 text-gray-500" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[1.25rem]">
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </Button>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" aria-label="User menu">
            {user ? (
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
                <AvatarFallback>{user.displayName?.[0] || "U"}</AvatarFallback>
              </Avatar>
            ) : (
              <UserIcon className="h-6 w-6 text-gray-500" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          {user ? (
            <>
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium leading-none">{user.displayName || "User"}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email || ""}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile/settings" className="flex items-center">
                  <UserIcon className="mr-2 h-5 w-5" />
                  My Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile/orders" className="flex items-center">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  My Orders
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-500">
                <LogIn className="mr-2 h-5 w-5" />
                Log out
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem asChild>
                <Link href="/login" className="flex items-center">
                  <LogIn className="mr-2 h-5 w-5" />
                  Login
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}