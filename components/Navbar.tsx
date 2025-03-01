"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { User } from "firebase/auth";
import Link from "next/link";
import Image from "next/image";
import { IoTrendingUp } from "react-icons/io5";

const categories = ["sofas", "tables", "beds", "chairs"];

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
    setShowSuggestions(false);
  };

  const handleCategoryClick = (category: string) => {
    router.push(`/search?category=${encodeURIComponent(category)}`);
    setShowSuggestions(false);
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-800">
                Furniture Store
              </h1>
            </Link>
          </div>

          <div className="flex-1 max-w-xl mx-8 relative">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 border border-gray-300 text-black font-semibold font-serif rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Search
              </button>
            </form>
            {showSuggestions && (
              <div className="absolute z-10 w-full mt-1 bg-white border text-black border-gray-300 rounded-md shadow-lg">
                <ul>
                  {categories.map((category) => (
                    <>
                      <li
                        key={category}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex flex-row justify-start items-center gap-5"
                        onClick={() => handleCategoryClick(category)}
                      >
                        <p>{category}</p>
                        <span>
                           <IoTrendingUp size={20} fontWeight={100}/>
                        </span>
                      </li>
                    </>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Rest of the component remains the same */}
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="text-gray-600 hover:text-gray-900">
              <span className="sr-only">Cart</span>
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </Link>

            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2">
                  <Image
                    src={user.photoURL || "/default-avatar.jpg"}
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full"
                  />
                </button>
                <div className="hidden group-hover:block group-focus-within:block absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Account
                  </Link>
                  <button
                    onClick={() => auth.signOut()}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-4">
                {/* <Link
                  href="/signup"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link> */}
                <Link
                  href="/login"
                  className="bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
