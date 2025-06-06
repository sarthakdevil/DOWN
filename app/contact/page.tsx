import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="bg-black min-h-screen">
      {/* Contact Form Section */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Get in Touch</h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Have questions about our events or dating plans? Want to collaborate with us? We'd love to hear from
                you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
                <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 text-red-500 mr-4 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Our Location</h3>
                      <p className="text-gray-400">
                        123 Dating Street
                        <br />
                        Love City, LC 12345
                        <br />
                        United States
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="h-6 w-6 text-red-500 mr-4 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Email Us</h3>
                      <p className="text-gray-400">
                        info@loveconnect.com
                        <br />
                        events@loveconnect.com
                        <br />
                        support@loveconnect.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-6 w-6 text-red-500 mr-4 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Call Us</h3>
                      <p className="text-gray-400">
                        Main: (123) 456-7890
                        <br />
                        Events: (123) 456-7891
                        <br />
                        Support: (123) 456-7892
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Business Hours</h3>
                  <div className="space-y-2 text-gray-400">
                    <p className="flex justify-between">
                      <span>Monday - Friday:</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Saturday:</span>
                      <span>10:00 AM - 4:00 PM</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Sunday:</span>
                      <span>Closed</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
                <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-white">
                        Your Name
                      </label>
                      <Input id="name" placeholder="John Doe" className="bg-gray-800 border-gray-700 text-white" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-white">
                        Your Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-white">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      placeholder="How can we help you?"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-white">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Your message here..."
                      className="bg-gray-800 border-gray-700 text-white min-h-[150px]"
                    />
                  </div>
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white">Send Message</Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                {
                  question: "How quickly can I expect a response to my inquiry?",
                  answer:
                    "We aim to respond to all inquiries within 24 hours during business days. For urgent matters, please call our support line.",
                },
                {
                  question: "Can I visit your office in person?",
                  answer:
                    "Yes, you can visit our office during business hours. We recommend scheduling an appointment in advance to ensure someone is available to assist you.",
                },
                {
                  question: "How do I report an issue with my account?",
                  answer:
                    "For account-related issues, please email support@loveconnect.com with your username and a description of the problem. Our support team will assist you promptly.",
                },
                {
                  question: "Do you offer partnership opportunities?",
                  answer:
                    "Yes, we're always open to partnerships with businesses and venues. Please contact us at partnerships@loveconnect.com with your proposal.",
                },
                {
                  question: "How can I suggest a new event location?",
                  answer:
                    "We love expanding to new locations! You can suggest a new event location through the 'Request Event' form on our Events page or by contacting us directly.",
                },
              ].map((faq, index) => (
                <div key={index} className="bg-black border border-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{faq.question}</h3>
                  <p className="text-gray-400">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-black">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Find Us</h2>
              <p className="text-gray-400">Visit our headquarters or attend one of our events near you.</p>
            </div>
            <div className="h-[400px] bg-gray-800 rounded-lg overflow-hidden relative">
              {/* This would be replaced with an actual map component */}
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white text-lg">Interactive Map Would Be Here</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-xl text-white/80 mb-8">
              Subscribe to our newsletter for the latest events and dating tips.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-gray-800 border-gray-700 text-white flex-1"
              />
              <Button className="bg-red-600 hover:bg-red-700 text-white">Subscribe</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
