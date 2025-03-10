"use client";

import { ProductCard } from "@/components/product-card";
import { useToast } from "@/components/ui/use-toast";
import { ProductType } from "@/types/product";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

async function getBestSellers(): Promise<ProductType[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`, {
    cache: "no-store",
    next: { revalidate: 3600 }, // Optional: revalidate every hour
  });
  const result = await res.json();
  if (!res.ok) throw new Error("Failed to fetch similar products");
  return result.products;
}

export function BestsellersSection() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadProducts() {
      try {
        const products = await getBestSellers();
        setProducts(products);
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "Failed to load similar products. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, [toast]);

  return (
    <section className="py-8 px-8 w-full">
      <div className="container">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Weekly Bestsellers</h2>
          <p className="text-muted-foreground">Checkout what&apos;s hot in the market!</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-72 w-full" />
              ))
            : products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </div>
    </section>
  );
}