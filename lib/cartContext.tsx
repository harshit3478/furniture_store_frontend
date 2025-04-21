"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./authContext";
import { CartItemType, LocalCartItemType, ProductType } from "@/types/product";
import { toast } from "react-hot-toast";

interface CartContextType {
  cart: CartItemType[];
  localCart: LocalCartItemType[];
  addToCart: (product: ProductType, quantity: number, duration: number) => Promise<void>;
  removeFromCart: (cartItemId: number | string) => Promise<void>;
  updateQuantity: (cartItemId: number | string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  syncCart: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { token, user } = useAuth();
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [localCart, setLocalCart] = useState<LocalCartItemType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  
  // Load localCart from localStorage on initial mount
  useEffect(() => {
    const storedCart = localStorage.getItem("localCart");
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setLocalCart(parsedCart);
      } catch (error) {
        console.error("Error parsing stored cart:", error);
        localStorage.removeItem("localCart"); // Remove invalid data
      }
    }
  }, []);

  // Save localCart to localStorage whenever it changes
  useEffect(() => {
    if (localCart.length > 0) {
      localStorage.setItem("localCart", JSON.stringify(localCart));
    } else {
      localStorage.removeItem("localCart");
    }
  }, [localCart]);

  // Switch between authenticated and guest cart
  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token]);

  const fetchCart = async () => {
    if (!token) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      
      if (res.ok) {
        const data = await res.json();
        setCart(data.cart.items || []);
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to fetch cart");
        toast.error("Could not load your cart. Please try again.");
        setCart([]);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError("Network error. Please check your connection.");
      toast.error("Network error. Please check your connection.");
      setCart([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product: ProductType, quantity: number, duration: number) => {
    if (token) {
      setIsLoading(true);
      setError(null);
      
      try {
        const price = duration == 6 ? product.websitePrices?.sixMonths : duration == 9 ? product.websitePrices?.nineMonths : product.websitePrices?.twelveMonths
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: product.id, quantity, duration,pricePerMonth: price  }),
          credentials: "include",
        });
        
        if (res.ok) {
          await fetchCart();
          toast.success(`${product.name} added to cart`);
        } else {
          const errorData = await res.json();
          setError(errorData.message || "Failed to add item to cart");
          toast.error("Could not add item to cart");
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
        setError("Network error. Please check your connection.");
        toast.error("Network error. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    } else {
      // For guest users
      setLocalCart((prevCart) => {
        const existingItemIndex = prevCart.findIndex((item) => item.productId === product.id);
        
        if (existingItemIndex !== -1) {
          // Update existing item
          const newCart = [...prevCart];
          newCart[existingItemIndex] = {
            ...newCart[existingItemIndex],
            quantity: newCart[existingItemIndex].quantity + quantity
          };
          toast.success(`Updated ${product.name} in cart`);
          return newCart;
        } else {
          // Add new item with a unique ID for local cart
          const price = duration == 6 ? product.websitePrices?.sixMonths : duration == 9 ? product.websitePrices?.nineMonths : product.websitePrices?.twelveMonths
          const newItem: LocalCartItemType = {
            id: `local-${Date.now()}-${product.id}`,
            productId: product.id,
            quantity,
            product,
            duration,
            total : quantity * price * duration,
            pricePerMonth: price
          };
          toast.success(`${product.name} added to cart`);
          return [...prevCart, newItem];
        }
      });
    }
  };

  const removeFromCart = async (cartItemId: number | string) => {
    if (token && typeof cartItemId === 'number') {
      setIsLoading(true);
      setError(null);
      
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/remove`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cartItemId }),
          credentials: "include",
        });
        
        if (res.ok) {
          await fetchCart();
          toast.success("Item removed from cart");
        } else {
          const errorData = await res.json();
          setError(errorData.message || "Failed to remove item from cart");
          toast.error("Could not remove item from cart");
        }
      } catch (error) {
        console.error("Error removing from cart:", error);
        setError("Network error. Please check your connection.");
        toast.error("Network error. Please check your connection.");
      } finally {
        setIsLoading(false);
        //reload the page
        window.location.reload();
      }
    } else {
      // For guest users, cartItemId could be either the product ID or the local item ID
      setLocalCart((prevCart) => {
        const newCart = prevCart.filter((item) => 
          item.id !== cartItemId && item.productId !== cartItemId
        );
        
        if (newCart.length < prevCart.length) {
          toast.success("Item removed from cart");
        }
        // reload the page
        window.location.reload();
        return newCart;
      });
    }
  };

  const updateQuantity = async (cartItemId: number | string, quantity: number) => {
    if (quantity <= 0) {
      return removeFromCart(cartItemId);
    }
    
    if (token && typeof cartItemId === 'number') {
      setIsLoading(true);
      setError(null);
      
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/update/${cartItemId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity, cartItemId, email : user?.email }),
          credentials: "include",
        });
        
        if (res.ok) {
          await fetchCart();
          toast.success("Cart updated");
        } else {
          const errorData = await res.json();
          setError(errorData.message || "Failed to update cart");
          toast.error("Could not update cart");
        }
      } catch (error) {
        console.error("Error updating quantity:", error);
        setError("Network error. Please check your connection.");
        toast.error("Network error. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    } else {
      // For guest users
      console.log("updating cart for guest user " , cartItemId , quantity)
      setLocalCart((prevCart) => {
        // First try to find by id (which is more precise)
        let itemIndex = prevCart.findIndex(item => item.id === cartItemId);
        
        // If not found, try by productId (for backward compatibility)
        if (itemIndex === -1) {
          itemIndex = prevCart.findIndex(item => item.productId === cartItemId);
        }
        
        if (itemIndex !== -1) {
          const newCart = [...prevCart];
          newCart[itemIndex] = {
            ...newCart[itemIndex],
            quantity
          };
          toast.success("Cart updated");
          return newCart;
        }
        
        return prevCart;
      });
    }
  };

  const clearCart = async () => {
    if (token) {
      setIsLoading(true);
      setError(null);
      
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/clear`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        
        if (res.ok) {
          setCart([]);
          toast.success("Cart cleared");
        } else {
          const errorData = await res.json();
          setError(errorData.message || "Failed to clear cart");
          toast.error("Could not clear cart");
        }
      } catch (error) {
        console.error("Error clearing cart:", error);
        setError("Network error. Please check your connection.");
        toast.error("Network error. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setLocalCart([]);
      toast.success("Cart cleared");
    }
  };

  const syncCart = async () => {
    if (token && localCart.length > 0) {
      setIsLoading(true);
      setError(null);
      
      try {
        // Create a toast notification that persists during sync
        const toastId = toast.loading("Syncing your cart...");
        
        for (const item of localCart) {
          await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/add`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ 
              productId: item.productId, 
              quantity: item.quantity,
              duration: item.duration
            }),
            credentials: "include",
          });
        }
        
        setLocalCart([]);
        await fetchCart();
        
        // Update the toast notification once sync is complete
        toast.success("Your cart has been synced!", { id: toastId });
      } catch (error) {
        console.error("Error syncing cart:", error);
        setError("Failed to sync cart. Please try again.");
        toast.error("Failed to sync cart. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // // Sync local cart to server when user logs in
  // useEffect(() => {
  //   if (token) {
  //     syncCart();
  //   }
  // }, [token]);

  return (
    <CartContext.Provider
      value={{
        cart,
        localCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        fetchCart,
        syncCart,
        isLoading,
        error
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};