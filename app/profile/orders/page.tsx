"use client";

import { FC, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Loader2, ShoppingBag } from "lucide-react";
import { OrderItem as OrderItemComponent } from "../components/OrderItem";
import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { OrderSummary } from "@/types/orders";

const MyOrdersPage: FC = () => {
  const { user, token } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect to login if not logged in
    // if (!user) {
    //   router.push('/login');
    //   return;
    // }

    // Fetch orders
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        console.log("data orders:", data.orders)
        setOrders(data.orders || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [user, token, router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
      <div className="p-4 md:p-0 flex flex-col justify-start gap-4 items-start w-full">
        {isLoading ? (
          <div className="flex justify-center items-center h-64 w-full">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : orders.length === 0 ? (
          <div className="w-full text-center py-8 text-gray-500">
            <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="mb-4">You haven&apos;t placed any orders yet.</p>
            <Link href="/products" className="text-primary hover:underline">
              Browse products
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <OrderItemComponent
              key={order.id}
              order={{
                id: order.id,
                orderNumber: order.orderNumber,
                status: order.status,
                orderDate: formatDate(order.createdAt),
                product: {
                  id: '',
                  name: order.mainProductName,
                  price: order.totalAmount,
                  image: order.mainProductImage,
                },
                rentedFor: order.rentedFor,
                // @ts-expect-error - itemCount is used in the component
                itemCount: order.itemCount
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;