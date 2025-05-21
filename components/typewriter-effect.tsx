"use client"

// Create a new file for the TypewriterEffect component
import { useState, useEffect } from "react"

interface TypewriterEffectProps {
  text: string
  speed?: number
  showEffect?: boolean
}

export function TypewriterEffect({ text, speed = 30, showEffect = true }: TypewriterEffectProps) {
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

  // Format the text to a maximum of 5 lines if needed
  const formattedText = displayedText.split("\n").slice(0, 5).join("\n")

  return (
    <>
      {formattedText}
      {!isComplete && <span className="animate-pulse">|</span>}
    </>
  )
}
