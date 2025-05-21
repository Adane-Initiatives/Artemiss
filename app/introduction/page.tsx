import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function IntroductionPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-[80px]">
        <div className="max-w-6xl mx-auto px-4 md:px-[100px] py-12">
          {/* Hero Section */}
          <div className="mb-16 text-center">
            <h1 className="text-[48px] font-medium text-[#0A0A0A] mb-4">Introduction to Artemis</h1>
            <p className="text-[18px] font-normal text-[#A3A3A3] max-w-3xl mx-auto mb-8">
              Discover how our AI-driven security system is transforming urban safety through real-time monitoring,
              threat detection, and intelligent response.
            </p>
          </div>

          {/* Overview Section */}
          <div className="mb-16">
            <div className="relative w-full h-[400px] rounded-[16px] overflow-hidden bg-[#0a0a3a] mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-[#114FFF]/40 to-[#7000FF]/40"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white p-8 max-w-2xl">
                  <h2 className="text-[32px] font-medium mb-4">A New Approach to Safety</h2>
                  <p className="text-[18px] font-normal text-white/80">
                    Artemis transforms passive surveillance into active protection, using AI to detect threats in
                    real-time and provide immediate, actionable insights.
                  </p>
                </div>
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="text-[16px] font-normal text-[#A3A3A3] mb-6">
                Every day, countless cameras capture moments that could signal trouble, but most of that footage is
                simply stored away until an incident forces someone to review it. In times of crisis, when seconds
                count, relying on slow, manual video checks isn't enough.
              </p>
              <p className="text-[16px] font-normal text-[#A3A3A3] mb-6">
                The problem isn't a lack of data or surveillance infrastructure, but the inefficient processing and
                utilization of the vast amounts of information already being collected. Cities are equipped with
                extensive camera networks, sensor arrays, and communication systems, yet the critical insights these
                systems could provide often remain untapped due to limitations in real-time analysis capabilities.
              </p>
              <p className="text-[16px] font-normal text-[#A3A3A3] mb-6">
                Artemis addresses this challenge by leveraging cutting-edge artificial intelligence to transform raw
                surveillance data into immediate, actionable insights. Our system doesn't just record what happens—it
                understands it, classifies it, and helps you respond to it in real-time.
              </p>
            </div>
          </div>

          {/* The Artemis System Section */}
          <div className="mb-16">
            <h2 className="text-[24px] font-medium text-[#0A0A0A] mb-8">The Artemis System</h2>
            <p className="text-[16px] font-normal text-[#A3A3A3] mb-8">
              Our comprehensive security solution consists of three core AI models working in concert to provide
              unparalleled awareness and response capabilities:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="p-[16px] border border-[#F5F5F5] rounded-lg">
                <div className="mb-4 w-full h-[200px] flex items-center justify-center border border-[#F5F5F5] rounded-[12px] overflow-hidden bg-[#F5F5F5]">
                  <Image
                    src="/images/interactive-ai.svg"
                    alt="Artemis AI"
                    width={150}
                    height={150}
                    className="w-auto h-auto"
                  />
                </div>
                <Link href="/models/artemis" className="block">
                  <h3 className="text-[16px] font-medium text-[#0A0A0A] mb-2">Artemis</h3>
                </Link>
                <p className="text-[12px] font-normal text-[#A3A3A3] mb-4">
                  An interactive AI interface that processes urban data and provides real-time insights to users,
                  answering questions and delivering contextual information about ongoing situations.
                </p>
                <Link
                  href="/models/artemis"
                  className="text-[12px] font-medium text-[#2563EB] hover:underline inline-flex items-center"
                >
                  Learn more
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1 h-3 w-3"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </Link>
              </div>

              <div className="p-[16px] border border-[#F5F5F5] rounded-lg">
                <div className="mb-4 w-full h-[200px] flex items-center justify-center border border-[#F5F5F5] rounded-[12px] overflow-hidden bg-[#F5F5F5]">
                  <Image
                    src="/images/real-time-monitoring.svg"
                    alt="Serafin"
                    width={150}
                    height={150}
                    className="w-auto h-auto"
                  />
                </div>
                <Link href="/models/serafin" className="block">
                  <h3 className="text-[16px] font-medium text-[#0A0A0A] mb-2">Serafin</h3>
                </Link>
                <p className="text-[12px] font-normal text-[#A3A3A3] mb-4">
                  A real-time monitoring system that analyzes video feeds to detect emergencies and unusual activities
                  as they happen, generating descriptive threads of events.
                </p>
                <Link
                  href="/models/serafin"
                  className="text-[12px] font-medium text-[#2563EB] hover:underline inline-flex items-center"
                >
                  Learn more
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1 h-3 w-3"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </Link>
              </div>

              <div className="p-[16px] border border-[#F5F5F5] rounded-lg">
                <div className="mb-4 w-full h-[200px] flex items-center justify-center border border-[#F5F5F5] rounded-[12px] overflow-hidden bg-[#F5F5F5]">
                  <Image
                    src="/images/threat-identification.svg"
                    alt="Archer"
                    width={150}
                    height={150}
                    className="w-auto h-auto"
                  />
                </div>
                <Link href="/models/archer" className="block">
                  <h3 className="text-[16px] font-medium text-[#0A0A0A] mb-2 flex items-center">
                    Archer
                    <span className="ml-1.5 text-[8px] font-medium text-white bg-[#114FFF] rounded-full px-1.5 py-0.5">
                      New
                    </span>
                  </h3>
                </Link>
                <p className="text-[12px] font-normal text-[#A3A3A3] mb-4">
                  A visual profiling system that generates detailed descriptions of individuals to aid in identifying
                  suspects and locating victims in crisis situations.
                </p>
                <Link
                  href="/models/archer"
                  className="text-[12px] font-medium text-[#2563EB] hover:underline inline-flex items-center"
                >
                  Learn more
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1 h-3 w-3"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>

            <p className="text-[16px] font-normal text-[#A3A3A3]">
              Together, these three models create a comprehensive security ecosystem that transforms passive
              surveillance into active protection, enabling faster response times, better resource allocation, and
              improved overall safety.
            </p>
          </div>

          {/* How It Works Section */}
          <div className="mb-16">
            <h2 className="text-[24px] font-medium text-[#0A0A0A] mb-8">How It Works</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-[18px] font-medium text-[#0A0A0A] mb-4">1. Real-Time Monitoring</h3>
                <p className="text-[14px] font-normal text-[#A3A3A3] mb-6">
                  Artemis connects to existing camera networks and sensor systems, continuously analyzing the data they
                  capture. Unlike traditional surveillance systems that passively record footage, Artemis actively
                  processes what it sees in real-time.
                </p>
                <h3 className="text-[18px] font-medium text-[#0A0A0A] mb-4">2. Threat Detection</h3>
                <p className="text-[14px] font-normal text-[#A3A3A3]">
                  Using advanced computer vision and machine learning algorithms, Artemis identifies potential threats
                  and unusual activities as they occur. The system can detect a wide range of situations, from traffic
                  accidents and medical emergencies to suspicious behavior and public safety hazards.
                </p>
              </div>

              <div>
                <h3 className="text-[18px] font-medium text-[#0A0A0A] mb-4">3. Intelligent Classification</h3>
                <p className="text-[14px] font-normal text-[#A3A3A3] mb-6">
                  Once a situation is detected, Artemis classifies it based on type and urgency, ensuring that resources
                  are allocated efficiently. This classification system helps prioritize responses and ensures that the
                  most critical situations receive immediate attention.
                </p>
                <h3 className="text-[18px] font-medium text-[#0A0A0A] mb-4">4. Actionable Insights</h3>
                <p className="text-[14px] font-normal text-[#A3A3A3]">
                  Artemis provides users with clear, contextual information about ongoing situations, enabling faster
                  and more effective decision-making. Whether you're a first responder, a security professional, or a
                  concerned citizen, Artemis gives you the insights you need to stay informed and take appropriate
                  action.
                </p>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mb-16">
            <h2 className="text-[24px] font-medium text-[#0A0A0A] mb-8">Key Benefits</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-[16px] border border-[#F5F5F5] rounded-lg">
                <div className="p-[6px] border border-[#F5F5F5] rounded-[100px] inline-flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                  </svg>
                </div>
                <h3 className="text-[16px] font-medium text-[#0A0A0A] mb-2">Faster Response Times</h3>
                <p className="text-[12px] font-normal text-[#A3A3A3]">
                  By detecting threats in real-time and automatically alerting the appropriate responders, Artemis
                  significantly reduces response times, potentially saving lives and preventing escalation.
                </p>
              </div>

              <div className="p-[16px] border border-[#F5F5F5] rounded-lg">
                <div className="p-[6px] border border-[#F5F5F5] rounded-[100px] inline-flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <h3 className="text-[16px] font-medium text-[#0A0A0A] mb-2">Enhanced Public Safety</h3>
                <p className="text-[12px] font-normal text-[#A3A3A3]">
                  Artemis helps create safer communities by providing early detection of potential threats and enabling
                  proactive intervention before situations escalate.
                </p>
              </div>

              <div className="p-[16px] border border-[#F5F5F5] rounded-lg">
                <div className="p-[6px] border border-[#F5F5F5] rounded-[100px] inline-flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4"></path>
                    <path d="M12 8h.01"></path>
                  </svg>
                </div>
                <h3 className="text-[16px] font-medium text-[#0A0A0A] mb-2">Improved Situational Awareness</h3>
                <p className="text-[12px] font-normal text-[#A3A3A3]">
                  By providing real-time insights and contextual information, Artemis helps users make more informed
                  decisions about their surroundings and potential risks.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-white border border-[#F5F5F5] rounded-[16px] py-16 px-8 text-center">
            <h2 className="text-[24px] font-medium text-[#0A0A0A] mb-4">Experience the future of safety</h2>
            <p className="text-[16px] font-normal text-[#A3A3A3] mb-8 max-w-xl mx-auto">
              Ready to see how Artemis can transform security in your community? Try our interactive demo or explore our
              models in more detail.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/playground"
                className="px-4 py-2.5 rounded-full bg-[#2563EB] text-white text-[10px] font-medium hover:bg-[#2563EB]/90 transition-colors"
              >
                Try Demo
              </Link>
              <Link
                href="/get-involved"
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
