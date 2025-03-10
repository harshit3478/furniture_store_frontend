"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import AddToCartButton from "@/app/products/[id]/components/AddToCartButton";
import { ProductType } from "@/types/product";

interface ProductCardProps {
  product: ProductType;
}

export function ProductCard({ product}: ProductCardProps) {
  return (
    <Card className={cn("overflow-hidden  shadow-sm border border-slate-300")}>
      <div className="relative">
        {product.discount && (
          <Badge className="absolute top-2 left-2 bg-amber-500 text-white">Price Drop</Badge>
        )}
       

        <Link href={`/products/${product.id}`} className="block overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt="Similar product"
            width={250}
            height={350}
            className="w-full h-72 object-cover"
          />
        </Link>
      </div>
      <CardContent className="py-6 pt-2 px-3 ">
        <div className="flex justify-between mb-2">
          <h3 className="font-medium">{product.name}</h3>
        </div>
        <div className="flex items-baseline mb-4">
          <span className="text-sm font-semibold">₹{product.price}</span>
          <span className="text-xs text-gray-500 ml-1">/month</span>
          <span className="text-xs text-gray-400 line-through ml-2">
            ₹{Math.round(product.price * 1.2)}/month
          </span>
        </div>
        <AddToCartButton product={product} />
      </CardContent>
    </Card>
  );
}

