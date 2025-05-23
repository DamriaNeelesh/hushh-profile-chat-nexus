"use client"; // SignupForm is a client component

import SignupForm from "@/components/auth/SignupForm";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter }from "next/navigation";
import { useEffect } from "react";

export default function SignupPage() {
  const { state } = useAuth();
  const router = useRouter();

  // Comment out authentication redirect for frontend UI development
  // useEffect(() => {
  //   if (state.isAuthenticated) {
  //     router.replace("/"); // Redirect if already authenticated
  //   }
  // }, [state.isAuthenticated, router]);
  
  // if (state.isLoading || state.isAuthenticated) {
  //    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  // }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-hushh-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-hushh-700">hushh</h1>
          <p className="mt-2 text-muted-foreground">Your Personal Data Agent</p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
} 