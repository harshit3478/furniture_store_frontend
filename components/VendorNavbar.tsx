"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserCircleIcon, ShoppingBagIcon } from "@heroicons/react/24/outline"

export function VendorNavbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/vendor/dashboard" className="flex-shrink-0 flex items-center">
              <ShoppingBagIcon className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">VendorHub</span>
            </Link>
          </div>
          <div className="flex items-center">
            <Link
              href="/vendor/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === "/vendor/dashboard"
                  ? "text-indigo-600 bg-indigo-50"
                  : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/vendor/profile"
              className={`ml-4 px-3 py-2 rounded-md text-sm font-medium ${
                pathname === "/vendor/profile"
                  ? "text-indigo-600 bg-indigo-50"
                  : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              Profile
            </Link>
            <button className="ml-4 p-1 rounded-full text-gray-500 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span className="sr-only">View notifications</span>
              <UserCircleIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

