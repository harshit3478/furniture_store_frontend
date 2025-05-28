import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cartContext";
import { AuthProvider } from "@/lib/authContext";
import localFont from 'next/font/local';
import { WishlistProvider } from "@/lib/wishlist-context";

const gilroy = localFont({
  src: './../public/fonts/Gilroy-Regular.ttf',
  variable: '--font-gilroy',
});

const gilroySemibold = localFont({
  src: './../public/fonts/Gilroy-Semibold.ttf',
  variable: '--font-gilroy-semibold',
})

const gilroyMedium = localFont({
  src: './../public/fonts/Gilroy-Medium.ttf',
  variable: '--font-gilroy-medium',
})



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
      <body className={`${gilroy.variable} ${gilroySemibold.variable} ${gilroyMedium.variable} font-gilroy`}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
            {children}
            <Analytics/>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
