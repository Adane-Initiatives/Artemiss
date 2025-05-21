import Link from "next/link"
import { Play } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function SerafinPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-[80px]">
        {/* Hero Section */}
        <section className="w-full max-w-6xl mx-auto px-4 md:px-[100px] pt-16 pb-12 text-center">
          <div className="inline-flex items-center px-[12px] py-[8px] bg-white border border-[#F5F5F5] rounded-full mb-6">
            <span className="text-[12px] font-normal">Introducing Serafin</span>
          </div>

          <h1 className="text-[48px] font-medium leading-tight text-[#0A0A0A] mb-6">
            See everything, understand anything
          </h1>

          <p className="text-[18px] font-normal text-[#A3A3A3] max-w-2xl mx-auto mb-8">
            Serafin converts raw surveillance into structured intelligence, enabling real-time awareness and proactive
            security.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link
              href="#try-serafin"
              className="px-4 py-2.5 rounded-full bg-[#2563EB] text-white text-[10px] font-medium hover:bg-[#2563EB]/90 transition-colors"
            >
              Try Serafin Now
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
              Every day, countless cameras around the city capture moments that could signal trouble, from accidents to
              unusual crowd behavior, but most of that footage is simply stored away until an incident forces someone to
              review it. In times of crisis, when seconds count, relying on slow, manual video checks isn't enough.
            </p>
            <p className="text-[16px] font-normal text-[#A3A3A3] mb-12">
              Traditional surveillance systems passively record the scene, often missing the urgent details that would
              allow for a quick response. The problem isn't a shortage of cameras; it's the lack of real-time
              understanding of what the cameras capture.
            </p>

            <h2 className="text-[24px] font-medium text-[#0A0A0A] mb-6" id="how-it-works">
              What Is Serafin and How It Works
            </h2>
            <p className="text-[16px] font-normal text-[#A3A3A3] mb-6">
              Serafin is designed to transform raw video feeds into immediate, actionable insights. It continuously
              processes live and recorded footage to detect signs of emergency or concern—a person falling, a stalled
              vehicle, a sudden blockage, or an unusual gathering. Serafin generates a live stream of descriptive
              "threads." These are simple, chronological descriptions of what's being observed in each frame.
            </p>
            <p className="text-[16px] font-normal text-[#A3A3A3] mb-12">
              By piecing together these moments, Serafin creates a continuous narrative of events, to understand the
              situation in real time.
            </p>

            <h2 className="text-[24px] font-medium text-[#0A0A0A] mb-6">What Serafin Does Differently?</h2>
            <p className="text-[16px] font-normal text-[#A3A3A3] mb-6">
              While most systems depend on delayed reports or manual monitoring, Serafin actively "reads" the scene. It
              doesn't wait for a clear face or a specific alarm; it focuses on the context and the physical changes in
              the environment. The system detects anomalies—unexpected sizes, erratic movements, blocked lanes—and
              classifies them by type and urgency, so you know instantly if a situation is evolving into an emergency.
            </p>
            <p className="text-[16px] font-normal text-[#A3A3A3] mb-12">
              It builds a timeline of events that helps to see the story as it unfolds, making it possible to react
              promptly and accurately.
            </p>

            <h2 className="text-[24px] font-medium text-[#0A0A0A] mb-6">Why It Matters</h2>
            <p className="text-[16px] font-normal text-[#A3A3A3] mb-6">
              Detecting emergencies as they happen is crucial—every second can prevent further harm. Serafin doesn't
              just add another layer of video storage; it turns a flood of raw footage into clear, structured
              information that allows you to act before a situation escalates. With its real-time analysis, Serafin
              provides the context needed to understand the unfolding events, ensuring that emergency responses come
              swiftly and effectively.
            </p>
            <p className="text-[16px] font-normal text-[#A3A3A3] mb-6">
              It's about bridging that gap between what's happening on the street and the critical action that can
              prevent disasters.
            </p>
            <p className="text-[16px] font-normal text-[#A3A3A3] mb-12">
              We built Serafin because safety should be proactive, not reactive, and every moment of awareness can make
              a difference.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="w-full max-w-6xl mx-auto px-4 md:px-[100px] mb-20">
          <div className="bg-white border border-[#F5F5F5] rounded-[16px] py-16 px-8 text-center">
            <h2 className="text-[24px] font-medium text-[#0A0A0A] mb-4">Transform surveillance into intelligence</h2>
            <p className="text-[16px] font-normal text-[#A3A3A3] mb-8 max-w-xl mx-auto">
              Serafin turns passive video feeds into active awareness, helping you detect emergencies before they
              escalate and respond when every second counts.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="#try-serafin-now"
                id="try-serafin"
                className="px-4 py-2.5 rounded-full bg-[#2563EB] text-white text-[10px] font-medium hover:bg-[#2563EB]/90 transition-colors"
              >
                Try Serafin Now
              </Link>
              <Link
                href="#how-it-works"
                className="px-4 py-2.5 rounded-full bg-white border border-[#F5F5F5] text-[#0a0a0a] text-[10px] font-medium hover:bg-gray-50 transition-colors"
              >
                See How it Works
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
