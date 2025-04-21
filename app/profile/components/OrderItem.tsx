"use client";

import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Clock, XCircle } from "lucide-react";

interface OrderItemProps {
  order: {
    id: string;
    product: {
      id: string;
      name: string;
      image: string;
      price: number;
    };
    rentedFor: number;
    orderDate: string;
    orderNumber: string;
    status?: string;
  };
}

export const OrderItem: FC<OrderItemProps> = ({ order }) => {
  // Function to determine status icon and color
  const getStatusInfo = (status: string | undefined) => {
    if (!status) return { color: "text-gray-500", icon: null };
    switch (status) {
      case "Paid":
        return { color: "text-green-500", icon: <CheckCircle className="h-4 w-4 text-green-500" /> };
      case "Pending":
        return { color: "text-yellow-500", icon: <Clock className="h-4 w-4 text-yellow-500" /> };
      case "Cancelled":
        return { color: "text-red-500", icon: <XCircle className="h-4 w-4 text-red-500" /> };
      default:
        return { color: "text-gray-500", icon: null };
    }
  };

  const statusInfo = getStatusInfo(order.status);

  return (
    <Card className="p-4 mb-4 border border-gray-200">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/4 flex flex-col items-center">
          <Link href={`/products/${order.product.id}`}>
            <Image
              src={order.product.image}
              alt={order.product.name}
              width={200}
              height={200}
              className="object-cover rounded-md w-full md:w-[200px]"
            />
          </Link>
        </div>

        {/* Order Details */}
        <div className="md:w-3/4 md:grid grid-cols-5">
          <div className="flex col-span-3 flex-col p-2 px-6 gap-2 md:border-r border-slate-400">
            {/* Product Name, Price */}
            <div className="w-full text-left md:text-left">
              <h2 className="text-lg font-semibold">{order.product.name}</h2>
              <p className="text-primary text-sm font-medium">
                ₹{order.product.price}/month
              </p>
            </div>

            {/* Order Info - Desktop */}
            <div className="hidden md:flex mt-4 bg-purple-50 space-x-4 py-2">
              <div className="flex-1 border-r border-gray-300 pr-4 px-2">
                <p className="text-gray-500 text-xs">Order placed on</p>
                <p className="font-medium">{order.orderDate}</p>
              </div>
              <div className="flex-1">
                <p className="text-gray-500 text-xs">Rented for</p>
                <p className="font-medium">{order.rentedFor} Months</p>
              </div>
            </div>

            {/* Order Info - Mobile */}
            <div className="grid grid-cols-2 gap-2 md:hidden mt-2 bg-secondary">
              <div className="border border-gray-200 rounded p-2 text-center">
                <p className="text-gray-500 text-xs">Order placed on</p>
                <p className="font-medium text-sm">{order.orderDate}</p>
              </div>
              <div className="border border-gray-200 rounded p-2 text-center">
                <p className="text-gray-500 text-xs">Rented for</p>
                <p className="font-medium text-sm">{order.rentedFor} Months</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col col-span-2 p-2 gap-0 px-6">
            <div className="text-xs text-gray-500 mt-1">
              order # {order.orderNumber}
            </div>
            <div className="text-xs text-gray-500 mt-0">
              <Link
                href={`/profile/orders/${order.id}`}
                className="text-gray-700 hover:underline"
              >
                view order details
              </Link>
              <span className="mx-2">•</span>
              <Link
                href={`/profile/orders/${order.id}`}
                className="text-gray-700 hover:underline"
              >
                view invoice
              </Link>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:justify-end gap-2 mt-4">
              {order.status && (
                <div className="mb-2 text-sm flex items-center">
                  <span className="font-medium">Status: </span>
                  {statusInfo.icon}
                  <span className={`ml-1 ${statusInfo.color}`}>
                    {order.status}
                  </span>
                </div>
              )}
              <Link href={`/profile/orders/${order.id}`}>
                <Button className="bg-primary hover:bg-primary/90 text-white w-full md:w-auto">
                  View Details
                </Button>
              </Link>
              {order.status === "Paid" && (
                <Button className="bg-secondary hover:bg-secondary/90 text-white w-full md:w-auto">
                  Extend Rental
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};