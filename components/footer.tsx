"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import Logo from "./logo"

export default function Footer() {
  const [isDropupOpen, setIsDropupOpen] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    // Si hay un temporizador activo, lo limpiamos
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
    setIsDropupOpen(true)
  }

  const handleMouseLeave = () => {
    // Configuramos un temporizador para cerrar el menú después de 500ms
    const id = setTimeout(() => {
      setIsDropupOpen(false)
    }, 500)
    setTimeoutId(id)
  }

  // Limpiamos el temporizador cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [timeoutId])

  return (
    <footer className="bg-white pt-[100px] pb-[32px] px-[60px] border-t border-[#F5F5F5]">
      <div className="max-w-6xl ml-0 mr-auto px-4 md:px-[28px] w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 justify-between items-end">
          {/* Column 1: Logo and Tagline */}
          <div className="md:col-span-3 self-end">
            <Link href="/" className="inline-block mb-6">
              <Logo />
            </Link>
            <h3 className="text-[16px] font-medium text-[#0A0A0A] mb-6">
              <span className="block">A safe place for everyone,</span>
              <span className="block">everywhere.</span>
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="artemis"
                className="px-4 py-2.5 rounded-full bg-[#2563EB] text-white text-[10px] font-medium hover:bg-[#2563EB]/90 transition-colors text-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                Try Demo
              </Link>
              <Link
                href="models/serafin"
                className="px-4 py-2.5 rounded-full bg-white border border-[#F5F5F5] text-[#0a0a0a] text-[10px] font-medium hover:bg-gray-50 transition-colors text-center"
              >
                See it in Action
              </Link>
            </div>
          </div>

          {/* Column 2: Discover */}
          <div className="md:col-span-2 md:col-start-8 self-end">
            <div className="flex flex-col gap-3">
              <h4 className="text-[14px] font-medium text-[#0A0A0A] text-left">Discover</h4>
              <Link href="/#hero" className="text-[12px] font-normal text-[#A3A3A3] hover:text-[#0A0A0A]">
                Home
              </Link>
              <Link href="/#features" className="text-[12px] font-normal text-[#A3A3A3] hover:text-[#0A0A0A]">
                Features
              </Link>
              <Link
                href="/waitlist"
                className="text-[12px] font-normal text-[#A3A3A3] hover:text-[#0A0A0A] flex items-center"
              >
                Waitlist
                <span className="ml-1.5 text-[8px] font-medium text-white bg-[#114FFF] rounded-full px-1.5 py-0.5">
                  New
                </span>
              </Link>
            </div>
          </div>

          {/* Column 4: Resources */}
          <div className="md:col-span-2 md:col-start-10 self-end">
            <div className="flex flex-col gap-3">
              <h4 className="text-[14px] font-medium text-[#0A0A0A] text-left">Resources</h4>
              <Link href="/models/artemis" className="text-[12px] font-normal text-[#A3A3A3] hover:text-[#0A0A0A]">
                Introduction
              </Link>
              <Link href="/documentation" className="text-[12px] font-normal text-[#A3A3A3] hover:text-[#0A0A0A]">
                Documentation
              </Link>
              <Link href="/research" className="text-[12px] font-normal text-[#A3A3A3] hover:text-[#0A0A0A]">
                Research
              </Link>
            </div>
          </div>

          {/* Column 5: About */}
          <div className="md:col-span-2 md:col-start-12 self-end">
            <div className="flex flex-col gap-3">
              <h4 className="text-[14px] font-medium text-[#0A0A0A] text-left">About</h4>
              <Link href="/ethos" className="text-[12px] font-normal text-[#A3A3A3] hover:text-[#0A0A0A]">
                Ethos
              </Link>
              <div
                className="text-[12px] font-normal text-[#A3A3A3] hover:text-[#0A0A0A] cursor-pointer relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                People
                {isDropupOpen && (
                  <div
                    className="absolute bottom-full left-0 mb-2 bg-white shadow-lg rounded-[18px] border border-[#F5F5F5] py-2 w-48 z-10"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <a
                      href="https://www.linkedin.com/in/tobias-adane-b702821b6/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-2 text-[12px] text-[#A3A3A3] hover:text-[#0A0A0A]"
                    >
                      Tobias Adane
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/sourabh-singh-7b001922a/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-2 text-[12px] text-[#A3A3A3] hover:text-[#0A0A0A]"
                    >
                      Sourabh Singh
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/sarah-haddad-it/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-2 text-[12px] text-[#A3A3A3] hover:text-[#0A0A0A]"
                    >
                      Sarah Haddad
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
              <Link href="/contact" className="text-[12px] font-normal text-[#A3A3A3] hover:text-[#0A0A0A]">
                Contact
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom section with logo */}
        <div className="mt-16 flex flex-col items-center w-full">
          <div className="mb-3">
            <svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8.6966 18.099L0.438184 21.3736C0.438184 21.3736 6.01697 18.6418 7.64556 14.8245C8.80542 12.1058 9.48551 8.32085 9.87336 5.26773L10.3483 0.0889407C10.3483 0.0889407 10.245 2.34241 9.87336 5.26773L8.6966 18.099Z"
                fill="#0A0A0A"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.3383 0.133548L9.36137 0L8.88798 5.1618C8.50135 8.19944 7.83399 11.8607 6.73281 14.4418C6.02665 16.0971 4.40806 17.6039 2.84567 18.7379C2.08129 19.2928 1.36374 19.7347 0.837612 20.0376C0.575079 20.1888 0.36159 20.3045 0.215498 20.3816C0.142487 20.4201 0.0864149 20.4489 0.0495851 20.4676L0.00909713 20.488L0.000241704 20.4924C0.000269615 20.4923 -0.000988653 20.493 0.00197681 20.4988L0.806238 22.2857L9.62856 18.7876L10.8588 5.37354C11.0458 3.89869 11.1653 2.59421 11.2383 1.65688C11.2749 1.18618 11.2998 0.807404 11.3156 0.545363C11.3235 0.414327 11.3291 0.312431 11.3328 0.242774L11.3369 0.162837L11.3379 0.141717L11.3383 0.133548ZM6.89913 17.7537C7.24131 17.3645 7.56187 16.9528 7.84627 16.5205L7.76464 17.4105L6.89913 17.7537Z"
                fill="#0A0A0A"
              />
              <path
                d="M15.3034 18.099L23.5618 21.3736C23.5618 21.3736 17.983 18.6418 16.3544 14.8245C15.1946 12.1058 14.5145 8.32085 14.1266 5.26773L13.6517 0.0889407C13.6517 0.0889407 13.755 2.34241 14.1266 5.26773L15.3034 18.099Z"
                fill="#0A0A0A"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.6617 0.133548L14.6386 0L15.112 5.1618C15.4986 8.19944 16.166 11.8607 17.2672 14.4418C17.9734 16.0971 19.5919 17.6039 21.1543 18.7379C21.9187 19.2928 22.6363 19.7347 23.1624 20.0376C23.4249 20.1888 23.6384 20.3045 23.7845 20.3816C23.8575 20.4201 23.9136 20.4489 23.9504 20.4676L23.9909 20.488L23.9998 20.4924C23.9997 20.4923 24.001 20.493 23.998 20.4988L23.1938 22.2857L14.3714 18.7876L13.1412 5.37354C12.9542 3.89869 12.8347 2.59421 12.7617 1.65688C12.7251 1.18618 12.7002 0.807404 12.6844 0.545363C12.6765 0.414327 12.6709 0.312431 12.6672 0.242774L12.6631 0.162837L12.6621 0.141717L12.6617 0.133548ZM17.1009 17.7537C16.7587 17.3645 16.4381 16.9528 16.1537 16.5205L16.2354 17.4105L17.1009 17.7537Z"
                fill="#0A0A0A"
              />
            </svg>
          </div>
          <p className="text-xs text-[#A3A3A3]">Built by humans, for humans.</p>
        </div>
      </div>
    </footer>
  )
}
