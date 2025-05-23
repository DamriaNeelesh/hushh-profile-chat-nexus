import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Will create this from src/index.css
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Providers from "@/components/Providers";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Hushh Profile Chat Nexus",
  description: "Your Personal Data Agent, powered by Hushh.",
  // Add more metadata here: openGraph, twitter, icons, etc.
  openGraph: {
    title: "Hushh Profile Chat Nexus",
    description: "Your Personal Data Agent, powered by Hushh.",
    type: "website",
    // Replace with your actual OpenGraph image URL
    images: [{ url: "https://lovable.dev/opengraph-image-p98pqg.png" }],
  },
  twitter: {
    card: "summary_large_image",
    // Replace with your Twitter handle if available
    site: "@lovable_dev",
    // Replace with your actual Twitter image URL
    images: ["https://lovable.dev/opengraph-image-p98pqg.png"],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff', // Example theme color
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <Providers>
          {children}
          <Toaster />
          <Sonner />
        </Providers>
      </body>
    </html>
  );
} 