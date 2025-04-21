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
        const email = window.localStorage.getItem("emailForSignIn");
        if (!email) {
          toast.error("Please provide the email again.");
          router.push("/login");
          return;
        }

        try {
          const userCredential = await signInWithEmailLink(
            auth,
            email,
            window.location.href
          );
          const user = userCredential.user;
          const idToken = await userCredential.user.getIdToken();

          // Get additional user info
          const displayName = user.displayName || "";
          const photoURL = user.photoURL || "";
          console.log("displayname:", displayName,  "photourl", photoURL)

          // call backend api to create user
          const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({ displayName, photoURL }),
          });
          if (response.ok) {
            const data = await response.json();
            if (data.error) {
              toast.error(data.error);
              router.push("/login");
              return;
            }
            window.localStorage.removeItem("emailForSignIn"); // Clean up
            toast.success("Signed in successfully!");

            // Check if there's a redirect URL saved in localStorage
            const redirectUrl = window.localStorage.getItem("redirectAfterLogin");
            if (redirectUrl) {
              window.localStorage.removeItem("redirectAfterLogin"); // Clean up
              router.push(redirectUrl);
            } else {
              router.push("/"); // Default redirect to home
            }
          }
        } catch (error) {
          console.error("Error signing in:", error);
          toast.error("Sign-in failed. Please try again.");
          router.push("/login");
        }
      }
    };

    handleSignIn();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      Processing sign-in...
    </div>
  );
}
