// ===== FILE: src/app/layout.tsx =====
// This version integrates the Vazirmatn font for a professional Persian UI.

import type { Metadata } from "next";
// FIX: Import the Vazirmatn font from Google Fonts
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Sidebar from "@/components/layout/Sidebar";
import { Toaster } from "sonner"; 

// FIX: Configure the Vazirmatn font
const vazirmatn = Vazirmatn({ 
  subsets: ["arabic", "latin"], // Include subsets for Persian and English characters
  display: 'swap', // Ensures text is visible while the font loads
});

export const metadata: Metadata = {
  title: "هوش مصنوعی تولید سناریو  فراز",
  description: "با هوش مصنوعی فراز، برای ویدیوهای خود سناریو  های وایرال بسازید.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      {/* FIX: Apply the font's CSS class to the body tag */}
      <body className={vazirmatn.className}>
        <Providers attribute="class" defaultTheme="dark" enableSystem>
          <div className="flex h-screen overflow-hidden bg-background text-foreground">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}