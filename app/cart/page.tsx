"use client"

import { useState } from "react"
import couponsData from "@/data/coupons.json"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useTheme } from "@/contexts/theme-context"
import { cn } from "@/lib/utils"
import RazorpayCheckout from "@/components/razorpay-checkout"

export default function CartPage() {
  const { state, dispatch } = useCart()
  const { theme } = useTheme()
  const [couponCode, setCouponCode] = useState("")
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [discount, setDiscount] = useState(0)
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)

  const removeFromCart = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const addToCart = (item: any) => {
    dispatch({ type: "ADD_ITEM", payload: item })
  }

  const applyCoupon = () => {
    const coupon = couponsData.find(
      (c) => c.code.toUpperCase() === couponCode.trim().toUpperCase()
    )
    if (coupon) {
      // Calculate discount as percentage of subtotal
      const subtotal = state.items.reduce((sum, item) => sum + (item.price || 0), 0)
      const discountAmount = Math.round((subtotal * coupon.discount) / 100)
      setDiscount(discountAmount)
      setAppliedCoupon(coupon.code)
      alert(`Coupon applied! You saved ₹${discountAmount} (${coupon.discount}% off)`)
    } else {
      setDiscount(0)
      setAppliedCoupon(null)
      alert("Invalid coupon code")
    }
  }

  // Calculate totals
  const subtotal = state.items.reduce((sum, item) => sum + (item.price || 0), 0)
  const finalTotal = subtotal - discount

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300",
        theme === "dark" ? "bg-[#212121] text-white" : "bg-white text-gray-900",
      )}
    >
      {/* Back Button */}
      <div className="px-4 pt-4">
        <Link href="/" className="inline-flex items-center text-red-600 hover:text-red-500 transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span className="font-medium">Back</span>
        </Link>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className={cn("text-4xl md:text-5xl font-bold mb-12", theme === "dark" ? "text-white" : "text-gray-900")}>
          Your Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2">
            <h2 className={cn("text-2xl font-bold mb-6", theme === "dark" ? "text-white" : "text-gray-900")}>
              DownDating Show Services
            </h2>
            <div className={cn("h-px mb-6", theme === "dark" ? "bg-gray-600" : "bg-gray-300")}></div>

            {state.items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg mb-4">Your cart is empty</p>
                <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
                  <Link href="/">Continue Shopping</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {state.items.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl border transition-colors duration-300",
                      theme === "dark" ? "bg-[#2a2a2a]/50 border-[#333333]" : "bg-gray-50 border-gray-200",
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-16 h-16 bg-red-600 rounded-full">
                        <span className="text-white font-bold text-sm">{item.icon}</span>
                      </div>
                      <div>
                        <h3 className={cn("font-bold text-lg", theme === "dark" ? "text-white" : "text-gray-900")}>
                          {item.title}
                        </h3>
                        <p className="text-gray-400 text-sm">{item.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={cn("text-xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>
                        ₹{item.price}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className={cn(
                          "border-gray-400 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-300",
                          theme === "dark" && "border-gray-600 text-gray-400 hover:bg-red-900/20",
                        )}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Total Section */}
          <div className="lg:col-span-1">
            <div
              className={cn(
                "rounded-2xl p-6 border transition-colors duration-300",
                theme === "dark" ? "bg-[#2a2a2a]/50 border-[#333333]" : "bg-gray-50 border-gray-200",
              )}
            >
              <h2 className={cn("text-2xl font-bold mb-6", theme === "dark" ? "text-white" : "text-gray-900")}>
                Cart Total
              </h2>
              <div className={cn("h-px mb-6", theme === "dark" ? "bg-gray-600" : "bg-gray-300")}></div>

              <div className="space-y-4 mb-6">
                <div className="flex flex-col gap-1">
                  <span className="text-gray-400">Service Charges</span>
                  {state.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className={cn(theme === "dark" ? "text-white" : "text-gray-900")}>{item.title}</span>
                      <span className={cn(theme === "dark" ? "text-white" : "text-gray-900")}>₹{item.price}</span>
                    </div>
                  ))}
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
              </div>

              <div className={cn("h-px mb-6", theme === "dark" ? "bg-gray-600" : "bg-gray-300")}></div>

              <div className="flex justify-between mb-6">
                <span className={cn("text-xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>
                  Total
                </span>
                <span className={cn("text-xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>
                  ₹{finalTotal}
                </span>
              </div>

              <div className="mb-6">
                <p className="text-gray-400 mb-2">Have a coupons?</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className={cn(
                      "flex-1",
                      theme === "dark" ? "bg-[#121212] border-[#333333] text-white" : "bg-white border-gray-300",
                    )}
                  />
                  <Button variant="outline" onClick={applyCoupon} className="px-6 bg-transparent">
                    Apply
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {couponsData.map((c) => (
                    <span key={c.code} className="mr-2">{c.code}</span>
                  ))}
                </p>
              </div>

              <Button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
                disabled={state.items.length === 0}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>

        {/* Explain more plans Section */}
        {state.items.length > 0 && (
          <div className="mt-16">
            <h2 className={cn("text-2xl font-bold mb-8", theme === "dark" ? "text-white" : "text-gray-900")}>
              Explain more plans
            </h2>
          </div>
        )}
      </div>

      {/* Razorpay Checkout Modal */}
      <RazorpayCheckout isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} amount={finalTotal} />
    </div>
  )
}