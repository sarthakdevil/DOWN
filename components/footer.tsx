"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { cn } from "@/lib/utils"

export default function Footer() {
  const { theme } = useTheme()

  return (
    <footer
      className={cn(
        "border-t transition-colors duration-300",
        theme === "dark" ? "bg-[#191919] text-white border-[#333333]" : "bg-white text-gray-900 border-gray-200",
      )}
    >
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center mb-4">
              <span className="text-2xl font-bold">
                <span className="bg-red-600 px-2 py-1 text-white">DOWN</span>
                <span className={cn(theme === "dark" ? "text-white" : "text-gray-900")}>DATING</span>
              </span>
            </Link>
            <p className={cn("mb-4", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
              The most exciting dating experience in your city. Find your match through our premium dating plans.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className={cn(
                  "transition-colors",
                  theme === "dark" ? "text-gray-400 hover:text-red-500" : "text-gray-600 hover:text-red-500",
                )}
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className={cn(
                  "transition-colors",
                  theme === "dark" ? "text-gray-400 hover:text-red-500" : "text-gray-600 hover:text-red-500",
                )}
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className={cn(
                  "transition-colors",
                  theme === "dark" ? "text-gray-400 hover:text-red-500" : "text-gray-600 hover:text-red-500",
                )}
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className={cn("text-lg font-semibold mb-4", theme === "dark" ? "text-white" : "text-gray-900")}>
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className={cn(
                    "transition-colors",
                    theme === "dark" ? "text-gray-400 hover:text-red-500" : "text-gray-600 hover:text-red-500",
                  )}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/plans"
                  className={cn(
                    "transition-colors",
                    theme === "dark" ? "text-gray-400 hover:text-red-500" : "text-gray-600 hover:text-red-500",
                  )}
                >
                  Plans
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className={cn(
                    "transition-colors",
                    theme === "dark" ? "text-gray-400 hover:text-red-500" : "text-gray-600 hover:text-red-500",
                  )}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className={cn(
                    "transition-colors",
                    theme === "dark" ? "text-gray-400 hover:text-red-500" : "text-gray-600 hover:text-red-500",
                  )}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className={cn("text-lg font-semibold mb-4", theme === "dark" ? "text-white" : "text-gray-900")}>
              Contact Us
            </h3>
            <address className={cn("not-italic space-y-2", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
              <p>Dwarka Sec 16C</p>
              <p>New Delhi, India</p>
              <p>Email: downdatingshow@gmail.com</p>
              <p>Phone: +91 98765 43210</p>
            </address>
          </div>
          <div>
            <h3 className={cn("text-lg font-semibold mb-4", theme === "dark" ? "text-white" : "text-gray-900")}>
              Newsletter
            </h3>
            <p className={cn("mb-4", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
              Subscribe to our newsletter for the latest updates on dating plans and special offers.
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Your email"
                className={cn(
                  "px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-300",
                  theme === "dark"
                    ? "bg-[#2a2a2a] border border-[#333333] text-white"
                    : "bg-gray-100 border border-gray-300 text-gray-900",
                )}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div
          className={cn(
            "border-t mt-8 pt-8 text-center transition-colors duration-300",
            theme === "dark" ? "border-[#333333] text-gray-400" : "border-gray-200 text-gray-600",
          )}
        >
          <p>&copy; {new Date().getFullYear()} Downdating. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
