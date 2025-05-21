"use client"

import { useEffect, useRef } from "react"
import createGlobe from "cobe"

export default function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let phi = 0
    let width = 0

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth
      }
    }

    window.addEventListener("resize", onResize)
    onResize()

    const globe = createGlobe(canvasRef.current!, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0,
      dark: 0,
      diffuse: 0.9,
      mapSamples: 12000,
      mapBrightness: 1,
      mapBaseBrightness: 0,
      baseColor: [1, 1, 1],
      markerColor: [37 / 255, 99 / 255, 235 / 255],
      glowColor: [1, 1, 1],
      scale: 1.3, // Cambiado de 1.5 a 1.3
      opacity: 0.9,
      markers: [
        // Ubicaciones actualizadas
        { location: [40.7128, -74.006], size: 0.05 }, // New York City
        { location: [37.7749, -122.4194], size: 0.05 }, // San Francisco
        { location: [-34.6037, -58.3816], size: 0.05 }, // Buenos Aires
        { location: [-32.0588, -59.2014], size: 0.05 }, // Entre Ríos (coordenadas aproximadas del centro de la provincia)
        { location: [-54.8019, -68.303], size: 0.05 }, // Ushuaia
      ],
      onRender: (state) => {
        // Rotación automática
        phi += 0.005
        state.phi = phi
        state.width = width * 2
        state.height = width * 2
      },
    })

    return () => {
      globe.destroy()
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return (
    <div
      className="relative w-full aspect-square max-w-[500px] mx-auto"
      style={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
    >
      <canvas ref={canvasRef} className="w-full h-full" style={{ transform: `translateX(${0}px)` }} />
    </div>
  )
}
