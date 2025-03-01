'use client'
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ProductType } from '@/types/product';
import Product from '@/components/Product';
import { auth } from '@/lib/firebase';
export default function Home() {
  const [products, setProducts] = useState<ProductType[]>([]);
  

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('/api/products');
      const productsList = await response.json();

      console.log(productsList.products);
      setProducts(productsList.products);
    };

    fetchProducts();
  }, []);

  // set the firebase token in local storage
  useEffect(() => {
    const setToken = async () => {
      const token = await auth.currentUser?.getIdToken();
      localStorage
        .setItem('firebaseToken', token || '');
        console.log("Token set in local storage", token);
    };
    setToken();
  }
  , []);


  return (
    <div className="bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <Navbar />
      </header>

      {/* Hero Section */}
      <div className="bg-white h-full">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Welcome to</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Our Furniture Store
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Discover comfort and style with our curated collection of furniture.
            </p>
          </div>
        </div>
      </div>

      {/* Product Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Featured Products</h2>
        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product : ProductType) => (
            <Product key={product.id} product={product} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
