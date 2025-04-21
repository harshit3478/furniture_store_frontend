"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/lib/authContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "react-hot-toast"
import Image from "next/image"
import {
  FileText,
  Printer,
  ChevronLeft,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  Loader2,
  ShoppingBag,
  MapPin,
  Phone,
  CreditCard,
  Package,
  Truck,
} from "lucide-react"
import Link from "next/link"
import { type Order, OrderStatus } from "@/types/orders"
import { Separator } from "@/components/ui/separator"

export default function OrderDetailsPage() {
  const { id } = useParams()
  const {  token } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch order details
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch order details")
        }

        const data = await response.json()
        setOrder(data.order || null)
      } catch (error) {
        console.error("Error fetching order details:", error)
        toast.error("Failed to load order details")
      } finally {
        setIsLoading(false)
      }
    }

    if (token) {
      fetchOrderDetails()
    }
  }, [id, token])

  const handleDownloadInvoice = () => {
    // In a real application, this would generate and download a PDF invoice
    toast.success("Invoice downloaded successfully")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case OrderStatus.Paid:
      case OrderStatus.Delivered:
        return "text-green-500 bg-green-50"
      case OrderStatus.Pending:
      case OrderStatus.PaymentPending:
      case OrderStatus.Processing:
      case OrderStatus.Shipped:
        return "text-amber-500 bg-amber-50"
      case OrderStatus.Cancelled:
        return "text-red-500 bg-red-50"
      default:
        return "text-gray-500 bg-gray-50"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case OrderStatus.Paid:
      case OrderStatus.Delivered:
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case OrderStatus.Pending:
      case OrderStatus.PaymentPending:
      case OrderStatus.Processing:
      case OrderStatus.Shipped:
        return <Clock className="h-5 w-5 text-amber-500" />
      case OrderStatus.Cancelled:
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white md:bg-transparent">
        {/* Breadcrumb - Mobile Only */}
        <div className="md:hidden py-2 px-4 text-sm text-primary flex items-center overflow-x-auto whitespace-nowrap">
          <Link href="/profile" className="hover:text-gray-900">
            Profile
          </Link>
          <ChevronRight size={14} className="mx-1" />
          <Link href="/profile/orders" className="hover:text-gray-900">
            My Orders
          </Link>
          <ChevronRight size={14} className="mx-1" />
          <span className="font-medium">Order Details</span>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden bg-white p-4 pt-0 border-b border-gray-200">
          <h1 className="text-xl font-bold">Order Details</h1>
          <p className="text-gray-500 text-sm">Loading your order information...</p>
        </div>

        <div className="p-4 md:p-6 flex justify-center items-center min-h-[60vh]">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 animate-spin text-purple-600 mb-4" />
            <p className="text-lg font-medium">Loading order details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white md:bg-transparent">
        {/* Breadcrumb - Mobile Only */}
        <div className="md:hidden py-2 px-4 text-sm text-primary flex items-center overflow-x-auto whitespace-nowrap">
          <Link href="/profile" className="hover:text-gray-900">
            Profile
          </Link>
          <ChevronRight size={14} className="mx-1" />
          <Link href="/profile/orders" className="hover:text-gray-900">
            My Orders
          </Link>
          <ChevronRight size={14} className="mx-1" />
          <span className="font-medium">Order Details</span>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden bg-white p-4 pt-0 border-b border-gray-200">
          <h1 className="text-xl font-bold">Order Details</h1>
          <p className="text-gray-500 text-sm">Order not found</p>
        </div>

        <div className="p-4 md:p-6 flex justify-center items-center min-h-[60vh]">
          <div className="flex flex-col items-center text-center">
            <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-bold mb-2">Order Not Found</h2>
            <p className="text-gray-500 mb-6">We couldn&apos;t find the order you&apos;re looking for.</p>
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link href="/profile/orders">Back to My Orders</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Group order items by vendor
  const orderItemsByVendor = order.orderItems.reduce(
    (acc, item) => {
      const vendorId = item.vendorId || "unknown"
      if (!acc[vendorId]) {
        acc[vendorId] = []
      }
      acc[vendorId].push(item)
      return acc
    },
    {} as Record<string, typeof order.orderItems>,
  )

  // Calculate order totals
  const subtotal = order.totalAmount || 0
  const tax = order.taxAmount || 0
  const deliveryFee = order.deliveryFee || 0
  const discount = order.discountAmount || 0
  const total = subtotal + tax + deliveryFee - discount

  return (
    <div className="min-h-screen bg-white md:bg-transparent">
      {/* Breadcrumb - Mobile Only */}
      <div className="md:hidden py-2 px-4 text-sm text-primary flex items-center overflow-x-auto whitespace-nowrap">
        <Link href="/profile" className="hover:text-gray-900">
          Profile
        </Link>
        <ChevronRight size={14} className="mx-1" />
        <Link href="/profile/orders" className="hover:text-gray-900">
          My Orders
        </Link>
        <ChevronRight size={14} className="mx-1" />
        <span className="font-medium">Order #{order.orderNumber}</span>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 pt-0 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Order #{order.orderNumber}</h1>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
            {order.status}
          </div>
        </div>
        <p className="text-gray-500 text-sm">Placed on {formatDate(order.createdAt)}</p>
      </div>

      <div className="p-4 md:p-6">
        {/* Desktop Header - Hidden on Mobile */}
        <div className="hidden md:block mb-6">
          <div className="flex items-center mb-2">
            <Link href="/profile/orders" className="text-primary hover:text-primary/80 flex items-center mr-2">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Orders
            </Link>
          </div>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleDownloadInvoice} className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Download Invoice
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.print()} className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Print
              </Button>
            </div>
          </div>
          <div className="flex items-center mt-1">
            <p className="text-gray-500">Placed on {formatDate(order.createdAt)}</p>
            <div className="mx-2 h-1 w-1 rounded-full bg-gray-300"></div>
            <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
              {order.status}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardContent className="p-4 md:p-6">
                <h2 className="text-lg font-semibold mb-4">Order Items</h2>
                {Object.entries(orderItemsByVendor).map(([vendorId, vendorItems]) => (
                  <div key={vendorId} className="mb-6 last:mb-0">
                    {vendorId !== "unknown" && (
                      <div className="text-sm font-medium text-gray-500 mb-2 pb-1 border-b">Vendor: {vendorId}</div>
                    )}
                    <div className="space-y-4">
                      {vendorItems.map((item) => (
                        <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0 w-20 h-20 relative rounded-md overflow-hidden">
                            <Image
                              src={item.product.image || "/placeholder.svg"}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-base">{item.product.name}</h3>
                            <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                              <div className="text-gray-500">
                                Price: <span className="text-gray-700">{formatCurrency(item.pricePerUnit)}</span>
                              </div>
                              <div className="text-gray-500">
                                Quantity: <span className="text-gray-700">{item.quantity}</span>
                              </div>
                              <div className="text-gray-500">
                                Duration: <span className="text-gray-700">{item.duration} months</span>
                              </div>
                              <div className="text-gray-500">
                                Status:{" "}
                                <span
                                  className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                    item.status,
                                  )}`}
                                >
                                  {item.status}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex flex-col justify-between items-end">
                            <div className="font-semibold">{formatCurrency(item.subtotal)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shipping & Delivery */}
            <Card>
              <CardContent className="p-4 md:p-6">
                <h2 className="text-lg font-semibold mb-4">Shipping & Delivery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-start gap-2 mb-4">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-sm mb-1">Delivery Address</h3>
                        <p className="text-gray-700">
                          {order.deliveryAddress.fullName || "Recipient"}
                          <br />
                          {order.deliveryAddress.addressLine1}
                          {order.deliveryAddress.addressLine2 && <>, {order.deliveryAddress.addressLine2}</>}
                          <br />
                          {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
                        </p>
                      </div>
                    </div>

                    {order.deliveryAddress.phoneNumber && (
                      <div className="flex items-start gap-2">
                        <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-sm mb-1">Contact Number</h3>
                          <p className="text-gray-700">{order.deliveryAddress.phoneNumber}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <Package className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-sm mb-1">Delivery Status</h3>
                        <div
                          className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}
                        >
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status}</span>
                        </div>
                      </div>
                    </div>

                    {order.status === OrderStatus.Shipped && (
                      <div className="flex items-start gap-2">
                        <Truck className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-sm mb-1">Estimated Delivery</h3>
                          <p className="text-gray-700">
                            {new Date(order.createdAt).setDate(new Date(order.createdAt).getDate() + 3) >
                            new Date().getTime()
                              ? formatDate(
                                  new Date(
                                    new Date(order.createdAt).setDate(new Date(order.createdAt).getDate() + 3),
                                  ).toISOString(),
                                )
                              : "Soon"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardContent className="p-4 md:p-6">
                <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-2">
                    <CreditCard className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-sm mb-1">Payment Method</h3>
                      <p className="text-gray-700">
                        {order.paymentMethod === "Razorpay" ? "Razorpay" : "Cash on Delivery"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-sm mb-1">Payment Status</h3>
                      <div
                        className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${getStatusColor(
                          order.paymentStatus,
                        )}`}
                      >
                        {getStatusIcon(order.paymentStatus)}
                        <span className="ml-1">{order.paymentStatus}</span>
                      </div>
                    </div>
                  </div>

                  {order.paymentId && (
                    <div className="md:col-span-2 flex items-start gap-2">
                      <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-sm mb-1">Payment ID</h3>
                        <p className="text-gray-700 font-mono">{order.paymentId}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card className="min-w-[20vw]">
                <CardContent className="p-4 md:p-6 ">
                  <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    {/* <div className="flex justify-between">
                      <span className="text-gray-500">GST (18%)</span>
                      <span>{formatCurrency(tax)}</span>
                    </div> */}
                    <div className="flex justify-between">
                      <span className="text-gray-500">Delivery Fee</span>
                      <span>{formatCurrency(deliveryFee)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-{formatCurrency(discount)}</span>
                      </div>
                    )}
                    <Separator className="my-2" />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>

                  {/* Order Timeline */}
                  <div className="mt-8">
                    <h3 className="font-semibold mb-4">Order Timeline</h3>
                    <div className="relative">
                      <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                      <div className="relative pl-10 pb-8">
                        <div
                          className={`absolute left-0 top-0 w-7 h-7 rounded-full flex items-center justify-center ${
                            order.status !== OrderStatus.Cancelled
                              ? "bg-purple-600 text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          1
                        </div>
                        <h4 className="font-medium">Order Placed</h4>
                        <p className="text-sm text-gray-500">{formatDateTime(order.createdAt)}</p>
                      </div>

                      <div className="relative pl-10 pb-8">
                        <div
                          className={`absolute left-0 top-0 w-7 h-7 rounded-full flex items-center justify-center ${
                            order.status === OrderStatus.Processing ||
                            order.status === OrderStatus.Shipped ||
                            order.status === OrderStatus.Delivered
                              ? "bg-purple-600 text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          2
                        </div>
                        <h4 className="font-medium">Processing</h4>
                        <p className="text-sm text-gray-500">
                          {order.status === OrderStatus.Processing ||
                          order.status === OrderStatus.Shipped ||
                          order.status === OrderStatus.Delivered
                            ? "Your order is being processed"
                            : "Pending"}
                        </p>
                      </div>

                      <div className="relative pl-10 pb-8">
                        <div
                          className={`absolute left-0 top-0 w-7 h-7 rounded-full flex items-center justify-center ${
                            order.status === OrderStatus.Shipped || order.status === OrderStatus.Delivered
                              ? "bg-purple-600 text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          3
                        </div>
                        <h4 className="font-medium">Shipped</h4>
                        <p className="text-sm text-gray-500">
                          {order.status === OrderStatus.Shipped || order.status === OrderStatus.Delivered
                            ? "Your order is on the way"
                            : "Pending"}
                        </p>
                      </div>

                      <div className="relative pl-10">
                        <div
                          className={`absolute left-0 top-0 w-7 h-7 rounded-full flex items-center justify-center ${
                            order.status === OrderStatus.Delivered
                              ? "bg-purple-600 text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          4
                        </div>
                        <h4 className="font-medium">Delivered</h4>
                        <p className="text-sm text-gray-500">
                          {order.status === OrderStatus.Delivered ? "Your order has been delivered" : "Pending"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-8 space-y-3">
                    {order.status === OrderStatus.Delivered && (
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">Extend Rental</Button>
                    )}

                    {(order.status === OrderStatus.Pending || order.status === OrderStatus.PaymentPending) && (
                      <Button className="w-full" variant="destructive">
                        Cancel Order
                      </Button>
                    )}

                    <Button variant="outline" className="w-full">
                      Contact Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
