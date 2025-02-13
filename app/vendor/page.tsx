import Link from "next/link"
import { ShoppingBagIcon } from "@heroicons/react/24/outline"

export default function VendorLanding() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <ShoppingBagIcon className="mx-auto h-16 w-16 text-indigo-600" />
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Vendor Portal</h1>
        <p className="mt-4 text-lg text-gray-600">Manage your products and grow your business with ease.</p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/vendor/login"
            className="w-full sm:w-auto px-6 py-3 text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </Link>
          <Link
            href="/vendor/register"
            className="w-full sm:w-auto px-6 py-3 text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}

