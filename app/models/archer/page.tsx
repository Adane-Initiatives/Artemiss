import Link from "next/link"
import { Play } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function ArcherPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-[80px]">
        {/* Hero Section */}
        <section className="w-full max-w-6xl mx-auto px-4 md:px-[100px] pt-16 pb-12 text-center">
          <div className="inline-flex items-center px-[12px] py-[8px] bg-white border border-[#F5F5F5] rounded-full mb-6">
            <span className="text-xs font-medium text-white bg-[#114FFF] rounded-full px-2 py-0.5 mr-[6px]">New</span>
            <span className="text-[12px] font-normal">Introducing Archer</span>
          </div>

          <h1 className="text-[48px] font-medium leading-tight text-[#0A0A0A] mb-6">Find anyone, anywhere</h1>

          <p className="text-[18px] font-normal text-[#A3A3A3] max-w-2xl mx-auto mb-8">
            Archer generates precise individual profiles, enabling real-time identification of suspects and location of
            victims.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link
              href="#get-demo"
              className="px-4 py-2.5 rounded-full bg-[#2563EB] text-white text-[10px] font-medium hover:bg-[#2563EB]/90 transition-colors"
            >
              Get a Demo
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
              <span className="text-[14px] font-medium text-[#0A0A0A]">Sarah Haddad</span>
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
            <p className="text-[16px] font-normal text-[#A3A3A3] mb-6">Cameras are everywhere but recognition isn't.</p>
            <p className="text-[16px] font-normal text-[#A3A3A3] mb-6">
              Every day, countless moments are captured on video. But when we need to find someone specific, we're often
              left searching through hours of footage. Archer is built to change that.
            </p>
            <p className="text-[16px] font-normal text-[#A3A3A3] mb-12">
              Instead of relying on perfect facial recognition, we need a system that understands how people naturally
              describe others. Archer is that system.
            </p>

            <h2 className="text-[24px] font-medium text-[#0A0A0A] mb-6" id="how-it-works">
              What Is Archer
            </h2>
            <p className="text-[16px] font-normal text-[#A3A3A3] mb-6">
              Archer is our visual recognition intelligence, designed to help you find specific individuals based on
              simple descriptions.
            </p>
            <p className="text-[16px] font-normal text-[#A3A3A3] mb-6">
              It doesn't rely on knowing who someone is - just what they look like. Tell Archer about a person's
              appearance, and it will scan through footage to find matches, creating a timeline of where and when they
              were seen.
            </p>
            <p className="text-[16px] font-normal text-[#A3A3A3] mb-12">
              Archer can understand natural descriptions, track individuals across different cameras, and help locate
              people when time is critical.
            </p>

            <h2 className="text-[24px] font-medium text-[#0A0A0A] mb-6">What Archer Does Differently?</h2>
            <p className="text-[16px] font-normal text-[#A3A3A3] mb-6">
              Archer doesn't just look for faces, it sees the whole person. It focuses on the details that make someone
              recognizable - their clothing, how they move, what they're carrying - the things we naturally notice and
              describe.
            </p>
            <p className="text-[16px] font-normal text-[#A3A3A3] mb-12">
              You don't need to know who you're looking for, just how to describe them. Archer does the rest.
            </p>

            <h2 className="text-[24px] font-medium text-[#0A0A0A] mb-6">Why It Matters</h2>
            <p className="text-[16px] font-normal text-[#A3A3A3] mb-6">
              When someone needs to be found, every minute counts.
            </p>
            <p className="text-[16px] font-normal text-[#A3A3A3] mb-6">
              Whether it's locating a missing child, finding a vulnerable person, or identifying someone who poses a
              threat, Archer helps you act quickly with the information you have, not the information you wish you had.
            </p>
            <p className="text-[16px] font-normal text-[#A3A3A3] mb-12">
              It's about finding people when it matters most.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="w-full max-w-6xl mx-auto px-4 md:px-[100px] mb-20">
          <div className="bg-white border border-[#F5F5F5] rounded-[16px] py-16 px-8 text-center">
            <h2 className="text-[24px] font-medium text-[#0A0A0A] mb-4">See how it sees</h2>
            <p className="text-[16px] font-normal text-[#A3A3A3] mb-8 max-w-xl mx-auto">
              Archer helps you act on the first description, not the last clue. It sees what people see — and follows
              what matters.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="#get-demo"
                id="get-demo"
                className="px-4 py-2.5 rounded-full bg-[#2563EB] text-white text-[10px] font-medium hover:bg-[#2563EB]/90 transition-colors"
              >
                Get a Demo
              </Link>
              <Link
                href="#get-involved"
                className="px-4 py-2.5 rounded-full bg-white border border-[#F5F5F5] text-[#0a0a0a] text-[10px] font-medium hover:bg-gray-50 transition-colors"
              >
                Get Involved
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
