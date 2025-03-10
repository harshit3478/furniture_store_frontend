import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"

// Sample offers data
const offers = [
  {
    id: "1",
    title: "30% OFF",
    subtitle: "FOR EVERYTHING",
    code: "COFFEELOVER",
    expiry: "Valid until 31.12.2023",
    terms: "Cannot be combined with other promotions",
    color: "bg-purple-100",
  },
  {
    id: "2",
    title: "10% OFF",
    subtitle: "FOR SECOND ORDER",
    code: "COFFEELOVER",
    expiry: "Valid until 31.12.2023",
    terms: "Cannot be combined with other promotions",
    color: "bg-blue-100",
  },
  {
    id: "3",
    title: "10% OFF",
    subtitle: "FOR SECOND ORDER",
    code: "COFFEELOVER",
    expiry: "Valid until 31.12.2023",
    terms: "Cannot be combined with other promotions",
    color: "bg-blue-100",
  },
]

export function OffersSection() {
  return (
    <section className="py-8 px-8 w-full bg-gray-50">
      <div className="container">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Offers</h2>
          <p className="text-muted-foreground">Checkout these coupons just for you!</p>
        </div>
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <Card key={offer.id} className={`border-0 ${offer.color}`}>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="text-sm font-medium text-purple-800">{offer.subtitle}</div>
                    <div className="text-2xl font-bold">{offer.title}</div>
                  </div>
                  <div className="mb-4">
                    <div className="text-sm">Code: {offer.code}</div>
                    <div className="mt-2 inline-block bg-yellow-400 px-3 py-1 text-xs font-semibold text-black">
                      Copy code
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">
                    <p>{offer.expiry}</p>
                    <p>{offer.terms}</p>
                  </div>
                </CardContent>
              </Card>
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

