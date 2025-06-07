import type { Metadata } from "next"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import type React from "react"

export const metadata: Metadata = {
  title: "Terms and Conditions | Downdating",
  description: "Read the terms and conditions for Downdating online dating form.",
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <div className="leading-relaxed text-sm text-gray-300">{children}</div>
    </section>
  )
}

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-black py-8">
      <ScrollArea className="h-screen w-full">
        <Card className="mx-auto w-full max-w-4xl px-4 bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">Terms and Conditions for Online Dating Form</CardTitle>
            <p className="text-sm text-gray-400">
              Effective Date: December 7, 2024 &nbsp;|&nbsp; Last Updated: December 7, 2024
            </p>
          </CardHeader>
          <Separator className="bg-gray-800" />
          <CardContent className="space-y-8 py-6">
            <Section title="1. Acceptance of Terms">
              By submitting this form, you agree to abide by these Terms and Conditions. If you do not agree, please do
              not submit your information.
            </Section>

            <Separator className="bg-gray-800" />

            <Section title="2. Eligibility">
              Participants must be at least 18 years old. By submitting the form, you confirm that all information
              provided is accurate and truthful.
            </Section>

            <Separator className="bg-gray-800" />

            <Section title="3. Data Collection and Privacy">
              All personal information submitted will be used solely for the purpose of matching participants. We do not
              share, sell, or distribute your information to third parties without consent, except as required by law.
            </Section>

            <Separator className="bg-gray-800" />

            <Section title="4. Accuracy of Information">
              Participants are responsible for providing accurate and up-to-date information. We are not liable for any
              issues arising from incorrect or misleading details.
            </Section>

            <Separator className="bg-gray-800" />

            <Section title="5. Matching Process">
              Matches are based on the responses provided in the form. While we strive to make meaningful connections,
              we do not guarantee compatibility or relationship success.
            </Section>

            <Separator className="bg-gray-800" />

            <Section title="6. Code of Conduct">
              Participants must engage respectfully and refrain from any inappropriate, offensive, or harmful behavior.
              Any violation of this may result in disqualification from the event.
            </Section>

            <Separator className="bg-gray-800" />

            <Section title="7. Limitation of Liability">
              We are not responsible for any interactions, outcomes, or incidents that may arise from the event.
              Participants engage at their own discretion and risk.
            </Section>

            <Separator className="bg-gray-800" />

            <Section title="8. Event Changes and Cancellations">
              We reserve the right to modify, reschedule, or cancel the event at any time without prior notice.
            </Section>

            <Separator className="bg-gray-800" />

            <Section title="9. Contact Information">
              For any concerns or inquiries, please contact us at{" "}
              <a className="underline text-red-500 hover:text-red-400" href="mailto:shivammehta2023@gmail.com">
                shivammehta2023@gmail.com
              </a>
              .
            </Section>

            <Separator className="bg-gray-800" />

            <p className="text-center text-sm text-gray-400">
              By submitting this form, you acknowledge that you have read, understood, and agreed to these Terms and
              Conditions.
            </p>
          </CardContent>
        </Card>
      </ScrollArea>
    </div>
  )
}
