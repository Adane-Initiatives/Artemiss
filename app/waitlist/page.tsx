"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Globe from "@/components/globe"

export default function WaitlistPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState({
    title: "",
    description: "",
  })
  const [error, setError] = useState("")
  const [registrationCount, setRegistrationCount] = useState(27)
  const [registeredEmails, setRegisteredEmails] = useState<string[]>([])

  useEffect(() => {
    // Intentar obtener el contador y emails registrados desde localStorage
    const savedCount = localStorage.getItem("waitlistCount")
    if (savedCount) {
      setRegistrationCount(Number.parseInt(savedCount, 10))
    }

    const savedEmails = localStorage.getItem("registeredEmails")
    if (savedEmails) {
      setRegisteredEmails(JSON.parse(savedEmails))
    }
  }, [])

  // Efecto para ocultar la alerta después de 5 segundos
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showAlert])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Verificar si el email ya está registrado
      if (registeredEmails.includes(email)) {
        setAlertMessage({
          title: "Email already registered",
          description: "This email is already on our waitlist.",
        })
      } else {
        // Registrar nuevo email
        const newEmails = [...registeredEmails, email]
        setRegisteredEmails(newEmails)
        localStorage.setItem("registeredEmails", JSON.stringify(newEmails))

        // Incrementar el contador y guardarlo en localStorage
        const newCount = registrationCount + 1
        setRegistrationCount(newCount)
        localStorage.setItem("waitlistCount", newCount.toString())

        setAlertMessage({
          title: "Successfully signed up to the waitlist",
          description: "We'll notify you when you get access.",
        })

        setEmail("")
      }

      setShowAlert(true)
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-[80px]">
        <div className="max-w-6xl mx-auto px-4 md:px-[100px] py-12">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-[48px] font-medium text-[#0A0A0A] mb-4">Get early access</h1>
            <p className="text-[18px] font-normal text-[#A3A3A3] mb-8">
              Be amongst the first to experience our services.
            </p>

            {showAlert && (
              <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white border border-gray-100 shadow-lg rounded-xl p-4 w-full max-w-sm z-50 flex items-start gap-3">
                <Heart className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <h3 className="font-medium text-[#0A0A0A] text-[14px]">{alertMessage.title}</h3>
                  <p className="text-[#A3A3A3] text-[12px]">{alertMessage.description}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-md w-full">
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="flex-1 px-4 py-2.5 rounded-full border border-[#F5F5F5] focus:outline-none text-[14px]"
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-full bg-[#2563EB] text-white text-[10px] font-medium hover:bg-[#2563EB]/90 transition-colors disabled:opacity-70 whitespace-nowrap"
                >
                  {isSubmitting ? "Joining..." : "Join Waitlist"}
                </button>
              </div>
              {error && <p className="text-red-500 text-[12px] mt-2">{error}</p>}
            </form>

            <p className="text-[14px] font-normal text-[#0A0A0A] mt-4">
              Join {registrationCount}+ others who signed up
            </p>

            <div className="mt-16 w-full max-w-xl">
              <Globe />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
