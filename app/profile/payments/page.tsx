"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { ChevronRight, Download, MoreVertical } from "lucide-react";
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

// Sample payment data
const payments = [
  {
    id: "TXN123456789",
    date: "2025-03-01 14:30",
    amount: "₹12,000",
    rentDuration: "March 2025 - August 2025 (6 months)",
    paymentMethod: "Credit Card (****3478)",
    status: "Successful",
  },
  {
    id: "TXN123456790",
    date: "2025-03-01 14:30",
    amount: "₹12,000",
    rentDuration: "March 2025 - August 2025 (6 months)",
    paymentMethod: "Credit Card (****3478)",
    status: "Pending",
  },
  {
    id: "TXN123456791",
    date: "2025-03-01 14:30",
    amount: "₹12,000",
    rentDuration: "March 2025 - August 2025 (6 months)",
    paymentMethod: "Credit Card (****3478)",
    status: "Failed",
  },
  {
    id: "TXN123456792",
    date: "2025-03-01 14:30",
    amount: "₹12,000",
    rentDuration: "March 2025 - August 2025 (6 months)",
    paymentMethod: "Credit Card (****3478)",
    status: "Successful",
  },
];

const MyPaymentsPage: FC = () => {
  const totalInvoices = "₹4,567";
  const totalPayments = "₹12,346";

  return (
    <div className="bg-white md:bg-transparent">
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
        <h1 className="text-2xl font-bold mb-2">My Payments</h1>
        <p className="text-gray-500">
          Access your complete payment history on one page.
        </p>
      </div>

      {/* Payment Summary - Desktop */}
      <div className="hidden md:flex justify-between items-center mb-6">
        <div className="flex space-x-8">
          <div>
            <span className="text-sm text-gray-500">Total Invoices:</span>
            <span className="ml-2 font-medium">{totalInvoices}</span>
          </div>
          <div>
            <span className="text-sm text-gray-500">Total Payments:</span>
            <span className="ml-2 font-medium">{totalPayments}</span>
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white">
          <Download className="mr-2 h-4 w-4" />
          Download Statement
        </Button>
      </div>

      {/* Payment Summary - Mobile */}
      <div className="md:hidden p-4 bg-purple-50 rounded-md mx-4 my-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm">Total Invoices:</span>
          <span className="font-medium text-primary">{totalInvoices}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Total Payments:</span>
          <span className="font-medium text-primary">{totalPayments}</span>
        </div>
        <Button className="w-full mt-4 bg-primary hover:bg-primary/90 text-white">
          <Download className="mr-2 h-4 w-4" />
          Download Statement
        </Button>
      </div>

      {/* Payment History - Desktop */}
      <div className="hidden md:block">
        <h2 className="text-lg font-medium mb-4">Payment History</h2>
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
                <TableCell className="font-medium">{payment.id}</TableCell>
                <TableCell>{payment.date}</TableCell>
                <TableCell>{payment.amount}</TableCell>
                <TableCell>{payment.rentDuration}</TableCell>
                <TableCell>{payment.paymentMethod}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      payment.status === "Successful"
                        ? "bg-green-100 text-green-800"
                        : payment.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {payment.status}
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
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Download Invoice</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Payment History - Mobile */}
      <div className="md:hidden px-4 pb-4">
        <h2 className="text-lg font-medium mb-4">Payment History</h2>
        <div className="space-y-4">
          {payments.map((payment) => (
            <Card key={payment.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm font-medium">{payment.id}</p>
                  <p className="text-xs text-gray-500">{payment.date}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    payment.status === "Successful"
                      ? "bg-green-100 text-green-800"
                      : payment.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {payment.status}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount:</span>
                  <span>{payment.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration:</span>
                  <span>{payment.rentDuration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Method:</span>
                  <span>{payment.paymentMethod}</span>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="ghost" size="sm" className="text-primary">
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyPaymentsPage;
