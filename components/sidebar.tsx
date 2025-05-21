"use client"
import { NavItem } from "./nav-item"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

// Import custom icons
import { SparkleIcon, ZapIcon, SproutIcon } from "@/components/icons/lucide-icons"
import { ArtemisLogo } from "./icons/artemis-logo"
import { AvatarIcon } from "./icons"
import { FeedbackDialog } from "./feedback-dialog"
import { CustomTvIcon } from "./icons/custom-tv-icon"

type SectionType = "artemis" | "monitor" | "activity" | "feedback"

interface SidebarProps {
  activeSection: SectionType
  setActiveSection: (section: SectionType) => void
}

export function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const router = useRouter()

  const handleFeedbackClick = () => {
    setFeedbackOpen(true)
    setActiveSection("feedback")
  }

  return (
    <div className="w-16 border-r border-[#F5F5F5] flex flex-col items-center px-3 py-4">
      <nav className="flex flex-col items-center gap-4 flex-1">
        <Link href="/artemis">
          <ArtemisLogo width={32} height={32} className="mb-2" />
        </Link>

        <Link href="/artemis">
          <NavItem
            icon={<SparkleIcon size={12} />}
            isActive={activeSection === "artemis"}
            onClick={() => setActiveSection("artemis")}
            className="p-2 bg-white border border-[#F5F5F5] rounded-[32px]"
            iconColor="#0A0A0A"
          />
        </Link>

        <Link href="/monitor">
          <NavItem
            icon={<CustomTvIcon size={12} />}
            isActive={activeSection === "monitor"}
            onClick={() => setActiveSection("monitor")}
            className="p-2 bg-white border border-[#F5F5F5] rounded-[32px]"
            iconColor="#0A0A0A"
          />
        </Link>

        <Link href="/activity">
          <NavItem
            icon={<ZapIcon size={12} />}
            isActive={activeSection === "activity"}
            onClick={() => setActiveSection("activity")}
            className="p-2 bg-white border border-[#F5F5F5] rounded-[32px]"
            iconColor="#0A0A0A"
          />
        </Link>
      </nav>

      <div className="mt-auto flex flex-col items-center gap-[16px]">
        {/* Feedback button */}
        <NavItem
          icon={<SproutIcon size={12} />}
          isActive={activeSection === "feedback"}
          onClick={handleFeedbackClick}
          className="p-2 bg-white border border-[#F5F5F5] rounded-[32px]"
          iconColor="#0A0A0A"
          showFeedbackDialog={true}
        />

        {/* Avatar Button (non-interactive) */}
        <div className="h-6 w-6 rounded-full">
          <AvatarIcon className="w-full h-full" />
        </div>
      </div>

      <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </div>
  )
}
