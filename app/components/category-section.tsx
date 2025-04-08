import Image from "next/image";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";

// Define the categories
const categories = [
  {
    id: "bed-room",
    title: "Bed Room",
    image: "/home/categories/bedroom.png?height=150&width=150",
    href: "/search?category=bed-room",
  },
  {
    id: "living-room",
    title: "Living Room",
    image: "/home/categories/livingroom.png?height=150&width=150",
    href: "/search?category=living-room",
  },
  {
    id: "dining-room",
    title: "Dining Room",
    image: "/home/categories/diningroom.png?height=150&width=150",
    href: "/search?category=dining-room",
  },
  {
    id: "office",
    title: "Office",
    image: "/home/categories/office.png?height=150&width=150",
    href: "/search?category=office",
  },
  {
    id: "kids-room",
    title: "Kids Room",
    image: "/home/categories/kidsroom.png?height=150&width=150",
    href: "/search?category=kids-room",
  },
  {
    id: "outdoor",
    title: "Outdoor",
    image: "/home/categories/outdoor.png?height=150&width=150",
    href: "/search?category=outdoor",
  },
];

export function CategorySection() {
  return (
    <section className="py-8 px-8 w-full categories">
      <div className="container">
        <div className="mb-2">
          <h2 className="text-2xl font-semibold">Categories</h2>
          <p className="text-muted-foreground text-sm">
            Furniture for all your furnishing needs!
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link key={category.id} href={category.href} className="group">
              <Card className="border-0 shadow-sm hover:shadow transition-shadow duration-200 bg--300">
                <CardContent className=" flex flex-col items-center text-center border border-1  ">
                  <div className="relative w-32 h-32 mb-2 ">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="font-medium group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
