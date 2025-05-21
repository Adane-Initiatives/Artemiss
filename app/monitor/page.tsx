"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  VideoIcon,
  CircleAlertIcon,
  SquareTerminalIcon,
  SearchIcon,
  ListFilterIcon,
  ShieldIcon,
} from "@/components/icons/lucide-icons"
import { Sidebar } from "@/components/sidebar"
import { Input } from "@/components/ui/input"
import { FeedbackDialog } from "@/components/feedback-dialog"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { cameraData } from "../data/cameraData"

type SectionType = "artemis" | "monitor" | "activity" | "feedback"

export default function SerafinPage() {
  const [activeSection, setActiveSection] = useState<SectionType>("monitor")
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const moreMenuRef = useRef<HTMLDivElement>(null)

  // Clase CSS para ocultar la barra de desplazamiento
  const hideScrollbarClass = "scrollbar-hide"

  // Agregar estilos CSS para ocultar la barra de desplazamiento
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

  // Filter cameras based on search query
  const filteredCameras = cameraData.cameras.filter(
    (camera) =>
      searchQuery === "" ||
      camera.street_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camera.city.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex h-screen bg-white">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center px-6 py-4 border-b border-[#F5F5F5] bg-white z-10">
          <div className="flex items-center text-gray-500 text-sm">
            <span>Monitor</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Cameras</span>
          </div>
        </header>

        {/* Main Content */}
        <div className={`flex-1 overflow-auto p-6 ${hideScrollbarClass}`}>
          {/* Status Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <StatusCard
              icon={
                <div className="p-2 bg-white border border-[#F5F5F5] rounded-[32px] inline-flex">
                  <ShieldIcon size={12} />
                </div>
              }
              title="Security Status"
              description="Real-time security monitoring and threat assessment system"
              status="Secure"
              statusColor="bg-green-500"
            />
            <StatusCard
              icon={
                <div className="p-2 bg-white border border-[#F5F5F5] rounded-[32px] inline-flex">
                  <VideoIcon size={12} />
                </div>
              }
              title="Active Cameras"
              description="Network of connected surveillance cameras and their status"
              status={`${cameraData.cameras.length} Online`}
              statusColor="bg-green-500"
            />
            <StatusCard
              icon={
                <div className="p-2 bg-white border border-[#F5F5F5] rounded-[32px] inline-flex">
                  <CircleAlertIcon size={12} />
                </div>
              }
              title="Active Threats"
              description="Current security alerts and potential risks in monitored areas"
              status="None"
              statusColor="bg-green-500"
            />
            <StatusCard
              icon={
                <div className="p-2 bg-white border border-[#F5F5F5] rounded-[32px] inline-flex">
                  <SquareTerminalIcon size={12} />
                </div>
              }
              title="System Status"
              description="Overall health and operational status of monitoring systems"
              status="Operational"
              statusColor="bg-green-500"
            />
          </div>

          {/* Search and Actions */}
          {/* Search Bar */}
          <div className="relative flex-1 mb-5">
            <SearchIcon size={12} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by location or street name"
              className={cn(
                "pl-10 pr-10 py-2 border border-[#F5F5F5] rounded-md text-sm bg-white w-full",
                "focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-[#F5F5F5]",
                "hover:border-[#F5F5F5]",
                "active:border-[#F5F5F5] active:ring-0",
                "!shadow-none",
              )}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <ListFilterIcon size={12} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Camera Grid */}
          <div className="grid grid-cols-4 gap-4">
            {filteredCameras.map((camera) => (
              <Link
                key={camera.id}
                href={`/monitor/${camera.id}`}
                className="rounded-lg overflow-hidden border border-[#F5F5F5] hover:border-blue-500 transition-colors flex flex-col"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={camera.image || "/placeholder.svg"}
                    alt={camera.street_name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Live
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium truncate">{camera.street_name}</h3>
                  <p className="text-xs text-gray-500 truncate">{camera.city}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </div>
  )
}

interface StatusCardProps {
  icon: React.ReactNode
  title: string
  description: string
  status: string
  statusColor: string
}

function StatusCard({ icon, title, description, status, statusColor }: StatusCardProps) {
  return (
    <div className="border border-[#F5F5F5] rounded-lg p-4">
      <div className="flex flex-col gap-4">
        <div className="inline-flex w-fit">{icon}</div>
        <div>
          <h3 className="font-medium mb-1">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
          <div className={`inline-block px-3 py-1 rounded-full text-white text-xs mt-2 ${statusColor}`}>{status}</div>
        </div>
      </div>
    </div>
  )
}
