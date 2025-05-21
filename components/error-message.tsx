"use client"

import { XCircleIcon } from "lucide-react"

interface ErrorMessageProps {
  message: string
  onDismiss?: () => void
}

export function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
      <div className="flex items-center">
        <XCircleIcon className="h-5 w-5 mr-2" />
        <span className="block sm:inline">{message}</span>
      </div>
      {onDismiss && (
        <button className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={onDismiss}>
          <span className="sr-only">Dismiss</span>
          <XCircleIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
