"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect, Suspense } from "react"
import SearchFilters from "./components/search-filters"
import { ProductCard } from "@/components/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductType } from "@/types/product"

function SearchPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Read all query parameters
  const query = searchParams.get("query")?.toLowerCase() || ""
  const categoriesParam = searchParams.get("categories") || searchParams.get("category") || ""
  const minPriceParam = searchParams.get("minPrice") || "0"
  const maxPriceParam = searchParams.get("maxPrice") || "2000"
  const sortByParam = searchParams.get("sortBy") || "name"
  const conditionsParam = searchParams.get("conditions") || ""
  const materialsParam = searchParams.get("materials") || ""
  const minRatingParam = searchParams.get("minRating") || "0"

  // Parse parameters
  const categories = categoriesParam ? categoriesParam.split(",") : []
  const conditions = conditionsParam ? conditionsParam.split(",") : []
  const materials = materialsParam ? materialsParam.split(",") : []

  // Parse numeric parameters
  const minPrice = parseInt(minPriceParam, 10)
  const maxPrice = parseInt(maxPriceParam, 10)
  const minRating = parseFloat(minRatingParam)

  const [products, setProducts] = useState<ProductType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [showSortOptions, setShowSortOptions] = useState(false)

  // Update URL when filters change
  const updateFilters = (
    newCategories: string[] = categories,
    newPriceRange: [number, number] = [minPrice, maxPrice],
    newSortBy: string = sortByParam,
    newConditions: string[] = conditions,
    newMaterials: string[] = materials,
    newMinRating: number = minRating
  ) => {
    // Create a new URLSearchParams object
    const params = new URLSearchParams(searchParams.toString())

    // Update parameters
    if (newCategories.length > 0) {
      params.set("categories", newCategories.join(","))
    } else {
      params.delete("categories")
    }

    if (newConditions.length > 0) {
      params.set("conditions", newConditions.join(","))
    } else {
      params.delete("conditions")
    }

    if (newMaterials.length > 0) {
      params.set("materials", newMaterials.join(","))
    } else {
      params.delete("materials")
    }

    if (newMinRating > 0) {
      params.set("minRating", newMinRating.toString())
    } else {
      params.delete("minRating")
    }

    params.set("minPrice", newPriceRange[0].toString())
    params.set("maxPrice", newPriceRange[1].toString())
    params.set("sortBy", newSortBy)

    // Keep the query parameter if it exists
    if (query) {
      params.set("query", query)
    }

    // Update URL without refreshing page
    router.push(`/search?${params.toString()}`)
  }

  // Handlers for filter changes
  const handleCategoryChange = (newCategories: string[]) => {
    updateFilters(newCategories)
  }

  const handlePriceChange = (newRange: [number, number]) => {
    updateFilters(categories, newRange)
  }

  const handleSortChange = (sort: string) => {
    if (["name", "price_asc", "price_desc", "createdAt_desc"].includes(sort)) {
      updateFilters(categories, [minPrice, maxPrice], sort)
      setShowSortOptions(false) // Close sort options after selection
    }
  }

  const handleConditionChange = (newConditions: string[]) => {
    updateFilters(categories, [minPrice, maxPrice], sortByParam, newConditions)
  }

  const handleMaterialChange = (newMaterials: string[]) => {
    updateFilters(categories, [minPrice, maxPrice], sortByParam, conditions, newMaterials)
  }

  const handleRatingChange = (newRating: number) => {
    updateFilters(categories, [minPrice, maxPrice], sortByParam, conditions, materials, newRating)
  }

  // Fetch products from PostgreSQL via API
  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (query) params.append("query", query)
      params.append("minPrice", minPrice.toString())
      params.append("maxPrice", maxPrice.toString())
      params.append("sortBy", sortByParam)

      if (categories.length > 0) {
        params.append("categories", categories.join(","))
      }

      if (conditions.length > 0) {
        params.append("conditions", conditions.join(","))
      }

      if (materials.length > 0) {
        params.append("materials", materials.join(","))
      }

      if (minRating > 0) {
        params.append("minRating", minRating.toString())
      }

      console.log(`Fetching products with URL: ${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/search?${params.toString()}`)

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/search?${params}`)

      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }

      const result = await response.json()
      console.log("API Response:", result)
      setProducts(result as ProductType[])
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Refetch products when URL parameters change
  useEffect(() => {
    fetchProducts()
  }, [searchParams])

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const toggleSortOptions = () => {
    setShowSortOptions(!showSortOptions)
  }

  // Get page title based on parameters
  const getPageTitle = () => {
    if (query) {
      return `Search results for "${query}"`
    } else if (categories.length === 1) {
      // Capitalize and format category name
      const category = categories[0]
      return category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    } else if (sortByParam === "createdAt_desc") {
      return "All Products"
    } else {
      return "Products"
    }
  }

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-muted-foreground mb-4 border-b border-slate-200 pb-4">
          <span>Home</span>
          <span className="mx-2">/</span>
          <span>{getPageTitle()}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-64 space-y-6 border-r border-slate-200 pr-6">
            <div className="text-xl font-semibold mb-4">Filters</div>
            <SearchFilters
              selectedCategories={categories}
              onCategoryChange={handleCategoryChange}
              priceRange={[minPrice, maxPrice]}
              onPriceChange={handlePriceChange}
              sortBy={sortByParam}
              onSortChange={handleSortChange}
              selectedConditions={conditions}
              onConditionChange={handleConditionChange}
              selectedMaterials={materials}
              onMaterialChange={handleMaterialChange}
              minRating={minRating}
              onRatingChange={handleRatingChange}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">
                {getPageTitle()}
                <span className="text-muted-foreground text-sm ml-2">({products.length} items)</span>
              </h1>

              {/* Sort By - Desktop */}
              <div className="hidden md:flex items-center mt-2 md:mt-0">
                <span className="mr-2 text-sm">Sort By:</span>
                <select
                  className="border rounded-md px-2 py-1 text-sm bg-background"
                  value={sortByParam}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  <option value="name">Popularity</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="createdAt_desc">Newest First</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter/Sort Buttons */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 flex border-t bg-background z-20">
        <button onClick={toggleFilters} className="flex-1 py-4 flex justify-center items-center gap-2 border-r">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="21" x2="4" y2="14"></line>
            <line x1="4" y1="10" x2="4" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12" y2="3"></line>
            <line x1="20" y1="21" x2="20" y2="16"></line>
            <line x1="20" y1="12" x2="20" y2="3"></line>
            <line x1="1" y1="14" x2="7" y2="14"></line>
            <line x1="9" y1="8" x2="15" y2="8"></line>
            <line x1="17" y1="16" x2="23" y2="16"></line>
          </svg>
          Filters
        </button>
        <button
          className="flex-1 py-4 flex justify-center items-center gap-2"
          onClick={toggleSortOptions}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
          Sort By
        </button>
      </div>

      {/* Backdrop for mobile sheets */}
      {(showFilters || showSortOptions) && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => {
            setShowFilters(false);
            setShowSortOptions(false);
          }}
        />
      )}

      {/* Mobile Filters Bottom Sheet */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 bg-background z-40 rounded-t-xl shadow-lg transition-transform duration-300 transform ${
          showFilters ? 'translate-y-0' : 'translate-y-full'
        } max-h-[70vh] overflow-auto`}
      >
        <div className="p-4">
          <div className="flex flex-col items-center pb-2 border-b border-gray-200">
            {/* Handle/Pill for bottom sheet */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mb-4"></div>
            <div className="flex justify-between w-full items-center mb-4">
              <h2 className="text-xl font-bold">Filters</h2>
              <button onClick={toggleFilters} className="p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
          <div className="max-h-[calc(70vh-120px)] overflow-auto">
            <SearchFilters
              selectedCategories={categories}
              onCategoryChange={handleCategoryChange}
              priceRange={[minPrice, maxPrice]}
              onPriceChange={handlePriceChange}
              sortBy={sortByParam}
              onSortChange={handleSortChange}
              selectedConditions={conditions}
              onConditionChange={handleConditionChange}
              selectedMaterials={materials}
              onMaterialChange={handleMaterialChange}
              minRating={minRating}
              onRatingChange={handleRatingChange}
            />
          </div>
          <div className="mt-6 sticky bottom-0 bg-background pt-2 pb-4">
            <button
              onClick={toggleFilters}
              className="w-full bg-purple-600 text-white py-3 rounded-md"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sort Options Bottom Sheet */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 bg-background z-40 rounded-t-xl shadow-lg transition-transform duration-300 transform ${
          showSortOptions ? 'translate-y-0' : 'translate-y-full'
        } max-h-[50vh] overflow-auto`}
      >
        <div className="p-4">
          <div className="flex flex-col items-center pb-2 border-b border-gray-200">
            {/* Handle/Pill for bottom sheet */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mb-4"></div>
            <div className="flex justify-between w-full items-center mb-4">
              <h2 className="text-xl font-bold">Sort By</h2>
              <button onClick={toggleSortOptions} className="p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
          <div className="space-y-4 py-4">
            <button
              onClick={() => handleSortChange("name")}
              className={`w-full text-left py-3 px-4 rounded-md ${sortByParam === "name" ? "bg-purple-600 text-white" : "bg-gray-100"}`}
            >
              Popularity
            </button>
            <button
              onClick={() => handleSortChange("price_asc")}
              className={`w-full text-left py-3 px-4 rounded-md ${sortByParam === "price_asc" ? "bg-purple-600 text-white" : "bg-gray-100"}`}
            >
              Price: Low to High
            </button>
            <button
              onClick={() => handleSortChange("price_desc")}
              className={`w-full text-left py-3 px-4 rounded-md ${sortByParam === "price_desc" ? "bg-purple-600 text-white" : "bg-gray-100"}`}
            >
              Price: High to Low
            </button>
            <button
              onClick={() => handleSortChange("createdAt_desc")}
              className={`w-full text-left py-3 px-4 rounded-md ${sortByParam === "createdAt_desc" ? "bg-purple-600 text-white" : "bg-gray-100"}`}
            >
              Newest First
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductCardSkeleton() {
  return (
    <div className="border rounded-md overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-1/4" />
        <div className="pt-2">
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background p-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  )
}