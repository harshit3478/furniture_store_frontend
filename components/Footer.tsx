import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

const navigationLinks = {
  main: [
    { name: "Schedule", href: "/schedule" },
    { name: "Courses", href: "/courses" },
    { name: "Pricing", href: "/pricing" },
    { name: "Study in Spain", href: "/study-in-spain" },
    { name: "Books", href: "/books" },
  ],
  about: [
    { name: "About school", href: "/about" },
    { name: "Gallery", href: "/gallery" },
    { name: "News", href: "/news" },
    { name: "Contacts", href: "/contacts" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-white px-8 w-full pt-12 pb-6 border-t border-black">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-medium mb-4">Navigation</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <ul className="space-y-2">
                  {navigationLinks.main.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-sm text-gray-600 hover:text-gray-900">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <ul className="space-y-2">
                  {navigationLinks.about.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-sm text-gray-600 hover:text-gray-900">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Contact us</h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-600">+1 (408) 555-1010</li>
              <li className="text-sm text-gray-600">+1 (408) 555-0123</li>
              <li className="text-sm text-gray-600">help@logoyourcom</li>
            </ul>

            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Follow us</h4>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-500 hover:text-gray-900">
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="#" className="text-gray-500 hover:text-gray-900">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link href="#" className="text-gray-500 hover:text-gray-900">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link href="#" className="text-gray-500 hover:text-gray-900">
                  <Youtube className="h-5 w-5" />
                  <span className="sr-only">YouTube</span>
                </Link>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Location</h4>
              <p className="text-sm text-gray-600">2118 Thornridge Cir. Santa Ana, Calif. 85486</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-end">
            <div className="text-3xl font-bold">Logo</div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-xs text-gray-500">© {new Date().getFullYear()} FurnitureCo. All rights reserved.</div>
            <div className="mt-4 md:mt-0 text-xs text-gray-500">
              <Link href="/privacy" className="hover:text-gray-900">
                Privacy Policy
              </Link>
              {" · "}
              <Link href="/terms" className="hover:text-gray-900">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

