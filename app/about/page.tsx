"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Shield, Heart, Lightbulb, Star, Smile } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { cn } from "@/lib/utils"

export default function AboutPage() {
  const { theme } = useTheme()

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300",
        theme === "dark" ? "bg-[#212121] text-white" : "bg-white text-gray-900",
      )}
    >
      {/* Back Button */}
      <div className="px-4 pt-4">
        <Link href="/" className="inline-flex items-center text-red-600 hover:text-red-500 transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span className="font-medium">Back</span>
        </Link>
      </div>

      {/* Our Story Section */}
      <section className="relative mx-4 mt-6 mb-8 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <Image
          src="/WhatsApp Image 2025-06-07 at 16.34.57_20ca118e.jpg"
          alt="Our Story background"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-8">Our Story</h1>
          <div className="max-w-4xl space-y-6">
            <p className="text-white text-lg leading-relaxed">
              Downdating began as a fun experiment by a group of college students who noticed how many great connections
              were missed at campus events. What started as a small matchmaking initiative at college fests quickly
              turned into something bigger.
            </p>
            <p className="text-white text-lg leading-relaxed">
              We focused on creating meaningful matches based on shared vibes, interests, and real-life interactions—not
              just profiles. With each successful date, word spread, and what began as a passion project grew into a
              thriving startup. Today, Downdating continues to connect people authentically, turning casual meetups into
              lasting stories.
            </p>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section
        className={cn(
          "mx-4 mb-12 rounded-2xl p-8 md:p-12 border transition-colors duration-300",
          theme === "dark" ? "bg-[#121212] border-[#333333]" : "bg-gray-50 border-gray-200",
        )}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-red-600 mb-8">Our Mission</h2>
            <div className={cn("space-y-4", theme === "dark" ? "text-white" : "text-gray-900")}>
              <p className="leading-relaxed">
                At Downdating, we believe that love shouldn't start with awkward swipes or cheesy bios—it should begin
                with a spark, a simple even a bad joke at a college event. That's how we started too—a bunch of friends
                trying to match people up for fun at campus fests. But when we saw real connections blooming (and even a
                few couples holding hands at the canteen), we knew we were onto something special.
              </p>
              <p className="leading-relaxed">
                We're here to bring the heart back into dating. Downdating is all about real vibes, genuine moments, and
                helping people meet the way it should feel—easy, exciting, and a little bit magical. Whether it's a
                shared love for midnight chai, indie music, or terrible puns, we help people find matches that actually
                click. No pressure, just possibilities.
              </p>
              <p className="leading-relaxed">
                Our mission is simple: to turn casual meetups into sweet memories, and sparks into something more. We
                want to make dating feel natural, warm, and full of little butterflies again. Because honestly? Everyone
                deserves a cute "how we met" story—and we're here to help you write yours.
              </p>
            </div>
          </div>
          <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden">
            <Image
              src="/placeholder.svg?height=400&width=600&text=Campus Event Photo"
              alt="Campus event with students holding colorful signs"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Our Core Values Section */}
      <section className="px-4 pb-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-red-600">Our Core Values</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Authenticity */}
          <div
            className={cn(
              "backdrop-blur-sm rounded-2xl p-6 border text-center transition-colors duration-300",
              theme === "dark" ? "bg-[#2a2a2a]/50 border-[#333333]" : "bg-gray-50/50 border-gray-200",
            )}
          >
            <div
              className={cn(
                "flex items-center justify-center w-16 h-16 rounded-full mb-4 mx-auto",
                theme === "dark" ? "bg-gray-700" : "bg-gray-200",
              )}
            >
              <Shield className={cn("h-8 w-8", theme === "dark" ? "text-gray-300" : "text-gray-600")} />
            </div>
            <h3 className={cn("text-xl font-bold mb-4", theme === "dark" ? "text-white" : "text-gray-900")}>
              Authenticity
            </h3>
            <p className={cn("text-sm leading-relaxed", theme === "dark" ? "text-gray-300" : "text-gray-600")}>
              We believe in real connections between real people. Our platform and events are designed to showcase your
              authentic self.
            </p>
          </div>

          {/* Inclusivity */}
          <div
            className={cn(
              "backdrop-blur-sm rounded-2xl p-6 border text-center transition-colors duration-300",
              theme === "dark" ? "bg-[#2a2a2a]/50 border-[#333333]" : "bg-gray-50/50 border-gray-200",
            )}
          >
            <div className="flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4 mx-auto">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h3 className={cn("text-xl font-bold mb-4", theme === "dark" ? "text-white" : "text-gray-900")}>
              Inclusivity
            </h3>
            <p className={cn("text-sm leading-relaxed", theme === "dark" ? "text-gray-300" : "text-gray-600")}>
              Love is for everyone. We create a welcoming environment for people of all backgrounds, orientations, and
              relationship goals.
            </p>
          </div>

          {/* Innovation */}
          <div
            className={cn(
              "backdrop-blur-sm rounded-2xl p-6 border text-center transition-colors duration-300",
              theme === "dark" ? "bg-[#2a2a2a]/50 border-[#333333]" : "bg-gray-50/50 border-gray-200",
            )}
          >
            <div className="flex items-center justify-center w-16 h-16 bg-yellow-500 rounded-full mb-4 mx-auto">
              <Lightbulb className="h-8 w-8 text-black" />
            </div>
            <h3 className={cn("text-xl font-bold mb-4", theme === "dark" ? "text-white" : "text-gray-900")}>
              Innovation
            </h3>
            <p className={cn("text-sm leading-relaxed", theme === "dark" ? "text-gray-300" : "text-gray-600")}>
              We're constantly evolving our approach to dating, combining the best of technology with meaningful
              in-person experiences.
            </p>
          </div>

          {/* Safety */}
          <div
            className={cn(
              "backdrop-blur-sm rounded-2xl p-6 border text-center transition-colors duration-300",
              theme === "dark" ? "bg-[#2a2a2a]/50 border-[#333333]" : "bg-gray-50/50 border-gray-200",
            )}
          >
            <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 mx-auto">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h3 className={cn("text-xl font-bold mb-4", theme === "dark" ? "text-white" : "text-gray-900")}>Safety</h3>
            <p className={cn("text-sm leading-relaxed", theme === "dark" ? "text-gray-300" : "text-gray-600")}>
              Your safety is our priority. We verify profiles, moderate our community, and create secure spaces for you
              to connect.
            </p>
          </div>

          {/* Quality */}
          <div
            className={cn(
              "backdrop-blur-sm rounded-2xl p-6 border text-center transition-colors duration-300",
              theme === "dark" ? "bg-[#2a2a2a]/50 border-[#333333]" : "bg-gray-50/50 border-gray-200",
            )}
          >
            <div className="flex items-center justify-center w-16 h-16 bg-yellow-500 rounded-full mb-4 mx-auto">
              <Star className="h-8 w-8 text-black" />
            </div>
            <h3 className={cn("text-xl font-bold mb-4", theme === "dark" ? "text-white" : "text-gray-900")}>Quality</h3>
            <p className={cn("text-sm leading-relaxed", theme === "dark" ? "text-gray-300" : "text-gray-600")}>
              We focus on quality connections rather than endless swiping. Our matching algorithms and event formats are
              designed for meaningful interactions.
            </p>
          </div>

          {/* Fun */}
          <div
            className={cn(
              "backdrop-blur-sm rounded-2xl p-6 border text-center transition-colors duration-300",
              theme === "dark" ? "bg-[#2a2a2a]/50 border-[#333333]" : "bg-gray-50/50 border-gray-200",
            )}
          >
            <div className="flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4 mx-auto">
              <Smile className="h-8 w-8 text-white" />
            </div>
            <h3 className={cn("text-xl font-bold mb-4", theme === "dark" ? "text-white" : "text-gray-900")}>Fun</h3>
            <p className={cn("text-sm leading-relaxed", theme === "dark" ? "text-gray-300" : "text-gray-600")}>
              Dating should be enjoyable! We create experiences that are fun, engaging, and take the pressure off
              meeting new people.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
