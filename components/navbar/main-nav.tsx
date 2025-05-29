"use client";

import * as React from "react";
import Link from "next/link";

import { ChevronDown } from "lucide-react";

// Define furniture categories and subcategories
const categories = [
  {
    title: "Bedroom",
    href: "/search?category=bedroom",
    subcategories: [
      { title: "Beds", href: "/search?category=beds" },
      { title: "Mattresses", href: "/search?category=mattresses" },
      { title: "Nightstands", href: "/search?category=nightstands" },
      { title: "Mirrors", href: "/search?category=mirrors" },
      { title: "Dressers", href: "/search?category=dressers" },
    ],
  },
  {
    title: "Living Room",
    href: "/search?category=living-room",
    subcategories: [
      { title: "Sofas", href: "/search?category=sofas" },
      { title: "Tables", href: "/search?category=tables" },
      { title: "Cabinets", href: "/search?category=cabinets" },
      { title: "Chairs", href: "/search?category=chairs" },
    ],
  },
  {
    title: "Kids",
    href: "/search?category=kids",
    subcategories: [
      { title: "Beds", href: "/search?category=kids-beds" },
      { title: "Desks", href: "/search?category=kids-desks" },
      { title: "Chairs", href: "/search?category=kids-chairs" },
      { title: "Storage", href: "/search?category=kids-storage" },
    ],
  },
  {
    title: "Combos",
    href: "/search?category=combos",
    subcategories: [
      { title: "Bedroom Sets", href: "/search?category=bedroom-sets" },
      { title: "Dining Sets", href: "/search?category=dining-sets" },
      { title: "Office Sets", href: "/search?category=office-sets" },
      { title: "All", href: "/search?category=combos" },
    ],
  },
  {
    title: "Deals & Discounts",
    href: "/deals",
    subcategories: [
      { title: "Clearance", href: "/deals?type=clearance" },
      { title: "Sale", href: "/deals?type=sale" },
      { title: "Seasonal Offers", href: "/deals?type=seasonal" },
      { title: "All Deals", href: "/deals" },
    ],
  },
];

export function   MainNav() {
  const [openDropdown, setOpenDropdown] = React.useState(null);
  const navRef = React.useRef(null);

  // Handle clicking outside to close dropdown
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCategoryClick = (categoryTitle) => {
    setOpenDropdown(openDropdown === categoryTitle ? null : categoryTitle);
  };

  return (
    <nav 
      ref={navRef}
      className="hidden md:flex items-center justify-between w-full border-b border-gray-200 font-gilroyMedium"
    >
      <ul className="flex space-x-0 items-center">
        {categories.map((category) => (
          <li key={category.title} className="relative">
            <button
              onClick={() => handleCategoryClick(category.title)}
              className="text-gray-500 hover:text-gray-900 px-2 py-2 text-base flex items-center cursor-pointer"
            >
              {category.title}
              <ChevronDown 
                size={16} 
                className={`ml-1 transition-transform duration-200 ${
                  openDropdown === category.title ? 'rotate-180' : ''
                }`} 
              />
            </button>
            {/* Dropdown menu */}
            {openDropdown === category.title && (
              <ul className="absolute left-0 top-full bg-white shadow-md rounded-md mt-1 w-48 z-10">
                {category.subcategories.map((subcategory) => (
                  <li key={subcategory.title}>
                    <Link
                      href={subcategory.href}
                      className="block px-4 py-2 text-md text-gray-600 hover:bg-gray-100"
                      onClick={() => setOpenDropdown(null)}
                    >
                      {subcategory.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <ul className="flex space-x-3">
        <li>
          <a
            href="#faqs"
            className="text-gray-500 hover:text-gray-900 px-4 py-2 text-base font-gilroyMedium"
            onClick={(e) => {
              e.preventDefault();
              const faqsSection = document.querySelector("#faqs");
              if (faqsSection) {
                faqsSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            FAQs
          </a>
        </li>
      </ul>
    </nav>
  );
}