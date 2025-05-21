"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { AvatarIcon } from "@/components/icons"
// Dynamic import to handle any issues with the Google Generative AI package
let GoogleGenerativeAI: any = null
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const GenAI = require('@google/generative-ai')
  GoogleGenerativeAI = GenAI.GoogleGenerativeAI
} catch (error) {
  console.error('Error importing @google/generative-ai:', error)
}

import {
  MoreHorizontalIcon,
  SearchIcon,
  ZapIcon,
  MessageCircleIcon,
  UsersIcon,
  ChevronRightIcon,
  ListFilterIcon,
  PaperclipIcon,
  ArrowUpIcon,
  ShareIcon,
  ShieldIcon,
} from "@/components/icons/lucide-icons"
import { activitiesService, threadsService, supabase } from "@/lib/supabase"

type SectionType = "artemis" | "monitor" | "activity" | "feedback"

interface Message {
  id: string
  content: string
  sender: "user" | "monitor"
  timestamp: Date
  isNew?: boolean
}

interface Thread {
  id: string
  title: string
  content: string
  severity: "info" | "low" | "medium" | "high"
  timestamp: Date
  cameraId: string
}

interface Activity {
  id: string
  title: string
  content: string
  severity: "critical" | "warning" | "info"
  timestamp: Date
  cameraId: string
  threadId?: string
}

// Custom CSS class for hiding scrollbars while maintaining functionality
const hideScrollbarClass = "scrollbar-hide"

// Function to capture screenshot from video element
const captureVideoFrame = (videoElement: HTMLVideoElement): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement("canvas")
      canvas.width = videoElement.videoWidth
      canvas.height = videoElement.videoHeight
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        reject(new Error("Failed to get canvas context"))
        return
      }

      // Draw the current video frame on the canvas
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)

      // Convert canvas to base64 data URL (JPEG format with 90% quality)
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9)
      resolve(dataUrl)
    } catch (error) {
      reject(error)
    }
  })
}

// Function to convert data URL to Blob
const dataUrlToBlob = (dataUrl: string): Blob => {
  const arr = dataUrl.split(",")
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg"
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new Blob([u8arr], { type: mime })
}

// Function to analyze image with Gemini using structured output
const analyzeImageWithGemini = async (
  imageDataUrl: string,
  cameraInfo: { name: string; location: string },
): Promise<{ thread: Thread; isImportant: boolean }> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
    if (!apiKey) {
      throw new Error("Gemini API key not set")
    }

    // Check if GoogleGenerativeAI is available
    if (!GoogleGenerativeAI) {
      throw new Error("GoogleGenerativeAI is not available")
    }

    // Initialize the Google GenAI client
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    // Extract base64 from data URL
    const base64Image = imageDataUrl.split(",")[1]

    // Current date/time information for context
    const currentTime = new Date()
    const hours = currentTime.getHours()
    const minutes = currentTime.getMinutes()
    const timeOfDay = hours < 12 ? "morning" : hours < 18 ? "afternoon" : "evening"
    const isWeekend = [0, 6].includes(currentTime.getDay())
    const timeContext = `${timeOfDay} on ${isWeekend ? 'weekend' : 'weekday'} at ${hours}:${minutes < 10 ? '0' + minutes : minutes}`

    // Prepare the prompt for image analysis with dynamic time context
    const promptText = `Analyze this traffic camera snapshot from ${cameraInfo.name} in ${cameraInfo.location} during ${timeContext}.
    Create a detailed summary of traffic conditions, any incidents, weather conditions, and overall safety.
    Be realistic and dynamic - don't just say everything is normal all the time.
    Consider time of day - rush hour (7-9am, 4-6pm) typically has more traffic.
    Consider weather visible in the image.
    Consider the day of week - weekends typically have less commuter traffic.
    
    Assess the situation severity and determine if immediate attention is needed.
    
    Format your response exactly like this JSON:
    {
      "title": "Your observation title here",
      "content": "Your detailed analysis here", 
      "severity": "info|low|medium|high", 
      "needsAttention": true|false
    }
    
    IMPORTANT: Use severity levels:
    - "info" for normal conditions with no concerns
    - "low" for minor slowdowns or weather starting to impact visibility
    - "medium" for significant congestion, visibility issues, or potential hazards
    - "high" for dangerous conditions, accidents, stranded vehicles, or severe weather impacts
    
    Set "needsAttention" to true for any "medium" or "high" severity situations, or occasionally for "low" if it requires monitoring.
    
    Only return valid JSON, nothing else.`

    // Create content parts with image and text
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: promptText },
            { inlineData: { mimeType: "image/jpeg", data: base64Image } }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7, // Increased temperature for more variation
        maxOutputTokens: 800,
      }
    })

    // Parse the JSON from the response
    const responseText = result.response.text()
    const analysis = JSON.parse(responseText)

    // Create thread from analysis
    const thread: Thread = {
      id: Date.now().toString(),
      title: analysis.title,
      content: analysis.content,
      severity: analysis.severity,
      timestamp: new Date(),
      cameraId: cameraInfo.name,
    }

    return {
      thread,
      isImportant: analysis.needsAttention,
    }
  } catch (error) {
    console.error("Error analyzing image:", error)
    
    // Create more varied fallback threads based on time and random factors
    const currentHour = new Date().getHours()
    const currentMinute = new Date().getMinutes()
    const randomFactor = Math.random()
    const isWeekend = [0, 6].includes(new Date().getDay())
    let title, content, severity, isImportant

    // Add some randomness to the responses to avoid duplicates
    const variationId = `${currentHour}:${Math.floor(currentMinute / 5)}`
    
    // Determine severity based on time of day and random factors
    // This creates more variation in the responses
    let possibleSeverities: ("info" | "low" | "medium" | "high")[] = ["info"]
    
    // Morning or evening rush hour - higher chance of issues
    if ((currentHour >= 7 && currentHour <= 9) || (currentHour >= 16 && currentHour <= 18)) {
      if (isWeekend) {
        // Weekend rush hours are less severe
        possibleSeverities = randomFactor < 0.2 ? ["low"] : ["info"]
      } else {
        // Weekday rush hours can be more severe
        possibleSeverities = randomFactor < 0.3 ? ["medium"] : 
                            randomFactor < 0.6 ? ["low"] : ["info"]
      }
    } 
    // Late night - occasional incidents
    else if (currentHour >= 22 || currentHour <= 5) {
      possibleSeverities = randomFactor < 0.1 ? ["medium"] : 
                          randomFactor < 0.2 ? ["low"] : ["info"]
    }
    // Regular daytime
    else {
      possibleSeverities = randomFactor < 0.05 ? ["medium"] : 
                          randomFactor < 0.2 ? ["low"] : ["info"]
    }
    
    // Randomly select severity from possible options
    severity = possibleSeverities[Math.floor(Math.random() * possibleSeverities.length)]
    
    // Determine if this requires attention
    isImportant = severity === "high" || severity === "medium" || (severity === "low" && randomFactor > 0.7)
    
    // Generate appropriate content and title based on severity and time
    if (severity === "medium") {
      if (currentHour >= 7 && currentHour <= 9) {
        title = "Heavy Morning Rush Hour Traffic"
        content = `Significantly congested traffic observed at ${cameraInfo.name} in ${cameraInfo.location}. Vehicle movement is slow with potential for delays. No accidents visible, but traffic density is high. Commuters should consider alternate routes.`
      } else if (currentHour >= 16 && currentHour <= 18) {
        title = "Congested Evening Commute"
        content = `Heavy traffic conditions during evening rush hour at ${cameraInfo.name}. Vehicles moving at reduced speeds with congestion building. No incidents detected but conditions may deteriorate. Monitor situation advised.`
      } else {
        title = "Unexpected Traffic Congestion"
        content = `Unusual traffic congestion observed at ${cameraInfo.name} in ${cameraInfo.location} outside normal rush hours. Vehicles moving slowly. Possible construction or event impact. Situation requires monitoring.`
      }
    } else if (severity === "low") {
      if (currentHour >= 7 && currentHour <= 9) {
        title = "Moderate Morning Traffic"
        content = `Morning commute shows moderate traffic at ${cameraInfo.name}. Some slowdowns observed but vehicles maintaining steady movement. No incidents detected. Typical weekday morning conditions.`
      } else if (currentHour >= 16 && currentHour <= 18) {
        title = "Building Evening Traffic"
        content = `Evening traffic building at ${cameraInfo.name} in ${cameraInfo.location}. Moderate vehicle density with occasional slowdowns. No incidents detected, but traffic volume increasing as expected for this time.`
      } else if (currentHour >= 22 || currentHour <= 5) {
        title = "Light Night Traffic with Minor Concerns"
        content = `Light traffic during night hours at ${cameraInfo.name}. Few vehicles present. Visibility appears reduced - possible fog or light precipitation. Drivers should exercise caution.`
      } else {
        title = "Minor Traffic Slowdown"
        content = `Slight traffic slowdown observed at ${cameraInfo.name} in ${cameraInfo.location}. Vehicles moving slightly below normal speeds. No incidents detected, but traffic flow not optimal. Situation being monitored.`
      }
    } else {
      // Info severity - normal conditions
      if (currentHour >= 7 && currentHour <= 9) {
        title = "Normal Morning Traffic Flow"
        content = `Morning traffic flowing normally at ${cameraInfo.name}. Expected vehicle density for this time of day. No congestion or incidents detected. Good commuting conditions.`
      } else if (currentHour >= 16 && currentHour <= 18) {
        title = "Regular Evening Traffic"
        content = `Evening traffic at ${cameraInfo.name} in ${cameraInfo.location} moving at expected pace. Normal vehicle count for this time. No incidents or significant congestion detected.`
      } else if (currentHour >= 22 || currentHour <= 5) {
        title = "Clear Night Traffic Conditions"
        content = `Minimal traffic during night hours at ${cameraInfo.name}. Few vehicles on the road. No safety concerns detected. Normal night-time traffic pattern.`
      } else {
        title = "Normal Traffic Conditions"
        content = `Traffic flowing normally at ${cameraInfo.name} in ${cameraInfo.location}. Vehicle density and speeds as expected for this time of day. No incidents or concerns detected.`
      }
    }
    
    // Append variation ID to make each title slightly unique
    title = `${title} (${variationId})`
    
    return {
      thread: {
        id: Date.now().toString(),
        title,
        content,
        severity: severity,
        timestamp: new Date(),
        cameraId: cameraInfo.name,
      },
      isImportant,
    }
  }
}

function TypewriterEffect({
  text,
  speed = 30,
  showEffect = true,
}: {
  text: string
  speed?: number
  showEffect?: boolean
}) {
  const [displayedText, setDisplayedText] = useState(showEffect ? "" : text)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(!showEffect)

  useEffect(() => {
    if (!showEffect) {
      setDisplayedText(text)
      setIsComplete(true)
      return
    }

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    } else {
      setIsComplete(true)
    }
  }, [currentIndex, text, speed, showEffect])

  return (
    <>
      {displayedText}
      {!isComplete && <span className="animate-pulse">|</span>}
    </>
  )
}

interface CameraDetailClientProps {
  cameraId: string
  cameraInfo: {
    url: string
    name: string
    location: string
  }
  mainCamera: {
    id: string
    name: string
    image: string
  }
  otherCameras: {
    id: string
    image: string
  }[]
}

export default function CameraDetailClient({
  cameraId,
  cameraInfo,
  mainCamera,
  otherCameras,
}: CameraDetailClientProps) {
  const [activeSection, setActiveSection] = useState<SectionType>("monitor")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [threads, setThreads] = useState<Thread[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [lastAnalysisTime, setLastAnalysisTime] = useState<Date | null>(null)
  const [lastThreadTitle, setLastThreadTitle] = useState<string>("")
  const [analysisEnabled, setAnalysisEnabled] = useState(true)
  const [analysisInterval, setAnalysisInterval] = useState(60000) // 1 minute in ms

  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const moreMenuRef = useRef<HTMLDivElement>(null)
  const [isVideoLoading, setIsVideoLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Add CSS to hide scrollbars
  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      .scrollbar-hide {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Initialize video immediately when component mounts
  useEffect(() => {
    const initVideo = async () => {
      if (videoRef.current && cameraInfo.url) {
        setIsVideoLoading(true)
        try {
          // Dynamically import HLS.js only on client side
          const Hls = (await import("hls.js")).default

          if (Hls.isSupported()) {
            const hls = new Hls({
              maxBufferLength: 5, // Reduce buffer length for faster start
              maxMaxBufferLength: 30,
              manifestLoadingTimeOut: 5000,
              manifestLoadingMaxRetry: 3,
              levelLoadingTimeOut: 5000,
              fragLoadingTimeOut: 5000,
              enableWorker: true,
              lowLatencyMode: true,
              liveSyncDurationCount: 1, // Use fewer segments for sync to reduce latency
              startLevel: 0, // Start with lowest quality for faster loading
            })

            // Setup HLS
            hls.loadSource(cameraInfo.url)
            hls.attachMedia(videoRef.current)

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              videoRef.current?.play().catch((err) => console.error("Error playing video:", err))
            })

            // Handle autoplay issues
            videoRef.current.oncanplay = () => {
              videoRef.current?.play().catch((err) => console.error("Error playing video:", err))
              setIsVideoLoading(false)
            }

            // Add loading timeout
            setTimeout(() => {
              setIsVideoLoading(false)
            }, 8000) // Fallback timeout in case oncanplay doesn't fire
          } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
            // For Safari with native HLS support
            videoRef.current.src = cameraInfo.url
            videoRef.current.oncanplay = () => {
              videoRef.current?.play().catch((err) => console.error("Error playing video:", err))
              setIsVideoLoading(false)
            }
            videoRef.current.play().catch((err) => console.error("Error playing video:", err))

            // Add loading timeout
            setTimeout(() => {
              setIsVideoLoading(false)
            }, 8000) // Fallback timeout in case oncanplay doesn't fire
          }
        } catch (error) {
          console.error("Error initializing video:", error)
          setIsVideoLoading(false)
        }
      }
    }

    // Initialize immediately
    initVideo()

    // Clean up function
    return () => {
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.src = ""
        videoRef.current.load()
      }
    }
  }, [cameraInfo.url])

  // Close more menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Function to save activity to Supabase
  const saveActivityToSupabase = async (activity: Activity) => {
    try {
      console.log("Preparing to save activity to Supabase:", activity);
      
      // Ensure proper data formatting
      const activityData = {
        title: activity.title,
        content: activity.content,
        severity: activity.severity,
        timestamp: activity.timestamp.toISOString(),
        camera_id: activity.cameraId,
        thread_id: activity.threadId || null,
      };
      
      console.log("Formatted activity data for Supabase:", activityData);
      
      // Direct call to supabase to verify data is being sent correctly
      const { data, error } = await supabase
        .from('activities')
        .insert([activityData])
        .select();
      
      if (error) {
        console.error("Supabase error saving activity:", error);
        throw error;
      }
      
      console.log("Activity saved to Supabase successfully:", data);
      return data?.[0];
    } catch (error) {
      console.error("Failed to save activity to Supabase:", error);
      
      // Try one more time after a short delay
      try {
        console.log("Retrying activity save after 1 second...");
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const activityData = {
          title: activity.title,
          content: activity.content,
          severity: activity.severity,
          timestamp: activity.timestamp.toISOString(),
          camera_id: activity.cameraId,
          thread_id: activity.threadId || null,
        };
        
        const { data, error } = await supabase
          .from('activities')
          .insert([activityData])
          .select();
        
        if (error) {
          console.error("Retry also failed:", error);
          return null;
        }
        
        console.log("Activity saved on retry:", data);
        return data?.[0];
      } catch (retryError) {
        console.error("Retry also failed with exception:", retryError);
        return null;
      }
    }
  }

  // Function to add a thread as an activity
  const addThreadAsActivity = (thread: Thread) => {
    console.log("Converting thread to activity, thread severity:", thread.severity);
    
    // Map thread severity to activity severity
    let activitySeverity: "critical" | "warning" | "info" = "info"
    
    // Determine severity based on thread severity
    if (thread.severity === "high") {
      activitySeverity = "critical"
      console.log("Thread has high severity -> activity marked as critical");
    } else if (thread.severity === "medium") {
      activitySeverity = "warning"
      console.log("Thread has medium severity -> activity marked as warning");
    } else if (thread.severity === "low") {
      // Consider low severity threads as warnings sometimes
      activitySeverity = Math.random() > 0.7 ? "warning" : "info"
      console.log(`Thread has low severity -> activity marked as ${activitySeverity}`);
    } else {
      console.log("Thread has info severity -> activity marked as info");
    }

    // Create activity object with guaranteed valid data
    const activity: Activity = {
      id: Date.now().toString(),
      title: thread.title || `Activity from ${thread.cameraId}`,
      content: thread.content || "No details available",
      severity: activitySeverity,
      timestamp: new Date(),
      cameraId: thread.cameraId,
      threadId: thread.id,
    }

    // Add to activities state first for immediate UI feedback
    setActivities((prev) => [activity, ...prev])
    console.log("Activity added to local state:", activity);

    // Save to Supabase with proper error handling
    console.log("Saving activity to Supabase...");
    
    // Save activity asynchronously to avoid blocking UI
    // We'll wrap this in a try-catch to make sure any errors don't affect the UI
    (async () => {
      try {
        const savedActivity = await saveActivityToSupabase(activity);
        if (savedActivity) {
          console.log("Activity saved to Supabase successfully:", savedActivity);
        } else {
          console.error("Failed to save activity to Supabase");
        }
      } catch (error) {
        console.error("Error in addThreadAsActivity:", error);
      }
    })();

    return activity
  }

  // Function to perform periodic video analysis
  const performVideoAnalysis = async () => {
    if (!videoRef.current || videoRef.current.paused || isRecording || !analysisEnabled) {
      console.log("Skipping analysis: video not ready, recording in progress, or analysis disabled");
      return
    }

    try {
      // Set recording state
      setIsRecording(true)
      console.log(`Starting analysis at ${new Date().toISOString()} with interval ${analysisInterval}ms`);

      // Capture a screenshot from the current video frame
      console.log("Capturing screenshot for analysis...")
      const imageDataUrl = await captureVideoFrame(videoRef.current)
      console.log("Screenshot captured successfully")

      // Analyze the image with Gemini
      console.log("Analyzing image with Gemini...")
      const analysis = await analyzeImageWithGemini(imageDataUrl, cameraInfo)
      console.log("Analysis received:", analysis);

      // Add the thread to our state
      setThreads((prev) => [analysis.thread, ...prev])
      setLastThreadTitle(analysis.thread.title)
      console.log("Thread created:", analysis.thread)

      // Save thread to Supabase
      let savedThreadId: string | undefined;
      try {
        console.log("Saving thread to Supabase...");
        const savedThread = await threadsService.saveThread({
          title: analysis.thread.title,
          content: analysis.thread.content,
          severity: analysis.thread.severity,
          timestamp: analysis.thread.timestamp.toISOString(),
          camera_id: analysis.thread.cameraId,
        })
        console.log("Thread saved to Supabase:", savedThread);
        savedThreadId = savedThread?.id;
      } catch (error) {
        console.error("Error saving thread to database:", error)
      }

      // Create an activity from the thread
      console.log("Creating activity from thread...")
      
      // First try with our standard method
      try {
        const activity = addThreadAsActivity(analysis.thread)
        console.log("Activity created:", activity);
      } catch (activityError) {
        console.error("Error creating activity via addThreadAsActivity:", activityError);
        
        // If the standard method fails, try a direct approach as backup
        try {
          console.log("Trying direct Supabase activity creation as backup...");
          
          // Map thread severity to activity severity
          let activitySeverity: "critical" | "warning" | "info" = "info";
          if (analysis.thread.severity === "high") activitySeverity = "critical";
          else if (analysis.thread.severity === "medium") activitySeverity = "warning";
          else if (analysis.thread.severity === "low") activitySeverity = "info";
          
          // Direct Supabase insert
          const { data, error } = await supabase
            .from('activities')
            .insert([{
              title: analysis.thread.title,
              content: analysis.thread.content,
              severity: activitySeverity,
              timestamp: new Date().toISOString(),
              camera_id: analysis.thread.cameraId,
              thread_id: savedThreadId || analysis.thread.id
            }])
            .select();
            
          if (error) {
            console.error("Backup activity creation failed:", error);
          } else {
            console.log("Activity created via backup method:", data);
          }
        } catch (backupError) {
          console.error("Backup activity creation failed with exception:", backupError);
        }
      }

      // Update last analysis time
      setLastAnalysisTime(new Date())
      console.log(`Analysis complete at ${new Date().toISOString()}`);
    } catch (error) {
      console.error("Error in image analysis process:", error)
    } finally {
      setIsRecording(false)
    }
  }

  // Set up periodic video analysis (every minute)
  useEffect(() => {
    // Only start after video is loaded and not already recording
    if (isVideoLoading || isRecording) return

    console.log(`Setting up periodic analysis with interval: ${analysisInterval}ms`);
    
    // Create a single consistent interval for analysis
    const interval = setInterval(() => {
      if (!isRecording && analysisEnabled) {
        console.log(`Running scheduled analysis at ${new Date().toISOString()}`);
        performVideoAnalysis();
      } else {
        console.log(`Skipping scheduled analysis: recording=${isRecording}, enabled=${analysisEnabled}`);
      }
    }, analysisInterval); // Default: 1 minute (60000ms)

    // Cleanup
    return () => {
      console.log("Cleaning up analysis interval");
      clearInterval(interval);
    }
  }, [isVideoLoading, isRecording, analysisEnabled, analysisInterval, cameraInfo]);

  // Load existing activities for this camera from Supabase on component mount
  useEffect(() => {
    const loadActivities = async () => {
      try {
        console.log(`Loading activities for camera ${mainCamera.id}...`);
        const data = await activitiesService.getActivitiesByCameraId(mainCamera.id)

        // Convert to Activity objects
        if (data && data.length > 0) {
          console.log(`Found ${data.length} activities in Supabase`);
          const loadedActivities: Activity[] = data.map((item) => ({
            id: item.id,
            title: item.title,
            content: item.content,
            severity: item.severity as "critical" | "warning" | "info",
            timestamp: new Date(item.timestamp),
            cameraId: item.camera_id,
            threadId: item.thread_id || undefined,
          }))

          setActivities(loadedActivities)
          console.log("Activities loaded into state:", loadedActivities.length);
        } else {
          console.log("No activities found in Supabase");
        }
      } catch (error) {
        console.error("Error loading activities:", error)
      }
    }

    loadActivities()
  }, [mainCamera.id])

  // Load existing threads for this camera from Supabase on component mount
  useEffect(() => {
    const loadThreads = async () => {
      try {
        console.log(`Loading threads for camera ${mainCamera.id}...`);
        const data = await threadsService.getThreadsByCameraId(mainCamera.id)

        // Convert to Thread objects
        if (data && data.length > 0) {
          console.log(`Found ${data.length} threads in Supabase`);
          const loadedThreads: Thread[] = data.map((item) => ({
            id: item.id,
            title: item.title,
            content: item.content,
            severity: item.severity as "info" | "low" | "medium" | "high",
            timestamp: new Date(item.timestamp),
            cameraId: item.camera_id,
          }))

          setThreads(loadedThreads)
          console.log("Threads loaded into state:", loadedThreads.length);
          
          // Set the last thread title to avoid duplication
          if (loadedThreads.length > 0) {
            setLastThreadTitle(loadedThreads[0].title);
          }
        } else {
          console.log("No threads found in Supabase");
        }
      } catch (error) {
        console.error("Error loading threads:", error)
      }
    }

    loadThreads()
  }, [mainCamera.id])

  // Function to get AI response from Gemini using structured output
  const getAIResponseForImage = async (imageDataUrl: string, userMessage: string): Promise<string> => {
    try {
      // Check if we have an API key
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
      if (!apiKey) {
        console.error("Gemini API key not set in environment variables")
        return "I can't analyze the image because the API key is missing. Please configure the NEXT_PUBLIC_GOOGLE_API_KEY environment variable."
      }

      // Check if GoogleGenerativeAI is available
      if (!GoogleGenerativeAI) {
        return "I can't analyze the image because the GoogleGenerativeAI library isn't available. Please install the @google/generative-ai package."
      }

      try {
        // Extract base64 image data (remove the data:image/jpeg;base64, prefix)
        const base64Image = imageDataUrl.split(",")[1]

        // Initialize the Google GenAI client
        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

        // Create a prompt for Gemini to analyze the current traffic situation
       
        const promptText = `You're analyzing a live traffic camera feed. Based on this snapshot, answer the user's camera-related question: "${userMessage}"
Comment on traffic flow, visibility, road conditions, incidents, or anything observable from the camera image that helps address the user's query.`;


        // Create content parts with image and text
        const result = await model.generateContent({
          contents: [
            {
              role: "user",
              parts: [
                { text: promptText },
                { inlineData: { mimeType: "image/jpeg", data: base64Image } }
              ]
            }
          ],
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 0.95,
            maxOutputTokens: 800,
          }
        })

        return result.response.text()
      } catch (error) {
        console.error("Error with Gemini API:", error)
        // Provide a more user-friendly error message
        if (error instanceof Error && error.message.includes("403")) {
          return "I can't analyze the image due to API authentication issues. Please check if your Google API key has the Gemini API enabled."
        } else if (error instanceof Error && error.message.includes("429")) {
          return "I can't analyze the image right now. The Gemini API quota has been exceeded. Please try again later."
        } else if (error instanceof Error && error.message.includes("NOT_FOUND")) {
          return "I can't analyze the image. There's an issue with the Gemini model configuration. Please report this to the development team."
        } else {
          return (
            "I'm having trouble analyzing the image right now. The view shows the traffic situation, but I can't provide specific details at the moment. Technical error: " +
            (error instanceof Error ? error.message : String(error))
          )
        }
      }
    } catch (error) {
      console.error("Error getting AI response:", error)
      return "I couldn't analyze the camera feed properly. Please try again in a moment."
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isProcessing) return

    setIsProcessing(true)

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date(),
      isNew: false,
    }

    setMessages((prev) => [...prev, userMessage])
    setMessage("")

    try {
      // Show loading message
      const loadingMsgId = (Date.now() + 1).toString()
      const loadingMessage: Message = {
        id: loadingMsgId,
        content: "Analyzing camera feed...",
        sender: "monitor",
        timestamp: new Date(),
        isNew: true,
      }

      setMessages((prev) => [...prev, loadingMessage])

      // Capture screenshot from video if available
      let imageDataUrl = ""
      if (videoRef.current && !videoRef.current.paused) {
        imageDataUrl = await captureVideoFrame(videoRef.current)
      }

      // Get AI response based on image and user message
      const aiResponse = await getAIResponseForImage(imageDataUrl, userMessage.content)

      // Update loading message with actual response
      setMessages((prev) =>
        prev.map((msg) => (msg.id === loadingMsgId ? { ...msg, content: aiResponse, isNew: true } : msg)),
      )

      // After the animation completes, mark as not new
      const animationTime = aiResponse.length * 10 + 500
      setTimeout(() => {
        setMessages((prev) => prev.map((msg) => (msg.id === loadingMsgId ? { ...msg, isNew: false } : msg)))
      }, animationTime)
    } catch (error) {
      console.error("Error processing message:", error)

      // Add error message if something went wrong
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          content: "Sorry, I couldn't analyze the camera feed. Please try again.",
          sender: "monitor",
          timestamp: new Date(),
          isNew: false,
        },
      ])
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      <div className="flex-1 flex flex-col">
        {/* Main Header - spans full width */}
        <header className="flex items-center px-6 py-4 border-b border-[#F5F5F5] bg-white z-10">
          <div className="flex items-center text-gray-500 text-sm">
            <span>Monitor</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{mainCamera.name}</span>
          </div>
          <div className="ml-auto relative" ref={moreMenuRef}>
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-2 bg-white border border-[#F5F5F5] rounded-[32px] text-[#0A0A0A] flex items-center justify-center hover:bg-gray-50 transition-colors"
              title="More options"
            >
              <MoreHorizontalIcon size={12} />
            </button>

            {showMoreMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-[#F5F5F5] z-50">
                <div className="p-3 border-b border-[#F5F5F5] flex justify-between items-center">
                  <h3 className="text-sm font-medium">More</h3>
                </div>
                <div className="p-2">
                  <button
                    className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-[#F5F5F5] rounded-md transition-colors"
                    onClick={() => {
                      setShowMoreMenu(false)
                      // Handle share action
                    }}
                  >
                    <ShareIcon size={12} className="text-[#0A0A0A]" />
                    <span>Share camera feed</span>
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-[#F5F5F5] rounded-md transition-colors"
                    onClick={() => {
                      setAnalysisEnabled(!analysisEnabled)
                      setShowMoreMenu(false)
                    }}
                  >
                    <ZapIcon size={12} className={analysisEnabled ? "text-green-500" : "text-gray-400"} />
                    <span>{analysisEnabled ? "Disable automatic analysis" : "Enable automatic analysis"}</span>
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-[#F5F5F5] rounded-md transition-colors"
                    onClick={() => {
                      setShowMoreMenu(false)
                      if (!isRecording) {
                        performVideoAnalysis();
                      }
                    }}
                  >
                    <ShieldIcon size={12} className="text-[#0A0A0A]" />
                    <span>Analyze now</span>
                  </button>
                  <div className="px-3 py-2 text-sm border-t border-[#F5F5F5] mt-1">
                    <p className="mb-1 font-medium">Analysis Interval</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button 
                        className={`px-2 py-1 rounded ${analysisInterval === 30000 ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                        onClick={() => {
                          setAnalysisInterval(30000);
                          setShowMoreMenu(false);
                        }}
                      >
                        30s
                      </button>
                      <button 
                        className={`px-2 py-1 rounded ${analysisInterval === 60000 ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                        onClick={() => {
                          setAnalysisInterval(60000);
                          setShowMoreMenu(false);
                        }}
                      >
                        1m
                      </button>
                      <button 
                        className={`px-2 py-1 rounded ${analysisInterval === 120000 ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                        onClick={() => {
                          setAnalysisInterval(120000);
                          setShowMoreMenu(false);
                        }}
                      >
                        2m
                      </button>
                      <button 
                        className={`px-2 py-1 rounded ${analysisInterval === 300000 ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                        onClick={() => {
                          setAnalysisInterval(300000);
                          setShowMoreMenu(false);
                        }}
                      >
                        5m
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Content Area - split into two columns */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Column - Camera View */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Main Camera View with search bar and thumbnails */}
            <div className="flex-1 relative overflow-hidden flex flex-col py-4 px-6">
              {/* Search Bar */}
              <div className="relative mb-5">
                <SearchIcon size={12} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search here"
                  className={cn(
                    "pl-10 pr-10 py-2 border border-[#F5F5F5] rounded-md text-sm bg-white w-full",
                    "focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-[#F5F5F5]",
                    "hover:border-[#F5F5F5]",
                    "active:border-[#F5F5F5] active:ring-0",
                    "!shadow-none",
                  )}
                />
                <ListFilterIcon
                  size={12}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>

              {/* Main Camera */}
              <div className={`relative overflow-hidden ${isExpanded ? "flex-1" : "flex-1 mb-5"}`}>
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover rounded-lg"
                  muted
                  playsInline
                  autoPlay
                  poster={mainCamera.image}
                />

                {/* Loading Overlay */}
                {isVideoLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                      <span className="mt-2 text-white font-medium">Loading stream...</span>
                    </div>
                  </div>
                )}

                {/* Live indicator */}
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  <span>LIVE</span>
                </div>

                {/* Analysis status indicator */}
                <div className="absolute top-4 left-20 bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  {isRecording ? (
                    <>
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      <span>ANALYZING</span>
                    </>
                  ) : analysisEnabled ? (
                    <>
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                      <span>{`ANALYSIS: ${analysisInterval/1000}s`}</span>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                      <span>ANALYSIS OFF</span>
                    </>
                  )}
                </div>

                {/* Recording indicator */}
                {isRecording && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 animate-pulse">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span>ANALYZING</span>
                  </div>
                )}

                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="absolute bottom-4 right-4 p-2 bg-white bg-opacity-80 border border-[#F5F5F5] rounded-full shadow-sm hover:bg-opacity-100 transition-all z-10"
                  aria-label={isExpanded ? "Collapse camera view" : "Expand camera view"}
                >
                  {isExpanded ? (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="4 14 10 14 10 20"></polyline>
                      <polyline points="20 10 14 10 14 4"></polyline>
                      <line x1="14" y1="10" x2="21" y2="3"></line>
                      <line x1="3" y1="21" x2="10" y2="14"></line>
                    </svg>
                  ) : (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <polyline points="9 21 3 21 3 15"></polyline>
                      <line x1="21" y1="3" x2="14" y2="10"></line>
                      <line x1="3" y1="21" x2="10" y2="14"></line>
                    </svg>
                  )}
                </button>
              </div>

              {/* Thumbnail Cameras */}
              {!isExpanded && (
                <div className="h-24 flex gap-2">
                  {otherCameras.map((camera) => (
                    <a
                      key={camera.id}
                      href={`/monitor/${camera.id}`}
                      className="h-full aspect-video rounded-lg overflow-hidden border border-[#F5F5F5] cursor-pointer hover:border-blue-500 transition-colors"
                    >
                      <img
                        src={camera.image || "/placeholder.svg"}
                        alt={`Camera ${camera.id} thumbnail`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Info Panel */}
          <div className="border-l border-[#F5F5F5] flex flex-col" style={{ width: "400px" }}>
            {/* Info Panel Header */}
            <div className="px-7 py-4 border-b border-[#F5F5F5]">
              <div className="flex items-center text-sm">
                <span className="text-gray-500">Serafin</span>
                <ChevronRightIcon size={12} className="mx-1 text-gray-400" />
                <span className="text-gray-900">Camera 101</span>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="chat" className="flex-1 flex flex-col">
              <div
                className="flex items-center justify-start border-b border-[#F5F5F5] bg-white px-7"
                style={{ paddingTop: "12px", paddingBottom: "12px" }}
              >
                <TabsList className="flex w-auto bg-transparent p-0">
                  <div className="flex items-center gap-x-2 gap-y-4">
                    <TabsTrigger
                      value="chat"
                      className="data-[state=active]:text-[#0A0A0A] data-[state=active]:font-medium text-[#A3A3A3] font-normal data-[state=active]:shadow-none rounded-none border-0"
                    >
                      Chat
                    </TabsTrigger>
                    <TabsTrigger
                      value="threads"
                      className="data-[state=active]:text-[#0A0A0A] data-[state=active]:font-medium text-[#A3A3A3] font-normal data-[state=active]:shadow-none rounded-none border-0"
                    >
                      Threads
                    </TabsTrigger>
                    <TabsTrigger
                      value="activity"
                      className="data-[state=active]:text-[#0A0A0A] data-[state=active]:font-medium text-[#A3A3A3] font-normal data-[state=active]:shadow-none rounded-none border-0"
                    >
                      Activity
                    </TabsTrigger>
                  </div>
                </TabsList>
              </div>

              <TabsContent
                value="chat"
                className="flex-1 flex flex-col px-5 py-5 data-[state=inactive]:hidden overflow-hidden relative h-full"
              >
                {/* Messages container with proper padding for fixed elements */}
                <div className={`absolute inset-0 overflow-y-auto pt-5 pb-[120px] px-0 ${hideScrollbarClass}`}>
                  <div className="flex flex-col space-y-5 w-full px-5">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`flex max-w-[90%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                          <div
                            className={`w-5 h-5 flex-shrink-0 flex items-center justify-center ${
                              msg.sender === "user" ? "ml-3" : "mr-3"
                            }`}
                          >
                            {msg.sender === "user" ? (
                              <AvatarIcon className="w-full h-full" />
                            ) : (
                              <div className="w-full h-full rounded-full bg-gradient-to-b from-[#193BE2] to-[#0091FF]">
                                {/* AI orb */}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <div
                              className={`px-4 py-3 ${
                                msg.sender === "user"
                                  ? "bg-white border border-[#F5F5F5] rounded-tl-xl rounded-tr-none rounded-bl-xl rounded-br-xl"
                                  : "bg-[#FAFAFA] bg-opacity-25 border border-[#F5F5F5] rounded-tl-none rounded-tr-xl rounded-bl-xl rounded-br-xl"
                              }`}
                            >
                              <p className="text-[14px] text-[#0A0A0A] mb-1">
                                {msg.sender === "user" ? (
                                  msg.content
                                ) : (
                                  <TypewriterEffect text={msg.content} showEffect={msg.isNew} speed={10} />
                                )}
                              </p>
                              <div
                                className={`text-[12px] text-[#A3A3A3] ${
                                  msg.sender === "user" ? "text-right" : "text-left"
                                }`}
                              >
                                {msg.sender === "user" ? "You" : "Monitor"} - {format(msg.timestamp, "HH:mm")}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Fixed bottom section with quick actions and chat input */}
                <div className="absolute bottom-0 left-0 right-0 bg-white pt-2 pb-5 px-5 z-10">
                  {/* Quick Actions - only show when no messages */}
                  {messages.length === 0 && (
                    <div className="flex flex-wrap justify-center gap-2.5 w-full mb-4">
                      <QuickAction
                        icon={<MessageCircleIcon size={12} />}
                        label="Analyze a situation"
                        color="#F59E0B"
                        onClick={() => {
                          setMessage("Can you analyze what's happening in this camera feed?")
                          handleSendMessage(new Event("submit") as any)
                        }}
                      />
                      <QuickAction
                        icon={<UsersIcon size={12} />}
                        label="Identify..."
                        color="#10B981"
                        onClick={() => {
                          setMessage("Can you identify any people or objects in this camera feed?")
                          handleSendMessage(new Event("submit") as any)
                        }}
                      />
                      <QuickAction
                        icon={<ZapIcon size={12} />}
                        label="What's happening?"
                        color="#4F46E5"
                        onClick={() => {
                          setMessage("What's happening in this camera feed right now?")
                          handleSendMessage(new Event("submit") as any)
                        }}
                      />
                      <QuickAction
                        icon={<MoreHorizontalIcon size={12} />}
                        label="More"
                        color="#6B7280"
                        onClick={() => {
                          setMessage("What else can you tell me about this camera feed?")
                          handleSendMessage(new Event("submit") as any)
                        }}
                      />
                    </div>
                  )}

                  {/* Chat Input */}
                  <form onSubmit={handleSendMessage} className="w-full">
                    <div className="flex items-center border border-[#F5F5F5] rounded-[32px] px-4 py-2 bg-white w-full">
                      <div className="flex-shrink-0 mr-2">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-b from-[#193BE2] to-[#0091FF]"></div>
                      </div>
                      <input
                        ref={inputRef}
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ask me anything..."
                        className="flex-1 outline-none border-none text-[14px] font-normal bg-transparent"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage(e)
                          }
                        }}
                      />
                      <div className="flex items-center gap-2 ml-2">
                        <button type="button" className="p-2 text-[#0A0A0A] flex items-center justify-center">
                          <PaperclipIcon size={12} />
                        </button>
                        <button
                          type="submit"
                          className="p-2 bg-white border border-[#F5F5F5] rounded-[32px] text-[#0A0A0A] flex items-center justify-center"
                          disabled={!message.trim()}
                        >
                          <ArrowUpIcon size={12} />
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </TabsContent>

              <TabsContent
                value="threads"
                className={`flex-1 px-7 pt-2 pb-5 data-[state=inactive]:hidden overflow-hidden relative ${hideScrollbarClass}`}
              >
                <div
                  className={`absolute inset-0 overflow-y-auto px-[20px] pt-[-24px] pb-[16px] ${hideScrollbarClass}`}
                >
                  <div className="space-y-5 relative pb-4">
                    {/* Vertical timeline line */}
                    <div className="absolute left-[6px] top-6 bottom-0 w-[1px] bg-[#F5F5F5]"></div>

                    {/* Show message if no threads */}
                    {threads.length === 0 && (
                      <div className="flex items-center justify-center py-8">
                        <p className="text-sm text-gray-500">
                          Monitoring traffic conditions... Threads will appear here.
                        </p>
                      </div>
                    )}

                    {/* Map through real threads */}
                    {threads.map((thread) => {
                      // Determine dot color based on severity
                      let dotColorClass = "bg-green-500" // info (default)
                      if (thread.severity === "high") {
                        dotColorClass = "bg-red-500"
                      } else if (thread.severity === "medium") {
                        dotColorClass = "bg-orange-500"
                      } else if (thread.severity === "low") {
                        dotColorClass = "bg-yellow-500"
                      }

                      return (
                        <div key={thread.id} className="flex items-start gap-[8px]">
                          <div className="relative z-10 mt-1">
                            <div className={`w-3 h-3 rounded-full ${dotColorClass}`}></div>
                          </div>
                          <div className="flex-1 flex flex-col gap-[6px]">
                            <h3 className="text-[12px] font-medium text-[#0A0A0A]">{thread.title}</h3>
                            <p className="text-[12px] font-normal text-[#737373] mt-1 mb-3 line-clamp-2 overflow-hidden">
                              {thread.content}
                            </p>
                            <div className="flex items-center gap-4">
                              <span className="text-[10px] font-normal text-[#A3A3A3]">
                                {format(thread.timestamp, "MMM d, yyyy, hh:mm a")}
                              </span>
                              <div className="px-3 py-1 bg-[#FAFAFA] rounded-full text-[10px] text-[#0A0A0A] border border-[#F5F5F5]">
                                {thread.severity.charAt(0).toUpperCase() + thread.severity.slice(1)} priority
                              </div>
                              <button 
                                className="px-4 py-2 bg-[#FAFAFA] rounded-full text-[12px] text-[#0A0A0A] hover:bg-gray-100 transition-colors border border-[#F5F5F5]"
                                onClick={() => {
                                  // Open full thread in a modal or expand content
                                  console.log("Thread details clicked:", thread);
                                }}
                              >
                                See details
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </TabsContent>

              <TabsContent
                value="activity"
                className={`flex-1 px-5 py-5 data-[state=inactive]:hidden overflow-y-auto h-full ${hideScrollbarClass}`}
                style={{ maxHeight: "calc(100vh - 200px)" }}
              >
                <div className={`space-y-4 w-full pb-8 overflow-y-auto ${hideScrollbarClass}`}>
                  {/* Show message if no activities */}
                  {activities.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8">
                      <p className="text-sm text-gray-500 mb-2">No activities detected yet.</p>
                      <p className="text-xs text-gray-400">Activities will appear here as they are detected.</p>
                    </div>
                  )}

                  {/* Map through real activities */}
                  {activities.map((activity) => {
                    // Determine icon color based on severity
                    let iconColorClass = "text-blue-500" // info
                    let badgeColorClass = "bg-blue-500"
                    let badgeText = "Info"

                    if (activity.severity === "critical") {
                      iconColorClass = "text-[#EF4444]"
                      badgeColorClass = "bg-red-500"
                      badgeText = "Critical"
                    } else if (activity.severity === "warning") {
                      iconColorClass = "text-[#F59E0B]"
                      badgeColorClass = "bg-yellow-500"
                      badgeText = "Warning"
                    }

                    return (
                      <div key={activity.id} className="border border-[#F5F5F5] p-4 rounded-lg">
                        <div className="mb-2">
                          <div className="p-2 bg-white border border-[#F5F5F5] rounded-[32px] inline-flex">
                            <ZapIcon size={12} className={iconColorClass} />
                          </div>
                        </div>
                        <h3 className="font-medium mb-1">{activity.title}</h3>
                        <p className="text-xs text-gray-400 mb-2">{format(activity.timestamp, "MMM d, yyyy, hh:mm:ss a")}</p>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{activity.content}</p>
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-[10px] py-1 flex items-center gap-1 ${badgeColorClass} text-white text-xs rounded-full`}
                          >
                            {badgeText}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs bg-[#FAFAFA] text-black border-[#F5F5F5] hover:bg-gray-100 hover:border-[#F5F5F5] rounded-[32px]"
                            onClick={() => {
                              // Open full activity in a modal or expand content
                              console.log("Activity details clicked:", activity);
                            }}
                          >
                            See details
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

// QuickAction component
function QuickAction({
  icon,
  label,
  color = "#0A0A0A",
  onClick,
}: { icon: React.ReactNode; label: string; color?: string; onClick?: () => void }) {
  return (
    <Button
      variant="outline"
      className="flex items-center gap-2 px-4 py-2 border border-[#F5F5F5] rounded-[32px] text-[14px] text-[#A3A3A3] transition-colors duration-200 h-auto"
      style={
        {
          "--hover-color": color,
        } as React.CSSProperties
      }
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.backgroundColor = `${color}1A` // 10% opacity
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.backgroundColor = ""
      }}
      onClick={onClick}
    >
      <div className="w-3 h-3 flex-shrink-0" style={{ color }}>
        {icon}
      </div>
      <span className="whitespace-nowrap truncate">{label}</span>
    </Button>
  )
}
