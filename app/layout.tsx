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
    icon: '/logo.jpg',
  },
  openGraph: {
    title: "Downdating | Find Your Match",
    description: "The most exciting dating experience in your city",
    url: 'https://downdating.in', // Replace with your actual URL
    siteName: 'Downdating',
    images: [
      {
        url: '/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Downdating Logo',
      },
    ],
    type: 'website',
  }
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
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'LoveConnect',
              url: 'https://yourwebsite.com', // Replace with your actual URL
              logo: 'https://yourwebsite.com/logo.jpg', // Replace with your actual URL
              description: 'The most exciting dating experience in your city',
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