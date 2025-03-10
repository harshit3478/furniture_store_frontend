import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cartContext";
import { AuthProvider } from "@/lib/authContext";


export const metadata: Metadata = {
  title: "FURNITURE STORE",
  description: "YOUR LIFE, YOUR STYLE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <AuthProvider>

        <CartProvider>
        {children}
        </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
