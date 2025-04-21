"use client"

import Image from "next/image"
import { useState } from "react"

interface ProductImageGalleryProps {
  images: string[]
  name: string
}

export function ProductImageGallery({ images, name }: ProductImageGalleryProps) {
  // Make sure we have at least one image
  const validImages = images.filter(img => img);
  const [mainImage, setMainImage] = useState(validImages.length > 0 ? validImages[0] : "/placeholder.svg")

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      <div className="flex md:flex-col gap-4 mt-4 md:mt-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`w-20 h-20 border rounded overflow-hidden cursor-pointer ${
              image === mainImage ? "border-blue-500" : "border-gray-200"
            }`}
            onClick={() => setMainImage(image)}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`${name} thumbnail ${index + 1}`}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      <div className="flex-1">
        <div className="aspect-square rounded-lg overflow-hidden">
          <Image
            src={mainImage || "/placeholder.svg"}
            alt={name}
            width={600}
            height={600}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}

