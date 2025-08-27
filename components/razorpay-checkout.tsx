"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CreditCard, ExternalLink } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useTheme } from "@/contexts/theme-context"
import { cn } from "@/lib/utils"
import plansData from "@/data/plans.json"

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
  const [showGoogleForms, setShowGoogleForms] = useState(false)
  const [purchasedPlans, setPurchasedPlans] = useState<any[]>([])
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
  })
  const { state, dispatch } = useCart()
  const { theme } = useTheme()

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

  const getGoogleFormUrls = (cartItems: any[]) => {
    return cartItems.map((item) => {
      const planData = plansData.plans.find((plan) => plan.id === item.id)
      return {
        ...item,
        googleFormUrl: planData?.googleFormUrl || "#",
      }
    })
  }

  const handlePayment = async () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert("Please fill in all customer details")
      return
    }

    setIsLoading(true)

    try {
      // Load Razorpay script
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
        body: JSON.stringify({ amount }),
      })

      const orderData = await orderResponse.json()
      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to create order")
      }

      // Configure Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
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

            // Directly show Google Forms and clear cart (no payment verification route)
            const plansWithForms = getGoogleFormUrls(state.items)
            setPurchasedPlans(plansWithForms)
            dispatch({ type: "CLEAR_CART" })
            setShowGoogleForms(true)
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
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleFormsClose = () => {
    setShowGoogleForms(false)
    setPurchasedPlans([])
    onClose()
  }

  const openGoogleForm = (formUrl: string, planTitle: string) => {
    // Add customer info as URL parameters
    const url = new URL(formUrl)
    url.searchParams.set("entry.name", customerInfo.name)
    url.searchParams.set("entry.email", customerInfo.email)
    url.searchParams.set("entry.phone", customerInfo.phone)
    url.searchParams.set("entry.plan", planTitle)

    window.open(url.toString(), "_blank")
  }

  return (
    <>
      {/* Checkout Dialog */}
      <Dialog open={isOpen && !showGoogleForms} onOpenChange={onClose}>
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
              <h3
                className={cn("font-semibold text-base sm:text-lg", theme === "dark" ? "text-white" : "text-gray-900")}
              >
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
                ) : (
                  `Pay ₹${amount}`
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Google Forms Dialog */}
      <Dialog open={showGoogleForms} onOpenChange={handleGoogleFormsClose}>
        <DialogContent
          className={cn(
            "w-[95vw] max-w-lg mx-auto p-4 sm:p-6 max-h-[90vh] overflow-y-auto transition-colors duration-300",
            theme === "dark" ? "bg-[#121212] border-[#333333]" : "bg-white border-gray-200",
          )}
        >
          <DialogHeader className="pb-4">
            <DialogTitle
              className={cn(
                "text-xl sm:text-2xl flex items-center gap-2 leading-tight",
                theme === "dark" ? "text-white" : "text-gray-900",
              )}
            >
              <ExternalLink className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 flex-shrink-0" />
              Complete Your Dating Profiles
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-6">
            <div
              className={cn(
                "rounded-lg p-4 sm:p-6 border text-center",
                theme === "dark" ? "bg-[#2a2a2a]/50 border-[#333333]" : "bg-gray-50 border-gray-200",
              )}
            >
              <h3
                className={cn(
                  "text-lg sm:text-xl font-semibold mb-3",
                  theme === "dark" ? "text-white" : "text-gray-900",
                )}
              >
                🎉 Payment Successful!
              </h3>
              <p
                className={cn(
                  "mb-4 text-sm sm:text-base leading-relaxed",
                  theme === "dark" ? "text-gray-300" : "text-gray-600",
                )}
              >
                Thank you for your purchase! Please complete your dating profile for each plan you've purchased by
                clicking the forms below.
              </p>
            </div>

            <div className="space-y-4">
              <h4
                className={cn("font-semibold text-base sm:text-lg", theme === "dark" ? "text-white" : "text-gray-900")}
              >
                Your Plans & Forms:
              </h4>
              {purchasedPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={cn(
                    "flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border",
                    theme === "dark" ? "bg-[#2a2a2a]/30 border-[#333333]" : "bg-gray-50 border-gray-200",
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <h5
                      className={cn(
                        "font-medium text-base leading-tight",
                        theme === "dark" ? "text-white" : "text-gray-900",
                      )}
                    >
                      {plan.title}
                    </h5>
                    <p className="text-sm text-gray-400 mt-1">₹{plan.price}</p>
                  </div>
                  <Button
                    onClick={() => openGoogleForm(plan.googleFormUrl, plan.title)}
                    className="bg-red-600 hover:bg-red-700 text-white h-10 w-full sm:w-auto"
                    size="sm"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Fill Form
                  </Button>
                </div>
              ))}
            </div>

            <div
              className={cn(
                "rounded-lg p-4 border",
                theme === "dark" ? "bg-[#2a2a2a]/30 border-[#333333]" : "bg-gray-50 border-gray-200",
              )}
            >
              <p className="text-xs sm:text-sm text-gray-400 text-center leading-relaxed">
                💡 <strong>Important:</strong> Please complete all forms to activate your dating plans. Each form is
                specific to the plan you purchased.
              </p>
            </div>

            <div className="flex justify-center pt-2">
              <Button onClick={handleGoogleFormsClose} variant="outline" className="bg-transparent h-10 px-8">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
