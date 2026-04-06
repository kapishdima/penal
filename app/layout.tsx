import type { Metadata } from "next";
import {
  DM_Sans,
  Fira_Code,
  Geist,
  Geist_Mono,
  Manrope,
} from "next/font/google";
import "./globals.css";

import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";

const firaCodeFiraCode = Fira_Code({
  subsets: [
    "cyrillic",
    "cyrillic-ext",
    "greek",
    "greek-ext",
    "latin",
    "latin-ext",
  ],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fira-code",
});

const dmSansDmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-dm-sans",
});

const manropeManrope = Manrope({
  subsets: [
    "cyrillic",
    "cyrillic-ext",
    "greek",
    "latin",
    "latin-ext",
    "vietnamese",
  ],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pennal - Productivity Whiteboard",
  description: "Your personal productivity dashboard on an infinite canvas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        manropeManrope.variable,
        dmSansDmSans.variable,
        firaCodeFiraCode.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
