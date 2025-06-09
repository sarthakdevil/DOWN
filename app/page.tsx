import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Instagram, Linkedin } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[90vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/70 z-10"></div>
        <Image
          src="/WhatsApp Image 2025-06-07 at 16.34.57_20ca118e.jpg"
          alt="Dating event background"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
          <div className="flex items-center justify-center mb-6">
            <Heart className="h-8 w-8 text-red-600 fill-red-600 mr-2" />
            <Heart className="h-6 w-6 text-red-600 fill-red-600" />
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
            THE MOST EXCITING <br /> DATING EXPERIENCE
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl">
            Find your perfect match with our exclusive dating plans.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 text-lg px-8"
              asChild
            >
              <Link href="/plans">View Plans</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Social Media Options */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Choose Your Path</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Select the category that best fits your professional and personal dating preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Instagram Option - Regular Plans */}
            <div className="rounded-lg overflow-hidden border border-gray-800 bg-gray-900 relative group hover:border-pink-500 transition-colors">
              <div className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-4 rounded-full">
                    <Instagram className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Instagram Dating</h3>
                <p className="text-gray-400 mb-6">
                  Perfect for everyone looking to find meaningful connections. Choose from various plans based on your
                  preferences and timeline.
                </p>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center text-gray-300">
                    <svg
                      className="h-5 w-5 text-pink-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Special pricing for girls
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg
                      className="h-5 w-5 text-pink-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Fast matching options
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg
                      className="h-5 w-5 text-pink-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Affordable plans
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg
                      className="h-5 w-5 text-pink-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Community access
                  </li>
                </ul>
                <Button
                  className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white"
                  asChild
                >
                  <Link href="/insta-plans">View Instagram Plans</Link>
                </Button>
              </div>
            </div>

            {/* LinkedIn Option - Corporate Plans */}
            <div className="rounded-lg overflow-hidden border border-gray-800 bg-gray-900 relative group hover:border-blue-500 transition-colors">
              <div className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="bg-blue-600 p-4 rounded-md">
<svg
  className="h-8 w-8 text-white"
  fill="currentColor"
  viewBox="0 0 24 24"
  xmlns="http://www.w3.org/2000/svg"
>
  <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0V8zm7.5 0h4.8v2.2h.07c.67-1.27 2.3-2.6 4.73-2.6 5.06 0 5.97 3.33 5.97 7.66V24h-5V15.4c0-2.07-.04-4.73-2.88-4.73-2.88 0-3.32 2.25-3.32 4.58V24h-5V8z"/>
</svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Corporate Professionals</h3>
                <p className="text-gray-400 mb-6">
                  Exclusive matching service designed for working professionals. Connect with like-minded individuals in
                  your field and meet your date.
                </p>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center text-gray-300">
                    <svg
                      className="h-5 w-5 text-blue-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Tailored for professionals
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg
                      className="h-5 w-5 text-blue-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Networking opportunities
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg
                      className="h-5 w-5 text-blue-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Exclusive events access
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg
                      className="h-5 w-5 text-blue-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Personalized coaching
                  </li>
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" asChild>
                  <Link href="/Linkedin-plans">View LinkedIn Plans</Link>
                </Button>
              </div>
            </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-black p-6 rounded-lg border border-gray-800">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <Image
                      src={
                        ["/download-1.jpg", "/download (2).jpg", "/download (1).jpg"][item - 1] || "/placeholder.svg"
                      }
                      alt="User"
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      {["Shreya and Aman", "Riya and Kabir", "Neha and Rahul"][item - 1]}
                    </h4>
                    <p className="text-gray-400">{["Delhi", "Mumbai", "Bangalore"][item - 1]}</p>
                  </div>
                </div>
                <p className="text-gray-300">
                  {
                    [
                      "We met through the Basic Match plan and instantly connected. After 6 months of dating, we're now engaged!",
                      "The Premium Connect plan matched us perfectly. We've been together for a year now and couldn't be happier.",
                      "The Elite Romance plan and personal matchmaker found us the perfect match. We're celebrating our 6-month anniversary next week!",
                    ][item - 1]
                  }
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-black/70 z-10"></div>
        <Image
          src="/WhatsApp Image 2025-06-07 at 16.34.58_203925dd.jpg"
          alt="CTA background"
          fill
          className="object-cover brightness-25"
        />
        <div className="container relative z-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Heart className="h-8 w-8 text-red-600 fill-red-600 mr-2" />
              <Heart className="h-6 w-6 text-red-600 fill-red-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Find Your Perfect Match?</h2>
            <p className="text-xl text-white/80 mb-8">
              Join thousands of singles who have found love through our dating plans.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 text-lg px-8"
                asChild
              >
                <Link href="/plans">View Plans</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
