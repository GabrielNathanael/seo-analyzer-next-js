// src\app\layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://seo.gabrielnathanael.site"),
  title: {
    default: "SEO Analyzer - Check Your Website's Performance",
    template: "%s | SEO Analyzer",
  },
  description:
    "Analyze your website's SEO performance, accessibility, and best practices in seconds with our free SEO Analyzer tool. Get actionable insights to improve your ranking.",
  keywords: [
    "SEO Analyzer",
    "Website Grader",
    "SEO Audit",
    "Site Speed Test",
    "On-Page SEO",
    "Accessibility Check",
  ],
  authors: [{ name: "Gabriel Nathanael Purba" }],
  creator: "Gabriel Nathanael Purba",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://seo.gabrielnathanael.site",
    title: "SEO Analyzer - Free Website Performance Tool",
    description:
      "Get a comprehensive analysis of your website's SEO, accessibility, and performance. Improve your Google ranking today.",
    siteName: "SEO Analyzer",
    images: [
      {
        url: "/seo.webp",
        width: 1200,
        height: 630,
        alt: "SEO Analyzer Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SEO Analyzer - Free Website Performance Tool",
    description:
      "Analyze and improve your website's SEO performance with our free tool.",
    images: ["/seo.webp"],
    creator: "@gabrielnathanael",
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
