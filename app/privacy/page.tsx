import type { Metadata } from "next"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import type React from "react"

export const metadata: Metadata = {
  title: "Privacy Policy | Downdating",
  description: "Read the privacy policy for Downdating online dating form.",
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <div className="leading-relaxed text-sm text-gray-300">{children}</div>
    </section>
  )
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black py-8">
      <ScrollArea className="h-screen w-full">
        <Card className="mx-auto w-full max-w-4xl px-4 bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">Privacy Policy</CardTitle>
            <p className="text-sm text-gray-400">
              Effective Date: December 7, 2024 &nbsp;|&nbsp; Last Updated: December 7, 2024
            </p>
          </CardHeader>
          <Separator className="bg-gray-800" />
          <CardContent className="space-y-8 py-6">
            <Section title="1. Information We Collect">
              We collect personal information you provide through our dating form, including your name, contact details,
              preferences, and payment information. We also collect payment screenshots for verification purposes.
            </Section>

            <Separator className="bg-gray-800" />

            <Section title="2. How We Use Your Information">
              Your information is used solely for matching purposes, processing payments, and communicating with you
              about our services. We do not use your data for marketing to third parties.
            </Section>

            <Separator className="bg-gray-800" />

            <Section title="3. Information Sharing">
              We do not sell, trade, or share your personal information with third parties except as required by law or
              with your explicit consent for matching purposes.
            </Section>

            <Separator className="bg-gray-800" />

            <Section title="4. Data Security">
              We implement appropriate security measures to protect your personal information against unauthorized
              access, alteration, disclosure, or destruction.
            </Section>

            <Separator className="bg-gray-800" />

            <Section title="5. Data Retention">
              We retain your information for as long as necessary to provide our services and as required by law. You
              may request deletion of your data at any time.
            </Section>

            <Separator className="bg-gray-800" />

            <Section title="6. Your Rights">
              You have the right to access, update, or delete your personal information. You may also withdraw consent
              for data processing at any time.
            </Section>

            <Separator className="bg-gray-800" />

            <Section title="7. Contact Us">
              For privacy-related questions or requests, please contact us at{" "}
              <a className="underline text-red-500 hover:text-red-400" href="mailto:shivammehta2023@gmail.com">
                shivammehta2023@gmail.com
              </a>
              .
            </Section>

            <Separator className="bg-gray-800" />

            <p className="text-center text-sm text-gray-400">
              By using our services, you consent to the collection and use of your information as described in this
              Privacy Policy.
            </p>
          </CardContent>
        </Card>
      </ScrollArea>
    </div>
  )
}
