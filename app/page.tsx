"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Star, Heart, ChevronRight, ChevronDown, ShoppingBag, Check, ChevronLeft } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useTheme } from "@/contexts/theme-context"
import { cn } from "@/lib/utils"
import { useRef } from "react"
interface Plan {
  id: string
  title: string
  price: number
  original_price?: number
  currency: string
  period: string
  description: string
  features: string[]
  popular: boolean
  color: string
  google_form_url: string
}
export default function Home() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const [addedToCart, setAddedToCart] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [plans, setPlans] = useState<Plan[]>([])
  const { dispatch, state } = useCart()
  const { theme } = useTheme()
  const plansLoaded = useRef(false)
  const galleryImages = ["WhatsApp Image 2025-08-27 at 16.54.05_f5c07bba.jpg", "IMG_5290.jpg", "IMG_5330.jpg"]

  const reelsGallery = [
    "WhatsApp Image 2025-08-27 at 16.54.05_f5c07bba.jpg",
    "IMG_5290.jpg",
    "IMG_5330.jpg",
    "WhatsApp Image 2025-08-24 at 12.55.48_8811ad1f.jpg",
  ]

  // Separate localStorage keys for different data
  const PLANS_STORAGE_KEY = "downdating-plans-data"
  const PLANS_CACHE_KEY = "downdating-plans-cache"

  // Utility functions for localStorage management
  const savePlansToStorage = (plansData: Plan[]) => {
    const data = JSON.stringify(plansData)
    localStorage.setItem(PLANS_STORAGE_KEY, data)
    localStorage.setItem(PLANS_CACHE_KEY, data)
  }

  const loadPlansFromStorage = (key: string): Plan[] | null => {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error(`Error loading plans from ${key}:`, error)
      localStorage.removeItem(key) // Remove corrupted data
      return null
    }
  }

  const forceClearCache = () => {
    console.log('Force clearing plans cache...')
    localStorage.removeItem(PLANS_STORAGE_KEY)
    localStorage.removeItem(PLANS_CACHE_KEY)
    // Also clear any other related cache keys
    localStorage.removeItem('cachedPlans')
    // Note: Keeping cart data intact - localStorage.removeItem('downdating-cart')
  }

  useEffect(() => {
    const fetchPlans = async () => {
      if (plansLoaded.current) return // Prevent multiple loads

      // Force clear cache on every load
      forceClearCache()

      // Always fetch fresh data from API (skip localStorage)
      try {
        console.log("Fetching fresh plans from API (cache cleared)")
        const response = await axios.get("/api/getplans")
        const data = response.data
        if (data.plans && data.plans.length > 0) {
          console.log("Setting fresh plans from API:", data.plans)
          setPlans(data.plans)
          // Optionally save to storage if you want to keep it for other purposes
          // savePlansToStorage(data.plans)
          plansLoaded.current = true
        }
      } catch (error) {
        console.error("Error fetching plans:", error)
      }
    }

    fetchPlans()
  }, []) // Empty dependency array

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % galleryImages.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [galleryImages.length])

  useEffect(() => {
    const galleryInterval = setInterval(() => {
      setGalleryIndex((prevIndex) => (prevIndex + 1) % reelsGallery.length)
    }, 4000)

    return () => clearInterval(galleryInterval)
  }, [reelsGallery.length])

  const nextGalleryImage = () => {
    setGalleryIndex((prevIndex) => (prevIndex + 1) % reelsGallery.length)
  }

  const prevGalleryImage = () => {
    setGalleryIndex((prevIndex) => (prevIndex - 1 + reelsGallery.length) % reelsGallery.length)
  }

  const faqItems = [
    {
      question: "How does the matching process work?",
      answer:
        "Our advanced algorithm analyzes your preferences, interests, and compatibility factors to find the best matches for you. We consider over 100 different parameters to ensure quality connections.",
    },
    {
      question: "What makes DownDating different from other dating apps?",
      answer:
        "DownDating focuses on meaningful connections rather than endless swiping. We offer personalized matching, verified profiles, and both online and offline dating experiences.",
    },
    {
      question: "How quickly will I get matched?",
      answer:
        "Depending on your chosen plan, you can get matched within 24 hours, 3 days, or through our regular matching process. Premium plans offer faster matching with priority placement.",
    },
    {
      question: "Is my personal information safe and secure?",
      answer:
        "Yes, we take privacy and security very seriously. All profiles are verified, and we use advanced encryption to protect your personal data. You have full control over who can see your profile.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Yes, you can cancel your subscription at any time. There are no long-term commitments, and you'll continue to have access to your plan until the end of your current billing period.",
    },
    {
      question: "Do you offer refunds if I'm not satisfied?",
      answer:
        "We offer a satisfaction guarantee. If you don't find meaningful connections within your first month, we'll work with you to improve your experience or provide a refund based on our terms.",
    },
  ]

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index)
  }

  const addToCart = (plan: Plan) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: plan.id,
        title: plan.title,
        price: plan.price,
        icon: "logo.jpg",
        category: plan.period || "Plan",
        href: plan.google_form_url,
      },
    })

    // Save plans to persistent storage when user interacts with them
    if (plans.length > 0) {
      savePlansToStorage(plans)
    }

    setAddedToCart(plan.id)
    setTimeout(() => setAddedToCart(null), 2000)
  }

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300",
        theme === "dark" ? "bg-[#212121] text-white" : "bg-white text-gray-900",
      )}
    >
      <section className="relative h-[85vh] overflow-hidden rounded-2xl mx-4 mt-4">
        <div className="absolute inset-0 bg-black/60 z-10 rounded-2xl"></div>
        <Image
          src="WhatsApp Image 2025-06-07 at 16.34.57_20ca118e.jpg"
          alt={`Gallery image ${currentImageIndex + 1}`}
          fill
          className="object-cover rounded-2xl"
          priority
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 pb-24 sm:pb-0">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">Down to find your other half?</h1>
          <h2 className="text-4xl md:text-6xl font-bold text-red-600 mb-2">DownDating</h2>
          <p className="text-lg text-white/80 mb-4">is here for you</p>
          <p className="text-sm text-white/70 mb-8 max-w-md">
            Whatever text which was on the previous website, but I was down the whole day
          </p>
          <Button className="bg-white text-black hover:bg-gray-100 px-8 py-3 rounded-full font-medium" asChild>
            <Link href="#plans">Explore plan for Show</Link>
          </Button>
        </div>

        <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-4xl px-4">
          <div className="flex flex-wrap justify-center gap-1 sm:gap-4">
            <div
              className={cn(
                "backdrop-blur-sm rounded-xl sm:rounded-2xl p-2 sm:p-4 text-center min-w-[100px] sm:min-w-[140px] border",
                theme === "dark" ? "bg-[#121212]/90 border-[#333333]" : "bg-white/90 border-gray-200",
              )}
            >
              <div className="flex items-center justify-center mb-1">
                <Star className="h-3 w-3 sm:h-5 sm:w-5 text-yellow-500 fill-yellow-500 mr-1" />
                <span className={cn("text-sm sm:text-xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>
                  4.7
                </span>
                <span className="text-gray-400 ml-1 text-xs">(47k+)</span>
              </div>
              <p className="text-red-500 text-xs font-medium">Ratings</p>
            </div>
            <div
              className={cn(
                "backdrop-blur-sm rounded-xl sm:rounded-2xl p-2 sm:p-4 text-center min-w-[100px] sm:min-w-[140px] border",
                theme === "dark" ? "bg-[#121212]/90 border-[#333333]" : "bg-white/90 border-gray-200",
              )}
            >
              <div className="flex items-center justify-center mb-1">
                <ShoppingBag className="h-3 w-3 sm:h-5 sm:w-5 text-purple-500 mr-1" />
                <span className={cn("text-sm sm:text-xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>
                  10k+
                </span>
              </div>
              <p className="text-red-500 text-xs font-medium">Orders</p>
            </div>
            <div
              className={cn(
                "backdrop-blur-sm rounded-xl sm:rounded-2xl p-2 sm:p-4 text-center min-w-[100px] sm:min-w-[140px] border",
                theme === "dark" ? "bg-[#121212]/90 border-[#333333]" : "bg-white/90 border-gray-200",
              )}
            >
              <div className="flex items-center justify-center mb-1">
                <Heart className="h-3 w-3 sm:h-5 sm:w-5 text-red-500 fill-red-500 mr-1" />
                <span className={cn("text-sm sm:text-xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>
                  7.5k+
                </span>
              </div>
              <p className="text-red-500 text-xs font-medium">Loved This</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 mt-8">
        <div className="container mx-auto">
          <div className="flex items-center mb-8">
            <h2 className={cn("text-3xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")} id="plans">
              Plans
            </h2>
            <div className={cn("flex-1 h-px ml-6", theme === "dark" ? "bg-white" : "bg-gray-300")}></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  "backdrop-blur-sm rounded-2xl p-6 border transition-colors duration-300 relative",
                  theme === "dark" ? "bg-[#2a2a2a]/50 border-[#333333]" : "bg-gray-50/50 border-gray-200",
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      Popular
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-center w-16 h-16 rounded-full mb-4 mx-auto overflow-hidden">
                  <Image src="logo.jpg" alt="Plan logo" width={64} height={64} className="w-full h-full object-cover" />
                </div>
                <h3
                  className={cn(
                    "text-xl font-bold mb-3 text-center",
                    theme === "dark" ? "text-white" : "text-gray-900",
                  )}
                >
                  {plan.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 text-center leading-relaxed">{plan.description}</p>

                {/* Features List */}
                {plan.features && plan.features.length > 0 && (
                  <div className="mb-6">
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span className={cn(
                            "leading-relaxed",
                            theme === "dark" ? "text-gray-300" : "text-gray-600"
                          )}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="text-center mb-6">
                  {plan.original_price && plan.original_price > plan.price ? (
                    <>
                      <span className="block text-base font-medium text-gray-400 line-through mb-1">
                        ₹{plan.original_price}
                      </span>
                      <span className={cn("text-2xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>
                        ₹{plan.price}
                      </span>
                    </>
                  ) : (
                    <span className={cn("text-2xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>
                      ₹{plan.price}
                    </span>
                  )}
                </div>
                <Button
                  onClick={() => addToCart(plan)}
                  className={cn(
                    "w-full rounded-full py-3 font-medium transition-all duration-300",
                    addedToCart === plan.id
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-red-600 hover:bg-red-700 text-white",
                  )}
                >
                  {addedToCart === plan.id ? (
                    <div className="flex items-center justify-center">
                      <Check className="h-4 w-4 mr-2" />
                      Added to Cart!
                    </div>
                  ) : (
                    "Add to Cart"
                  )}
                </Button>
                {addedToCart === plan.id && (
                  <div className="mt-3 md:hidden">
                    <div
                      className={cn(
                        "flex items-center justify-center p-3 rounded-full text-sm font-medium animate-in slide-in-from-bottom-2 duration-300",
                        theme === "dark"
                          ? "bg-green-900/50 text-green-300 border border-green-700"
                          : "bg-green-50 text-green-700 border border-green-200",
                      )}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      {plan.title} added to your cart
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center mb-8">
            <h2 className={cn("text-3xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>Gallery</h2>
            <div className={cn("flex-1 h-px ml-6", theme === "dark" ? "bg-white" : "bg-gray-300")}></div>
          </div>

          <Link href="/reels" className="block">
            <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden group cursor-pointer">
              <Image
                src={reelsGallery[galleryIndex] || "/placeholder.svg"}
                alt={`Gallery image ${galleryIndex + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>

              <button
                onClick={(e) => {
                  e.preventDefault()
                  prevGalleryImage()
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault()
                  nextGalleryImage()
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">View Our Reels</h3>
                  <p className="text-lg opacity-90">Click to explore more</p>
                </div>
              </div>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {reelsGallery.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault()
                      setGalleryIndex(index)
                    }}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors duration-300",
                      index === galleryIndex ? "bg-white" : "bg-white/50",
                    )}
                  />
                ))}
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div
              className={cn(
                "h-80 rounded-2xl flex items-center justify-center",
                theme === "dark" ? "bg-[#2a2a2a]/50" : "bg-gray-100",
              )}
            >
              <h2 className={cn("text-6xl font-bold", theme === "dark" ? "text-red-500" : "text-red-600")}>FAQs</h2>
            </div>

            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    "backdrop-blur-sm rounded-2xl border overflow-hidden transition-colors duration-300",
                    theme === "dark" ? "bg-[#121212]/90 border-[#333333]" : "bg-white/90 border-gray-200",
                  )}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className={cn(
                      "w-full p-4 flex items-center justify-between transition-colors text-left",
                      theme === "dark" ? "hover:bg-[#2a2a2a]/50" : "hover:bg-gray-50/50",
                    )}
                  >
                    <span className={cn("font-medium", theme === "dark" ? "text-white" : "text-gray-900")}>
                      {item.question}
                    </span>
                    {expandedFAQ === index ? (
                      <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" />
                    )}
                  </button>
                  {expandedFAQ === index && (
                    <div className="px-4 pb-4">
                      <p className="text-gray-400 text-sm leading-relaxed">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/WhatsApp Image 2025-06-07 at 16.34.56_14e1be12.jpg"
            alt="Contact background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-2xl font-bold text-white mb-2">Want to enquire about anything else or</h2>
          <h3 className="text-2xl font-bold text-white mb-8">want to contact our team?</h3>

          <div className="space-y-4 max-w-md mx-auto">
            <div className="flex items-center justify-center text-gray-300">
              <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
              <span>Dwarka Sector-16</span>
            </div>
            <div className="flex items-center justify-center text-gray-300">
              <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
              <a href="mailto:Downdating@gmail.com" className="hover:text-white transition-colors">
                Downdatingshow@gmail.com
              </a>
            </div>
            <div className="flex items-center justify-center text-gray-300">
              <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
              <span>24/7 (365 Days)</span>
            </div>
          </div>
        </div>
      </section>

      {addedToCart && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 hidden md:block">
          <div
            className={cn(
              "flex items-center px-6 py-3 rounded-full shadow-lg animate-in slide-in-from-bottom-4 duration-300",
              theme === "dark" ? "bg-green-900 text-green-100 border border-green-700" : "bg-green-600 text-white",
            )}
          >
            <Check className="h-5 w-5 mr-2" />
            <span className="font-medium">{plans.find((p) => p.id === addedToCart)?.title} added to cart!</span>
          </div>
        </div>
      )}

      {state.items.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
          <Button
            className={cn(
              "w-full py-4 rounded-full font-medium shadow-lg animate-in slide-in-from-bottom-4 duration-300",
              "bg-red-600 hover:bg-red-700 text-white",
            )}
            asChild
          >
            <Link href="/cart" className="flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Go to Cart ({state.items.length})
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
