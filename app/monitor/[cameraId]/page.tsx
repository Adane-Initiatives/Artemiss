import { cameraData } from "@/app/data/cameraData"
import CameraDetailClient from "./client"

// Convert camera data into the expected format for the component
const cameraStreams: Record<string, { url: string; name: string; location: string }> = {}
cameraData.cameras.forEach((camera) => {
  cameraStreams[camera.id.toString()] = {
    url: camera.url,
    name: camera.street_name,
    location: camera.city.split(",")[0],
  }
})

export default function CameraDetailPage({
  params,
}: {
  params: { cameraId: string }
}) {
  const { cameraId } = params

  // Get camera info
  const cameraInfo = cameraStreams[cameraId as keyof typeof cameraStreams] || {
    url: "",
    name: `Camera ${cameraId}`,
    location: "Unknown",
  }

  // Sample camera data
  const camera = cameraData.cameras.find((cam) => cam.id.toString() === cameraId)
  const mainCamera = {
    id: cameraId,
    name: cameraInfo.name || `Camera${cameraId}`,
    image: camera?.image || "/placeholder.svg?height=600&width=1000",
  }

  // Get 4 other cameras for thumbnails
  const otherCameras = cameraData.cameras
    .filter((cam) => cam.id.toString() !== cameraId)
    .slice(0, 4)
    .map((cam) => ({
      id: cam.id.toString(),
      image: cam.image,
    }))

  return (
    <CameraDetailClient
      cameraId={cameraId}
      cameraInfo={cameraInfo}
      mainCamera={mainCamera}
      otherCameras={otherCameras}
    />
  )
}
