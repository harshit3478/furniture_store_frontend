import { Toaster } from "react-hot-toast"
import { Inter } from "next/font/google"

import type React from "react" // Import React
import { VendorNavbar } from "@/components/VendorNavbar"
import { VendorFooter } from "@/components/VendorFooter"

const inter = Inter({ subsets: ["latin"] })

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`flex flex-col min-h-screen ${inter.className}`}>
      {/* <VendorNavbar /> */}
      <main className="flex-grow">{children}</main>
      <VendorFooter />
      <Toaster />
    </div>
  )
}

