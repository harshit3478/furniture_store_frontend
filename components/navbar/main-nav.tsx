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
      { title: "All", href: "/search?category=bedroom" },
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
      { title: "All", href: "/search?category=living-room" },
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
      { title: "All", href: "/search?category=kids" },
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

export function MainNav() {
  return (
    <nav className="hidden md:flex items-center justify-between w-full border-b border-gray-200">
      <ul className="flex space-x-0 items-center">
        {categories.map((category) => (
          <li key={category.title} className="relative group">
            <p
              // href={category.href}
              className="text-gray-600 hover:text-gray-900 px-2 py-2 text-sm flex items-center"
            >
              {category.title}
              <ChevronDown size={16} className="ml-1" />
            </p>
            {/* Dropdown menu */}
            <ul className="absolute left-0 top-full hidden group-hover:block group-focus-within:block bg-white shadow-md rounded-md mt-1 w-48">
              {category.subcategories.map((subcategory) => (
                <li key={subcategory.title}>
                  <Link
                    href={subcategory.href}
                    className="block px-4 py-2 text-md text-gray-600 hover:bg-gray-100"
                  >
                    {subcategory.title}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <ul className="flex space-x-3">
        {/* <li>
          <Link
            href="/business"
            className="text-gray-700  hover:text-gray-900 px-4 py-2 text-sm "
          >
            Business
          </Link>
        </li> */}
        <li>
          <a
            href="#faqs"
            className="text-gray-700 hover:text-gray-900 px-4 py-2 text-sm"
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
