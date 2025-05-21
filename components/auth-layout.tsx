import type React from "react"

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#FFFFFF]">
      {/* Left side - Form */}
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md p-8">{children}</div>
      </div>

      {/* Right side - Blue background with logo */}
      <div className="hidden lg:block flex-1 p-8">
        <div className="w-full h-full rounded-[24px] overflow-hidden">
          <img src="/images/artemis-banner.png" alt="Artemis" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  )
}
