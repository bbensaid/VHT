import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
// Make sure we're importing from the correct path
import { DocumentProvider } from "@/contexts/document-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VT Healthcare Reform",
  description: "Vermont Healthcare Reform Analysis Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DocumentProvider>
            {children}
            <Toaster />
          </DocumentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
