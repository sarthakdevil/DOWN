import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[90vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/70 z-10"></div>
        <Image
          src="/download.jpg"
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

      {/* Dating Plans */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Dating Plans</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Choose the perfect dating plan that suits your needs and preferences. From casual dating to serious
              relationships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Girls Only",
                price: "₹49",
                features: ["Unlimited matches", "Enhanced profile", "Chat with matches", "Priority support"],
                featured: true,
              },
              {
                title: "Men - 24 Hours",
                price: "₹299",
                features: ["Match within 24 hours", "Premium placement", "Video chat", "Personal coach"],
              },
              {
                title: "Men - Regular",
                price: "₹109",
                features: ["Regular matching", "Basic profile", "Chat with matches", "Standard support"],
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`rounded-lg overflow-hidden border ${
                  plan.featured ? "border-red-600 scale-105 shadow-lg shadow-red-600/20" : "border-gray-800"
                } bg-gray-900 relative`}
              >
                {plan.featured && (
                  <div className="absolute top-0 inset-x-0 bg-red-600 text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className={`p-8 ${plan.featured ? "pt-14" : "pt-8"} text-center`}>
                  <h3 className="text-xl font-bold text-white mb-2">{plan.title}</h3>
                  <div className="text-3xl font-bold text-white mb-6">
                    {plan.price}
                    <span className="text-sm text-gray-400 font-normal">/month</span>
                  </div>
                  <ul className="space-y-3 mb-8 text-left">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-300">
                        <svg
                          className="h-5 w-5 text-red-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${
                      plan.featured ? "bg-red-600 hover:bg-red-700" : "bg-gray-800 hover:bg-gray-700"
                    } text-white`}
                    asChild
                  >
                    <Link href="/plans">Choose Plan</Link>
                  </Button>
                </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-black p-6 rounded-lg border border-gray-800">
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
                    <h4 className="text-lg font-semibold text-white">
                      {["Sarah & Mike", "Jessica & David", "Emma & John"][item - 1]}
                    </h4>
                    <p className="text-gray-400">{["New York", "Chicago", "Los Angeles"][item - 1]}</p>
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
          src="/placeholder.svg?height=600&width=1920"
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

      {/* Featured In */}
      <section className="py-12 bg-black">
        <div className="container">
          <div className="text-center mb-8">
            <p className="text-gray-400 text-sm uppercase tracking-wider">Featured In</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {["DatingAdvice.com", "eHarmony", "Match.com", "The Knot", "Brides"].map((brand) => (
              <div key={brand} className="text-gray-500 text-xl md:text-2xl font-serif">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
