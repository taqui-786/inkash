import type { Metadata } from "next";
import {
  Fraunces,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
} from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "./providers";

const sans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Inkash - Your Content in the URL",
    template: "%s | Inkash",
  },
  description:
    "Inkash lets you create Markdown documents stored directly in the URL. No sign-ups, no cloud storage, no cookies. Your content is the link. Instant sharing, completely private.",
  keywords: [
    "markdown editor",
    "url storage",
    "hash storage",
    "privacy-first",
    "no account",
    "instant sharing",
    "offline editor",
    "markdown",
    "canvas drawing",
    "private notes",
    "anonymous writing",
    "qr code sharing",
  ],
  authors: [{ name: "Taqui", url: "https://taqui.vercel.app" }],
  creator: "Taqui",
  publisher: "Inkash",
  metadataBase: new URL("https://inkash.vercel.app"), // Update with your actual domain
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://inkash.vercel.app", // Update with your actual domain
    siteName: "Inkash",
    title: "Inkash - Your Content in the URL",
    description:
      "Create Markdown documents stored directly in the URL. No sign-ups, no cloud storage. Your content is the link. Instant sharing, completely private.",
    images: [
      {
        url: "/og-image.png", // Add your Open Graph image
        width: 1200,
        height: 630,
        alt: "Inkash - Content Stored in URL",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Inkash - Your Content in the URL",
    description:
      "Create Markdown stored in the URL. No accounts, no cloud storage. Your content is the link.",
    creator: "@yourtwitterhandle", // Update with your Twitter handle
    images: ["/og-image.png"], // Add your Twitter card image
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body
        className="antialiased"
      >
        <Providers>
          <main className="min-h-dvh h-full w-screen flex flex-col relative z-10">
            <Header />

            {children}

            <Footer />
          </main>
        </Providers>
      </body>
    </html>
  );
}
