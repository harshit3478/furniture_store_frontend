// app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { signInWithEmailLink, isSignInWithEmailLink } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleSignIn = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        const email = window.localStorage.getItem("emailForSignUp");
        if (!email) {
          toast.error("Please provide the email again.");
          router.push("/login");
          return;
        }

        try {
          await signInWithEmailLink(auth, email, window.location.href);
          window.localStorage.removeItem("emailForSignIn"); // Clean up
          toast.success("Signed in successfully!");
          router.push("/"); // Adjust redirect as needed
        } catch (error) {
          console.error("Error signing in:", error);
          toast.error("Sign-in failed. Please try again.");
          router.push("/login");
        }
      }
    };

    handleSignIn();
  }, [router]);

  return <div className="flex items-center justify-center min-h-screen">Processing sign-in...</div>;
}