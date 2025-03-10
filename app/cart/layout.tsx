import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar/navbar";
import React from "react";


export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}