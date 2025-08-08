"use client"
import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Check, Loader2, CreditCard } from 'lucide-react'
import Link from "next/link"

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Plan {
  id: string
  title: string
  price: number
  currency: string
  period: string
}

interface PlanFormModalProps {
  isOpen: boolean
  onClose: () => void
  plan: Plan | null
}

export default function PlanFormModal({ isOpen, onClose, plan }: PlanFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    instagramId: "",
    email: "",
    phone: "",
    gender: "",
    interestedIn: "",
    relationshipStyle: "",
    idealFirstMeeting: "",
    loveLanguage: "",
    partyVibe: "",
    flirtingStyle: "",
    toxicTrait: "",
    bollywoodCharacter: "",
    greenFlag: "",
    perfectDate: "",
    pitchYourself: "",
    agreeToTerms: false,
    agreeToPrivacy: false,
    salary: "",
    order_id: "",
  })

  const [showPayment, setShowPayment] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [paymentId, setPaymentId] = useState('')

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleRazorpayPayment = async () => {
    if (!plan) return

    setIsSubmitting(true)
    try {
      // Call API route to create order
      const response = await fetch('/api/razor/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: plan.price }),
      })
      
      const res = await response.json()
      
      if (!res.success) {
        alert('Failed to create order')
        setIsSubmitting(false)
        return
      }

      const order = res.order
      
      // Save order_id to formData
      setFormData(prev => ({ ...prev, order_id: order?.id || "" }))

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order?.amount,
        currency: order?.currency,
        name: 'Downdating Services',
        description: `Payment for ${plan.title}`,
        order_id: order?.id,
        handler: async function (response: any) {
          try {
            // Call API route for payment capture
            const captureResponse = await fetch('/api/razor/payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                paymentId: response.razorpay_payment_id, 
                amount: plan.price 
              }),
            })
            
            const captureResult = await captureResponse.json()
          
            if (captureResult.success) {
              setPaymentId(response.razorpay_payment_id)
              setPaymentCompleted(true)
              alert('Payment Successful!')
              // Auto-submit the form after successful payment
              await submitFormData(response.razorpay_payment_id, order?.id)
            } else {
              throw new Error('Payment capture failed')
            }
          } catch (error) {
            console.error('Payment processing error:', error)
            alert('Payment verification failed. Please contact support.')
            setIsSubmitting(false)
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#dc2626', // Red color to match your theme
        },
        modal: {
          ondismiss: function() {
            setIsSubmitting(false)
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      console.error('Payment error:', error)
      alert('Error initiating payment. Please try again.')
      setIsSubmitting(false)
    }
  }

  const submitFormData = async (razorpayPaymentId?: string, orderId?: string) => {
    try {
      const submitData = {
        ...formData,
        planId: plan?.id || "",
        planTitle: plan?.title || "",
        planPrice: plan?.price || 0,
        paymentMethod: 'razorpay',
        paymentId: razorpayPaymentId || paymentId,
        paymentStatus: razorpayPaymentId ? 'completed' : 'pending',
        order_id: orderId || formData.order_id,
        timestamp: new Date().toISOString(),
      }

      const response = await fetch("/api/submit-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      })

      if (response.ok) {
        alert("Application submitted successfully! We'll contact you within 24 hours.")
        onClose()
        // Reset form
        setFormData({
          name: "",
          instagramId: "",
          email: "",
          phone: "",
          gender: "",
          interestedIn: "",
          relationshipStyle: "",
          idealFirstMeeting: "",
          loveLanguage: "",
          partyVibe: "",
          flirtingStyle: "",
          toxicTrait: "",
          bollywoodCharacter: "",
          greenFlag: "",
          perfectDate: "",
          pitchYourself: "",
          agreeToTerms: false,
          agreeToPrivacy: false,
          salary: "",
          order_id: "",
        })
        setShowPayment(false)
        setPaymentCompleted(false)
        setPaymentId('')
      } else {
        throw new Error("Failed to submit")
      }
    } catch (error) {
      console.error('Form submission error:', error)
      alert("Error submitting application. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.agreeToTerms || !formData.agreeToPrivacy) {
      alert("Please agree to the terms and privacy policy")
      return
    }

    if (!showPayment) {
      setShowPayment(true)
      return
    }
  }

  if (!plan) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl">
            {showPayment ? "Complete Payment" : `Apply for ${plan.title}`}
          </DialogTitle>
        </DialogHeader>

        {!showPayment ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Basic Information</h3>
              <div>
                <Label htmlFor="name" className="text-white">
                  Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="instagramId" className="text-white">
                  Instagram ID *
                </Label>
                <Input
                  id="instagramId"
                  value={formData.instagramId}
                  onChange={(e) => handleInputChange("instagramId", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="@username"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="text-white">
                    Email ID *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-white">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>
              </div>
              {(plan.title.toLowerCase().includes('corporate') || plan.title.toLowerCase().includes('corporate-match')) && (
                <div>
                  <Label htmlFor="salary" className="text-white">
                    What is your salary? *
                  </Label>
                  <Input
                    id="salary"
                    value={formData.salary}
                    onChange={(e) => handleInputChange("salary", e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="e.g., ₹8,00,000 per annum"
                    required
                  />
                </div>
              )}
              <div>
                <Label className="text-white">Gender *</Label>
                <RadioGroup onValueChange={(value) => handleInputChange("gender", value)} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="text-white">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="text-white">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="prefer-not-to-say" id="prefer-not" />
                    <Label htmlFor="prefer-not" className="text-white">Prefer not to say</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label className="text-white">Interested in Matching with: *</Label>
                <RadioGroup onValueChange={(value) => handleInputChange("interestedIn", value)} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="interested-male" />
                    <Label htmlFor="interested-male" className="text-white">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="interested-female" />
                    <Label htmlFor="interested-female" className="text-white">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="open-to-all" id="open-all" />
                    <Label htmlFor="open-all" className="text-white">Open to all</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Personality Questions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Tell Us About Yourself</h3>
              <div>
                <Label className="text-white">What describes you best in a relationship? *</Label>
                <RadioGroup onValueChange={(value) => handleInputChange("relationshipStyle", value)} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="filmy-lover" id="filmy" />
                    <Label htmlFor="filmy" className="text-white">Filmy Lover (Full-on SRK vibes)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="chill-partner" id="chill" />
                    <Label htmlFor="chill" className="text-white">Chill Partner (Go with the flow)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="loyal-possessive" id="loyal" />
                    <Label htmlFor="loyal" className="text-white">Loyal & Possessive (Mera hai bas)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fun-flirty" id="fun" />
                    <Label htmlFor="fun" className="text-white">Fun & Flirty (No strings attached)</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label className="text-white">Your ideal first meeting would be? *</Label>
                <RadioGroup onValueChange={(value) => handleInputChange("idealFirstMeeting", value)} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="long-drive" id="drive" />
                    <Label htmlFor="drive" className="text-white">Long drive & deep talks</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="netflix-chill" id="netflix" />
                    <Label htmlFor="netflix" className="text-white">Netflix & Chill (Actually watching the movie!)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="adventure" id="adventure" />
                    <Label htmlFor="adventure" className="text-white">A crazy adventure date</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="coffee-books" id="coffee" />
                    <Label htmlFor="coffee" className="text-white">Coffee & bookshop vibes</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label className="text-white">What's your love language? *</Label>
                <RadioGroup onValueChange={(value) => handleInputChange("loveLanguage", value)} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="words-affirmation" id="words" />
                    <Label htmlFor="words" className="text-white">Words of Affirmation (I love you 100 times a day)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="physical-touch" id="touch" />
                    <Label htmlFor="touch" className="text-white">Physical Touch (Hugs fix everything)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="quality-time" id="time" />
                    <Label htmlFor="time" className="text-white">Quality Time (Let's spend every second together)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gifts" id="gifts" />
                    <Label htmlFor="gifts" className="text-white">Gifts & Surprises (Material girl/boy vibes)</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label className="text-white">What's your vibe at a party? *</Label>
                <RadioGroup onValueChange={(value) => handleInputChange("partyVibe", value)} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="life-of-party" id="party-life" />
                    <Label htmlFor="party-life" className="text-white">Life of the party (Dancing on tables)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dj-group" id="dj" />
                    <Label htmlFor="dj" className="text-white">DJ of the group (Fire playlists only)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="corner-chill" id="corner" />
                    <Label htmlFor="corner" className="text-white">Corner chill & observing people</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="here-for-food" id="food" />
                    <Label htmlFor="food" className="text-white">Just here for the food</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label className="text-white">Your go-to flirting style? *</Label>
                <RadioGroup onValueChange={(value) => handleInputChange("flirtingStyle", value)} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cheesy-pickup" id="cheesy" />
                    <Label htmlFor="cheesy" className="text-white">Cheesy pickup lines (Are you a magician?)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="roasting" id="roast" />
                    <Label htmlFor="roast" className="text-white">Roasting them (Insult = Love)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="eye-contact" id="eye" />
                    <Label htmlFor="eye" className="text-white">Deep eye contact & smirks</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no-flirting" id="no-flirt" />
                    <Label htmlFor="no-flirt" className="text-white">No flirting, just vibes</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label className="text-white">Your toxic dating trait? (Be honest) *</Label>
                <RadioGroup onValueChange={(value) => handleInputChange("toxicTrait", value)} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ghosting" id="ghost" />
                    <Label htmlFor="ghost" className="text-white">Ghosting when bored</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="overthinking" id="overthink" />
                    <Label htmlFor="overthink" className="text-white">Overthinking every text</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="late-replies" id="late" />
                    <Label htmlFor="late" className="text-white">Replying after 3-5 business days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="falling-fast" id="fast" />
                    <Label htmlFor="fast" className="text-white">Falling too fast too soon</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label className="text-white">Which Bollywood character are you in a relationship? *</Label>
                <RadioGroup onValueChange={(value) => handleInputChange("bollywoodCharacter", value)} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bunny" id="bunny" />
                    <Label htmlFor="bunny" className="text-white">Bunny (YJHD) - Free-spirited, commitment issues</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="geet" id="geet" />
                    <Label htmlFor="geet" className="text-white">Geet (JWM) - Talkative, full of life</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="kabir-singh" id="kabir" />
                    <Label htmlFor="kabir" className="text-white">Kabir Singh - Intense, passionate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="poo" id="poo" />
                    <Label htmlFor="poo" className="text-white">Poo (K3G) - Main character energy</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label className="text-white">Your biggest GREEN flag in a person? *</Label>
                <RadioGroup onValueChange={(value) => handleInputChange("greenFlag", value)} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="respects-boundaries" id="boundaries" />
                    <Label htmlFor="boundaries" className="text-white">Respects boundaries</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good-humor" id="humor" />
                    <Label htmlFor="humor" className="text-white">Has a good sense of humour</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="deep-conversations" id="deep" />
                    <Label htmlFor="deep" className="text-white">Can handle deep conversations</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="supports-dreams" id="support" />
                    <Label htmlFor="support" className="text-white">Supports my dreams & goals</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label htmlFor="perfectDate" className="text-white">
                  Describe your perfect date in 1-2 sentences: *
                </Label>
                <Textarea
                  id="perfectDate"
                  value={formData.perfectDate}
                  onChange={(e) => handleInputChange("perfectDate", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Tell us about your dream date..."
                  required
                />
              </div>
              <div>
                <Label htmlFor="pitchYourself" className="text-white">
                  If you had to pitch yourself in one line for your perfect match, what would you say? *
                </Label>
                <Textarea
                  id="pitchYourself"
                  value={formData.pitchYourself}
                  onChange={(e) => handleInputChange("pitchYourself", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Your one-line pitch..."
                  required
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)}
                />
                <Label htmlFor="terms" className="text-white text-sm">
                  I agree to the{" "}
                  <Link href="/terms" className="text-red-500 hover:underline">
                    Terms and Conditions
                  </Link>{" "}
                  *
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="privacy"
                  checked={formData.agreeToPrivacy}
                  onCheckedChange={(checked) => handleInputChange("agreeToPrivacy", checked)}
                />
                <Label htmlFor="privacy" className="text-white text-sm">
                  I agree to the{" "}
                  <Link href="/privacy" className="text-red-500 hover:underline">
                    Privacy Policy
                  </Link>{" "}
                  *
                </Label>
              </div>
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
              Proceed to Payment
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-4">Complete Your Payment</h3>
              <div className="bg-gray-800 p-6 rounded-lg mb-6">
                <p className="text-white mb-2">Plan: {plan.title}</p>
                <p className="text-2xl font-bold text-red-500 mb-4">₹{plan.price}</p>
                <p className="text-gray-400 text-sm">
                  Secure payment with Credit/Debit Card, UPI, Net Banking, and Wallets
                </p>
              </div>
            </div>

            {/* Razorpay Payment */}
            <div className="space-y-4">
              {paymentCompleted && (
                <div className="flex items-center gap-2 text-green-400 text-sm bg-green-900/20 p-3 rounded-lg">
                  <Check className="h-4 w-4" />
                  Payment completed successfully! Payment ID: {paymentId}
                </div>
              )}
              <Button
                onClick={handleRazorpayPayment}
                disabled={isSubmitting || paymentCompleted}
                className="w-full bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Processing Payment...
                  </>
                ) : paymentCompleted ? (
                  'Payment Completed'
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay ₹{plan.price} with Razorpay
                  </>
                )}
              </Button>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPayment(false)}
                className="flex-1 border-gray-700 text-white hover:bg-gray-800"
              >
                Back to Form
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
