"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CreditCard } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useTheme } from "@/contexts/theme-context"
import { cn } from "@/lib/utils"

interface Plan {
  id: string
  title: string
  price: number
  originalPrice?: number
  currency: string
  period: string
  description: string
  features: string[]
  popular: boolean
  color: string
  google_form_url: string
}

interface RazorpayCheckoutProps {
  isOpen: boolean
  onClose: () => void
  amount: number
}

interface CustomerInfo {
  name: string
  email: string
  phone: string
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function RazorpayCheckout({ isOpen, onClose, amount }: RazorpayCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [plans, setPlans] = useState<Plan[]>([])
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
  })
  const { state, dispatch } = useCart()
  const { theme } = useTheme()

  useEffect(() => {
    const fetchPlans = async () => {
      // Try persistent storage first
      const savedPlans = localStorage.getItem("downdating-plans-data")
      if (savedPlans) {
        try {
          const parsedPlans = JSON.parse(savedPlans)
          if (parsedPlans.length > 0 && plans.length === 0) {
            console.log("[CHECKOUT] Loading plans from persistent storage:", parsedPlans)
            setPlans(parsedPlans)
            return
          }
        } catch (error) {
          console.error("[CHECKOUT] Error parsing saved plans:", error)
        }
      }

      // Try cache next
      const cachedPlans = localStorage.getItem("downdating-plans-cache")
      if (cachedPlans) {
        try {
          const parsedPlans = JSON.parse(cachedPlans)
          if (parsedPlans.length > 0 && plans.length === 0) {
            console.log("[CHECKOUT] Loading plans from cache:", parsedPlans)
            setPlans(parsedPlans)
            return
          }
        } catch (error) {
          console.error("[CHECKOUT] Error parsing cached plans:", error)
        }
      }

      // Finally fetch from API
      try {
        console.log("[CHECKOUT] Fetching plans from API")
        const response = await axios.get("/api/getplans")
        const data = response.data
        if (data.plans && data.plans.length > 0 && plans.length === 0) {
          console.log("[CHECKOUT] Setting plans from API:", data.plans)
          setPlans(data.plans)
          // Save to both persistent and cache storage
          const plansData = JSON.stringify(data.plans)
          localStorage.setItem("downdating-plans-data", plansData)
          localStorage.setItem("downdating-plans-cache", plansData)
        }
      } catch (error) {
        console.error("[CHECKOUT] Error fetching plans:", error)
      }
    }
    fetchPlans()
  }, [plans.length])

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }))
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const redirectToSuccessPage = (cartItems: any[]) => {
    const plansWithForms = cartItems.map((item) => {
      const planData = plans.find((plan: Plan) => plan.id === item.id)
      return {
        ...item,
        googleFormUrl: planData?.google_form_url || "#",
      }
    })

    const planIds = encodeURIComponent(JSON.stringify(plansWithForms.map((p) => p.id)))
    const planTitles = encodeURIComponent(JSON.stringify(plansWithForms.map((p) => p.title)))
    const planPrices = encodeURIComponent(JSON.stringify(plansWithForms.map((p) => p.price)))
    const planFormUrls = encodeURIComponent(JSON.stringify(plansWithForms.map((p) => p.googleFormUrl)))
    const name = encodeURIComponent(customerInfo.name)
    const email = encodeURIComponent(customerInfo.email)
    const phone = encodeURIComponent(customerInfo.phone)

    const successUrl = `/payment-success?planIds=${planIds}&planTitles=${planTitles}&planPrices=${planPrices}&planFormUrls=${planFormUrls}&amount=${amount}&name=${name}&email=${email}&phone=${phone}`

    window.location.href = successUrl
  }

  const handlePayment = async () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert("Please fill in all customer details")
      return
    }

    setIsLoading(true)
    console.log("[DEBUG] Starting payment process. Amount:", amount)
    console.log("[DEBUG] Cart items:", state.items)

    try {
      if (amount === 0) {
        console.log("[DEBUG] Processing free plan checkout")

        // For free plans, skip payment and go directly to success page
        const applicationResponse = await fetch("/api/submit-application", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: customerInfo.name,
            email: customerInfo.email,
            phone: customerInfo.phone,
            razorpay_order_id: "free",
            razorpay_payment_id: "free",
            plan_ids: JSON.stringify(state.items.map((item) => item.id)),
            plan_titles: JSON.stringify(state.items.map((item) => item.title)),
            total_amount: amount,
            payment_status: "completed",
          }),
        })

        const applicationResult = await applicationResponse.json()
        console.log("[DEBUG] Application save result:", applicationResult)

        if (!applicationResult.success) {
          console.error("[ERROR] Failed to save application:", applicationResult.error)
          alert("Failed to process your request. Please try again.")
          setIsLoading(false)
          return
        }

        console.log("[DEBUG] Clearing cart and redirecting to success page")
        dispatch({ type: "CLEAR_CART" })
        redirectToSuccessPage(state.items)
        onClose()
        setIsLoading(false)
        return
      }

      // Load Razorpay script for paid plans
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay script")
      }

      // Create order
      const orderResponse = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          planIds: state.items.map((item) => item.id),
        }),
      })

      const orderData = await orderResponse.json()
      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to create order")
      }

      // Configure Razorpay options
      const options = {
        key: process.env.RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "DownDating",
        description: "Dating Plans Purchase",
        order_id: orderData.order.id,
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone,
        },
        theme: {
          color: "#dc2626", // Red color matching your brand
        },
        handler: async (response: any) => {
          try {
            // Save application to database
            const applicationResponse = await fetch("/api/submit-application", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: customerInfo.name,
                email: customerInfo.email,
                phone: customerInfo.phone,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                plan_ids: JSON.stringify(state.items.map((item) => item.id)),
                plan_titles: JSON.stringify(state.items.map((item) => item.title)),
                total_amount: amount,
                payment_status: "completed",
              }),
            })

            const applicationResult = await applicationResponse.json()
            if (!applicationResult.success) {
              console.error("Failed to save application:", applicationResult.error)
            }

            dispatch({ type: "CLEAR_CART" })
            redirectToSuccessPage(state.items)
            onClose()
          } catch (error) {
            console.error("Payment error:", error)
            alert("Payment failed. Please contact support.")
          }
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false)
          },
        },
      }

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error("Payment error:", error)
      alert("Payment failed. Please try again.")
      setIsLoading(false)
    }
  }

  // Debug logging for state changes
  console.log("[DEBUG] Render - isOpen:", isOpen)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "w-[95vw] max-w-md mx-auto p-4 sm:p-6 transition-colors duration-300",
          theme === "dark" ? "bg-[#121212] border-[#333333]" : "bg-white border-gray-200",
        )}
      >
        <DialogHeader className="pb-4">
          <DialogTitle
            className={cn(
              "text-xl sm:text-2xl flex items-center gap-2",
              theme === "dark" ? "text-white" : "text-gray-900",
            )}
          >
            <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
            Checkout
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Order Summary */}
          <div
            className={cn(
              "rounded-lg p-3 sm:p-4 border",
              theme === "dark" ? "bg-[#2a2a2a]/50 border-[#333333]" : "bg-gray-50 border-gray-200",
            )}
          >
            <h3
              className={cn(
                "font-semibold mb-3 text-base sm:text-lg",
                theme === "dark" ? "text-white" : "text-gray-900",
              )}
            >
              Order Summary
            </h3>
            <div className="space-y-2 text-sm">
              {state.items.map((item) => (
                <div key={item.id} className="flex justify-between items-start gap-2">
                  <span className="text-gray-400 flex-1 leading-tight">{item.title}</span>
                  <span
                    className={cn("font-medium whitespace-nowrap", theme === "dark" ? "text-white" : "text-gray-900")}
                  >
                    ₹{item.price}
                  </span>
                </div>
              ))}
              <div className={cn("border-t pt-3 mt-3", theme === "dark" ? "border-gray-600" : "border-gray-300")}>
                <div className="flex justify-between font-semibold text-base">
                  <span className={cn(theme === "dark" ? "text-white" : "text-gray-900")}>Total</span>
                  <span className={cn(theme === "dark" ? "text-white" : "text-gray-900")}>₹{amount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className={cn("font-semibold text-base sm:text-lg", theme === "dark" ? "text-white" : "text-gray-900")}>
              Customer Information
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className={cn("text-sm font-medium", theme === "dark" ? "text-white" : "text-gray-900")}
                >
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={customerInfo.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  className={cn(
                    "h-11 text-base",
                    theme === "dark" ? "bg-[#2a2a2a] border-[#333333] text-white" : "bg-white border-gray-300",
                  )}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className={cn("text-sm font-medium", theme === "dark" ? "text-white" : "text-gray-900")}
                >
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                  className={cn(
                    "h-11 text-base",
                    theme === "dark" ? "bg-[#2a2a2a] border-[#333333] text-white" : "bg-white border-gray-300",
                  )}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className={cn("text-sm font-medium", theme === "dark" ? "text-white" : "text-gray-900")}
                >
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter your phone number"
                  className={cn(
                    "h-11 text-base",
                    theme === "dark" ? "bg-[#2a2a2a] border-[#333333] text-white" : "bg-white border-gray-300",
                  )}
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-11 bg-transparent order-2 sm:order-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isLoading}
              className="h-11 bg-red-600 hover:bg-red-700 text-white font-medium order-1 sm:order-2 sm:flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : amount === 0 ? (
                "Continue for Free"
              ) : (
                `Pay ₹${amount}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
