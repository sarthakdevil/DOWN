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
          src="/WhatsApp Image 2025-06-07 at 16.34.57_20ca118e.jpg"
          alt="About Us background"
          fill
          className="object-cover brightness-50"
        />
        <div className="container relative z-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Story</h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl">
              DOWNDATING began as a fun experiment by a group of college students who noticed how many great connections
              were missed at campus events. What started as a small matchmaking initiative at college fests quickly
              turned into something bigger. We focused on creating meaningful matches based on shared vibes, interests,
              and real-life interactions—not just profiles. With each successful date, word spread, and what began as a
              passion project grew into a thriving startup. Today, DOWNDATING continues to connect people authentically,
              turning casual meetups into lasting stories.
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
                At DOWNDATING, we believe that love shouldn’t start with awkward swipes or cheesy bios—it should begin
                with a spark, a smile, maybe even a bad joke at a college event. That’s how we started too—a bunch of
                friends trying to match people up for fun at campus fests. But when we saw real connections blooming
                (and even a few couples holding hands at the canteen), we knew we were onto something special.
              </p>
              <p className="text-gray-300 mb-4">
                We’re here to bring the heart back into dating. DOWNDATING is all about real vibes, genuine moments, and
                helping people meet the way it should feel—easy, exciting, and a little bit magical. Whether it’s a
                shared love for midnight chai, indie music, or terrible puns, we help people find matches that actually
                click. No pressure, just possibilities.
              </p>
              <p className="text-gray-300">
                Our mission is simple: to turn casual meetups into sweet memories, and sparks into something more. We
                want to make dating feel natural, warm, and full of little butterflies again. Because honestly? Everyone
                deserves a cute “how we met” story—and we’re here to help you write yours. 
              </p>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/WhatsApp Image 2025-06-07 at 16.34.59_78ad2dd5.jpg"
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
          <div className="max-w-3xl mx-auto">
            <div className="bg-black rounded-lg overflow-hidden border border-gray-800">
              <div className="h-[400px] relative">
                <Image
                  src="/WhatsApp Image 2025-06-07 at 16.37.07_0b6863d6.jpg"
                  alt="DOWNDATING Team"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-3">The DOWNDATING Core Team</h3>
                <p className="text-red-500 mb-4">Team DOWNDATING</p>
                <p className="text-gray-400">
                  What started as a casual conversation in a college canteen has now turned into DOWNDATING. Our
                  founding team brings together expertise in psychology, technology, and event planning with a shared
                  passion for creating authentic connections. As college friends who saw too many people struggling with
                  traditional dating apps, we decided to build something different—a platform that celebrates real
                  interactions and meaningful relationships. Together, we're on a mission to make dating feel natural,
                  fun, and full of possibilities again.
                </p>
              </div>
            </div>
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
                  "After trying countless dating apps with no success, DOWNDATING's events changed everything. Meeting people face-to-face in a structured environment made all the difference. I met my fiancé at a speed dating night!",
                name: "Priya Sharma",
                location: "Mumbai",
              },
              {
                quote:
                  "The Premium Connect plan matched me with exactly the kind of person I was looking for. The compatibility algorithm is incredible. We've been dating for 6 months now and things are going great.",
                name: "Arjun Patel",
                location: "Delhi",
              },
              {
                quote:
                  "As an introvert, dating events seemed intimidating, but DOWNDATING's format made it easy to connect. The hosts were fantastic at making everyone feel comfortable. I'm now dating someone I met at a wine tasting event!",
                name: "Meera Kapoor",
                location: "Bangalore",
              },
              {
                quote:
                  "The personal matchmaker from the Elite plan took the time to understand what I was looking for. The quality of matches was far better than anything I experienced on other platforms. Worth every penny!",
                name: "Vikram Singh",
                location: "Hyderabad",
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
      {/* CTA */}
      <section className="py-16 bg-black">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Join the DOWNDATING Community</h2>
            <p className="text-xl text-white/80 mb-8">
              Whether you're looking for a serious relationship or just want to meet new people, we're here to help you
              connect.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white" asChild>
                <Link href="/">Go to home</Link>
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
