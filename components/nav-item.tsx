"use client"

import React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { FeedbackDialog } from "./feedback-dialog"
import type { ReactNode, MouseEvent, ReactElement } from "react"
import { useRouter } from "next/navigation"

interface NavItemProps {
  icon: ReactNode
  isActive: boolean
  onClick: () => void
  className?: string
  iconColor?: string
  href?: string
  showFeedbackDialog?: boolean
  iconSize?: number // Añadir esta propiedad opcional
}

export function NavItem({
  icon,
  isActive,
  onClick,
  className,
  iconColor = "#0A0A0A",
  href,
  showFeedbackDialog = false,
  iconSize = 12, // Usar 12px como valor predeterminado
}: NavItemProps) {
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const router = useRouter()

  const handleClick = (e: MouseEvent) => {
    if (showFeedbackDialog) {
      e.preventDefault()
      setFeedbackOpen(true)
    } else {
      onClick()
    }
  }

  return (
    <>
      <button
        className={cn(
          "flex items-center justify-center transition-colors p-2 bg-white border border-[#F5F5F5] rounded-[32px]",
          isActive ? "bg-[#FAFAFA] opacity-100" : "bg-white",
          className,
        )}
        onClick={(e) => {
          if (showFeedbackDialog) {
            e.preventDefault()
            setFeedbackOpen(true)
          } else if (href === "/" || href === "/dashboard") {
            e.preventDefault()
            // Redirigir a Artemis en lugar de mostrar alerta
            router.push("/artemis")
          } else {
            onClick()
          }
        }}
        style={{
          backgroundColor: isActive ? "#FAFAFA" : "white",
          opacity: 1,
        }}
      >
        {/* Asegurarse de que el icono tenga el tamaño correcto */}
        {React.isValidElement(icon)
          ? React.cloneElement(icon as ReactElement, {
              size: iconSize,
              className: cn((icon as ReactElement).props.className, "text-[#0A0A0A]"),
            })
          : icon}
      </button>

      {showFeedbackDialog && <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />}
    </>
  )
}
