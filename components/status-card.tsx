import type React from "react"
interface StatusCardProps {
  icon: React.ReactNode
  title: string
  status: string
  statusColor: string
  description?: string
}

export function StatusCard({ icon, title, status, statusColor, description }: StatusCardProps) {
  return (
    <div className="border border-[#F5F5F5] rounded-lg p-4">
      <div className="flex flex-col gap-[16px]">
        <div className="flex items-center">{icon}</div>
        <div>
          <h3 className="font-medium mb-1">{title}</h3>
          <p className="text-sm text-gray-500 mb-4">
            {description || "Full-stack, open-source web3 development platform"}
          </p>
          <div
            className={`inline-flex items-center gap-1 px-[10px] py-[4px] rounded-full text-white text-xs ${statusColor}`}
          >
            {status}
          </div>
        </div>
      </div>
    </div>
  )
}
