'use client'

import { useState, useEffect } from 'react';
import { products } from '@/data/products';

interface SearchFiltersProps {
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const categories = [...new Set(products.map(p => p.category))];
const maxPrice = Math.max(...products.map(p => p.price));

export default function SearchFilters({
  selectedCategories,
  onCategoryChange,
  priceRange,
  onPriceChange,
  sortBy,
  onSortChange
}: SearchFiltersProps) {
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onPriceChange(localPriceRange);
    }, 300);
    return () => clearTimeout(timeout);
  }, [localPriceRange]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-6 text-black">
      {/* Sorting */}
      <div>
        <h3 className="font-medium mb-3">Sort By</h3>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="name">Name (A-Z)</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-medium mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <label key={category} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={(e) => {
                  const newCategories = e.target.checked
                    ? [...selectedCategories, category]
                    : selectedCategories.filter(c => c !== category);
                  onCategoryChange(newCategories);
                }}
                className="rounded text-indigo-600"
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-medium mb-3">Price Range</h3>
        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max={maxPrice}
            value={localPriceRange[1]}
            onChange={(e) => setLocalPriceRange([localPriceRange[0], parseInt(e.target.value)])}
            className="w-full"
          />
          <div className="flex justify-between text-sm">
            <span>${localPriceRange[0]}</span>
            <span>${localPriceRange[1]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
