"use client"

import * as React from "react"
import Link from "next/link"
import type { User } from "firebase/auth"

import { LocationSelector } from "./location-selector"
import { MainNav } from "./main-nav"
import { MobileNav } from "./mobile-nav"
import { SearchBar } from "./search-bar"
import { UserNav } from "./user-nav"
import { auth } from "@/lib/firebase"

export function Navbar() {
  const [user, setUser] = React.useState<User | null>(null)

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [])

  return (
    <header className="sticky top-0 pt-2  pr-4 z-50 w-full border-b bg-background">
      <div className="up-container flex items-center justify-between px-4 ">
        <div className="flex items-center gap-4 px-2">
          <MobileNav />
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-5xl font-extrabold">LOGO</span>
          </Link>
          <LocationSelector />
        </div>

        <div className="flex  items-center justify-center px-4 gap-5 w-2/5 ">
          <SearchBar />
          <UserNav user={user} />
        </div>

      </div>
      <div className="dropdown-content">
        <div className="ml-auto flex items-center gap-4 px-4">
          <MainNav />
        </div>
      </div>
    </header>
  )
}

