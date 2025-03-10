"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import SearchFilters from "@/components/SearchFilters";
;
import { Navbar } from "@/components/navbar/navbar";
import { Footer } from "@/components/footer/Footer";
import { ProductCard } from "@/components/product-card";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  description: string;
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query")?.toLowerCase() || "";
  const categoryFromUrl = searchParams.get("category")?.toLowerCase() || "";

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryFromUrl ? [categoryFromUrl] : []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [sortBy, setSortBy] = useState<"price_asc" | "price_desc" | "name">("name");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleSortChange = (sort: string) => {
    if (sort === "name" || sort === "price_asc" || sort === "price_desc") {
      setSortBy(sort);
    }
  };

  // Fetch products from PostgreSQL via API
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append("query", query);
      params.append("minPrice", priceRange[0].toString());
      params.append("maxPrice", priceRange[1].toString());
      params.append("sortBy", sortBy);

      if (selectedCategories.length > 0) {
        params.append("categories", selectedCategories.join(","));
      }

      console.log(`Fetching products with URL: /api/products/search?${params.toString()}`);

      const response = await fetch(`/api/products/search?${params}`);
      const result = await response.json();

      console.log("API Response:", result);

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      setProducts(result as Product[]);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refetch products when filters or sorting change
  useEffect(() => {
    fetchProducts();
  }, [query, selectedCategories, priceRange, sortBy]);

  // Update selectedCategories when categoryFromUrl changes
  useEffect(() => {
    if (categoryFromUrl && !selectedCategories.includes(categoryFromUrl)) {
      setSelectedCategories([categoryFromUrl]);
    }
  }, [categoryFromUrl]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-64 space-y-6">
            <SearchFilters
              selectedCategories={selectedCategories}
              onCategoryChange={setSelectedCategories}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              sortBy={sortBy}
              onSortChange={handleSortChange}
            />
          </div>
          <div className="flex-1 text-slate-900">
            <h1 className="text-2xl font-bold mb-6">
              {query ? `Search results for "${query}"` : categoryFromUrl ? `${categoryFromUrl.charAt(0).toUpperCase() + categoryFromUrl.slice(1)}` : "All Products"}
              <span className="text-gray-500 ml-2">
                ({products.length} items)
              </span>
            </h1>
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product}  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}


export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
