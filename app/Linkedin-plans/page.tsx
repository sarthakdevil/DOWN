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

export default function CorporatePlansPage() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filter corporate plans
  const corporatePlans = plansData.plans.filter((plan) => plan.id.includes("corporate-match"))

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
          alt="Corporate Dating Plans background"
          fill
          className="object-cover brightness-50"
        />
        <div className="container relative z-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Corporate Dating Plans</h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl">
              Exclusive matching services designed for working professionals. Connect with like-minded individuals in
              your field.
            </p>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {corporatePlans.map((plan, index) => (
              <div
                key={plan.id}
                className={`rounded-lg overflow-hidden border-2 border-purple-600 scale-105 shadow-lg shadow-purple-600/20 bg-gray-900 relative`}
              >
                <div className="absolute top-0 inset-x-0 bg-purple-600 text-white text-center py-2 text-sm font-medium">
                  Professional Plan
                </div>
                <div className="p-8 pt-14 text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.title}</h3>
                  <div className="text-4xl font-bold text-white mb-2">
                    ₹{plan.price}
                    <span className="text-sm text-gray-400 font-normal">/{plan.period}</span>
                  </div>
                  {plan.originalPrice > plan.price && (
                    <div className="text-lg text-gray-400 line-through mb-2">₹{plan.originalPrice}</div>
                  )}
                  <p className="text-gray-400 mb-6">{plan.description}</p>
                  <ul className="space-y-4 mb-8 text-left">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-300">
                        <Check className="h-5 w-5 text-purple-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    size="lg"
                    onClick={() => handlePlanSelect(plan)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Choose {plan.title.includes("Women") ? "Women's" : "Men's"} Plan
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose Corporate Plans?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our corporate plans are specifically designed for busy professionals who value quality connections and
              efficient matching.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Professional Network",
                description: "Connect with other professionals in your industry and expand your network while dating.",
                icon: "🏢",
              },
              {
                title: "Exclusive Events",
                description: "Access to premium networking events and professional mixers in your city.",
                icon: "🎉",
              },
              {
                title: "Personalized Coaching",
                description: "One-on-one coaching sessions to help you navigate professional dating.",
                icon: "👨‍💼",
              },
              {
                title: "Quality Matches",
                description: "Carefully curated matches based on career goals, education, and lifestyle.",
                icon: "⭐",
              },
              {
                title: "Flexible Scheduling",
                description: "Dating solutions that work around your busy professional schedule.",
                icon: "⏰",
              },
              {
                title: "Privacy Protection",
                description: "Enhanced privacy features to protect your professional reputation.",
                icon: "🔒",
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
