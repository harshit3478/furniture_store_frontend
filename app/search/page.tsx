"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { products } from "@/data/products";
import SearchFilters from "@/components/SearchFilters";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("query")?.toLowerCase() || "";

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [sortBy, setSortBy] = useState<"price_asc" | "price_desc" | "name">(
    "name"
  );

  const handleSortChange = (sort: string) => {
    if (sort === "name" || sort === "price_asc" || sort === "price_desc") {
      setSortBy(sort);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedCategories.length > 0) {
      params.set("categories", selectedCategories.join(","));
    } else {
      params.delete("categories");
    }
    params.set("minPrice", priceRange[0].toString());
    params.set("maxPrice", priceRange[1].toString());
    params.set("sort", sortBy);

    router.replace(`/search?${params.toString()}`, { scroll: false });
  }, [selectedCategories, priceRange, sortBy]);

  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    )
    .filter(
      (product) =>
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category)
    )
    .filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    )
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

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
              {query ? `Search results for "${query}"` : "All Products"}
              <span className="text-gray-500 ml-2">
                ({filteredProducts.length} items)
              </span>
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-indigo-600 font-bold">${product.price}</span>
                      <span className="text-sm text-gray-500">{product.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
