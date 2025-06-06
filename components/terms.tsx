import { Metadata } from "next";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

export const metadata: Metadata = {
  title: "Terms and Conditions | MulakatJunction",
  description:
    "Read the terms and conditions for MulakatJunction dating platform.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="leading-relaxed text-sm text-muted-foreground">{children}</p>
    </section>
  );
}

export default function TermsAndConditionsPage() {
  return (
    <ScrollArea className="h-screen w-full py-8">
      <Card className="mx-auto w-full max-w-4xl px-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Terms and Conditions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Effective Date: June 6, 2025 &nbsp;|&nbsp; Last Updated: June 6, 2025
          </p>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-8 py-6">
          <Section title="1. Eligibility">
            To use <strong>MulakatJunction</strong>, you must be at least 18 years old, have the legal capacity to enter a
            binding contract, and not be prohibited by law from using online dating services. By using the Platform, you
            represent and warrant that you meet all these requirements.
          </Section>

          <Separator />

          <Section title="2. Account Registration">
            You agree to provide truthful, accurate, and complete information when creating an account and to keep your
            login credentials confidential. You are responsible for all activities that occur under your account. We
            reserve the right to suspend or delete accounts that violate these Terms or pose a risk to other users.
          </Section>

          <Separator />

          <Section title="3. User Conduct">
            You agree not to impersonate others, harass or abuse users, post sexually explicit or illegal content,
            promote commercial products, or engage in scams or fraudulent behavior. Violations may result in account
            termination and reporting to law enforcement.
          </Section>

          <Separator />

          <Section title="4. Content and Ownership">
            You retain ownership of content you upload but grant us a non‑exclusive, worldwide, royalty‑free license to
            use, display, and distribute it for platform functionality and promotional purposes. You are solely
            responsible for ensuring your content does not violate any third‑party rights.
          </Section>

          <Separator />

          <Section title="5. Subscription and Payment">
            Certain features require a paid subscription. By subscribing, you authorize us to charge the displayed fees
            to your payment method. All fees are non‑refundable except as required by law. You may cancel at any time;
            cancellation takes effect at the end of the current billing cycle.
          </Section>

          <Separator />

          <Section title="6. Termination">
            We may suspend or terminate your access if you violate these Terms, if your account is inactive for an
            extended period, or to protect other users or the integrity of the Platform. You may delete your account at
            any time via account settings.
          </Section>

          <Separator />

          <Section title="7. Privacy">
            Your use of the Platform is governed by our Privacy Policy, which explains how we collect, use, and share
            your information. By using <strong>MulakatJunction</strong>, you consent to those practices.
          </Section>

          <Separator />

          <Section title="8. Disclaimer of Warranties">
            <strong>MulakatJunction</strong> is provided "as is" and "as available." We do not guarantee uninterrupted
            access, successful matches, or the authenticity of user content. You use the Platform at your own risk.
          </Section>

          <Separator />

          <Section title="9. Limitation of Liability">
            To the maximum extent permitted by law, <strong>MulakatJunction</strong> and its affiliates are not liable for
            indirect, incidental, or consequential damages, loss of data, profits, or reputation, or unauthorized access
            to your information.
          </Section>

          <Separator />

          <Section title="10. Modifications">
            We may update these Terms at any time. Significant changes will be communicated to users. Continued use
            after changes constitutes acceptance of the updated Terms.
          </Section>

          <Separator />

          <Section title="11. Governing Law">
            These Terms are governed by the laws of the Republic of India without regard to conflict of laws principles.
          </Section>

          <Separator />

          <Section title="12. Contact Us">
            For questions, please email <a className="underline" href="mailto:support@mulakatjunction.com">
              support@mulakatjunction.com
            </a>.
          </Section>

          <Separator />

          <p className="text-center text-sm text-muted-foreground">
            Thank you for choosing <strong>MulakatJunction</strong> — where meaningful connections begin.
          </p>
        </CardContent>
      </Card>
    </ScrollArea>
  );
}
