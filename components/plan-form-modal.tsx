"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, Check, Loader2 } from 'lucide-react'
import Link from "next/link"
import { uploadToCloudinary } from "@/app/api/cloudinary/cloudinary"

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
    paymentScreenshotUrl: "",
    agreeToTerms: false,
    agreeToPrivacy: false,
    salary: "",
  })

  const [showPayment, setShowPayment] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Convert file to ArrayBuffer, then to base64
  const convertFileToBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          // Convert ArrayBuffer to base64
          const uint8Array = new Uint8Array(reader.result)
          let binary = ""
          for (let i = 0; i < uint8Array.length; i++) {
            binary += String.fromCharCode(uint8Array[i])
          }
          const base64 = btoa(binary)
          resolve(base64)
        } else {
          reject(new Error("Failed to read file as ArrayBuffer"))
        }
      }
      reader.onerror = () => reject(reader.error)
      reader.readAsArrayBuffer(file)
    })
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB")
      return
    }

    setIsUploading(true)

    try {
      // Convert file to base64
      const base64 = await convertFileToBase64(file)

      // Upload to Cloudinary using server function
      const imageUrl = await uploadToCloudinary(base64)

      if (imageUrl) {
        handleInputChange("paymentScreenshotUrl", imageUrl)
      } else {
        throw new Error("Upload failed")
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload image. Please try again.")
    } finally {
      setIsUploading(false)
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

    if (!formData.paymentScreenshotUrl) {
      alert("Please upload payment screenshot")
      return
    }

    setIsSubmitting(true)

    try {
      const submitData = {
        ...formData,
        planId: plan?.id || "",
        planTitle: plan?.title || "",
        planPrice: plan?.price || 0,
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
          paymentScreenshotUrl: "",
          agreeToTerms: false,
          agreeToPrivacy: false,
          salary: "",
        })
        setShowPayment(false)
      } else {
        throw new Error("Failed to submit")
      }
    } catch (error) {
      alert("Error submitting application. Please try again.")
    } finally {
      setIsSubmitting(false)
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
                    Email ID (Same as that of payment) *
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
                    <Label htmlFor="male" className="text-white">
                      Male
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="text-white">
                      Female
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="prefer-not-to-say" id="prefer-not" />
                    <Label htmlFor="prefer-not" className="text-white">
                      Prefer not to say
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-white">Interested in Matching with: *</Label>
                <RadioGroup onValueChange={(value) => handleInputChange("interestedIn", value)} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="interested-male" />
                    <Label htmlFor="interested-male" className="text-white">
                      Male
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="interested-female" />
                    <Label htmlFor="interested-female" className="text-white">
                      Female
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="open-to-all" id="open-all" />
                    <Label htmlFor="open-all" className="text-white">
                      Open to all
                    </Label>
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
                    <Label htmlFor="filmy" className="text-white">
                      Filmy Lover (Full-on SRK vibes)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="chill-partner" id="chill" />
                    <Label htmlFor="chill" className="text-white">
                      Chill Partner (Go with the flow)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="loyal-possessive" id="loyal" />
                    <Label htmlFor="loyal" className="text-white">
                      Loyal & Possessive (Mera hai bas)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fun-flirty" id="fun" />
                    <Label htmlFor="fun" className="text-white">
                      Fun & Flirty (No strings attached)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-white">Your ideal first meeting would be? *</Label>
                <RadioGroup onValueChange={(value) => handleInputChange("idealFirstMeeting", value)} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="long-drive" id="drive" />
                    <Label htmlFor="drive" className="text-white">
                      Long drive & deep talks
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="netflix-chill" id="netflix" />
                    <Label htmlFor="netflix" className="text-white">
                      Netflix & Chill (Actually watching the movie!)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="adventure" id="adventure" />
                    <Label htmlFor="adventure" className="text-white">
                      A crazy adventure date
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="coffee-books" id="coffee" />
                    <Label htmlFor="coffee" className="text-white">
                      Coffee & bookshop vibes
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-white">What's your love language? *</Label>
                <RadioGroup onValueChange={(value) => handleInputChange("loveLanguage", value)} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="words-affirmation" id="words" />
                    <Label htmlFor="words" className="text-white">
                      Words of Affirmation (I love you 100 times a day)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="physical-touch" id="touch" />
                    <Label htmlFor="touch" className="text-white">
                      Physical Touch (Hugs fix everything)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="quality-time" id="time" />
                    <Label htmlFor="time" className="text-white">
                      Quality Time (Let's spend every second together)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gifts" id="gifts" />
                    <Label htmlFor="gifts" className="text-white">
                      Gifts & Surprises (Material girl/boy vibes)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-white">What's your vibe at a party? *</Label>
                <RadioGroup onValueChange={(value) => handleInputChange("partyVibe", value)} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="life-of-party" id="party-life" />
                    <Label htmlFor="party-life" className="text-white">
                      Life of the party (Dancing on tables)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dj-group" id="dj" />
                    <Label htmlFor="dj" className="text-white">
                      DJ of the group (Fire playlists only)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="corner-chill" id="corner" />
                    <Label htmlFor="corner" className="text-white">
                      Corner chill & observing people
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="here-for-food" id="food" />
                    <Label htmlFor="food" className="text-white">
                      Just here for the food
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-white">Your go-to flirting style? *</Label>
                <RadioGroup onValueChange={(value) => handleInputChange("flirtingStyle", value)} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cheesy-pickup" id="cheesy" />
                    <Label htmlFor="cheesy" className="text-white">
                      Cheesy pickup lines (Are you a magician?)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="roasting" id="roast" />
                    <Label htmlFor="roast" className="text-white">
                      Roasting them (Insult = Love)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="eye-contact" id="eye" />
                    <Label htmlFor="eye" className="text-white">
                      Deep eye contact & smirks
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no-flirting" id="no-flirt" />
                    <Label htmlFor="no-flirt" className="text-white">
                      No flirting, just vibes
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-white">Your toxic dating trait? (Be honest) *</Label>
                <RadioGroup onValueChange={(value) => handleInputChange("toxicTrait", value)} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ghosting" id="ghost" />
                    <Label htmlFor="ghost" className="text-white">
                      Ghosting when bored
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="overthinking" id="overthink" />
                    <Label htmlFor="overthink" className="text-white">
                      Overthinking every text
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="late-replies" id="late" />
                    <Label htmlFor="late" className="text-white">
                      Replying after 3-5 business days
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="falling-fast" id="fast" />
                    <Label htmlFor="fast" className="text-white">
                      Falling too fast too soon
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-white">Which Bollywood character are you in a relationship? *</Label>
                <RadioGroup onValueChange={(value) => handleInputChange("bollywoodCharacter", value)} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bunny" id="bunny" />
                    <Label htmlFor="bunny" className="text-white">
                      Bunny (YJHD) - Free-spirited, commitment issues
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="geet" id="geet" />
                    <Label htmlFor="geet" className="text-white">
                      Geet (JWM) - Talkative, full of life
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="kabir-singh" id="kabir" />
                    <Label htmlFor="kabir" className="text-white">
                      Kabir Singh - Intense, passionate
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="poo" id="poo" />
                    <Label htmlFor="poo" className="text-white">
                      Poo (K3G) - Main character energy
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-white">Your biggest GREEN flag in a person? *</Label>
                <RadioGroup onValueChange={(value) => handleInputChange("greenFlag", value)} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="respects-boundaries" id="boundaries" />
                    <Label htmlFor="boundaries" className="text-white">
                      Respects boundaries
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good-humor" id="humor" />
                    <Label htmlFor="humor" className="text-white">
                      Has a good sense of humour
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="deep-conversations" id="deep" />
                    <Label htmlFor="deep" className="text-white">
                      Can handle deep conversations
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="supports-dreams" id="support" />
                    <Label htmlFor="support" className="text-white">
                      Supports my dreams & goals
                    </Label>
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
              <div className="bg-gray-800 p-6 rounded-lg">
                <p className="text-white mb-2">Plan: {plan.title}</p>
                <p className="text-2xl font-bold text-red-500 mb-4">₹{plan.price}</p>

                <div className="flex justify-center mb-4">
                  <div className="bg-white p-4 rounded-lg">
                    <img
                      src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB4PSIxNiIgeT0iMTYiIHdpZHRoPSI5NiIgaGVpZ2h0PSI5NiIgZmlsbD0iYmxhY2siLz4KPHJlY3QgeD0iMjQiIHk9IjI0IiB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB4PSI0MCIgeT0iMjQiIHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHg9IjU2IiB5PSIyNCIgd2lkdGg9IjgiIGhlaWdodD0iOCIgZmlsbD0id2hpdGUiLz4KPHJlY3QgeD0iODAiIHk9IjI0IiB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB4PSI5NiIgeT0iMjQiIHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHg9IjI0IiB5PSI0MCIgd2lkdGg9IjgiIGhlaWdodD0iOCIgZmlsbD0id2hpdGUiLz4KPHJlY3QgeD0iOTYiIHk9IjQwIiB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB4PSIyNCIgeT0iNTYiIHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHg9IjQwIiB5PSI1NiIgd2lkdGg9IjgiIGhlaWdodD0iOCIgZmlsbD0id2hpdGUiLz4KPHJlY3QgeD0iNTYiIHk9IjU2IiB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB4PSI5NiIgeT0iNTYiIHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHg9IjI0IiB5PSI4MCIgd2lkdGg9IjgiIGhlaWdodD0iOCIgZmlsbD0id2hpdGUiLz4KPHJlY3QgeD0iNDAiIHk9IjgwIiB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB4PSI1NiIgeT0iODAiIHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHg9IjgwIiB5PSI4MCIgd2lkdGg9IjgiIGhlaWdodD0iOCIgZmlsbD0id2hpdGUiLz4KPHJlY3QgeD0iOTYiIHk9IjgwIiB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB4PSIyNCIgeT0iOTYiIHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHg9IjQwIiB5PSI5NiIgd2lkdGg9IjgiIGhlaWdodD0iOCIgZmlsbD0id2hpdGUiLz4KPHJlY3QgeD0iNTYiIHk9Ijk2IiB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB4PSI4MCIgeT0iOTYiIHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHg9Ijk2IiB5PSI5NiIgd2lkdGg9IjgiIGhlaWdodD0iOCIgZmlsbD0id2hpdGUiLz4KPC9zdmc+"
                      alt="QR Code"
                      className="h-32 w-32"
                    />
                  </div>
                </div>

                <p className="text-gray-400 text-sm mb-4">Scan the QR code above to make payment via UPI</p>

                <div className="text-left space-y-2 text-sm text-gray-400">
                  <p>
                    <strong>UPI ID:</strong> s36448@ptaxis
                  </p>
                  <p>
                    <strong>Account Name:</strong> Downdating Services
                  </p>
                  <p>
                    <strong>Amount:</strong> ₹{plan.price}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-white mb-2 block">Upload Payment Screenshot *</Label>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full flex items-center justify-center gap-2 bg-gray-800 border-gray-700 text-white hover:bg-gray-700 disabled:opacity-50"
                >
                  {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {isUploading
                    ? "Uploading..."
                    : formData.paymentScreenshotUrl
                      ? "Change Screenshot"
                      : "Upload Payment Screenshot"}
                </Button>
                {formData.paymentScreenshotUrl && (
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <Check className="h-4 w-4" />
                    Screenshot uploaded successfully
                  </div>
                )}
              </div>
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
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.paymentScreenshotUrl}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}