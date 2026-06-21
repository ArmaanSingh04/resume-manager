import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#111010",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Resume Manager | Share and Track Your Resumes",
    template: "%s | Resume Manager",
  },
  description: "Upload, organize, and share all your resumes from one place. Create permanent links, swap files silently, track recruiter views, and analyze performance with AI feedback.",
  keywords: [
    "resume manager",
    "resume builder",
    "track resume views",
    "share resume",
    "dynamic resume links",
    "silent resume swap",
    "ai resume analysis",
    "recruiter view tracking",
    "professional CV host",
    "career portfolio"
  ],
  authors: [{ name: "Armaan Singh" }],
  creator: "Armaan Singh",
  publisher: "Resume Manager",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 
    process.env.NEXTAUTH_URL || 
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Resume Manager | Share and Track Your Resumes",
    description: "Upload, organize, and share all your resumes from one place. Create permanent links, swap files silently, and track recruiter views.",
    url: "/",
    siteName: "Resume Manager",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume Manager | Share and Track Your Resumes",
    description: "Upload, organize, and share all your resumes from one place. Create permanent links, swap files silently, and track recruiter views.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
