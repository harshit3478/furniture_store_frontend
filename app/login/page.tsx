"use client";

import { useEffect, useState } from "react";
import { sendSignInLinkToEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const router = useRouter();
  const [actionCodeSettings, setActionCodeSettings] = useState({
    url: "",
    handleCodeInApp: true,
  });

  useEffect(() => {
    setActionCodeSettings({
      url: `${window.location.origin}/auth/callback/login`,
      handleCodeInApp: true,
    });
  }, []);

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email); // Save email for verification
      alert("Check your email for the sign-in link!"); 
    } catch (error) {
      console.error("Error sending sign-in link:", error);
      alert("Failed to send sign-in link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Get the ID token
      const idToken = await user.getIdToken();
  
      // Call backend API to register/login user
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          displayName: user.displayName,
          photoURL: user.photoURL,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data.error) {
          toast.error(data.error);
          return;
        }
        toast.success("Signed in successfully!");
        router.push("/");
      } else {
        throw new Error("Failed to register user");
      }
    } catch (error) {
      console.error("Error logging in with Google:", error);
      toast.error("Failed to sign in with Google. Please try again.");
    }
  };

  return (
    <div className="bg-gray-100">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/">
                  <h1 className="text-xl font-bold text-gray-800">Furniture Store</h1>
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Login to your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isLoading ? "Sending link..." : "Send Sign-In Link"}
              </button>
            </div>
          </form>
          <div className="flex flex-col items-center justify-center gap-5">
            <button
              onClick={handleGoogleLogin}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Sign in with Google
            </button>
            <div>
              <span className="mt-2 text-sm text-gray-600">Don&apos;t have an account? </span>
              <a href="/signup" className="text-indigo-600 hover:text-indigo-700">
                Signup
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}