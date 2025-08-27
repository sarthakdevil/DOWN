"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { cn } from "@/lib/utils"

export default function Footer() {
  const { theme } = useTheme()

  return (
    <footer className="border-t transition-colors duration-300 bg-black text-white border-gray-800">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center mb-4">
              <span className="text-2xl font-bold">
                <span className="bg-red-600 px-2 py-1 text-white">DOWN</span>
                <span className="text-white">DATING</span>
              </span>
            </Link>
            <p className="mb-4 text-gray-400">
              The most exciting dating experience in your city. Find your match through our premium dating plans.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="transition-colors text-gray-400 hover:text-red-500"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="transition-colors text-gray-400 hover:text-red-500"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="transition-colors text-gray-400 hover:text-red-500"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="transition-colors text-gray-400 hover:text-red-500"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/plans"
                  className="transition-colors text-gray-400 hover:text-red-500"
                >
                  Plans
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="transition-colors text-gray-400 hover:text-red-500"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition-colors text-gray-400 hover:text-red-500"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Contact Us
            </h3>
            <address className="not-italic space-y-2 text-gray-400">
              <p>Dwarka Sec 16C</p>
              <p>New Delhi, India</p>
              <p>Email: downdatingshow@gmail.com</p>
              <p>Phone: +91 92113 18912</p>
            </address>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Newsletter
            </h3>
            <p className="mb-4 text-gray-400">
              Subscribe to our newsletter for the latest updates on dating plans and special offers.
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-300 bg-gray-800 border border-gray-700 text-white"
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
        <div className="border-t mt-8 pt-8 text-center transition-colors duration-300 border-gray-800 text-gray-400">
          <p>&copy; {new Date().getFullYear()} Downdating. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
