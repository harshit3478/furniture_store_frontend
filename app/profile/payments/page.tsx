"use client";

import { FC, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronRight, Download, MoreVertical, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/authContext";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  paymentDate: string;
  invoiceLink?: string;
  orderId?: string;
  order?: {
    orderNumber: string;
    orderItems: Array<{
      duration: number;
      product: {
        name: string;
      };
    }>;
    paymentMethod: string;
  };
}

const MyPaymentsPage: FC = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalPayments, setTotalPayments] = useState(0);

  const fetchPayments = useCallback(async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/payments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch payments");
      }

      const data = await response.json();
      setPayments(data.payments || []);
      setTotalPayments(data.totalPayments || 0);
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Failed to load payment history");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const downloadInvoice = async (paymentId: string) => {
    if (!token) return;

    try {
      setIsDownloading(paymentId);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/payments/invoice/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to generate invoice");
      }

      // Get the invoice data
      await response.json();

      // In a real implementation, you would either:
      // 1. Download a PDF file returned by the backend
      // 2. Generate a PDF on the frontend using a library like jsPDF
      // For now, we'll just show a success message
      toast.success("Invoice downloaded successfully");

      // Simulate opening the invoice in a new tab
      // In a real implementation, you would redirect to a PDF or open a download dialog
      window.open(`/api/invoices/${paymentId}`, '_blank');
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast.error("Failed to download invoice");
    } finally {
      setIsDownloading(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "yyyy-MM-dd HH:mm");
    } catch (error) {
      return dateString;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getRentDuration = (payment: Payment) => {
    if (!payment.order?.orderItems || payment.order.orderItems.length === 0) {
      return "N/A";
    }

    const item = payment.order.orderItems[0];
    const duration = item.duration;

    if (duration <= 1) {
      return "1 month";
    } else {
      return `${duration} months`;
    }
  };

  const getPaymentMethod = (payment: Payment) => {
    if (!payment.order) return "N/A";

    switch (payment.order.paymentMethod) {
      case "Razorpay":
        return "Online Payment";
      case "COD":
        return "Cash on Delivery";
      case "BankTransfer":
        return "Bank Transfer";
      default:
        return payment.order.paymentMethod;
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg border-2 mx-4">
      {/* Breadcrumb - Mobile Only */}
      <div className="md:hidden bg-gray-50 py-2 px-4 text-sm text-gray-600 flex items-center overflow-x-auto whitespace-nowrap">
        <Link href="/profile" className="hover:text-gray-900">
          Profile
        </Link>
        <ChevronRight size={14} className="mx-1" />
        <span className="text-gray-900 font-medium">My Payments</span>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold">My Payments</h1>
        <p className="text-gray-500 text-sm">
          Access your complete payment history on one page.
        </p>
      </div>

      {/* Desktop Header - Hidden on Mobile */}
      <div className="hidden md:block mb-6">
        <h1 className="text-3xl font-gilroySemibold mb-2">My Payments</h1>
        <p className="text-gray-500 font-gilroy text-base mb-6">
          Access your complete payment history on one page.
        </p>
      </div>

      {/* Payment Summary - Desktop */}
      <div className="hidden md:flex justify-between items-center mb-6">
        <div className="flex space-x-8">
          <div>
            <span className="text-lg text-purple-700 font-gilroyMedium">Total Payments:</span>
            <span className="ml-2 font-medium">{formatCurrency(totalPayments)}</span>
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white" disabled={payments.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Download Statement
        </Button>
      </div>

      {/* Payment Summary - Mobile */}
      <div className="md:hidden p-4 bg-purple-50 rounded-md mx-4 my-4">
        <div className="flex justify-between">
          <span className="text-2xl font-gilroyMedium">Total Payments:</span>
          <span className="font-medium text-primary">{formatCurrency(totalPayments)}</span>
        </div>
        <Button className="w-full mt-4 bg-primary hover:bg-primary/90 text-white" disabled={payments.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Download Statement
        </Button>
      </div>

      {/* Payment History - Desktop */}
      <div className="hidden md:block">
        <h2 className="text-lg font-gilroyMedium mb-4">Payment History :</h2>
        {payments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No payment history found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Payment Date & Time</TableHead>
                <TableHead>Amount Paid</TableHead>
                <TableHead>Rent Duration</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.id.substring(0, 10).toUpperCase()}</TableCell>
                  <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                  <TableCell>{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>{getRentDuration(payment)}</TableCell>
                  <TableCell>{getPaymentMethod(payment)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        payment.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : payment.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {payment.status === "Completed" ? "Successful" : payment.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Link href={`/profile/orders/${payment.orderId}`} className="w-full">
                            View Order Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => downloadInvoice(payment.id)}>
                          {isDownloading === payment.id ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Downloading...
                            </>
                          ) : (
                            <>Download Invoice</>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Payment History - Mobile */}
      <div className="md:hidden px-4 pb-4">
        <h2 className="text-lg font-medium mb-4">Payment History</h2>
        {payments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No payment history found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <Card key={payment.id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm font-medium">{payment.id.substring(0, 10).toUpperCase()}</p>
                    <p className="text-xs text-gray-500">{formatDate(payment.paymentDate)}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      payment.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : payment.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {payment.status === "Completed" ? "Successful" : payment.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount:</span>
                    <span>{formatCurrency(payment.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Duration:</span>
                    <span>{getRentDuration(payment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment Method:</span>
                    <span>{getPaymentMethod(payment)}</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-primary"
                    onClick={() => downloadInvoice(payment.id)}
                    disabled={isDownloading === payment.id}
                  >
                    {isDownloading === payment.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>Download Invoice</>
                    )}
                  </Button>
                  <Link href={`/profile/orders/${payment.orderId}`}>
                    <Button variant="ghost" size="sm" className="text-primary">
                      View Order
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPaymentsPage;
