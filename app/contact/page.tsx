"use client"

import type React from "react"

import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    subject: "",
    email: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError("")

    try {
      // Simulamos una petición a un servidor
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulamos una respuesta exitosa
      setSubmitSuccess(true)
      setFormData({
        fullName: "",
        subject: "",
        email: "",
        message: "",
      })
    } catch (error) {
      setSubmitError("There was an error sending your message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-[80px]">
        <div className="max-w-6xl mx-auto px-4 md:px-[100px] py-12">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-[48px] font-medium text-[#0A0A0A] mb-4">Let's talk.</h1>
            <p className="text-[18px] font-normal text-[#A3A3A3] mb-12">
              Whether you have a question, want to collaborate, or just want to share a thought—we're here for it.
            </p>

            {submitSuccess ? (
              <div className="bg-[#F5F5F5] rounded-[16px] p-8 text-center">
                <h2 className="text-[24px] font-medium text-[#0A0A0A] mb-4">Message sent!</h2>
                <p className="text-[16px] font-normal text-[#A3A3A3] mb-6">
                  Thank you for reaching out. We'll get back to you as soon as possible.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="px-4 py-2.5 rounded-full bg-[#2563EB] text-white text-[10px] font-medium hover:bg-[#2563EB]/90 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <div className="border border-[#F5F5F5] rounded-lg p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-[16px] font-medium text-[#0A0A0A] mb-4">Send us a Message</h2>
                    <p className="text-[14px] font-normal text-[#A3A3A3] mb-6">
                      We try to respond within a few days. If it's something urgent, mention it in your message.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="fullName" className="block text-[12px] font-medium text-[#0A0A0A] mb-2">
                      Full name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Laura"
                      required
                      className="w-full px-4 py-2.5 rounded-[8px] border border-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-[14px]"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-[12px] font-medium text-[#0A0A0A] mb-2">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 rounded-[8px] border border-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-[14px] appearance-none bg-white"
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-[12px] font-medium text-[#0A0A0A] mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@email.com"
                      required
                      className="w-full px-4 py-2.5 rounded-[8px] border border-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-[14px]"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-[12px] font-medium text-[#0A0A0A] mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Enter message"
                      required
                      rows={5}
                      className="w-full px-4 py-2.5 rounded-[8px] border border-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-[14px] resize-none"
                    />
                  </div>

                  {submitError && <div className="text-red-500 text-[12px]">{submitError}</div>}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2.5 rounded-[8px] bg-[#2563EB] text-white text-[14px] font-medium hover:bg-[#2563EB]/90 transition-colors disabled:opacity-70"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
