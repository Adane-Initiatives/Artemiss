import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Globe from "@/components/globe"
import FeaturesSection from "@/components/features-section"


export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        {/* Hero Section Container with 100px padding */}
        <section id="hero" className="max-w-6xl mx-auto px-4 md:px-[100px] pt-20 md:py-[100px]">
          {/* Inner Container for Text and Buttons with 16px gap */}
          <div className="flex flex-col items-center gap-[16px] text-center">
            <div className="inline-flex items-center px-[12px] py-[8px] bg-white border border-[#F5F5F5] rounded-full">
              <span className="text-xs font-medium text-white bg-[#114FFF] rounded-full px-2 py-0.5 mr-[6px]">New</span>
              <span className="text-[12px] font-normal">Demo available now - Try it out!</span>
              <div className="ml-[6px] p-[6px] border border-[#F5F5F5] rounded-[100px] inline-flex items-center justify-center">
                <Link href="monitor" className="inline-flex items-center justify-center">
                  <ArrowUpRight className="h-[12px] w-[12px]" />
                </Link>
              </div>
            </div>

            <h1 className="text-[48px] font-medium leading-tight text-[#0A0A0A] max-w-4xl">
              A safe place for everyone, everywhere
            </h1>

            <p className="text-[18px] font-normal text-[#A3A3A3] max-w-3xl">
              Artemis is an AI-driven security system that detects threats in real time, automates emergency response,
              and keeps communities safe.
            </p>

            <div className="flex items-center justify-center gap-1.5 mt-4">
              <Link
                href="artemis"
                className="px-4 py-2.5 rounded-full bg-[#2563EB] text-white text-[10px] font-medium hover:bg-[#2563EB]/90 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Try Demo
              </Link>
              <Link
                href="./models/serafin"
                className="px-4 py-2.5 rounded-full bg-white border border-[#F5F5F5] text-[#0a0a0a] text-[10px] font-medium hover:bg-gray-50 transition-colors"
              >
                See it in Action
              </Link>
            </div>

            {/* Globe Component */}
            <div className="mt-16 w-full max-w-xl">
              <Globe />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <FeaturesSection />
      </main>

      <Footer />
    </div>
  )
}
