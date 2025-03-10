import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"

// Sample combo data
const combos = [
  {
    id: "1",
    title: "Bedroom Combo",
    image: "/placeholder.svg?height=200&width=300",
    href: "/combo/bedroom",
  },
  {
    id: "2",
    title: "Living Room Combo",
    image: "/placeholder.svg?height=200&width=300",
    href: "/combo/living-room",
  },
  {
    id: "3",
    title: "Office Combo",
    image: "/placeholder.svg?height=200&width=300",
    href: "/combo/office",
  },
]

export function ComboSection() {
  return (
    <section className="py-8 bg-gray-50 px-8 w-full">
      <div className="container">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Combos</h2>
          <p className="text-muted-foreground">Best Picks on Combo Deals!</p>
        </div>
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {combos.map((combo) => (
              <Link key={combo.id} href={combo.href} className="group">
                <Card className="overflow-hidden border-0 shadow-sm hover:shadow transition-shadow duration-200">
                  <div className="aspect-[3/2] bg-gray-100">
                    <Image
                      src={combo.image || "/placeholder.svg"}
                      alt={combo.title}
                      width={300}
                      height={200}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  )
}

