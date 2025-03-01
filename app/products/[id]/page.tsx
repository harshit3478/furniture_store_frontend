'use client'; // Mark this as a client component

import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import AddToCartButton from './AddToCartButton';
import { ProductType } from '@/types/product';

async function getProduct(id: string): Promise<ProductType> {
  console.log("Fetching product from:", process.env.NEXT_PUBLIC_API_URL, "with ID:", id);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, { cache: 'no-store' });
  const result = await res.json();
  console.log("API response:", result);
  if (!res.ok) throw new Error('Failed to fetch product');
  return result.product;
}

export default function ProductPage() {
  const pathname = usePathname();
  const id = pathname.split('/').pop(); // Extract the last segment (id)
  const [product, setProduct] = useState<ProductType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Invalid product ID');
      return;
    }

    async function fetchProduct() {
      try {
        if (id) {
          const data = await getProduct(id);
          setProduct(data);
        } else {
          setError('Invalid product ID');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load product');
      }
    }

    fetchProduct();
  }, [id]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Product Image */}
          <div className="lg:max-w-lg lg:self-end">
            <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-center object-cover"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>
            <div className="mt-3">
              <p className="text-3xl text-gray-900">${product.price.toFixed(2)}</p>
            </div>
            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="text-base text-gray-700 space-y-6">{product.description}</div>
            </div>
            <div className="mt-8">
              <Suspense fallback={<div>Loading...</div>}>
                <AddToCartButton product={product} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}