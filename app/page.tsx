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


      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
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
