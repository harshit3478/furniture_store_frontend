"use client";


import { useCart } from "@/lib/cartContext";
import Link from "next/link";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
        <p className="mt-4 text-gray-600">Your cart is empty.</p>
        <Link
          href="/"
          className="mt-6 inline-block bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
      <div className="space-y-6">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b pb-4"
          >
            <div className="flex items-center space-x-4">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded-md"
              />
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  {item.product.name}
                </h2>
                <p className="text-gray-600">${item.product.price.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  -
                </button>
                <span className="text-gray-900">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-between items-center">
        <p className="text-xl font-medium text-gray-900">
          Total: ${total.toFixed(2)}
        </p>
        <div className="space-x-4">
          <button
            onClick={clearCart}
            className="text-gray-600 hover:text-gray-900"
          >
            Clear Cart
          </button>
          <button className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}