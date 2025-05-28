"use client"; // Sidebar and auth checks make this a client component for now

import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state } = useAuth();
  const router = useRouter();

  // Comment out authentication check for frontend UI development
  // useEffect(() => {
  //   if (!state.isLoading && !state.isAuthenticated) {
  //     router.replace("/login");
  //   }
  // }, [state.isLoading, state.isAuthenticated, router]);

  // if (state.isLoading || !state.isAuthenticated) {
  //   // You can show a global loading spinner here, or a blank page until redirect.
  //   // Ensure this doesn't conflict with page-specific loaders.
  //   return <div className="h-screen flex items-center justify-center">Authenticating...</div>;
  // }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-background">
        {children}
      </main>
    </div>
  );
} 