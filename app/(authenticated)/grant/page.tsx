"use client"; // GrantAccessForm and ActiveGrantsList are client components

import GrantAccessForm from "@/components/permissions/GrantAccessForm";
import ActiveGrantsList from "@/components/permissions/ActiveGrantsList";
import { Separator } from "@/components/ui/separator";

export default function GrantAccessPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Grant Access</h1>
        <p className="text-muted-foreground">
          Manage who can chat with your Profile
        </p>
      </div>
      <GrantAccessForm />
      <Separator className="my-8" />
      <ActiveGrantsList />
    </div>
  );
} 