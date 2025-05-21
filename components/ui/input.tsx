import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-[#F5F5F5] bg-white px-3 py-2 text-sm text-[#0A0A0A] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#A3A3A3]",
        // Eliminar todos los efectos de focus, active, etc.
        "focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-[#F5F5F5]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
