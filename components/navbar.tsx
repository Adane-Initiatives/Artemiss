"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Logo from "./logo"

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY

      // Determinar si el scroll es hacia arriba o hacia abajo
      if (currentScrollY > lastScrollY) {
        // Scroll hacia abajo - ocultar la barra
        setIsVisible(false)
      } else {
        // Scroll hacia arriba - mostrar la barra
        setIsVisible(true)
      }

      // Actualizar la posición del último scroll
      setLastScrollY(currentScrollY)
    }

    // Añadir el event listener
    window.addEventListener("scroll", controlNavbar)

    // Limpiar el event listener cuando el componente se desmonte
    return () => {
      window.removeEventListener("scroll", controlNavbar)
    }
  }, [lastScrollY]) // Dependencia del último valor de scroll

  return (
    <header
      className={`fixed w-full bg-white z-50 border-b border-[#F5F5F5] transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-6xl mx-auto px-[28px] py-[14px] flex items-center justify-between">
        {/* Stack 1: Logo (width: fill, height: hug) */}
        <div className="flex-1 flex items-center">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>
        </div>

        {/* Stack 2: Links (width: hug, height: hug) */}
        <div className="flex items-center justify-center">
          <nav className="hidden md:flex items-center gap-3">
            <Link href="/#hero" className="text-xs text-[#A3A3A3] hover:text-[#0A0A0A]">
              Discover
            </Link>
            <Link href="/#features" className="text-xs text-[#A3A3A3] hover:text-[#0A0A0A]">
              Features
            </Link>
            <Link href="/waitlist" className="text-xs text-[#A3A3A3] hover:text-[#0A0A0A] flex items-center">
              Waitlist
              <span className="ml-1.5 text-[8px] font-medium text-white bg-[#114FFF] rounded-full px-1.5 py-0.5">
                New
              </span>
            </Link>
          </nav>
        </div>

        {/* Stack 3: Buttons (width: fill, height: hug) */}
        <div className="flex-1 flex items-center justify-end gap-1.5">
          <Link
            href="./artemis"
            className="px-4 py-2.5 rounded-full bg-[#2563EB] text-white text-[10px] font-medium hover:bg-[#2563EB]/90 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Try Demo
          </Link>
          <Link
            href="./models/serafin"
            className="hidden md:block px-4 py-2.5 rounded-full bg-white border border-[#F5F5F5] text-[#0a0a0a] text-[10px] font-medium hover:bg-gray-50 transition-colors"
          >
            See it in Action
          </Link>
        </div>
      </div>
    </header>
  )
}
