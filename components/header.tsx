"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, ShoppingCart, Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useCart } from "@/contexts/cart-context"
import { useTheme } from "@/contexts/theme-context"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { state } = useCart()
  const { theme, toggleTheme } = useTheme()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-colors duration-300",
        theme === "dark" ? "bg-[#191919] border-[#333333]" : "bg-white border-gray-200",
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="flex items-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-YavdTXSBtHJ9wupTuh8NeFaKmUFs6c.png"
              alt="DownDating Logo"
              width={32}
              height={32}
              className="mr-2"
            />
            <span className="text-xl font-bold text-red-600">DownDating</span>
          </div>
        </Link>

        {/* Desktop Navigation - Centered */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
          <Link
            href="/"
            className={cn(
              "font-medium transition-colors",
              theme === "dark" ? "text-white hover:text-red-500" : "text-gray-900 hover:text-red-500",
            )}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={cn(
              "font-medium transition-colors",
              theme === "dark" ? "text-white hover:text-red-500" : "text-gray-900 hover:text-red-500",
            )}
          >
            About
          </Link>
        </nav>

        {/* Right Side Icons */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={cn(
              "rounded-full transition-colors",
              theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100",
            )}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Cart Icon */}
          <Link href="/cart" className="relative">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer",
                theme === "dark" ? "bg-[#2a2a2a] hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200",
              )}
            >
              <ShoppingCart className={cn("h-5 w-5", theme === "dark" ? "text-white" : "text-gray-900")} />
              {state.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {state.itemCount}
                </span>
              )}
            </div>
          </Link>
        </div>

        {/* Mobile menu button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? (
            <X className={cn("h-6 w-6", theme === "dark" ? "text-white" : "text-gray-900")} />
          ) : (
            <Menu className={cn("h-6 w-6", theme === "dark" ? "text-white" : "text-gray-900")} />
          )}
          <span className="sr-only">Toggle menu</span>
        </Button>

        {/* Mobile navigation */}
        <div
          className={cn(
            "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 md:hidden transition-colors duration-300",
            theme === "dark" ? "bg-[#191919]" : "bg-white",
            isMenuOpen ? "block" : "hidden",
          )}
        >
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className={cn(
                "flex w-full items-center py-3 transition-colors",
                theme === "dark" ? "text-white hover:text-red-500" : "text-gray-900 hover:text-red-500",
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={cn(
                "flex w-full items-center py-3 transition-colors",
                theme === "dark" ? "text-white hover:text-red-500" : "text-gray-900 hover:text-red-500",
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <div className="flex items-center justify-between py-3">
              <Link href="/cart" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center relative",
                    theme === "dark" ? "bg-[#2a2a2a]" : "bg-gray-100",
                  )}
                >
                  <ShoppingCart className={cn("h-5 w-5", theme === "dark" ? "text-white" : "text-gray-900")} />
                  {state.itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {state.itemCount}
                    </span>
                  )}
                </div>
                <span className={cn("ml-3", theme === "dark" ? "text-white" : "text-gray-900")}>
                  Cart ({state.itemCount})
                </span>
              </Link>
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
