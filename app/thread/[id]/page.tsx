"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { format } from "date-fns"
import { ArrowLeftIcon, MessageCircleIcon, CameraIcon } from "@/components/icons/lucide-icons"
import { Sidebar } from "@/components/sidebar"
import { FeedbackDialog } from "@/components/feedback-dialog"
import { threadsService } from "@/lib/supabase"
import { cameraData } from "@/app/data/cameraData"

// Static imports for default camera images
import defaultCameraImage from '@/public/static/default-camera.jpg'

// Define thread item type
interface ThreadItem {
  id: string
  title: string
  content: string
  severity: "info" | "low" | "medium" | "high"
  timestamp: Date
  cameraId: string
}

type SectionType = "dashboard" | "artemis" | "serafin" | "activity" | "feedback" | "spaces" | "notifications"

// Helper function to get severity level and color based on thread severity
const getSeverityInfo = (severity: string) => {
  switch (severity) {
    case "high":
      return { level: "Critical", color: "bg-red-500" }
    case "medium":
      return { level: "Medium", color: "bg-orange-500" }
    case "low":
      return { level: "Low", color: "bg-yellow-500" }
    case "info":
    default:
      return { level: "Info", color: "bg-blue-500" }
  }
}

// Helper function to get camera image based on camera ID
const getCameraImage = (cameraId: string): string => {
  console.log("Getting image for camera ID:", cameraId);
  console.log("Available cameras:", cameraData.cameras.map(cam => ({ id: cam.id, name: cam.street_name })));
  
  // Find the camera in cameraData - try both direct match and string conversion for flexibility
  const camera = cameraData.cameras.find(cam => 
    cam.id.toString() === cameraId || 
    cam.id === parseInt(cameraId) ||
    cam.street_name.includes(cameraId)
  );
  
  if (camera) {
    console.log("Found matching camera:", camera);
    return camera.image;
  } else {
    console.log("No matching camera found, using placeholder");
    return `/placeholder.svg?height=800&width=1200&text=CAMERA+${encodeURIComponent(cameraId)}`;
  }
}

export default function ThreadDetailPage() {
  const [activeSection, setActiveSection] = useState<SectionType>("activity")
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [thread, setThread] = useState<ThreadItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  useEffect(() => {
    const loadThread = async () => {
      setIsLoading(true)
      try {
        console.log(`Loading thread details for ID: ${id}`)
        
        // Query Supabase for this specific thread
        const { data, error } = await threadsService.getThreadById(id)
        
        if (error) {
          console.error("Error fetching thread:", error)
          setThread(null)
        } else if (data && data.length > 0) {
          // Convert to ThreadItem
          const threadData = data[0]
          console.log("Raw thread data from Supabase:", threadData);
          setThread({
            id: threadData.id,
            title: threadData.title,
            content: threadData.content,
            severity: threadData.severity as "info" | "low" | "medium" | "high",
            timestamp: new Date(threadData.timestamp),
            cameraId: threadData.camera_id
          })
          console.log("Thread loaded with camera ID:", threadData.camera_id)
        } else {
          console.log("Thread not found")
          setThread(null)
        }
      } catch (error) {
        console.error("Exception loading thread:", error)
        setThread(null)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      loadThread()
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar activeSection={activeSection as any} setActiveSection={(section) => setActiveSection(section as any)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-t-transparent border-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Loading thread information...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!thread) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar activeSection={activeSection as any} setActiveSection={(section) => setActiveSection(section as any)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageCircleIcon size={40} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-700 font-medium mb-2">Thread Not Found</p>
            <p className="text-gray-500 mb-4">The thread you are looking for could not be found.</p>
            <button 
              onClick={() => router.push('/activity')}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Return to Activity
            </button>
          </div>
        </div>
      </div>
    )
  }

  const severityInfo = getSeverityInfo(thread.severity)

  return (
    <div className="flex h-screen bg-white">
      <Sidebar activeSection={activeSection as any} setActiveSection={(section) => setActiveSection(section as any)} />

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
            <span>Thread</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{thread.title}</span>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-auto px-[23px] py-8">
          <div className="w-full max-w-4xl mx-auto">
            {/* Cover Image */}
            <div className="relative w-full h-[400px] mb-6 rounded-lg overflow-hidden">
              <Image
                src={getCameraImage(thread.cameraId)}
                alt={`Camera view for ${thread.title}`}
                fill
                className="object-cover"
                onError={(e) => {
                  console.error("Image load error:", e);
                  // Set fallback image on error
                  const target = e.target as HTMLImageElement;
                  target.src = `/placeholder.svg?height=800&width=1200&text=CAMERA+${encodeURIComponent(thread.cameraId)}`;
                }}
              />
              {/* Camera ID overlay */}
              <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm">
                Camera ID: {thread.cameraId}
              </div>
            </div>

            {/* Thread Title and Badge */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-blue-50 border-blue-200 rounded-[32px] inline-flex">
                  <MessageCircleIcon size={16} className="text-blue-600" />
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Thread</span>
              </div>
              
              <h1 className="text-2xl font-bold mb-2">{thread.title}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <span className={`px-[10px] py-1 ${severityInfo.color} text-white rounded-full text-xs font-medium`}>
                  {severityInfo.level}
                </span>
                <span className="text-sm text-gray-500">{format(thread.timestamp, "MMM d, yyyy 'at' h:mm a")}</span>
                <span className="text-sm text-gray-500 border-l border-gray-300 pl-4">Camera ID: {thread.cameraId}</span>
              </div>
            </div>

            {/* Thread Content */}
            <div className="mt-6 bg-gray-50 p-6 rounded-lg border border-gray-100">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {thread.content}
              </p>
            </div>
            
            {/* Actions */}
            <div className="mt-8 flex justify-end">
              <button 
                onClick={() => router.push(`/monitor/${encodeURIComponent(thread.cameraId)}?thread=${thread.id}`)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-2"
              >
                <span>View Live Camera</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </div>
  )
} 