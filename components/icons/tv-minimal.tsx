import type React from "react"

export function TvMinimal({
  size = 12,
  color = "currentColor",
  ...props
}: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="4" width="20" height="14" rx="3" />
      <line x1="8" y1="21" x2="16" y2="21" />
    </svg>
  )
}
