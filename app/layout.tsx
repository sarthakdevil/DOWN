import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { CartProvider } from "@/contexts/cart-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Downdating | Find Your Match",
  description: "The most exciting dating experience in your city",
  icons: {
    icon: "https://downdating.in/logo.jpg",
  },
  openGraph: {
    title: "Downdating | Find Your Match",
    description: "The most exciting dating experience in your city",
    url: "https://downdating.in",
    siteName: "Downdating",
    images: [
      {
        url: "https://downdating.in/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Downdating Logo",
      },
    ],
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Downdating",
              url: "https://downdating.in",
              logo: "https://downdating.in/logo.jpg",
              description: "The most exciting dating experience in your city",
              sameAs: [
                "https://www.facebook.com/downdating",
                "https://www.instagram.com/downdating",
              ],
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Analytics />
              <Footer />
            </div>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
