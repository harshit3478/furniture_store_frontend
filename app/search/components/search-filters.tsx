"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface SearchFiltersProps {
  selectedCategories: string[]
  onCategoryChange: (categories: string[]) => void
  priceRange: [number, number]
  onPriceChange: (range: [number, number]) => void
  sortBy: string
  onSortChange: (sort: string) => void
}

export default function SearchFilters({
  selectedCategories,
  onCategoryChange,
  priceRange,
  onPriceChange,
}: SearchFiltersProps) {
  const [minPrice, setMinPrice] = useState(priceRange[0])
  const [maxPrice, setMaxPrice] = useState(priceRange[1])

  const categories = [
    { id: "beds", label: "Beds" },
    { id: "mattresses", label: "Mattresses" },
    { id: "nightstands", label: "Night Stands" },
    { id: "dressers", label: "Dressers" },
    { id: "art", label: "Art" },
  ]

  const colors = [
    { id: "black", label: "Black" },
    { id: "brown", label: "Brown" },
    { id: "beige", label: "Beige" },
    { id: "grey", label: "Grey" },
  ]

  const materials = [
    { id: "wood", label: "Wood" },
    { id: "metal", label: "Metal" },
    { id: "ceramics", label: "Ceramics" },
  ]

  const handleCategoryChange = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter((c) => c !== category))
    } else {
      onCategoryChange([...selectedCategories, category])
    }
  }

  const handlePriceInputChange = (min: number, max: number) => {
    setMinPrice(min)
    setMaxPrice(max)
  }

  const applyPriceFilter = () => {
    onPriceChange([minPrice, maxPrice])
  }

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div className="space-y-3">
        <h3 className="font-medium text-purple-700">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => handleCategoryChange(category.id)}
              />
              <Label htmlFor={`category-${category.id}`} className="text-sm font-normal cursor-pointer">
                {category.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h3 className="font-medium text-purple-700">Price</h3>
        <div className="pt-2 px-1">
          <Slider
            defaultValue={[minPrice, maxPrice]}
            max={2000}
            step={10}
            onValueChange={(values) => {
              handlePriceInputChange(values[0], values[1])
            }}
            onValueCommit={(values) => {
              onPriceChange([values[0], values[1]])
            }}
            className="mb-6"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <span className="text-sm mr-1">Min:</span>
            <Input
              type="number"
              value={minPrice}
              onChange={(e) => {
                const value = Number.parseInt(e.target.value)
                if (!isNaN(value)) {
                  handlePriceInputChange(value, maxPrice)
                }
              }}
              onBlur={applyPriceFilter}
              className="w-20 h-8 text-sm"
            />
          </div>
          <div className="flex items-center">
            <span className="text-sm mr-1">Max:</span>
            <Input
              type="number"
              value={maxPrice}
              onChange={(e) => {
                const value = Number.parseInt(e.target.value)
                if (!isNaN(value)) {
                  handlePriceInputChange(minPrice, value)
                }
              }}
              onBlur={applyPriceFilter}
              className="w-20 h-8 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Color */}
      <div className="space-y-3">
        <h3 className="font-medium text-purple-700">Colour</h3>
        <div className="space-y-2">
          {colors.map((color) => (
            <div key={color.id} className="flex items-center space-x-2">
              <Checkbox id={`color-${color.id}`} />
              <Label htmlFor={`color-${color.id}`} className="text-sm font-normal cursor-pointer">
                {color.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Material */}
      <div className="space-y-3">
        <h3 className="font-medium text-purple-700">Material</h3>
        <div className="space-y-2">
          {materials.map((material) => (
            <div key={material.id} className="flex items-center space-x-2">
              <Checkbox id={`material-${material.id}`} />
              <Label htmlFor={`material-${material.id}`} className="text-sm font-normal cursor-pointer">
                {material.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Apply Filter Button - Desktop only */}
      <button className="w-full bg-purple-700 text-white py-2 rounded-md hidden lg:block">Apply filter</button>
    </div>
  )
}

