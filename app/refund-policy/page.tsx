"use client"

import { useTheme } from "@/contexts/theme-context"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ChevronLeft, RefreshCw, AlertCircle, CheckCircle, XCircle } from "lucide-react"

export default function RefundPolicyPage() {
  const { theme } = useTheme()

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
          <span className="font-medium">Back to Home</span>
        </Link>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <RefreshCw className="h-12 w-12 text-red-600" />
          </div>
          <h1 className={cn("text-4xl md:text-5xl font-bold mb-4", theme === "dark" ? "text-white" : "text-gray-900")}>
            Cancellation & Refund Policy
          </h1>
          <p className="text-gray-400 text-lg">
            Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Policy Content */}
        <div className="space-y-8">
          {/* Overview */}
          <section
            className={cn(
              "rounded-lg p-6 border",
              theme === "dark" ? "bg-[#2a2a2a]/50 border-[#333333]" : "bg-gray-50 border-gray-200",
            )}
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <h2 className={cn("text-2xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>
                Refund Policy
              </h2>
            </div>
            <p className="text-gray-400 leading-relaxed">
              We provide refunds only if you have not received your Google Form after payment. If you have received the Google Form through email or Instagram DM, no refund will be provided.
            </p>
          </section>

          {/* Refund Conditions */}
          <section
            className={cn(
              "rounded-lg p-6 border",
              theme === "dark" ? "bg-[#2a2a2a]/50 border-[#333333]" : "bg-gray-50 border-gray-200",
            )}
          >
            <h2 className={cn("text-2xl font-bold mb-6", theme === "dark" ? "text-white" : "text-gray-900")}>
              Refund Conditions
            </h2>

            <div className="space-y-6">
              {/* Eligible for Refund */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h3 className={cn("font-semibold mb-2", theme === "dark" ? "text-white" : "text-gray-900")}>
                    Eligible for Refund
                  </h3>
                  <p className="text-gray-400">
                    You are eligible for a full refund if you have not received your Google Form after completing the payment process.
                  </p>
                </div>
              </div>

              {/* Not Eligible for Refund */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <XCircle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <h3 className={cn("font-semibold mb-2", theme === "dark" ? "text-white" : "text-gray-900")}>
                    Not Eligible for Refund
                  </h3>
                  <ul className="text-gray-400 space-y-2">
                    <li>• If you have received the Google Form via email</li>
                    <li>• If you have received the Google Form via Instagram DM</li>
                    <li>• If you have accessed or filled out the Google Form</li>
                    <li>• For any other reasons not related to not receiving the form</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* How to Request Refund */}
          <section
            className={cn(
              "rounded-lg p-6 border",
              theme === "dark" ? "bg-[#2a2a2a]/50 border-[#333333]" : "bg-gray-50 border-gray-200",
            )}
          >
            <h2 className={cn("text-2xl font-bold mb-6", theme === "dark" ? "text-white" : "text-gray-900")}>
              How to Request a Refund
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className={cn("font-semibold", theme === "dark" ? "text-white" : "text-gray-900")}>
                    Contact Support
                  </h4>
                  <p className="text-gray-400">
                    Email us at <span className="text-red-600">support@downdating.in</span> with your refund request
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className={cn("font-semibold", theme === "dark" ? "text-white" : "text-gray-900")}>
                    Provide Proof
                  </h4>
                  <p className="text-gray-400">
                    Include your payment ID, email used for purchase, and explain that you haven't received the Google Form
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className={cn("font-semibold", theme === "dark" ? "text-white" : "text-gray-900")}>
                    Processing Time
                  </h4>
                  <p className="text-gray-400">
                    We'll verify your claim and process the refund within 3-5 business days if eligible
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section
            className={cn(
              "rounded-lg p-6 border text-center",
              theme === "dark" ? "bg-[#2a2a2a]/50 border-[#333333]" : "bg-gray-50 border-gray-200",
            )}
          >
            <h2 className={cn("text-2xl font-bold mb-4", theme === "dark" ? "text-white" : "text-gray-900")}>
              Need Help?
            </h2>
            <p className="text-gray-400 mb-6">
              If you have any questions about our cancellation and refund policy, please don't hesitate to contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="mailto:support@downdating.in"
                className="inline-flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Email Support
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-lg font-medium transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </section>

          {/* Last Updated */}
          <div className="text-center pt-8">
            <p className="text-gray-400 text-sm">
              This policy was last updated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}