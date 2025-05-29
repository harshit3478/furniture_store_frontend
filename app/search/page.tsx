"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect, Suspense, useMemo } from "react"
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

  // Memoize parsed parameters to prevent infinite loops
  const categories = useMemo(() => 
    categoriesParam ? categoriesParam.split(",") : [], 
    [categoriesParam]
  )
  const conditions = useMemo(() => 
    conditionsParam ? conditionsParam.split(",") : [], 
    [conditionsParam]
  )
  const materials = useMemo(() => 
    materialsParam ? materialsParam.split(",") : [], 
    [materialsParam]
  )

  // Parse numeric parameters
  const minPrice = parseInt(minPriceParam, 10)
  const maxPrice = parseInt(maxPriceParam, 10)
  const minRating = parseFloat(minRatingParam)

  const [products, setProducts] = useState<ProductType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  
  // Initialize tempFilters with useMemo to prevent recreating on every render
  const [tempFilters, setTempFilters] = useState(() => ({
    categories: categories,
    priceRange: [minPrice, maxPrice] as [number, number],
    sortBy: sortByParam,
    conditions: conditions,
    materials: materials,
    minRating: minRating
  }))

  // Update temp state when URL params change - using string params instead of arrays
  useEffect(() => {
    setTempFilters({
      categories: categories,
      priceRange: [minPrice, maxPrice],
      sortBy: sortByParam,
      conditions: conditions,
      materials: materials,
      minRating: minRating
    })
  }, [categoriesParam, conditionsParam, materialsParam, minPrice, maxPrice, sortByParam, minRating])

  // Handlers for temporary filter changes
  const handleTempCategoryChange = (newCategories: string[]) => {
    setTempFilters(prev => ({ ...prev, categories: newCategories }))
  }

  const handleTempPriceChange = (newRange: [number, number]) => {
    setTempFilters(prev => ({ ...prev, priceRange: newRange }))
  }

  const handleTempSortChange = (sort: string) => {
    setTempFilters(prev => ({ ...prev, sortBy: sort }))
  }

  const handleTempConditionChange = (newConditions: string[]) => {
    setTempFilters(prev => ({ ...prev, conditions: newConditions }))
  }

  const handleTempMaterialChange = (newMaterials: string[]) => {
    setTempFilters(prev => ({ ...prev, materials: newMaterials }))
  }

  const handleTempRatingChange = (newRating: number) => {
    setTempFilters(prev => ({ ...prev, minRating: newRating }))
  }

  // Apply all filters at once
  const applyFilters = () => {
    // Create a new URLSearchParams object
    const params = new URLSearchParams()

    // Update parameters
    if (tempFilters.categories.length > 0) {
      params.set("categories", tempFilters.categories.join(","))
    } else {
      params.delete("categories")
    }

    if (tempFilters.conditions.length > 0) {
      params.set("conditions", tempFilters.conditions.join(","))
    } else {
      params.delete("conditions")
    }

    if (tempFilters.materials.length > 0) {
      params.set("materials", tempFilters.materials.join(","))
    } else {
      params.delete("materials")
    }

    if (tempFilters.minRating > 0) {
      params.set("minRating", tempFilters.minRating.toString())
    } else {
      params.delete("minRating")
    }

    params.set("minPrice", tempFilters.priceRange[0].toString())
    params.set("maxPrice", tempFilters.priceRange[1].toString())
    params.set("sortBy", tempFilters.sortBy)

    // Keep the query parameter if it exists
    if (query) {
      params.set("query", query)
    }

    // Update URL without refreshing page
    router.push(`/search?${params.toString()}`)
    setShowFilters(false)
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/search?${params}`)

      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }

      const result = await response.json()
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
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-3">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-muted-foreground mb-2 pb-2 ">
          <span>Home</span>
          <span className="mx-2">/</span>
          <span>{getPageTitle()}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-64 space-y-6 border-r border-slate-200 pr-6">
            <div className="text-3xl font-gilroySemibold mb-4">Filters</div>
            <SearchFilters
              selectedCategories={tempFilters.categories}
              onCategoryChange={handleTempCategoryChange}
              priceRange={[minPrice, maxPrice]}
              onPriceChange={handleTempPriceChange}
              tempPriceRange={tempFilters.priceRange}
              onTempPriceChange={handleTempPriceChange}
              sortBy={tempFilters.sortBy}
              onSortChange={handleTempSortChange}
              selectedConditions={tempFilters.conditions}
              onConditionChange={handleTempConditionChange}
              selectedMaterials={tempFilters.materials}
              onMaterialChange={handleTempMaterialChange}
              minRating={tempFilters.minRating}
              onRatingChange={handleTempRatingChange}
              onApply={applyFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <h1 className="text-3xl font-gilroySemibold">
                {getPageTitle()}
                <span className="text-muted-foreground text-base font-gilroyMedium ml-2">({products.length} items)</span>
              </h1>
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

      {/* Mobile Filter Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 flex border-t bg-background z-20">
        <button onClick={toggleFilters} className="flex-1 py-4 flex justify-center items-center gap-2">
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
      </div>

      {/* Backdrop for mobile sheet */}
      {showFilters && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-30"
          onClick={toggleFilters}
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
              selectedCategories={tempFilters.categories}
              onCategoryChange={handleTempCategoryChange}
              priceRange={[minPrice, maxPrice]}
              onPriceChange={handleTempPriceChange}
              tempPriceRange={tempFilters.priceRange}
              onTempPriceChange={handleTempPriceChange}
              sortBy={tempFilters.sortBy}
              onSortChange={handleTempSortChange}
              selectedConditions={tempFilters.conditions}
              onConditionChange={handleTempConditionChange}
              selectedMaterials={tempFilters.materials}
              onMaterialChange={handleTempMaterialChange}
              minRating={tempFilters.minRating}
              onRatingChange={handleTempRatingChange}
              onApply={applyFilters}
            />
          </div>
          <div className="mt-6 sticky bottom-0 bg-background pt-2 pb-4">
            <button
              onClick={applyFilters}
              className="w-full bg-purple-600 text-white py-3 rounded-md"
            >
              Apply Filters
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