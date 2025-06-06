"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import PlanFormModal from "@/components/plan-form-modal"
import plansData from "@/data/plans.json"
import terms from "@/components/terms"
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

export default function PlansPage() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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
          src="/placeholder.svg?height=600&width=1920&text=Dating Plans"
          alt="Dating Plans background"
          fill
          className="object-cover brightness-50"
        />
        <div className="container relative z-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Dating Plans for Every Need</h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl">
              Choose the perfect dating plan that suits your needs and preferences. From casual dating to serious
              relationships.
            </p>
          </div>
        </div>
      </section>

      {/* Plans Comparison */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plansData.plans.map((plan, index) => (
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
                <div className={`p-8 ${plan.popular ? "pt-14" : "pt-8"} text-center`}>
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
                        <Check className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    size="lg"
                    onClick={() => handlePlanSelect(plan)}
                    className={`w-full ${
                      plan.popular ? "bg-red-600 hover:bg-red-700" : "bg-gray-800 hover:bg-gray-700"
                    } text-white`}
                  >
                    Choose plan
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plan Features */}
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
                title: "Relationship Coaching",
                description: "Get expert advice from our relationship coaches to improve your dating experience.",
                icon: "👨‍🏫",
              },
              {
                title: "Personalized Matching",
                description: "Get matches tailored specifically to your preferences and relationship goals.",
                icon: "🎯",
              },
              {
                title: "Success Guarantee",
                description:
                  "If you don't find a meaningful connection in your first 3 months, get an additional month free.",
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

      {/* Testimonials */}
      <section className="py-16 bg-gray-900">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Success Stories</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Hear from couples who found love through our dating plans.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah & Mike",
                plan: "Premium Connect",
                location: "Mumbai",
                story:
                  "The Premium Connect plan matched us perfectly based on our interests and values. We've been together for a year now and couldn't be happier.",
              },
              {
                name: "Jessica & David",
                plan: "Elite Romance",
                location: "Delhi",
                story:
                  "The personal matchmaker from the Elite Romance plan found us the perfect match. We're celebrating our 6-month anniversary next week!",
              },
              {
                name: "Emma & John",
                plan: "Basic Match",
                location: "Bangalore",
                story:
                  "Even with the Basic Match plan, we found each other within the first month. The compatibility algorithm really works!",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-black p-6 rounded-lg border border-gray-800">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <Image
                      src={`/placeholder.svg?height=80&width=80&text=User`}
                      alt="User"
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-gray-400">
                      {testimonial.plan} • {testimonial.location}
                    </p>
                  </div>
                </div>
                <p className="text-gray-300">{testimonial.story}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-black">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                {
                  question: "How does the payment process work?",
                  answer:
                    "After filling out the application form, you'll be shown a QR code for UPI payment. Complete the payment and upload the screenshot. We'll verify and activate your plan within 24 hours.",
                },
                {
                  question: "Can I change my plan after subscribing?",
                  answer:
                    "Yes, you can upgrade or downgrade your plan at any time. Changes will take effect at the start of your next billing cycle.",
                },
                {
                  question: "Is there a contract or commitment period?",
                  answer: "No, all our plans are month-to-month with no long-term commitment. You can cancel anytime.",
                },
                {
                  question: "How long does it take to get matched?",
                  answer:
                    "Most users receive their first matches within 48 hours of plan activation. Premium and Elite users get priority matching.",
                },
                {
                  question: "Are there any hidden fees?",
                  answer: "No, the price you see is the price you pay. There are no hidden fees or additional charges.",
                },
              ].map((faq, index) => (
                <div key={index} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{faq.question}</h3>
                  <p className="text-gray-400">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Find Your Perfect Match?</h2>
            <p className="text-xl text-white/80 mb-8">
              Start your dating journey today. Choose a plan and let us help you find meaningful connections.
            </p>
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8">
              Choose Your Plan
            </Button>
          </div>
        </div>
      </section>

      <PlanFormModal isOpen={isModalOpen} onClose={closeModal} plan={selectedPlan} />
    </div>
  )
}
