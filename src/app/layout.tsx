import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Menanam Sejuta Pohon — Kota Lhokseumawe",
  description: "Program Menanam Sejuta Pohon Kota Lhokseumawe. Gerakan bersama menyelamatkan bumi dari krisis iklim.",
  keywords: ["Sejuta Pohon", "Lhokseumawe", "Menanam Pohon", "Lingkungan", "Iklim"],
  authors: [{ name: "Program Sejuta Pohon" }],
  openGraph: {
    title: "Menanam Sejuta Pohon — Kota Lhokseumawe",
    description: "Gerakan bersama menyelamatkan bumi dari krisis iklim",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
