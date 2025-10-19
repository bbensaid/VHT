import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { DocumentProvider } from "@/contexts/document-context";
import { AuthProvider } from "@/components/auth-provider";
import { SidebarProvider } from "@/contexts/sidebar-context";

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
          <AuthProvider>
            <DocumentProvider>
              <SidebarProvider>
                {children}
                <Toaster />
              </SidebarProvider>
            </DocumentProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
