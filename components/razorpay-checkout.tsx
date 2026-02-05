"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, QrCode, Upload, Check } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useTheme } from "@/contexts/theme-context"
import { cn } from "@/lib/utils"

interface QRPaymentCheckoutProps {
  isOpen: boolean
  onClose: () => void
  amount: number
}

interface CustomerInfo {
  name: string
  email: string
  phone: string
}

const QR_CODE_IMAGE = "/WhatsApp Image 2025-11-19 at 23.08.35_4a1a2672.png"
const PAYMENT_ID = "s36448@ptaxis"

export default function QRPaymentCheckout({ isOpen, onClose, amount }: QRPaymentCheckoutProps) {
  const [stage, setStage] = useState<"qr" | "upload" | "success">("qr")
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
  })
  const { state, dispatch } = useCart()
  const { theme } = useTheme()

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }))
    const updatedInfo = { ...customerInfo, [field]: value }
    if (updatedInfo.name && updatedInfo.email && updatedInfo.phone) {
      dispatch({ type: "SET_USER_INFO", payload: updatedInfo })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }

      setUploadedFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProceedToUpload = () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert("Please fill in all customer details")
      return
    }
    setStage("upload")
  }

  const handleSubmitScreenshot = async () => {
    if (!uploadedFile) {
      alert("Please select a payment screenshot")
      return
    }

    setIsLoading(true)

    try {
      // Prepare form data for submission
      const formData = new FormData()
      formData.append("screenshot", uploadedFile)
      formData.append("name", customerInfo.name)
      formData.append("email", customerInfo.email)
      formData.append("phone", customerInfo.phone)
      formData.append("plan_ids", JSON.stringify(state.items.map(item => item.id)))
      formData.append("plan_titles", JSON.stringify(state.items.map(item => item.title)))
      formData.append("total_amount", amount.toString())
      formData.append("payment_status", "pending")

      // Submit to API
      const response = await fetch("/api/submit-application", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to submit application")
      }

      console.log("Screenshot upload and application submitted successfully:", result)

      // Fetch Google Form URLs for the purchased plans
      const planIds = state.items.map((item) => item.id)
      const formsResponse = await fetch('/api/getforms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planIds })
      })

      const { forms } = await formsResponse.json()
      
      const plansWithForms = state.items.map((item) => {
        const formData = forms.find((form: any) => form.id === item.id)
        return {
          ...item,
          googleFormUrl: formData?.google_form_url || "#",
        }
      })

      // Process payment successfully
      dispatch({ type: "CLEAR_CART" })

      // Redirect to payment success page
      const planIdsParam = encodeURIComponent(JSON.stringify(plansWithForms.map((p) => p.id)))
      const planTitles = encodeURIComponent(JSON.stringify(plansWithForms.map((p) => p.title)))
      const planPrices = encodeURIComponent(JSON.stringify(plansWithForms.map((p) => p.price)))
      const planFormUrls = encodeURIComponent(JSON.stringify(plansWithForms.map((p) => p.googleFormUrl)))
      const name = encodeURIComponent(customerInfo.name)
      const email = encodeURIComponent(customerInfo.email)
      const phone = encodeURIComponent(customerInfo.phone)

      const successUrl = `/payment-success?planIds=${planIdsParam}&planTitles=${planTitles}&planPrices=${planPrices}&planFormUrls=${planFormUrls}&amount=${amount}&name=${name}&email=${email}&phone=${phone}`

      window.location.href = successUrl
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload screenshot. Please try again.")
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setStage("qr")
    setUploadedFile(null)
    setPreviewUrl("")
    setCustomerInfo({ name: "", email: "", phone: "" })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleReset}>
      <DialogContent
        className={cn(
          "w-[95vw] max-w-sm mx-auto p-3 sm:p-4 transition-colors duration-300 max-h-[90vh] overflow-y-auto",
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
            <QrCode className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            Payment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4">
          {/* Order Summary */}
          <div
            className={cn(
              "rounded-lg p-2 sm:p-3 border",
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

          {stage === "qr" && (
            <>
              {/* Customer Information */}
              <div className="space-y-4">
                <h3
                  className={cn(
                    "font-semibold text-base sm:text-lg",
                    theme === "dark" ? "text-white" : "text-gray-900",
                  )}
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

              {/* QR Code Section */}
              <div className="space-y-4">
                <h3
                  className={cn(
                    "font-semibold text-base sm:text-lg",
                    theme === "dark" ? "text-white" : "text-gray-900",
                  )}
                >
                  Scan & Pay
                </h3>
                <div
                  className={cn(
                    "rounded-lg p-3 sm:p-4 flex flex-col items-center gap-3 border-2 border-dashed",
                    theme === "dark" ? "bg-[#2a2a2a]/50 border-[#444444]" : "bg-gray-50 border-gray-300",
                  )}
                >
                  <img
                    src={QR_CODE_IMAGE || "/placeholder.svg"}
                    alt="Payment QR Code"
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg border-4 border-white shadow-lg"
                  />
                  <div className="text-center space-y-2">
                    <p className={cn("text-sm font-medium", theme === "dark" ? "text-white" : "text-gray-900")}>
                      Scan this QR code to pay
                    </p>
                    <p
                      className={cn(
                        "text-xs font-mono p-2 rounded bg-opacity-50",
                        theme === "dark" ? "bg-[#333333] text-gray-300" : "bg-gray-200 text-gray-700",
                      )}
                    >
                      {PAYMENT_ID}
                    </p>
                  </div>
                </div>

                {/* Alternative: Upload Payment Screenshot */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className={cn("flex-1 h-px", theme === "dark" ? "bg-gray-600" : "bg-gray-300")}></div>
                    <span className={cn("text-xs font-medium px-2", theme === "dark" ? "text-gray-400" : "text-gray-500")}>
                      OR
                    </span>
                    <div className={cn("flex-1 h-px", theme === "dark" ? "bg-gray-600" : "bg-gray-300")}></div>
                  </div>

                  <div className="space-y-2">
                    <Label className={cn("text-sm font-medium", theme === "dark" ? "text-white" : "text-gray-900")}>
                      Already have payment screenshot?
                    </Label>
                    <div
                      className={cn(
                        "rounded-lg p-3 flex flex-col items-center gap-2 border-2 border-dashed cursor-pointer transition-colors",
                        theme === "dark"
                          ? "bg-[#2a2a2a]/30 border-[#444444] hover:border-blue-500/50"
                          : "bg-gray-50 border-gray-300 hover:border-blue-500",
                      )}
                    >
                      <Upload className="h-5 w-5 text-gray-400" />
                      <label className="text-center cursor-pointer">
                        <span className={cn("text-sm font-medium", theme === "dark" ? "text-white" : "text-gray-900")}>
                          Upload payment screenshot
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            handleFileChange(e)
                            if (e.target.files?.[0]) {
                              setStage("upload")
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                      <span className={cn("text-xs", theme === "dark" ? "text-gray-500" : "text-gray-500")}>
                        PNG, JPG, JPEG (max 5MB)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {stage === "upload" && (
            <>
              {/* File Upload Section */}
              <div className="space-y-4">
                <h3
                  className={cn(
                    "font-semibold text-base sm:text-lg",
                    theme === "dark" ? "text-white" : "text-gray-900",
                  )}
                >
                  Upload Payment Screenshot
                </h3>
                <p className={cn("text-sm", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                  Please upload a screenshot of your successful payment to confirm the transaction.
                </p>

                {!previewUrl ? (
                  <div
                    className={cn(
                      "rounded-lg p-8 flex flex-col items-center gap-3 border-2 border-dashed cursor-pointer transition-colors",
                      theme === "dark"
                        ? "bg-[#2a2a2a]/50 border-[#444444] hover:border-blue-500/50"
                        : "bg-gray-50 border-gray-300 hover:border-blue-500",
                    )}
                  >
                    <Upload className="h-8 w-8 text-gray-400" />
                    <label className="text-center cursor-pointer">
                      <span className={cn("text-sm font-medium", theme === "dark" ? "text-white" : "text-gray-900")}>
                        Click to upload screenshot
                      </span>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                    <span className={cn("text-xs", theme === "dark" ? "text-gray-500" : "text-gray-500")}>
                      PNG, JPG, JPEG (max 5MB)
                    </span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div
                      className={cn(
                        "rounded-lg overflow-hidden border-2",
                        theme === "dark" ? "border-[#333333]" : "border-gray-200",
                      )}
                    >
                      <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="Payment screenshot preview"
                        className="w-full h-auto"
                      />
                    </div>
                    <label className="w-full">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => setUploadedFile(null)}
                      >
                        Change Screenshot
                      </Button>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>
                )}
              </div>
            </>
          )}

          {stage === "success" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className={cn("rounded-full p-4", theme === "dark" ? "bg-green-900/30" : "bg-green-100")}>
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-center space-y-2">
                <h3 className={cn("font-semibold text-lg", theme === "dark" ? "text-white" : "text-gray-900")}>
                  Payment Confirmed!
                </h3>
                <p className={cn("text-sm", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                  Your payment screenshot has been received. We'll verify and process your order shortly.
                </p>
              </div>
            </div>
          )}

          {/* Legal Links */}
          <div
            className={cn(
              "text-xs text-center space-y-2 py-3 border-t",
              theme === "dark" ? "text-gray-400 border-gray-600" : "text-gray-500 border-gray-200",
            )}
          >
            <p>By proceeding, you agree to our</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <a 
                href="/terms" 
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "underline hover:no-underline transition-colors",
                  theme === "dark" ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"
                )}
              >
                Terms of Service
              </a>
              <span className="text-gray-400">and</span>
              <a 
                href="/privacy" 
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "underline hover:no-underline transition-colors",
                  theme === "dark" ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"
                )}
              >
                Privacy Policy
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleReset}
              className="h-11 bg-transparent order-2 sm:order-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            {stage === "qr" && (
              <Button
                onClick={handleProceedToUpload}
                disabled={isLoading}
                className="h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium order-1 sm:order-2 sm:flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "I've Paid, Next"
                )}
              </Button>
            )}
            {stage === "upload" && (
              <Button
                onClick={handleSubmitScreenshot}
                disabled={isLoading || !uploadedFile}
                className="h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium order-1 sm:order-2 sm:flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Submit Screenshot"
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
