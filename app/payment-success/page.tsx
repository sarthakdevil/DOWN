"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ExternalLink, CheckCircle, ArrowLeft } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { cn } from "@/lib/utils"

interface Plan {
  id: string
  title: string
  price: number
  google_form_url: string
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { theme } = useTheme()
  const [plans, setPlans] = useState<Plan[]>([])
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [amount, setAmount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get data from URL parameters
    const planIds = searchParams.get("planIds")
    const planTitles = searchParams.get("planTitles")
    const planPrices = searchParams.get("planPrices")
    const planFormUrls = searchParams.get("planFormUrls")
    const totalAmount = searchParams.get("amount")
    const name = searchParams.get("name")
    const email = searchParams.get("email")
    const phone = searchParams.get("phone")

    if (planIds && planTitles && planPrices && planFormUrls) {
      try {
        const ids = JSON.parse(decodeURIComponent(planIds))
        const titles = JSON.parse(decodeURIComponent(planTitles))
        const prices = JSON.parse(decodeURIComponent(planPrices))
        const formUrls = JSON.parse(decodeURIComponent(planFormUrls))

        const plansData = ids.map((id: string, index: number) => ({
          id,
          title: titles[index],
          price: prices[index],
          google_form_url: formUrls[index],
        }))

        setPlans(plansData)
        setAmount(Number.parseInt(totalAmount || "0"))
        setCustomerInfo({
          name: decodeURIComponent(name || ""),
          email: decodeURIComponent(email || ""),
          phone: decodeURIComponent(phone || ""),
        })
      } catch (error) {
        console.error("Error parsing URL parameters:", error)
      }
    }
    setIsLoading(false)
  }, [searchParams])

  const openGoogleForm = (formUrl: string, planTitle: string) => {
    if (!formUrl || formUrl === "#") {
      alert(`No form URL configured for ${planTitle}. Please contact support.`)
      return
    }

    try {
      const url = new URL(formUrl)
      url.searchParams.set("entry.name", customerInfo.name)
      url.searchParams.set("entry.email", customerInfo.email)
      url.searchParams.set("entry.phone", customerInfo.phone)
      url.searchParams.set("entry.plan", planTitle)

      window.open(url.toString(), "_blank")
    } catch (error) {
      console.error("Invalid URL:", formUrl, error)
      alert(`Invalid form URL for ${planTitle}. Please contact support.`)
    }
  }

  const handleGoHome = () => {
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div
      className={cn("min-h-screen transition-colors duration-300", theme === "dark" ? "bg-[#121212]" : "bg-gray-50")}
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className={cn("text-3xl md:text-4xl font-bold mb-4", theme === "dark" ? "text-white" : "text-gray-900")}>
            🎉 {amount === 0 ? "Registration Successful!" : "Payment Successful!"}
          </h1>
          <p className={cn("text-lg mb-6 max-w-2xl mx-auto", theme === "dark" ? "text-gray-300" : "text-gray-600")}>
            {amount === 0
              ? "Thank you for registering! Please complete your dating profile for each free plan by clicking the forms below."
              : "Thank you for your purchase! Please complete your dating profile for each plan you've purchased by clicking the forms below."}
          </p>
        </div>

        {/* Customer Info Summary */}
        <div
          className={cn(
            "rounded-lg p-6 mb-8 border",
            theme === "dark" ? "bg-[#2a2a2a]/50 border-[#333333]" : "bg-white border-gray-200",
          )}
        >
          <h2 className={cn("text-xl font-semibold mb-4", theme === "dark" ? "text-white" : "text-gray-900")}>
            Order Summary
          </h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-400">Customer Name</p>
              <p className={cn("font-medium", theme === "dark" ? "text-white" : "text-gray-900")}>
                {customerInfo.name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className={cn("font-medium", theme === "dark" ? "text-white" : "text-gray-900")}>
                {customerInfo.email}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Phone</p>
              <p className={cn("font-medium", theme === "dark" ? "text-white" : "text-gray-900")}>
                {customerInfo.phone}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Amount</p>
              <p className={cn("font-medium text-lg", theme === "dark" ? "text-white" : "text-gray-900")}>₹{amount}</p>
            </div>
          </div>
        </div>

        {/* Plans and Forms */}
        <div className="space-y-6">
          <h2 className={cn("text-2xl font-semibold text-center", theme === "dark" ? "text-white" : "text-gray-900")}>
            Complete Your Dating Profiles
          </h2>

          {plans.length === 0 ? (
            <div
              className={cn(
                "text-center py-12 rounded-lg border",
                theme === "dark" ? "bg-[#2a2a2a]/30 border-[#333333]" : "bg-white border-gray-200",
              )}
            >
              <p className="text-gray-400 text-lg">No plans found. Please contact support.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {plans.map((plan, index) => (
                <div
                  key={plan.id}
                  className={cn(
                    "p-6 rounded-lg border transition-all duration-200 hover:shadow-lg",
                    theme === "dark"
                      ? "bg-[#2a2a2a]/30 border-[#333333] hover:bg-[#2a2a2a]/50"
                      : "bg-white border-gray-200 hover:shadow-xl",
                  )}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-red-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                          Plan {index + 1}
                        </span>
                        <h3 className={cn("text-xl font-semibold", theme === "dark" ? "text-white" : "text-gray-900")}>
                          {plan.title}
                        </h3>
                      </div>
                      <p className="text-gray-400 mb-3">₹{plan.price}</p>
                      <div
                        className={cn(
                          "text-xs p-3 rounded border font-mono break-all",
                          theme === "dark"
                            ? "bg-[#1a1a1a] border-[#444444] text-gray-300"
                            : "bg-gray-100 border-gray-300 text-gray-600",
                        )}
                      >
                        <span className="text-gray-500">Form URL: </span>
                        <span className={plan.google_form_url === "#" ? "text-red-500" : "text-blue-500"}>
                          {plan.google_form_url === "#" ? "Not configured" : plan.google_form_url}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <Button
                        onClick={() => openGoogleForm(plan.google_form_url, plan.title)}
                        className="bg-red-600 hover:bg-red-700 text-white h-12 px-6 text-base font-medium"
                        disabled={!plan.google_form_url || plan.google_form_url === "#"}
                      >
                        <ExternalLink className="h-5 w-5 mr-2" />
                        {!plan.google_form_url || plan.google_form_url === "#" ? "No Form Available" : "Fill Form"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Important Notice */}
        <div
          className={cn(
            "rounded-lg p-6 mt-8 border",
            theme === "dark" ? "bg-[#2a2a2a]/30 border-[#333333]" : "bg-blue-50 border-blue-200",
          )}
        >
          <p className={cn("text-center leading-relaxed", theme === "dark" ? "text-gray-300" : "text-blue-800")}>
            💡 <strong>Important:</strong> Please complete all forms to activate your dating plans. Each form is
            specific to the plan you purchased. You can bookmark this page to return later if needed.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mt-8">
          <Button onClick={handleGoHome} variant="outline" className="h-12 px-8 text-base font-medium bg-transparent">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  )
}
