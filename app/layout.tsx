import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cartContext";
import { AuthProvider } from "@/lib/authContext";
import localFont from 'next/font/local';
import { Roboto } from 'next/font/google';

const gilroy = localFont({
  src: './../public/fonts/Gilroy-Regular.ttf',
  variable: '--font-gilroy',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500'],
});




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
      <body className={`${gilroy.className}`}>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
