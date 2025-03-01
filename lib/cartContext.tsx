"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./authContext";
import { CartItem } from "@/types/product";

interface CartContextType {
  cart: CartItem[];
  localCart: LocalCartItem[];
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
}

interface LocalCartItem {
  productId: string;
  quantity: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [localCart, setLocalCart] = useState<LocalCartItem[]>([]);

  useEffect(() => {
    if (token) {
      fetchCart();
    } else {
      setCart(localCart as unknown as CartItem[]);
    }
  }, [token]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setLocalCart(JSON.parse(storedCart));
    }
  }, []);


  const fetchCart = async () => {
    console.log("token in fetch cart", token);
    try {
      const res = await fetch("/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        console.log("data in fetch cart", data.cart.items);
        setCart(data.cart.items || []);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart([]);
    }
  };

  const addToCart = async (productId: string) => {
    console.log("token in add to cart", token);
    if (token) {
      try {
        const res = await fetch("/api/cart/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId }),
          credentials: "include",
        });
        if (res.ok) {
          await fetchCart();
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    } else {
      setLocalCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.productId === productId);
        if (existingItem) {
          return prevCart.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prevCart, { productId, quantity: 1 }];
        }
      });
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    if (token) {
      try {
        const res = await fetch(`/api/cart/remove/${cartItemId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (res.ok) {
          await fetchCart();
        }
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    } else {
      setLocalCart((prevCart) =>
        prevCart.filter((item) => item.productId !== cartItemId.toString())
      );
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (token) {
      try {
        const res = await fetch(`/api/cart/update/${cartItemId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity }),
          credentials: "include",
        });
        if (res.ok) {
          await fetchCart();
        }
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    } else {
      setLocalCart((prevCart) =>
        prevCart.map((item) =>
          item.productId === cartItemId.toString()
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const clearCart = async () => {
    if (token) {
      try {
        const res = await fetch("/api/cart/clear", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (res.ok) {
          setCart([]);
        }
      } catch (error) {
        console.error("Error clearing cart:", error);
      }
    } else {
      setLocalCart([]);
    }
  };

  const syncCart = async () => {
    if (token && localCart.length > 0) {
      try {
        for (const item of localCart) {
          await fetch("/api/cart/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ productId: item.productId }),
            credentials: "include",
          });
        }
        setLocalCart([]);
        await fetchCart();
      } catch (error) {
        console.error("Error syncing cart:", error);
      }
    }
  };

  useEffect(() => {
    if (token) {
      syncCart();
    }
  }, [token]);

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
