"use client"

import { useState, useRef, useEffect } from "react"
import {
  ZapIcon,
  ShieldIcon,
  CircleAlertIcon,
  SquareTerminalIcon,
  SearchIcon,
  ListFilterIcon,
  XIcon,
  MessageCircleIcon,
} from "@/components/icons/lucide-icons"
import { Sidebar } from "@/components/sidebar"
import { Input } from "@/components/ui/input"
import { FeedbackDialog } from "@/components/feedback-dialog"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import Link from "next/link"
import { activitiesService, threadsService, supabase } from "@/lib/supabase"

type SectionType = "dashboard" | "artemis" | "serafin" | "activity" | "feedback" | "spaces" | "notifications"

// Define view modes to show different types of data
type ViewMode = "activities" | "thread-activities" | "all-threads"

// Define activity item type
interface ActivityItem {
  id: string
  title: string
  description: string
  timestamp: Date
  type: string
  source: string
  read: boolean
  threadId?: string
  hasThread: boolean
}

// Thread item type for direct thread display
interface ThreadItem {
  id: string
  title: string
  content: string
  severity: "info" | "low" | "medium" | "high"
  timestamp: Date
  cameraId: string
}

// Type for Supabase activity data
interface SupabaseActivity {
  id: string
  title: string
  content: string
  severity: "critical" | "warning" | "info"
  timestamp: string
  camera_id: string
  thread_id: string | null
  created_at: string
}

// Type for Supabase thread data
interface SupabaseThread {
  id: string
  title: string
  content: string
  severity: "info" | "low" | "medium" | "high"
  timestamp: string
  camera_id: string
  created_at: string
}

// Client component
function ActivityPageClient() {
  const [activeSection, setActiveSection] = useState<SectionType>("activity")
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [filter, setFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<ViewMode>("all-threads")
  const [searchQuery, setSearchQuery] = useState("")
  const filterMenuRef = useRef<HTMLDivElement>(null)
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [threads, setThreads] = useState<ThreadItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load activities and/or threads from Supabase based on view mode
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        console.log(`Loading data from Supabase (viewMode: ${viewMode})...`)

        if (viewMode === "all-threads") {
          // Load all threads directly
          console.log("Using threadsService.getAllThreads()")
          const threadData = await threadsService.getAllThreads(100)

          if (threadData && threadData.length > 0) {
            console.log(`Found ${threadData.length} threads in Supabase`)

            // Map thread data to our ThreadItem format
            const loadedThreads: ThreadItem[] = threadData.map((item: SupabaseThread) => ({
              id: item.id,
              title: item.title,
              content: item.content,
              severity: item.severity,
              timestamp: new Date(item.timestamp),
              cameraId: item.camera_id,
            }))

            setThreads(loadedThreads)
            console.log(`Loaded ${loadedThreads.length} threads into state`)
          } else {
            console.log("No threads found in Supabase")
            setThreads([])
          }

          // Clear activities when in threads-only mode
          setActivities([])
        } else {
          // Get activities from Supabase - using different method based on view mode
          let data
          if (viewMode === "thread-activities") {
            // Use the dedicated method for activities with threads
            console.log("Using threadsService.getActivitiesWithThreads()")
            data = await threadsService.getActivitiesWithThreads(100)
          } else {
            // Use regular method for all activities
            console.log("Using activitiesService.getAllActivities()")
            data = await activitiesService.getAllActivities(100)
          }

          if (data && data.length > 0) {
            console.log(`Found ${data.length} activities in Supabase`)

            // Count thread-related activities
            const threadActivities = data.filter(
              (item: SupabaseActivity) => item.thread_id !== null && item.thread_id !== undefined,
            ).length
            console.log(`${threadActivities} activities are from threads`)

            // Map Supabase data to our ActivityItem format
            const loadedActivities: ActivityItem[] = data.map((item: SupabaseActivity) => {
              // Map severity to type for backward compatibility with filter
              let type = "environmental"
              if (item.severity === "critical") type = "security"
              else if (item.severity === "warning") type = "safety"

              // Check if this is a thread-related activity
              const hasThread = item.thread_id !== null && item.thread_id !== undefined

              // Add a special type prefix for thread-related activities
              if (hasThread) {
                type = "thread-" + type
              }

              return {
                id: item.id,
                title: item.title,
                description: item.content,
                timestamp: new Date(item.timestamp),
                type: type,
                source: item.camera_id || "System",
                read: false,
                threadId: item.thread_id || undefined,
                hasThread: hasThread,
              }
            })

            setActivities(loadedActivities)
            console.log(`Loaded ${loadedActivities.length} activities into state`)
          } else {
            console.log("No activities found in Supabase")
            setActivities([])
          }

          // Clear threads when in activities mode
          setThreads([])
        }
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()

    // Set up a timer to refresh data every 60 seconds
    const refreshTimer = setInterval(() => {
      loadData()
    }, 60000)

    return () => clearInterval(refreshTimer)
  }, [viewMode])

  // Close filter menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setShowFilterMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Filter activities based on current filter and search query
  const filteredActivities = activities.filter((activity) => {
    // Base filter logic
    let matchesFilter = false

    if (filter === "all") {
      // Show everything when "all" is selected
      matchesFilter = true
    } else if (filter === "threads") {
      // Only show activities with threads when "threads" is selected
      matchesFilter = activity.hasThread
    } else {
      // Otherwise match the type
      const baseType = activity.type.startsWith("thread-") ? activity.type.substring(7) : activity.type

      matchesFilter = baseType === filter
    }

    // Filter by search query
    const matchesSearch =
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.source.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  // Filter threads based on search query
  const filteredThreads = threads.filter((thread) => {
    return (
      searchQuery === "" ||
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.cameraId.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  // Mark activity as read
  const markAsRead = (id: string) => {
    setActivities(activities.map((activity) => (activity.id === id ? { ...activity, read: true } : activity)))
  }

  // Get icon based on activity type
  const getActivityIcon = (type: string) => {
    // For thread-related activities
    if (type.startsWith("thread-")) {
      return <MessageCircleIcon size={12} className="text-blue-600" />
    }

    switch (type) {
      case "security":
        return <ShieldIcon size={12} className="text-[#0A0A0A]" />
      case "safety":
        return <CircleAlertIcon size={12} className="text-[#0A0A0A]" />
      case "emergency":
        return <ZapIcon size={12} className="text-[#0A0A0A]" />
      case "environmental":
      default:
        return <SquareTerminalIcon size={12} className="text-[#0A0A0A]" />
    }
  }

  // Get badge color based on activity type
  const getActivityBadgeColor = (type: string) => {
    const baseType = type.startsWith("thread-") ? type.substring(7) : type

    switch (baseType) {
      case "security":
        return "bg-red-500"
      case "safety":
        return "bg-yellow-500"
      case "emergency":
        return "bg-orange-500"
      case "environmental":
      default:
        return "bg-blue-500"
    }
  }

  // Get severity label based on activity type
  const getSeverityLabel = (type: string) => {
    const baseType = type.startsWith("thread-") ? type.substring(7) : type

    switch (baseType) {
      case "security":
        return "Critical"
      case "safety":
        return "Warning"
      case "emergency":
        return "High"
      case "environmental":
      default:
        return "Info"
    }
  }

  // Get badge color for thread severity
  const getThreadSeverityColor = (severity: "info" | "low" | "medium" | "high") => {
    switch (severity) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-orange-500"
      case "low":
        return "bg-yellow-500"
      case "info":
      default:
        return "bg-blue-500"
    }
  }

  // Get human-readable severity label for thread
  const getThreadSeverityLabel = (severity: "info" | "low" | "medium" | "high") => {
    switch (severity) {
      case "high":
        return "Critical"
      case "medium":
        return "Medium"
      case "low":
        return "Low"
      case "info":
      default:
        return "Info"
    }
  }

  // Toggle view mode
  const toggleViewMode = () => {
    if (viewMode === "activities") {
      setViewMode("thread-activities")
      setFilter("threads")
    } else if (viewMode === "thread-activities") {
      setViewMode("all-threads")
    } else {
      setViewMode("activities")
      setFilter("all")
    }
  }

  // Get view mode label
  const getViewModeLabel = () => {
    switch (viewMode) {
      case "all-threads":
        return "All Threads"
      case "thread-activities":
        return "Thread Activities"
      case "activities":
      default:
        return "All Activities"
    }
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar
        activeSection="activity"
        setActiveSection={(section) => {
          if (typeof section === "string") {
            setActiveSection(section as any)
          }
        }}
      />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center px-6 py-4 border-b border-[#F5F5F5] bg-white z-10">
          <div className="flex items-center text-gray-500 text-sm">
            <span>Activity</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{getViewModeLabel()}</span>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Search and Filter */}
          <div className="relative flex-1 mb-6">
            <SearchIcon size={12} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={viewMode === "all-threads" ? "Search threads..." : "Search activities..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "pl-10 pr-10 py-2 border border-[#F5F5F5] rounded-md text-sm bg-white w-full",
                "focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-[#F5F5F5]",
                "hover:border-[#F5F5F5]",
                "active:border-[#F5F5F5] active:ring-0",
                "!shadow-none",
              )}
            />
            {viewMode !== "all-threads" && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2" ref={filterMenuRef}>
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ListFilterIcon size={12} />
                </button>

                {showFilterMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#F5F5F5] z-50">
                    <div className="p-3 border-b border-[#F5F5F5] flex justify-between items-center">
                      <h3 className="text-sm font-medium">Filter</h3>
                      <button onClick={() => setShowFilterMenu(false)} className="text-gray-400 hover:text-gray-600">
                        <XIcon size={12} />
                      </button>
                    </div>
                    <div className="p-2">
                      <button
                        className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 ${
                          filter === "all" ? "bg-[#F5F5F5]" : "hover:bg-[#F5F5F5]"
                        } rounded-md transition-colors`}
                        onClick={() => {
                          setFilter("all")
                          setViewMode("activities")
                          setShowFilterMenu(false)
                        }}
                      >
                        <span>All</span>
                      </button>
                      <button
                        className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 ${
                          filter === "threads" ? "bg-[#F5F5F5]" : "hover:bg-[#F5F5F5]"
                        } rounded-md transition-colors`}
                        onClick={() => {
                          setFilter("threads")
                          setViewMode("thread-activities")
                          setShowFilterMenu(false)
                        }}
                      >
                        <MessageCircleIcon size={12} className="text-blue-600" />
                        <span>Threads Only</span>
                      </button>
                      <button
                        className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 ${
                          filter === "security" ? "bg-[#F5F5F5]" : "hover:bg-[#F5F5F5]"
                        } rounded-md transition-colors`}
                        onClick={() => {
                          setFilter("security")
                          setViewMode("activities")
                          setShowFilterMenu(false)
                        }}
                      >
                        <span>Security</span>
                      </button>
                      <button
                        className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 ${
                          filter === "safety" ? "bg-[#F5F5F5]" : "hover:bg-[#F5F5F5]"
                        } rounded-md transition-colors`}
                        onClick={() => {
                          setFilter("safety")
                          setViewMode("activities")
                          setShowFilterMenu(false)
                        }}
                      >
                        <span>Safety</span>
                      </button>
                      <button
                        className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 ${
                          filter === "environmental" ? "bg-[#F5F5F5]" : "hover:bg-[#F5F5F5]"
                        } rounded-md transition-colors`}
                        onClick={() => {
                          setFilter("environmental")
                          setViewMode("activities")
                          setShowFilterMenu(false)
                        }}
                      >
                        <span>Environmental</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* View mode indicator */}
          {viewMode !== "activities" && (
            <div className="mb-4 flex items-center">
              <span className="text-sm text-gray-500 mr-2">Viewing:</span>
              <div className="bg-blue-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                <MessageCircleIcon size={12} className="text-blue-600" />
                <span className="text-blue-700">
                  {viewMode === "all-threads" ? "All Threads" : "Thread Activities"}
                </span>
                <button
                  onClick={() => {
                    setViewMode("activities")
                    setFilter("all")
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XIcon size={12} />
                </button>
              </div>
            </div>
          )}

          {/* Thread List (when viewMode is all-threads) */}
          {viewMode === "all-threads" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {isLoading ? (
                <div className="col-span-full text-center py-12">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-10 h-10 border-4 border-t-transparent border-blue-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500">Loading threads...</p>
                  </div>
                </div>
              ) : filteredThreads.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <MessageCircleIcon size={24} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 mb-1">No threads found</p>
                  <p className="text-xs text-gray-400">
                    Threads will appear here when cameras generate new observations.
                  </p>

                  {/* Debug information */}
                  <div className="mt-6 p-4 border border-red-300 rounded bg-red-50 text-left mx-auto max-w-2xl">
                    <h3 className="font-bold mb-2 text-red-700">Debug Information</h3>
                    <p className="mb-2 text-sm text-red-800">
                      Database connection status: {!supabase ? "Not connected" : "Connected"}
                    </p>
                    <p className="mb-2 text-sm text-red-800">Loading state: {isLoading ? "Loading" : "Not loading"}</p>
                    <p className="mb-2 text-sm text-red-800">Filtered threads length: {filteredThreads.length}</p>
                    <p className="mb-2 text-sm text-red-800">Raw threads length: {threads.length}</p>
                    <p className="mb-2 text-sm text-red-800">View mode: {viewMode}</p>

                    <div className="mt-4">
                      <button
                        onClick={async () => {
                          console.log("Manual thread fetch initiated")
                          try {
                            setIsLoading(true)
                            const threadData = await threadsService.getAllThreads(100)
                            console.log("Manual fetch results:", threadData)

                            if (threadData && threadData.length > 0) {
                              const loadedThreads: ThreadItem[] = threadData.map((item: SupabaseThread) => ({
                                id: item.id,
                                title: item.title,
                                content: item.content,
                                severity: item.severity,
                                timestamp: new Date(item.timestamp),
                                cameraId: item.camera_id,
                              }))

                              setThreads(loadedThreads)
                            }
                          } catch (err) {
                            console.error("Manual fetch error:", err)
                          } finally {
                            setIsLoading(false)
                          }
                        }}
                        className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                      >
                        Fetch Threads Manually
                      </button>

                      <button
                        onClick={async () => {
                          console.log("Creating test thread")
                          try {
                            setIsLoading(true)
                            // Create a test thread
                            const testThread = {
                              title: "Test Thread " + new Date().toLocaleTimeString(),
                              content: "This is a test thread created for debugging purposes.",
                              severity: "medium" as "info" | "low" | "medium" | "high",
                              timestamp: new Date().toISOString(),
                              camera_id: "test-camera-001",
                            }

                            const result = await threadsService.saveThread(testThread)
                            console.log("Test thread created:", result)

                            // Refresh threads
                            const threadData = await threadsService.getAllThreads(100)
                            if (threadData && threadData.length > 0) {
                              const loadedThreads: ThreadItem[] = threadData.map((item: SupabaseThread) => ({
                                id: item.id,
                                title: item.title,
                                content: item.content,
                                severity: item.severity,
                                timestamp: new Date(item.timestamp),
                                cameraId: item.camera_id,
                              }))

                              setThreads(loadedThreads)
                            }
                          } catch (err) {
                            console.error("Error creating test thread:", err)
                          } finally {
                            setIsLoading(false)
                          }
                        }}
                        className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm ml-2"
                      >
                        Create Test Thread
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                filteredThreads.map((thread) => (
                  <div key={thread.id} className="border-blue-200 shadow-sm border rounded-lg p-4">
                    <div className="mb-2">
                      <div className="p-2 bg-blue-50 border-blue-200 rounded-[32px] inline-flex">
                        <MessageCircleIcon size={12} className="text-blue-600" />
                      </div>
                    </div>
                    <h3 className="font-medium mb-1 flex items-center">
                      {thread.title}
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Thread
                      </span>
                    </h3>
                    <p className="text-xs text-gray-400 mb-2">{format(thread.timestamp, "MMM d, yyyy, hh:mm a")}</p>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{thread.content}</p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2.5 py-1 flex items-center gap-1 ${getThreadSeverityColor(thread.severity)} text-white text-xs rounded-full`}
                      >
                        {getThreadSeverityLabel(thread.severity)}
                      </span>
                      <Link
                        href={`/thread/${thread.id}`}
                        className="inline-block px-4 py-2 text-xs rounded-[32px] bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                      >
                        View Thread
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Activity List */}
          {viewMode !== "all-threads" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {isLoading ? (
                <div className="col-span-full text-center py-12">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-10 h-10 border-4 border-t-transparent border-blue-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500">Loading activities...</p>
                  </div>
                </div>
              ) : filteredActivities.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  {viewMode === "thread-activities" ? (
                    <>
                      <MessageCircleIcon size={24} className="text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 mb-1">No thread activities found</p>
                      <p className="text-xs text-gray-400">
                        Thread activities will appear here when threads generate activities.
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-500">No activities found</p>
                  )}
                </div>
              ) : (
                filteredActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className={`border rounded-lg p-4 ${
                      activity.hasThread ? "border-blue-200 shadow-sm" : "border-[#F5F5F5]"
                    }`}
                    onClick={() => markAsRead(activity.id)}
                  >
                    <div className="mb-2">
                      <div
                        className={`p-2 inline-flex rounded-[32px] ${
                          activity.hasThread ? "bg-blue-50 border-blue-200" : "bg-white border border-[#F5F5F5]"
                        }`}
                      >
                        {getActivityIcon(activity.type)}
                      </div>
                    </div>
                    <h3 className="font-medium mb-1">
                      {activity.title}
                      {activity.hasThread && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Thread
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-gray-400 mb-2">{format(activity.timestamp, "MMM d, yyyy, hh:mm a")}</p>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{activity.description}</p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2.5 py-1 flex items-center gap-1 ${getActivityBadgeColor(
                          activity.type,
                        )} text-white text-xs rounded-full`}
                      >
                        {getSeverityLabel(activity.type)}
                      </span>
                      <Link
                        href={activity.threadId ? `/thread/${activity.threadId}` : `/activity/${activity.id}`}
                        className={`inline-block px-4 py-2 text-xs rounded-[32px] ${
                          activity.hasThread
                            ? "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                            : "bg-[#FAFAFA] text-black border border-[#F5F5F5] hover:bg-gray-100"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation() // Prevent the parent div's onClick from firing
                          markAsRead(activity.id)
                        }}
                      >
                        {activity.hasThread ? "View Thread" : "See Details"}
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </div>
  )
}
// Server component
export default function ActivityPage() {
  return <ActivityPageClient />
}

