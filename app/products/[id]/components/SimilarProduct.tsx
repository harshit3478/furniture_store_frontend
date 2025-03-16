import { ProductCard } from "@/components/product-card";
import { useToast } from "@/components/ui/use-toast";
import { ProductType } from "@/types/product";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

async function getSimilarProducts(): Promise<ProductType[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`,
    {
      cache: "no-store",
      next: { revalidate: 3600 }, // Optional: revalidate every hour
    }
  );
  const result = await res.json();
  if (!res.ok) throw new Error("Failed to fetch similar products");
  return result.products;
}

export function SimilarProducts() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadProducts() {
      try {
        const products = await getSimilarProducts();
        setProducts(products);
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description:
            "Failed to load similar products. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, [toast]);

  return (
    <div className="flex flex-col space-y-4 my-10">
      <h2 className="text-black font-semibold text-2xl">Similar Products :</h2>
      <div className="grid grid-cols-2 gap-2 md:gap-10 md:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-72 w-full" />
            ))
          : products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>
    </div>
  );
}
