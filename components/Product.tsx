"use client"

import { useState } from "react"
import { ProductType } from "@/types/product"
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline"
import { toast } from "react-hot-toast"
import * as Dialog from "@radix-ui/react-dialog"

interface ProductProps {
  product: ProductType
  onDelete: (id: string) => void
}

export default function Product({ product, onDelete }: ProductProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await onDelete(product.id)
      toast.success("Product deleted successfully")
    } catch (error) {
      toast.error("Failed to delete product")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-gray-800 text-lg font-semibold truncate">{product.name}</h2>
        <p className="text-gray-600 text-sm mt-1 h-12 overflow-hidden">{product.description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-gray-700 font-semibold">${product.price.toFixed(2)}</span>
          <span className="text-yellow-500">★ {product.rating.toFixed(1)}</span>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-500">{product.category}</span>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                /* Implement edit functionality */
              }}
              className="p-1 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <PencilIcon className="h-5 w-5" />
            </button>

            {/* Delete Button with Dialog */}
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button
                  className="p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </Dialog.Trigger>

              {/* Dialog Content */}
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30 z-[100]" />
                <Dialog.Content
                  className="fixed z-[101] top-[50%] left-[50%] max-w-md w-full -translate-x-[50%] -translate-y-[50%] bg-white rounded-lg shadow-lg p-6"
                >
                  <Dialog.Title className="text-lg font-medium text-gray-900">Confirm Deletion</Dialog.Title>
                  <Dialog.Description className="mt-2 text-sm text-gray-500">
                    Are you sure you want to delete this product? This action cannot be undone.
                  </Dialog.Description>

                  <div className="mt-4 flex justify-end space-x-4">
                    {/* Cancel Button */}
                    <Dialog.Close asChild>
                      <button
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                      >
                        Cancel
                      </button>
                    </Dialog.Close>

                    {/* Confirm Delete Button */}
                    <button
                      onClick={handleDelete}
                      disabled={isLoading}
                      className={`px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isLoading ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      </div>
    </div>
  )
}
