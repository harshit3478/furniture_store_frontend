"use client";

import { FC } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { OrderItem } from "../components/OrderItem";

// Sample orders data
const orders = [
  {
    id: "1",
    product: {
      name: "Malcom Platform Bed",
      image: "/bedroom-set.jpg",
      price: 799,
    },
    rentedFor: 3,
    orderDate: "2 March 2025",
    orderNumber: "404-4449898-2082702",
  },
  {
    id: "2",
    product: {
      name: "Malcom Platform Bed",
      image: "/dining-table.jpg",
      price: 799,
    },
    rentedFor: 3,
    orderDate: "2 March 2025",
    orderNumber: "404-4449898-2082702",
  },
];

const MyOrdersPage: FC = () => {
  return (
    <div className="bg-white md:bg-transparent">
      {/* Breadcrumb - Mobile Only */}
      <div className="md:hidden py-2 px-4 text-sm text-primary flex items-center overflow-x-auto whitespace-nowrap">
        <Link href="/profile" className="hover:text-gray-900">Profile</Link>
        <ChevronRight size={14} className="mx-1" />
        <span className="font-medium">My Orders</span>
      </div>
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 pt-0 border-b border-gray-200">
        <h1 className="text-xl font-bold">My Orders</h1>
        <p className="text-gray-500 text-sm">See all orders and stay updated with their status</p>
      </div>
      
      {/* Desktop Header - Hidden on Mobile */}
      <div className="hidden md:block mb-6">
        <h1 className="text-2xl font-bold mb-2">My Orders</h1>
        <p className="text-gray-500">See all orders and stay updated with their status</p>
      </div>
      
      {/* Orders List */}
      <div className="p-4 md:p-0 flex flex-col justify-start gap-4 items-start">
        {orders.map((order) => (
          <OrderItem key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default MyOrdersPage;
