import { Skeleton } from "@/components/ui/skeleton"
import { Sidebar } from "@/components/sidebar"

export default function Loading() {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar activeSection="activity" setActiveSection={() => {}} />

      <div className="flex-1 flex flex-col">
        {/* Header Skeleton */}
        <header className="flex items-center px-6 py-4 border-b border-[#F5F5F5] bg-white z-10">
          <Skeleton className="h-8 w-8 rounded-full mr-4" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="ml-auto flex gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </header>

        {/* Main Content Skeleton */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Cover Image Skeleton */}
            <Skeleton className="w-full h-64 mb-6 rounded-lg" />

            {/* Activity Details Skeleton */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/4 mb-4" />

              <div className="border-t border-[#F5F5F5] pt-4 mt-4">
                <Skeleton className="h-6 w-32 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
              </div>
            </div>

            {/* Related Actions Skeleton */}
            <div className="border-t border-[#F5F5F5] pt-6 mt-6">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
