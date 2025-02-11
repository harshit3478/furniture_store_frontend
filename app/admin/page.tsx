"use client"
import { useState, useEffect } from "react"
import ProductModal from "@/components/ProductModal"
import Product from "@/components/Product"
import {toast} from "react-toastify"

interface ProductType {
  id: string
  name: string
  price: number
  category: string
  rating: number
  image: string
  description: string
}

export default function AdminPage() {
  const [products, setProducts] = useState<ProductType[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const response = await fetch('/api/products')
    const productsData = await response.json()
    setProducts(productsData)
  }

  const handleAddProduct = async (formData: FormData) => {
    try {
      const response = await fetch("/api/products/add", {
        method: "POST",
        body: formData
      })
      
      if (response.ok) {
        const { product } = await response.json()
        setProducts(prev => [...prev, product])
        toast.success("Product added successfully")
        setIsModalOpen(false)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to add product')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to add product')
    }
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      toast.info("Deleting product...")
      const response = await fetch("/api/products/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        setProducts(products.filter((product) => product.id !== id))
        toast.success("Product deleted successfully")
      } else {
        console.error("Failed to delete product")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }
  return (
    <div className="flex-grow w-full h-full min-h-screen mx-auto p-6 bg-gradient-to-r from-zinc-500 via-stone-600 to-zinc-900 ">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Product key={product.id} product={product} onDelete={handleDeleteProduct} />
            ))}
          </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddProduct}
      />
    </div>
  )
}