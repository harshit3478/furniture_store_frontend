"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, getAuth, signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import ProductModal from "@/components/ProductModal"
import { toast } from "react-hot-toast"
import { PlusIcon } from "@heroicons/react/24/outline"
import { BiLogOut } from "react-icons/bi";
import Product from "@/components/Product"
import { ProductType } from "@/types/product"

export default function Dashboard() {
  const [products, setProducts] = useState<ProductType[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [vendorDetails, setVendorDetails] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/vendor/login")
      } else {
        const token = await user.getIdToken()
        console.log("user", user)
        fetchProducts(token)
        fetchVendorDetails(token)
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast.success("Logged out successfully")
      router.push("/vendor/login")
    } catch (error) {
      console.error("Error logging out:", error)
      toast.error("Failed to log out")
    }
  }

  const fetchProducts = async (token: string) => {
    try {
      const response = await fetch(`/api/vendor/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      } else {
        throw new Error("Failed to fetch products")
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      toast.error("Failed to fetch products")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchVendorDetails = async (token: string) => {
    try {
        console.log("token in details api", token)
      const response = await fetch(`/api/vendor/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setVendorDetails(data)
      } else {
        throw new Error("Failed to fetch vendor details")
      }
    } catch (error) {
      console.error("Error fetching vendor details:", error)
      toast.error("Failed to fetch vendor details")
    }
  }

  const handleAddProduct = async (formData: FormData) => {
    try {
      const token = await getAuth().currentUser?.getIdToken()
      const response = await fetch("/api/vendor/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
      if (response.ok) {
        const { product } = await response.json()
        setProducts([...products, product])
        setIsModalOpen(false)
        toast.success("Product added successfully")
      } else {
        throw new Error("Failed to add product")
      }
    } catch (error) {
      console.error("Error adding product:", error)
      toast.error("Failed to add product")
    }
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      toast.loading("Deleting product...")
      const token = await getAuth().currentUser?.getIdToken()
      const response = await fetch(`/api/vendor/products`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })
      if (response.ok) {
        setProducts(products.filter((product) => product.id !== id))
        toast.success("Product deleted successfully")
      } else {
        throw new Error("Failed to delete product")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      toast.error("Failed to delete product")
    } finally {
      toast.dismiss()
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-100 sm:text-3xl sm:truncate">Vendor Dashboard</h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add New Product
          </button>
          <button
            onClick={handleLogout}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <BiLogOut className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Logout
          </button>
        </div>
      </div>

      {vendorDetails && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Vendor Information</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{vendorDetails.name}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{vendorDetails.email}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{vendorDetails.address}</dd>
              </div>
            </dl>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <Product key={product.id} product={product} onDelete={handleDeleteProduct} />
        ))}
      </div>

      <ProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddProduct} />
    </div>
  )
}

