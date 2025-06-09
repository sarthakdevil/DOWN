"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import PlanFormModal from "@/components/plan-form-modal"
import plansData from "@/data/plans.json"

interface Plan {
  id: string
  title: string
  price: number
  originalPrice: number
  currency: string
  period: string
  description: string
  features: string[]
  popular: boolean
  color: string
}

export default function GeneralPlansPage() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filter general plans (exclude corporate plans)
  const generalPlans = plansData.plans.filter((plan) => !plan.id.includes("corporate-match"))

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedPlan(null)
  }

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/70 z-10"></div>
        <Image
          src="/WhatsApp Image 2025-06-07 at 16.34.58_203925dd.jpg"
          alt="General Dating Plans background"
          fill
          className="object-cover brightness-50"
        />
        <div className="container relative z-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">General Dating Plans</h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl">
              Perfect for everyone looking to find meaningful connections. Choose from various plans based on your
              preferences and timeline.
            </p>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {generalPlans.map((plan, index) => (
              <div
                key={plan.id}
                className={`rounded-lg overflow-hidden ${
                  plan.popular
                    ? "border-2 border-red-600 scale-105 shadow-lg shadow-red-600/20"
                    : "border border-gray-800"
                } bg-gray-900 relative`}
              >
                {plan.popular && (
                  <div className="absolute top-0 inset-x-0 bg-red-600 text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className={`p-6 ${plan.popular ? "pt-14" : "pt-6"} text-center`}>
                  <h3 className="text-xl font-bold text-white mb-2">{plan.title}</h3>
                  <div className="text-3xl font-bold text-white mb-2">
                    ₹{plan.price}
                    <span className="text-sm text-gray-400 font-normal">/{plan.period}</span>
                  </div>
                  {plan.originalPrice > plan.price && (
                    <div className="text-lg text-gray-400 line-through mb-2">₹{plan.originalPrice}</div>
                  )}
                  <p className="text-gray-400 mb-6 text-sm">{plan.description}</p>
                  <ul className="space-y-3 mb-6 text-left">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-300 text-sm">
                        <Check className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    size="sm"
                    onClick={() => handlePlanSelect(plan)}
                    className={`w-full ${
                      plan.popular ? "bg-red-600 hover:bg-red-700" : "bg-gray-800 hover:bg-gray-700"
                    } text-white`}
                  >
                    Choose Plan
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose Our Dating Plans?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our dating plans are designed to help you find meaningful connections based on compatibility, interests,
              and relationship goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Advanced Matching Algorithm",
                description:
                  "Our proprietary algorithm analyzes over 100 compatibility factors to find your perfect match.",
                icon: "🧩",
              },
              {
                title: "Verified Profiles",
                description:
                  "All profiles are verified to ensure you're connecting with real people who are serious about dating.",
                icon: "✓",
              },
              {
                title: "Privacy & Security",
                description:
                  "Your privacy is our priority. Control who sees your profile and communicate safely within our platform.",
                icon: "🔒",
              },
              {
                title: "Fast Matching Options",
                description: "Choose from 24-hour, 3-day, or regular matching based on your timeline preferences.",
                icon: "⚡",
              },
              {
                title: "Special Pricing for Women",
                description: "We offer special discounted pricing for women to encourage more female participation.",
                icon: "💝",
              },
              {
                title: "Community Support",
                description: "Join our dating community for tips, advice, and support from other singles.",
                icon: "🤝",
              },
            ].map((feature, index) => (
              <div key={index} className="bg-black p-6 rounded-lg border border-gray-800">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PlanFormModal isOpen={isModalOpen} onClose={closeModal} plan={selectedPlan} />
    </div>
  )
}
