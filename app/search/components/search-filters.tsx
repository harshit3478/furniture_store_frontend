"use client"

import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface SearchFiltersProps {
  selectedCategories: string[]
  onCategoryChange: (categories: string[]) => void
  priceRange: [number, number]
  onPriceChange: (range: [number, number]) => void
  sortBy: string
  onSortChange: (sort: string) => void
  selectedConditions?: string[]
  onConditionChange?: (conditions: string[]) => void
  selectedMaterials?: string[]
  onMaterialChange?: (materials: string[]) => void
  minRating?: number
  onRatingChange?: (rating: number) => void
  onApply: () => void
  tempPriceRange: [number, number]
  onTempPriceChange: (range: [number, number]) => void
}

export default function SearchFilters({
  selectedCategories,
  onCategoryChange,
  priceRange,
  onPriceChange,
  tempPriceRange,
  onTempPriceChange,
  sortBy,
  onSortChange,
  selectedConditions = [],
  onConditionChange = () => { },
  selectedMaterials = [],
  onMaterialChange = () => { },
  minRating = 0,
  onRatingChange = () => { },
  onApply,
}: SearchFiltersProps) {
  const [minPrice, setMinPrice] = useState(tempPriceRange[0])
  const [maxPrice, setMaxPrice] = useState(tempPriceRange[1])

  // Update local state when temp props change
  useEffect(() => {
    setMinPrice(tempPriceRange[0])
    setMaxPrice(tempPriceRange[1])
  }, [tempPriceRange])

  // Categories matching backend schema
  const categories = [
    { id: "bed-room", label: "Bed Room" },
    { id: "living-room", label: "Living Room" },
    { id: "dining-room", label: "Dining Room" },
    { id: "office", label: "Office" },
    { id: "kids-room", label: "Kids Room" },
    { id: "outdoor", label: "Outdoor" },
  ]

  // Conditions from the Prisma schema Condition enum
  const conditions = [
    { id: "Excellent", label: "Excellent" },
    { id: "Good", label: "Good" },
    { id: "Fair", label: "Fair" },
    { id: "New", label: "New" },
    { id: "Used", label: "Used" },
    { id: "Refurbished", label: "Refurbished" },
    { id: "LikeNew", label: "Like New" },
  ]

  // Materials from the Prisma schema
  const materials = [
    { id: "wood", label: "Wood" },
    { id: "metal", label: "Metal" },
    { id: "ceramics", label: "Ceramics" },
    { id: "glass", label: "Glass" },
    { id: "plastic", label: "Plastic" },
    { id: "fabric", label: "Fabric" },
  ]

  // Sort options
  const sortOptions = [
    { id: "name", label: "Popularity" },
    { id: "price_asc", label: "Price: Low to High" },
    { id: "price_desc", label: "Price: High to Low" },
    { id: "createdAt_desc", label: "Newest First" },
  ]

  // Rating options
  const ratingOptions = [1, 2, 3, 4, 5]

  const handleCategoryChange = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter((c) => c !== category))
    } else {
      onCategoryChange([...selectedCategories, category])
    }
  }

  const handleConditionChange = (condition: string) => {
    if (selectedConditions.includes(condition)) {
      onConditionChange(selectedConditions.filter((c) => c !== condition))
    } else {
      onConditionChange([...selectedConditions, condition])
    }
  }

  const handleMaterialChange = (material: string) => {
    if (selectedMaterials.includes(material)) {
      onMaterialChange(selectedMaterials.filter((m) => m !== material))
    } else {
      onMaterialChange([...selectedMaterials, material])
    }
  }

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value) || 0
    setMinPrice(value)
    onTempPriceChange([value, maxPrice])
  }

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value) || 20000
    setMaxPrice(value)
    onTempPriceChange([minPrice, value])
  }

  return (
    <div className="space-y-6">
      {/* Sort By */}
      <div className="space-y-3">
        <h3 className="font-gilroyMedium text-purple-700">Sort By</h3>
        <RadioGroup 
          value={sortBy} 
          onValueChange={onSortChange}
          className="space-y-2"
        >
          {sortOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id} id={`sort-${option.id}`} />
              <Label htmlFor={`sort-${option.id}`} className="text-sm font-normal cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h3 className="font-gilroyMedium text-purple-700">Categories</h3>
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

      {/* Price Range - Input Only */}
      <div className="space-y-3">
        <h3 className="font-medium text-purple-700">Price Range ($)</h3>
        <div className="flex flex-col space-y-3">
          <div className="flex items-center">
            <Label htmlFor="min-price" className="w-24 text-sm">Min Price:</Label>
            <Input
              id="min-price"
              type="number"
              value={minPrice}
              min={0}
              max={maxPrice - 1}
              onChange={handleMinPriceChange}
              className="w-full"
            />
          </div>
          <div className="flex items-center">
            <Label htmlFor="max-price" className="w-24 text-sm">Max Price:</Label>
            <Input
              id="max-price"
              type="number"
              value={maxPrice}
              min={minPrice + 1}
              max={20000}
              onChange={handleMaxPriceChange}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Condition */}
      <div className="space-y-3">
        <h3 className="font-medium text-purple-700">Condition</h3>
        <div className="space-y-2">
          {conditions.map((condition) => (
            <div key={condition.id} className="flex items-center space-x-2">
              <Checkbox
                id={`condition-${condition.id}`}
                checked={selectedConditions.includes(condition.id)}
                onCheckedChange={() => handleConditionChange(condition.id)}
              />
              <Label htmlFor={`condition-${condition.id}`} className="text-sm font-normal cursor-pointer">
                {condition.label}
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
              <Checkbox
                id={`material-${material.id}`}
                checked={selectedMaterials.includes(material.id)}
                onCheckedChange={() => handleMaterialChange(material.id)}
              />
              <Label htmlFor={`material-${material.id}`} className="text-sm font-normal cursor-pointer">
                {material.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-3">
        <h3 className="font-medium text-purple-700">Minimum Rating</h3>
        <div className="flex items-center space-x-2">
          {ratingOptions.map((rating) => (
            <button
              key={rating}
              onClick={() => onRatingChange(rating)}
              className={`flex items-center justify-center w-8 h-8 rounded-full ${minRating === rating ? 'bg-purple-600 text-white' : 'bg-gray-100'
                }`}
            >
              {rating}
            </button>
          ))}
          {minRating > 0 && (
            <button
              onClick={() => onRatingChange(0)}
              className="text-xs text-purple-700 ml-2"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Apply Filter Button - Desktop only */}
      <button
        className="w-full bg-purple-700 text-white py-2 rounded-md hidden lg:block"
        onClick={onApply}
      >
        Apply filter
      </button>
    </div>
  )
}