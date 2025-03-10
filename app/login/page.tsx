"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signInWithPopup, GoogleAuthProvider, sendSignInLinkToEmail } from "firebase/auth"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { toast } from "react-hot-toast"

export default function Login() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [actionCodeSettings, setActionCodeSettings] = useState({
    url: "",
    handleCodeInApp: true,
  })

  useEffect(() => {
    setActionCodeSettings({
      url: `${window.location.origin}/auth/callback/login`,
      handleCodeInApp: true,
    })
  }, [])

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings)
      window.localStorage.setItem("emailForSignIn", email)
      toast.success("Check your email for the sign-in link!")
    } catch (error) {
      console.error("Error sending sign-in link:", error)
      toast.error("Failed to send sign-in link. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // Get the ID token
      const idToken = await user.getIdToken()

      // Call backend API to register/login user
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          displayName: user.displayName,
          photoURL: user.photoURL,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.error) {
          toast.error(data.error)
          return
        }
        toast.success("Signed in successfully!")
        router.push("/")
      } else {
        throw new Error("Failed to register user")
      }
    } catch (error) {
      console.error("Error logging in with Google:", error)
      toast.error("Failed to sign in with Google. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-10">
            <Link href="/" className="text-2xl font-bold">
              Logo
            </Link>
          </div>
          <div className="mb-10">
            <h2 className="text-3xl font-bold">Welcome Back 👋</h2>
            <p className="mt-2 text-muted-foreground">
              Today is a new day. It&apos;s your day. You shape it.
              <br />
              Sign in to continue.
            </p>
          </div>
          <Card className="p-6 shadow-sm border-0">
            <form onSubmit={handleEmailLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending link..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-6" onClick={handleGoogleLogin}>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Sign in with Google
            </Button>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Don&apos;t you have an account? </span>
              <Link href="/signup" className="text-primary font-medium hover:underline">
                Sign up
              </Link>
            </div>
          </Card>

          <p className="mt-10 text-center text-xs text-muted-foreground">© 2023 All Rights Reserved</p>
        </div>
      </div>

      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 h-full w-full object-cover">
          <Image src="/login/login.jpg?height=1080&width=1080" alt="Furniture" fill className="object-cover" priority />
        </div>
      </div>
    </div>
  )
}

