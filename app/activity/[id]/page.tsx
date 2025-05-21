"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { format } from "date-fns"
import { ArrowLeftIcon } from "@/components/icons/lucide-icons"
import { Sidebar } from "@/components/sidebar"
import { FeedbackDialog } from "@/components/feedback-dialog"

// Define activity item type
interface ActivityItem {
  id: string
  title: string
  description: string
  timestamp: Date
  type: "security" | "safety" | "emergency" | "environmental"
  source: string
  read: boolean
  fullDescription?: string
}

// Sample activity data - this would normally come from an API
const activitiesData: ActivityItem[] = [
  {
    id: "1",
    title: "Suspicious Activity",
    description: "Unusual movement detected in the backyard area. Camera 3 has detected motion during quiet hours.",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    type: "security",
    source: "Camera 3",
    read: false,
    fullDescription:
      "At approximately 2:15 AM, Camera 3 detected unusual movement in the backyard area. The motion was detected during designated quiet hours (11 PM - 5 AM). The system identified a human-sized figure moving near the perimeter fence. Security personnel were automatically notified and dispatched to investigate. Upon arrival, they found no immediate signs of intrusion, but noted that a section of the fence appeared to have been tampered with. Additional patrols have been scheduled for the next 48 hours, and maintenance has been requested to repair and reinforce the affected section of fencing. Homeowners are advised to ensure all doors and windows are securely locked overnight.",
  },
  {
    id: "2",
    title: "Person Identified",
    description: "John Smith identified at front door. Authorized personnel.",
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    type: "security",
    source: "Camera 1",
    read: true,
    fullDescription:
      "At 1:45 PM, the front door camera identified John Smith, an authorized personnel with security clearance level 2. Facial recognition confirmed identity with 98.7% confidence. Mr. Smith used his authorized access code to enter the premises and remained on site for approximately 35 minutes. His visit was scheduled in the system calendar for routine maintenance of the HVAC system. All protocols were followed correctly during his visit.",
  },
  {
    id: "3",
    title: "System Update Completed",
    description: "Security system firmware updated to version 2.4.1. All systems operational.",
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    type: "security",
    source: "System",
    read: true,
    fullDescription:
      "The security system firmware has been successfully updated to version 2.4.1. This update includes critical security patches, performance improvements, and new features. All connected devices have been verified and are operating normally. The update process completed without any errors or interruptions. New features include enhanced motion detection algorithms, improved night vision capabilities, and better integration with third-party smart home devices. Users may notice slightly improved battery life on wireless components and faster notification delivery. No action is required from users at this time.",
  },
  {
    id: "4",
    title: "Large Crowd Detected",
    description: "Large crowd formation detected near main entrance. Please review camera footage.",
    timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
    type: "safety",
    source: "Camera 2",
    read: false,
    fullDescription:
      "At 11:30 AM, Camera 2 detected an unusually large gathering of approximately 25-30 people near the main entrance. The crowd appeared to be organized and peaceful, possibly related to the community event scheduled for today. Security personnel monitored the situation and reported no concerning behaviors. The crowd dispersed naturally after about 45 minutes. No security intervention was required, but the footage has been flagged for routine review. The system's crowd detection algorithm correctly identified the gathering and appropriately categorized it as a non-threatening situation.",
  },
  {
    id: "5",
    title: "Traffic Accident",
    description: "Traffic accident detected on main street. Emergency services have been notified.",
    timestamp: new Date(Date.now() - 1000 * 60 * 240), // 4 hours ago
    type: "emergency",
    source: "Camera 4",
    read: true,
    fullDescription:
      "At 10:15 AM, Camera 4 detected a traffic accident at the intersection of Main Street and Oak Avenue. The incident involved two vehicles - a silver sedan and a white SUV. The collision appeared to be minor with no visible injuries to occupants. Emergency services were automatically notified through the integrated alert system. Police arrived on scene at 10:23 AM, followed by a tow truck at 10:40 AM. The roadway was cleared by 11:05 AM. Traffic was diverted through alternate routes during this period. The system's accident detection algorithm correctly identified the incident with high confidence (94.2%) and properly categorized it as a non-life-threatening situation.",
  },
  {
    id: "6",
    title: "High Winds Alert",
    description: "High winds detected in the area. Please secure outdoor equipment.",
    timestamp: new Date(Date.now() - 1000 * 60 * 300), // 5 hours ago
    type: "environmental",
    source: "Weather Station",
    read: true,
    fullDescription:
      "The integrated weather monitoring system has detected sustained winds of 35-40 mph with gusts reaching up to 55 mph in your area. These conditions exceed the threshold for potential property damage. It is recommended to secure or store outdoor furniture, equipment, and decorations. The system has automatically adjusted external camera sensitivity to account for increased movement from vegetation and debris. The high wind conditions are expected to continue for approximately 4-6 hours according to connected weather services. The property's automated systems have engaged wind protection protocols, including retracting motorized awnings and closing smart vents.",
  },
  {
    id: "7",
    title: "Unauthorized Access Attempt",
    description: "Unauthorized access attempt at Main Gate. Security personnel have been alerted.",
    timestamp: new Date(Date.now() - 1000 * 60 * 360), // 6 hours ago
    type: "security",
    source: "Main Gate",
    read: false,
    fullDescription:
      "At 8:45 AM, the system detected an unauthorized access attempt at the Main Gate. An unidentified individual attempted to enter an invalid access code five consecutive times. The system automatically locked down the entry point and captured high-resolution images of the individual. Security personnel were immediately dispatched to investigate. Upon arrival, the individual had already left the premises. Video footage shows a male, approximately 5'10\", wearing a dark jacket and baseball cap. The incident has been logged and added to the security watch list. Facial recognition was unable to make a positive identification due to the cap obscuring key features. As a precautionary measure, all access codes have been verified for integrity.",
  },
  {
    id: "8",
    title: "Abandoned Object",
    description: "Abandoned object detected in lobby area. Security personnel investigating.",
    timestamp: new Date(Date.now() - 1000 * 60 * 420), // 7 hours ago
    type: "safety",
    source: "Camera 5",
    read: true,
    fullDescription:
      "At 7:30 AM, Camera 5 detected an unattended package in the main lobby area. The object, a medium-sized black backpack, remained stationary for more than 15 minutes, triggering the abandoned object alert. Security personnel were dispatched to investigate and arrived on scene at 7:36 AM. After following standard protocols, they determined the backpack belonged to a resident who had accidentally left it while checking their mail. The resident was contacted and retrieved their property at 7:55 AM. The incident was resolved without further action required. The system's abandoned object detection algorithm correctly identified the situation with 97.3% confidence.",
  },
]

type SectionType = "dashboard" | "artemis" | "serafin" | "activity" | "feedback" | "spaces" | "notifications"

// Helper function to get emergency level and color based on activity type
const getEmergencyLevel = (type: string) => {
  switch (type) {
    case "emergency":
      return { level: "Critical", color: "bg-red-500" }
    case "security":
      return { level: "High", color: "bg-orange-500" }
    case "safety":
      return { level: "Medium", color: "bg-yellow-500" }
    case "environmental":
      return { level: "Low", color: "bg-green-500" }
    default:
      return { level: "Info", color: "bg-blue-500" }
  }
}

export default function ActivityThreadPage() {
  const [activeSection, setActiveSection] = useState<SectionType>("activity")
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [activity, setActivity] = useState<ActivityItem | null>(null)
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  useEffect(() => {
    // In a real app, this would be an API call
    const foundActivity = activitiesData.find((a) => a.id === id)
    if (foundActivity) {
      setActivity(foundActivity)
    }
  }, [id])

  if (!activity) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading activity...</p>
        </div>
      </div>
    )
  }

  const emergencyInfo = getEmergencyLevel(activity.type)

  return (
    <div className="flex h-screen bg-white">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center px-6 py-4 border-b border-[#F5F5F5] bg-white z-10">
          <button
            onClick={() => router.back()}
            className="p-2 bg-white border border-[#F5F5F5] rounded-[32px] text-[#0A0A0A] flex items-center justify-center hover:bg-gray-50 transition-colors mr-4"
          >
            <ArrowLeftIcon size={12} />
          </button>
          <div className="flex items-center text-gray-500 text-sm">
            <span>Activity</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{activity.title}</span>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-auto px-[23px] py-8">
          <div className="w-full">
            {/* Cover Image */}
            <div className="relative w-full h-[400px] mb-6 rounded-lg overflow-hidden">
              <Image
                src={`/placeholder.svg?height=800&width=1200&text=${activity.type.toUpperCase()}+ALERT`}
                alt={activity.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Activity Title and Badge */}
            <h1 className="text-2xl font-bold mb-2">{activity.title}</h1>
            <div className="flex items-center gap-4 mb-4">
              <span className={`px-[10px] py-1 ${emergencyInfo.color} text-white rounded-full text-xs font-medium`}>
                {emergencyInfo.level}
              </span>
              <span className="text-sm text-gray-500">{format(activity.timestamp, "MMM d, yyyy 'at' h:mm a")}</span>
            </div>

            {/* Activity Details */}
            <div className="mt-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {activity.fullDescription || activity.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </div>
  )
}
