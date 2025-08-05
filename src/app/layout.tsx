// ===== FILE: src/app/layout.tsx =====

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Sidebar from "@/components/layout/Sidebar";
// FIX: Correctly importing Toaster directly from the 'sonner' library
import { Toaster } from "sonner"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Reels Script Generator",
  description: "Generate viral scripts for your social media videos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers attribute="class" defaultTheme="dark" enableSystem>
          <div className="flex h-screen overflow-hidden bg-background text-foreground">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
          {/* Toaster component for notifications */}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}