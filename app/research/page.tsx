import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface ResearchCardProps {
  title: string
  description: string
  date: string
  author: string
  authorRole: string
  authorImage?: string
  link: string
}

function ResearchCard({ title, description, date, author, authorRole, authorImage, link }: ResearchCardProps) {
  return (
    <div className="p-[16px] border border-[#F5F5F5] rounded-lg">
      <Link href={link} className="block">
        <h3 className="text-[16px] font-medium text-[#0A0A0A] mb-2">{title}</h3>
      </Link>
      <p className="text-[12px] font-normal text-[#A3A3A3] mb-4">{description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {authorImage ? (
            <div className="w-6 h-6 rounded-full overflow-hidden">
              <Image
                src={authorImage || "/placeholder.svg"}
                alt={author}
                width={24}
                height={24}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-[#F5F5F5] flex items-center justify-center">
              <span className="text-[10px] font-medium text-[#A3A3A3]">
                {author
                  .split(" ")
                  .map((name) => name[0])
                  .join("")}
              </span>
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-[12px] font-normal text-[#0A0A0A]">{author}</span>
            <span className="text-[10px] font-normal text-[#A3A3A3]">{authorRole}</span>
          </div>
        </div>
        <span className="text-[12px] font-normal text-[#A3A3A3]">{date}</span>
      </div>
    </div>
  )
}

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-[80px]">
        <div className="max-w-6xl mx-auto px-4 md:px-[100px] py-12">
          {/* Hero Section */}
          <div className="mb-16">
            <h1 className="text-[48px] font-medium text-[#0A0A0A] mb-4">Research</h1>
            <p className="text-[18px] font-normal text-[#A3A3A3] max-w-3xl">
              Explore our latest research on AI-driven security systems, real-time threat detection, and urban safety
              innovations. Our team is dedicated to advancing the field through rigorous study and practical
              applications.
            </p>
          </div>

          {/* Featured Research */}
          <div className="mb-16">
            <h2 className="text-[24px] font-medium text-[#0A0A0A] mb-8">Featured Research</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-[16px] border border-[#F5F5F5] rounded-lg">
                <div className="mb-4 w-full h-[200px] flex items-center justify-center border border-[#F5F5F5] rounded-[12px] overflow-hidden bg-[#F5F5F5]">
                  <Image
                    src="/placeholder.svg?height=200&width=400"
                    alt="AI-Driven Threat Detection"
                    width={400}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Link href="/research/ai-driven-threat-detection" className="block">
                  <h3 className="text-[16px] font-medium text-[#0A0A0A] mb-2">
                    AI-Driven Threat Detection in Urban Environments
                  </h3>
                </Link>
                <p className="text-[12px] font-normal text-[#A3A3A3] mb-4">
                  This comprehensive study explores how artificial intelligence can transform urban security by
                  identifying potential threats in real-time through camera feeds and sensor networks.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden">
                      <Image
                        src="/images/avatar-tobias.jpeg"
                        alt="Tobias Adane"
                        width={24}
                        height={24}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] font-normal text-[#0A0A0A]">Tobias Adane</span>
                      <span className="text-[10px] font-normal text-[#A3A3A3]">Research Lead</span>
                    </div>
                  </div>
                  <span className="text-[12px] font-normal text-[#A3A3A3]">Mar 15, 2025</span>
                </div>
              </div>

              <div className="p-[16px] border border-[#F5F5F5] rounded-lg">
                <div className="mb-4 w-full h-[200px] flex items-center justify-center border border-[#F5F5F5] rounded-[12px] overflow-hidden bg-[#F5F5F5]">
                  <Image
                    src="/placeholder.svg?height=200&width=400"
                    alt="Real-time Emergency Response"
                    width={400}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Link href="/research/real-time-emergency-response" className="block">
                  <h3 className="text-[16px] font-medium text-[#0A0A0A] mb-2">
                    Real-time Emergency Response Systems: A Comparative Analysis
                  </h3>
                </Link>
                <p className="text-[12px] font-normal text-[#A3A3A3] mb-4">
                  This research paper compares traditional emergency response systems with AI-enhanced alternatives,
                  measuring response times, accuracy, and overall effectiveness in crisis situations.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#F5F5F5] flex items-center justify-center">
                      <span className="text-[10px] font-medium text-[#A3A3A3]">SS</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] font-normal text-[#0A0A0A]">Sourabh Singh</span>
                      <span className="text-[10px] font-normal text-[#A3A3A3]">Technical Lead</span>
                    </div>
                  </div>
                  <span className="text-[12px] font-normal text-[#A3A3A3]">Feb 28, 2025</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Publications */}
          <div className="mb-16">
            <h2 className="text-[24px] font-medium text-[#0A0A0A] mb-8">Recent Publications</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ResearchCard
                title="Computer Vision Techniques for Crowd Behavior Analysis"
                description="An exploration of advanced computer vision algorithms for analyzing crowd dynamics and identifying anomalous behavior patterns."
                date="Jan 20, 2025"
                author="Sarah Haddad"
                authorRole="Lead AI Engineer"
                link="/research/computer-vision-crowd-behavior"
              />
              <ResearchCard
                title="Privacy-Preserving Surveillance: Ethical Frameworks"
                description="This paper proposes ethical guidelines for implementing surveillance systems that respect privacy while maintaining security effectiveness."
                date="Dec 12, 2024"
                author="Tobias Adane"
                authorRole="Research Lead"
                authorImage="/images/avatar-tobias.jpeg"
                link="/research/privacy-preserving-surveillance"
              />
              <ResearchCard
                title="Natural Language Processing for Emergency Communications"
                description="Research on using NLP to improve emergency response by analyzing and prioritizing communications during crisis situations."
                date="Nov 05, 2024"
                author="Sourabh Singh"
                authorRole="Technical Lead"
                link="/research/nlp-emergency-communications"
              />
            </div>
          </div>

          {/* Academic Partnerships */}
          <div className="mb-16">
            <h2 className="text-[24px] font-medium text-[#0A0A0A] mb-8">Academic Partnerships</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-[16px] border border-[#F5F5F5] rounded-lg">
                <h3 className="text-[16px] font-medium text-[#0A0A0A] mb-2">MIT Media Lab</h3>
                <p className="text-[12px] font-normal text-[#A3A3A3]">
                  Collaborative research on urban sensing technologies and their applications in improving city safety
                  and emergency response systems.
                </p>
              </div>
              <div className="p-[16px] border border-[#F5F5F5] rounded-lg">
                <h3 className="text-[16px] font-medium text-[#0A0A0A] mb-2">Stanford AI Lab</h3>
                <p className="text-[12px] font-normal text-[#A3A3A3]">
                  Joint development of machine learning models for real-time video analysis and threat detection in
                  complex urban environments.
                </p>
              </div>
              <div className="p-[16px] border border-[#F5F5F5] rounded-lg">
                <h3 className="text-[16px] font-medium text-[#0A0A0A] mb-2">NYU Center for Urban Science</h3>
                <p className="text-[12px] font-normal text-[#A3A3A3]">
                  Research partnership focused on implementing and testing AI security systems in New York City,
                  providing real-world validation of our technologies.
                </p>
              </div>
              <div className="p-[16px] border border-[#F5F5F5] rounded-lg">
                <h3 className="text-[16px] font-medium text-[#0A0A0A] mb-2">University of Buenos Aires</h3>
                <p className="text-[12px] font-normal text-[#A3A3A3]">
                  Collaboration on adapting AI security systems for Latin American urban contexts, with a focus on
                  cultural and infrastructural considerations.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-white border border-[#F5F5F5] rounded-[16px] py-16 px-8 text-center">
            <h2 className="text-[24px] font-medium text-[#0A0A0A] mb-4">Interested in our research?</h2>
            <p className="text-[16px] font-normal text-[#A3A3A3] mb-8 max-w-xl mx-auto">
              Download our latest papers or get in touch to discuss potential collaborations and research opportunities.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/whitepaper"
                className="px-4 py-2.5 rounded-full bg-[#2563EB] text-white text-[10px] font-medium hover:bg-[#2563EB]/90 transition-colors"
              >
                Download Whitepaper
              </Link>
              <Link
                href="/contact"
                className="px-4 py-2.5 rounded-full bg-white border border-[#F5F5F5] text-[#0a0a0a] text-[10px] font-medium hover:bg-gray-50 transition-colors"
              >
                Contact Research Team
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
