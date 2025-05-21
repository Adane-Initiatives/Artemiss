import Link from "next/link"
import { Play } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function ArtemisPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-[80px]">
        {/* Hero Section */}
        <section className="w-full max-w-6xl mx-auto px-4 md:px-[100px] pt-16 pb-12 text-center">
          <div className="inline-flex items-center px-[12px] py-[8px] bg-white border border-[#F5F5F5] rounded-full mb-6">
            <span className="text-[12px] font-normal">Introducing Artemis</span>
          </div>

          <h1 className="text-[48px] font-medium leading-tight text-[#0A0A0A] mb-6">
            The kind of safety you feel, not just see
          </h1>

          <p className="text-[18px] font-normal text-[#A3A3A3] max-w-2xl mx-auto mb-8">
            Artemis is here so you can live your life knowing someone's always paying attention, even when you're not.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link
              href="https://v0-artemis-ou4y.vercel.app/artemis"
              className="px-4 py-2.5 rounded-full bg-[#2563EB] text-white text-[10px] font-medium hover:bg-[#2563EB]/90 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Try Demo
            </Link>
            <Link
              href="#how-it-works"
              className="px-4 py-2.5 rounded-full bg-white border border-[#F5F5F5] text-[#0a0a0a] text-[10px] font-medium hover:bg-gray-50 transition-colors"
            >
              See How it Works
            </Link>
          </div>
        </section>

        {/* Video Section */}
        <div className="w-full max-w-6xl mx-auto px-4 md:px-[100px] mb-12">
          <div className="relative w-full h-[400px] rounded-[16px] overflow-hidden bg-[#0a0a3a]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#114FFF]/40 to-[#7000FF]/40"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 transition-transform hover:scale-110">
                <Play className="w-6 h-6 text-white fill-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="w-full max-w-6xl mx-auto px-4 md:px-[100px] mb-12">
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-col">
              <span className="text-[12px] font-normal text-[#A3A3A3]">Technical Lead</span>
              <span className="text-[14px] font-medium text-[#0A0A0A]">Sourabh Singh</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-normal text-[#A3A3A3]">Research Lead</span>
              <span className="text-[14px] font-medium text-[#0A0A0A]">Tobias Adane</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full max-w-6xl mx-auto px-4 md:px-[100px] mb-16">
          <div className="prose max-w-none">
            <p className="text-[16px] font-normal text-[#A3A3A3] mb-6">
              Cameras are everywhere but intelligence isn't.
            </p>
            <p className="text-[16px] font-normal text-[#A3A3A3] mb-6">
              Every day, homes, streets and buildings are being recorded. But when something goes wrong, we often find
              ourselves watching after it's too late. Artemis is built to change that.
            </p>
            <p className="text-[16px] font-normal text-[#A3A3A3] mb-12">
              Instead of mere footage, we need faster understanding. Artemis is a system that listens, analyzes, and
              helps act on what's happening.
            </p>

            <h2 className="text-[24px] font-medium text-[#0A0A0A] mb-6" id="how-it-works">
              What Is Artemis
            </h2>
            <p className="text-[16px] font-normal text-[#A3A3A3] mb-6">
              Artemis is our interactive intelligence, designed to provide real-time alerts to homes, neighborhoods, and
              cities that use it.
            </p>
            <p className="text-[16px] font-normal text-[#A3A3A3] mb-6">
              It connects to surveillance systems, organizing everything it sees into a live timeline of events. It
              identifies incidents, tracks their development, and helps people on the ground respond with better
              information.
            </p>
            <p className="text-[16px] font-normal text-[#A3A3A3] mb-12">
              Artemis can answer questions, send updates, and stay alert even when you are not.
            </p>

            <h2 className="text-[24px] font-medium text-[#0A0A0A] mb-6">What Artemis Does Differently?</h2>
            <p className="text-[16px] font-normal text-[#A3A3A3] mb-6">
              Artemis doesn't just show data, it makes sense of it. It brings together everything the system sees and
              turns it into simple answers, updates, and context you can actually use. Instead of isolated alerts,
              Artemis builds a clear picture of what's happening and keeps that picture updated in real time.
            </p>
            <p className="text-[16px] font-normal text-[#A3A3A3] mb-12">
              You don't need to know what to look for, Artemis already does.
            </p>

            <h2 className="text-[24px] font-medium text-[#0A0A0A] mb-6">Why It Matters</h2>
            <p className="text-[16px] font-normal text-[#A3A3A3] mb-6">
              When something serious is happening, you shouldn't have to guess.
            </p>
            <p className="text-[16px] font-normal text-[#A3A3A3] mb-12">
              Whether it's a break-in, an accident, or something that just feels wrong, Artemis helps people make
              faster, better decisions. It's made for the moments where timing and understanding make the difference.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="w-full max-w-6xl mx-auto px-4 md:px-[100px] mb-20">
          <div className="bg-white border border-[#F5F5F5] rounded-[16px] py-16 px-8 text-center">
            <h2 className="text-[24px] font-medium text-[#0A0A0A] mb-4">Step into the future of safety</h2>
            <p className="text-[16px] font-normal text-[#A3A3A3] mb-8 max-w-xl mx-auto">
              We believe that security is a fundamental right and we are committed to working hard to build a future in
              which everyone can feel safe and secure.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="https://v0-artemis-ou4y.vercel.app/artemis"
                className="px-4 py-2.5 rounded-full bg-[#2563EB] text-white text-[10px] font-medium hover:bg-[#2563EB]/90 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Try Demo
              </Link>
              <Link
                href="#how-it-works"
                className="px-4 py-2.5 rounded-full bg-white border border-[#F5F5F5] text-[#0a0a0a] text-[10px] font-medium hover:bg-gray-50 transition-colors"
              >
                See it in Action
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
