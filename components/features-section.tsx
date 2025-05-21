import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Eye, Scan, Zap, Option, ListFilter, Blend, Home, Map, Users } from "lucide-react"

interface FeatureProps {
  icon: React.ReactNode
  title: string
  description: string
  isNew?: boolean
  imageSrc: string
}

interface SubFeatureProps {
  icon: React.ReactNode
  title: string
  description: string
}

function Feature({ icon, title, description, isNew = false, imageSrc }: FeatureProps) {
  return (
    <div className="p-[16px] border border-[#F5F5F5] rounded-[18px]">
      {/* Feature Image */}
      <div className="mb-4 w-full h-[222px] flex items-center justify-center border border-[#F5F5F5] rounded-[18px] overflow-hidden">
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={title}
          width={300}
          height={222}
          className="w-full h-full object-contain"
          style={{ objectFit: "contain" }}
        />
      </div>

      {/* Text Container - fill width, hug height, 12px gap */}
      <div className="w-full flex flex-col gap-[12px]">
        <div className="flex items-center gap-[10px]">
          <div className="p-[6px] border border-[#F5F5F5] rounded-[100px] inline-flex items-center justify-center">
            {React.cloneElement(icon as React.ReactElement, { size: 12, className: "w-3 h-3", width: 12, height: 12 })}
          </div>
          <h3 className="text-[12px] font-semibold text-[#0A0A0A]">{title}</h3>
          {isNew && (
            <span className="ml-2 text-xs font-medium text-white bg-[#114FFF] rounded-full px-1.5 py-0.5">New</span>
          )}
        </div>
        <p className="text-[12px] font-normal text-[#A3A3A3]">{description}</p>
      </div>
    </div>
  )
}

function SubFeature({ icon, title, description }: SubFeatureProps) {
  return (
    <div className="p-[16px] border border-[#F5F5F5] rounded-[18px]">
      <div className="flex items-center gap-[10px]">
        <div className="p-[6px] border border-[#F5F5F5] rounded-[100px] inline-flex items-center justify-center">
          {React.cloneElement(icon as React.ReactElement, { size: 12, className: "w-3 h-3", width: 12, height: 12 })}
        </div>
        <h4 className="text-[12px] font-semibold text-[#0A0A0A]">{title}</h4>
      </div>
      <p className="text-[12px] font-normal text-[#A3A3A3] mt-[12px] leading-relaxed min-h-[40px] line-clamp-2">
        {description}
      </p>
    </div>
  )
}

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="w-fit mx-auto px-4 md:px-[100px] flex flex-col gap-[10px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[10px]">
          <Feature
            icon={<Eye className="text-[#0A0A0A]" width={12} height={12} />}
            title="AI Powered Real-Time Monitoring"
            description="Monitors cameras in real-time, analyzing activity to detect incidents and identify unusual situations automatically."
            imageSrc="/images/real-time-monitoring.svg"
          />
          <Feature
            icon={<Option className="text-[#0A0A0A]" width={12} height={12} />}
            title="Threads and activity"
            description="Generates descriptions of image frames, organizing them into threads to classify situations and detect issues."
            imageSrc="/images/threads-activity.svg"
          />
          <Feature
            icon={<ListFilter className="text-[#0A0A0A]" width={12} height={12} />}
            title="Smart Classification"
            description="Classifies situations based on urgency and type, prioritizing alerts and allocating resources to improve response times."
            imageSrc="/images/smart-classification.svg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px]">
          <Feature
            icon={<Blend className="text-[#0A0A0A]" width={12} height={12} />}
            title="Interactive Artificial Intelligence"
            description="Lets users interact with a chat interface, providing real-time updates and detailed information about ongoing events."
            imageSrc="/images/interactive-ai.svg"
          />
          <Feature
            icon={<Scan className="text-[#0A0A0A]" width={12} height={12} />}
            title="Threat Identification"
            description="Processes images and videos to generate detailed descriptions of individuals, helping identify suspects or victims in crises."
            isNew={true}
            imageSrc="/images/threat-identification.svg"
          />
        </div>

        {/* Sub-features grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-[10px]">
          <SubFeature
            icon={<Home className="text-[#0A0A0A]" width={12} height={12} />}
            title="Safer Homes"
            description="Protect your family with 24/7 smart monitoring."
          />
          <SubFeature
            icon={<Zap className="text-[#0A0A0A]" width={12} height={12} />}
            title="Rapid Response"
            description="Real-time threat detection for faster action."
          />
          <SubFeature
            icon={<Users className="text-[#0A0A0A]" width={12} height={12} />}
            title="Urban Awareness"
            description="Keeps citizens informed about their surroundings."
          />
          <SubFeature
            icon={<Map className="text-[#0A0A0A]" width={12} height={12} />}
            title="Safer Streets"
            description="AI-driven early detection to reduce incidents."
          />
        </div>

        {/* CTA Section */}
        <div className="px-[200px] py-[100px] border border-[#F5F5F5] rounded-[18px] flex flex-col items-center gap-[16px]">
          <h2 className="text-[24px] font-medium text-[#0A0A0A] text-center">Step into the future of safety</h2>
          <p className="text-[16px] font-normal text-[#A3A3A3] text-center max-w-3xl">
            We believe that security is a fundamental right and we are committed to working hard to build a future in
            which everyone can feel safe and secure.
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
              href="./models/artemis"
              className="px-4 py-2.5 rounded-full bg-white border border-[#F5F5F5] text-[#0a0a0a] text-[10px] font-medium hover:bg-gray-50 transition-colors"
            >
              See it in Action
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
