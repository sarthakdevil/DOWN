import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/70 z-10"></div>
        <Image
          src="/placeholder.svg?height=600&width=1920&text=About Us"
          alt="About Us background"
          fill
          className="object-cover brightness-50"
        />
        <div className="container relative z-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Story</h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl">
              LoveConnect was founded with a simple mission: to create meaningful connections in a world where dating
              has become increasingly digital.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-gray-300 mb-4">
                At LoveConnect, we believe that meaningful relationships are the foundation of a fulfilling life. Our
                mission is to help singles find genuine connections through innovative dating experiences both online
                and offline.
              </p>
              <p className="text-gray-300 mb-4">
                We're not just another dating app or service. We combine technology with real-world experiences to
                create opportunities for authentic connections. Our unique approach blends digital matching with
                in-person events to give you the best of both worlds.
              </p>
              <p className="text-gray-300">
                Whether you're looking for a serious relationship or just wanting to meet new people, LoveConnect
                provides a safe, inclusive, and fun environment to help you on your journey.
              </p>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600&text=Our Mission"
                alt="Our Mission"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Authenticity",
                description:
                  "We believe in real connections between real people. Our platform and events are designed to showcase your authentic self.",
                icon: "🤝",
              },
              {
                title: "Inclusivity",
                description:
                  "Love is for everyone. We create a welcoming environment for people of all backgrounds, orientations, and relationship goals.",
                icon: "❤️",
              },
              {
                title: "Innovation",
                description:
                  "We're constantly evolving our approach to dating, combining the best of technology with meaningful in-person experiences.",
                icon: "💡",
              },
              {
                title: "Safety",
                description:
                  "Your safety is our priority. We verify profiles, moderate our community, and create secure spaces for you to connect.",
                icon: "🔒",
              },
              {
                title: "Quality",
                description:
                  "We focus on quality connections rather than endless swiping. Our matching algorithms and event formats are designed for meaningful interactions.",
                icon: "⭐",
              },
              {
                title: "Fun",
                description:
                  "Dating should be enjoyable! We create experiences that are fun, engaging, and take the pressure off meeting new people.",
                icon: "🎉",
              },
            ].map((value, index) => (
              <div key={index} className="bg-black p-6 rounded-lg border border-gray-800">
                <div className="text-3xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gray-900">
        <div className="container">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Alex Johnson",
                role: "Founder & CEO",
                bio: "Alex founded LoveConnect after experiencing the challenges of modern dating firsthand. With a background in psychology and tech, he's passionate about creating meaningful connections.",
              },
              {
                name: "Sarah Chen",
                role: "Chief Matchmaker",
                bio: "With over 10 years of experience in matchmaking, Sarah leads our team of relationship experts who curate our matching algorithms and provide personalized coaching.",
              },
              {
                name: "Michael Rodriguez",
                role: "Events Director",
                bio: "Michael brings his extensive background in event planning to create unforgettable dating experiences that help singles connect in authentic ways.",
              },
              {
                name: "Jessica Kim",
                role: "Head of Technology",
                bio: "Jessica oversees our platform development, ensuring that our technology enhances rather than replaces the human element of dating.",
              },
            ].map((member, index) => (
              <div key={index} className="bg-black rounded-lg overflow-hidden border border-gray-800">
                <div className="h-64 relative">
                  <Image
                    src={`/placeholder.svg?height=300&width=300&text=${member.name}`}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-red-500 mb-4">{member.role}</p>
                  <p className="text-gray-400">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-black">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Our Members Say</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Don't just take our word for it. Hear from some of the thousands of singles who have found love through
              LoveConnect.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                quote:
                  "After trying countless dating apps with no success, LoveConnect's events changed everything. Meeting people face-to-face in a structured environment made all the difference. I met my fiancé at a speed dating night!",
                name: "Rachel T.",
                location: "New York",
              },
              {
                quote:
                  "The Premium Connect plan matched me with exactly the kind of person I was looking for. The compatibility algorithm is incredible. We've been dating for 6 months now and things are going great.",
                name: "James L.",
                location: "Chicago",
              },
              {
                quote:
                  "As an introvert, dating events seemed intimidating, but LoveConnect's format made it easy to connect. The hosts were fantastic at making everyone feel comfortable. I'm now dating someone I met at a wine tasting event!",
                name: "Sophia K.",
                location: "San Francisco",
              },
              {
                quote:
                  "The personal matchmaker from the Elite plan took the time to understand what I was looking for. The quality of matches was far better than anything I experienced on other platforms. Worth every penny!",
                name: "Marcus J.",
                location: "Miami",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-900 p-8 rounded-lg border border-gray-800">
                <div className="flex flex-col h-full">
                  <div className="text-4xl text-red-600 mb-4">"</div>
                  <p className="text-gray-300 mb-6 flex-grow">{testimonial.quote}</p>
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-gray-400">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">LoveConnect in the Press</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              See what the media is saying about our innovative approach to dating.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                publication: "Dating Today",
                title: "LoveConnect Revolutionizes the Dating Scene with Hybrid Approach",
                excerpt:
                  "By combining technology with in-person events, LoveConnect is changing how singles meet and form meaningful connections.",
              },
              {
                publication: "Tech Insider",
                title: "The Science Behind LoveConnect's Successful Matching Algorithm",
                excerpt:
                  "An inside look at how LoveConnect's proprietary algorithm achieves a 78% success rate in creating compatible matches.",
              },
              {
                publication: "Lifestyle Magazine",
                title: "Dating Events That Actually Work: The LoveConnect Story",
                excerpt:
                  "How LoveConnect's carefully curated events are helping singles overcome dating app fatigue and find real connections.",
              },
            ].map((article, index) => (
              <div key={index} className="bg-black p-6 rounded-lg border border-gray-800">
                <p className="text-red-500 mb-2">{article.publication}</p>
                <h3 className="text-xl font-bold text-white mb-3">{article.title}</h3>
                <p className="text-gray-400 mb-4">{article.excerpt}</p>
                <Button variant="link" className="text-red-500 p-0">
                  Read Article →
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-black">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Join the LoveConnect Community</h2>
            <p className="text-xl text-white/80 mb-8">
              Whether you're looking for a serious relationship or just want to meet new people, we're here to help you
              connect.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white" asChild>
                <Link href="/events">Browse Events</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link href="/plans">View Plans</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
