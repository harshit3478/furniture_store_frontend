"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Define furniture categories and subcategories (same as in main-nav.tsx)
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
]

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  const handleNavigation = (href: string) => {
    router.push(href)
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle>Furniture Store</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start" onClick={() => handleNavigation("/")}>
              Home
            </Button>
            <Accordion type="single" collapsible className="w-full">
              {categories.map((category) => (
                <AccordionItem key={category.title} value={category.title}>
                  <AccordionTrigger className="py-2 px-4">{category.title}</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col space-y-2 pl-6">
                      {category.subcategories.map((subcategory) => (
                        <Button
                          key={subcategory.title}
                          variant="ghost"
                          className="justify-start"
                          onClick={() => handleNavigation(subcategory.href)}
                        >
                          {subcategory.title}
                        </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <Button variant="ghost" className="w-full justify-start" onClick={() => handleNavigation("/business")}>
              Business
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => handleNavigation("/faqs")}>
              FAQs
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

