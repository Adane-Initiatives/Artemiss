"use client"

import { Button } from "@/components/ui/button"

import type React from "react"

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
