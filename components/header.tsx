"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-black/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold">
            <span className="bg-red-600 px-2 py-1 text-white">LOVE</span>
            <span className="text-white">CONNECT</span>
          </span>
        </Link>

        {/* Mobile menu button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
          <span className="sr-only">Toggle menu</span>
        </Button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium uppercase text-white hover:text-red-500 transition-colors">
            Home
          </Link>
          <Link href="/plans" className="text-sm font-medium uppercase text-white hover:text-red-500 transition-colors">
            Plans
          </Link>
          <Link href="/about" className="text-sm font-medium uppercase text-white hover:text-red-500 transition-colors">
            About
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium uppercase text-white hover:text-red-500 transition-colors"
          >
            Contact
          </Link>
          <Button className="bg-red-600 hover:bg-red-700 text-white">Sign Up</Button>
        </nav>

        {/* Mobile navigation */}
        <div
          className={cn(
            "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto bg-black p-6 md:hidden",
            isMenuOpen ? "block" : "hidden",
          )}
        >
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="flex w-full items-center py-3 text-white hover:text-red-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/plans"
              className="flex w-full items-center py-3 text-white hover:text-red-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Plans
            </Link>
            <Link
              href="/about"
              className="flex w-full items-center py-3 text-white hover:text-red-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="flex w-full items-center py-3 text-white hover:text-red-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white">Sign Up</Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
