import type React from "react"

export function SerafinIcon({
  size = 12,
  color = "currentColor",
  ...props
}: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 21C6 20.4477 6.44772 20 7 20H17C17.5523 20 18 20.4477 18 21C18 21.5523 17.5523 22 17 22H7C6.44772 22 6 21.5523 6 21Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 4C3.44772 4 3 4.44772 3 5V15C3 15.5523 3.44772 16 4 16H20C20.5523 16 21 15.5523 21 15V5C21 4.44772 20.5523 4 20 4H4ZM1 5C1 3.34315 2.34315 2 4 2H20C21.6569 2 23 3.34315 23 5V15C23 16.6569 21.6569 18 20 18H4C2.34315 18 1 16.6569 1 15V5Z"
        fill="currentColor"
      />
    </svg>
  )
}
