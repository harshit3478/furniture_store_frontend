"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Search, TrendingUp } from "lucide-react"

// Enhanced trending categories with more details
const TRENDING_CATEGORIES = [
  { name: "sofas", key: "sofas" },
  { name: "tables", key: "tables" },
  { name: "beds", key: "beds" },
  { name: "chairs", key: "chairs" },
]

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  // Filter categories based on search input
  const filteredCategories = useMemo(() => {
    return TRENDING_CATEGORIES.filter((category) => category.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`)
      setSearchQuery("")
      // remove focus from input
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
    }
  }

  const handleCategoryClick = (category: string) => {
    router.push(`/search?category=${encodeURIComponent(category)}`)
  }

  return (
    <div className="w-full relative">
      <form onSubmit={handleSearch} className="w-full">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search Chair"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-10 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
            <Search className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Filtered Categories Dropdown */}
        {searchQuery && filteredCategories.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
            {filteredCategories.map((category) => (
              <div
                key={category.key}
                onClick={() => handleCategoryClick(category.name)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {category.name}
                <TrendingUp className="inline-block w-4 h-4 ml-2" />
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  )
}

export default SearchBar

