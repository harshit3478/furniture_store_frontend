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
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="flex items-center justify-between px-4 pt-3">
        <div className="flex items-center gap-2 md:gap-4">
          <MobileNav />
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold md:text-2xl">Logo</span>
          </Link>
          <LocationSelector />
        </div>

        <div className="hidden md:flex items-center justify-center gap-4 flex-1 max-w-xl px-4">
          <SearchBar />
        </div>

        <div className="flex items-center gap-1">
          <UserNav user={user} />
        </div>
      </div>

      <div className="md:hidden px-4 pb-3">
        <SearchBar />
      </div>

      <div className="hidden md:block px-2 ">
        <MainNav />
      </div>
    </header>
  )
}

