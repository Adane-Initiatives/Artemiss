import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface TeamMemberProps {
  name: string
  role: string
  bio: string
  socialLinks: {
    twitter?: boolean
    linkedin?: boolean
    github?: boolean
  }
}

function TeamMember({ name, role, bio, socialLinks }: TeamMemberProps) {
  return (
    <div className="p-8 border border-[#F5F5F5] rounded-[16px]">
      <h3 className="text-[12px] font-semibold text-[#0A0A0A] mb-2">{name}</h3>
      <p className="text-[12px] font-medium text-[#A3A3A3] mb-4">{role}</p>
      <p className="text-[12px] font-normal text-[#A3A3A3] mb-8">{bio}</p>
      <div className="flex items-center gap-4">
        {socialLinks.github && (
          <Link href="#" className="w-10 h-10 rounded-full border border-[#F5F5F5] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2C6.477 2 2 6.477 2 12C2 16.418 4.865 20.166 8.84 21.49C9.34 21.581 9.5 21.278 9.5 21.017C9.5 20.783 9.492 20.135 9.489 19.293C6.728 19.882 6.139 17.958 6.139 17.958C5.685 16.853 5.029 16.551 5.029 16.551C4.121 15.925 5.098 15.937 5.098 15.937C6.101 16.01 6.629 16.973 6.629 16.973C7.521 18.483 8.97 18.005 9.52 17.752C9.611 17.118 9.87 16.641 10.153 16.37C7.99 16.099 5.722 15.276 5.722 11.454C5.722 10.347 6.109 9.442 6.649 8.737C6.546 8.488 6.203 7.524 6.747 6.147C6.747 6.147 7.587 5.883 9.478 7.177C10.293 6.959 11.152 6.851 12.012 6.847C12.872 6.851 13.731 6.959 14.546 7.177C16.436 5.883 17.276 6.147 17.276 6.147C17.82 7.524 17.477 8.488 17.374 8.737C17.914 9.442 18.301 10.347 18.301 11.454C18.301 15.286 16.03 16.097 13.862 16.364C14.219 16.697 14.539 17.356 14.539 18.359C14.539 19.782 14.527 20.69 14.527 21.017C14.527 21.28 14.686 21.585 15.192 21.487C19.164 20.161 22.026 16.416 22.026 12C22.026 6.477 17.549 2 12.026 2H12Z"
                fill="#0A0A0A"
              />
            </svg>
          </Link>
        )}
        {socialLinks.linkedin && (
          <Link href="#" className="w-10 h-10 rounded-full border border-[#F5F5F5] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z"
                fill="#0A0A0A"
              />
              <path d="M6 9H2V21H6V9Z" fill="#0A0A0A" />
              <path
                d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z"
                fill="#0A0A0A"
              />
            </svg>
          </Link>
        )}
        {socialLinks.twitter && (
          <Link href="#" className="w-10 h-10 rounded-full border border-[#F5F5F5] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M23 3.00005C22.0424 3.67552 20.9821 4.19216 19.86 4.53005C19.2577 3.83756 18.4573 3.34674 17.567 3.12397C16.6767 2.90121 15.7395 2.95724 14.8821 3.2845C14.0247 3.61176 13.2884 4.19445 12.773 4.95376C12.2575 5.71308 11.9877 6.61238 12 7.53005V8.53005C10.2426 8.57561 8.50127 8.18586 6.93101 7.39549C5.36074 6.60513 4.01032 5.43868 3 4.00005C3 4.00005 -1 13 8 17C5.94053 18.398 3.48716 19.099 1 19C10 24 21 19 21 7.50005C20.9991 7.2215 20.9723 6.94364 20.92 6.67005C21.9406 5.66354 22.6608 4.39276 23 3.00005Z"
                fill="#0A0A0A"
              />
            </svg>
          </Link>
        )}
      </div>
    </div>
  )
}

export default function PeoplePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-[80px]">
        <div className="max-w-6xl mx-auto px-4 md:px-[100px] py-12">
          <div className="mb-16">
            <h1 className="text-[48px] font-medium text-[#0A0A0A] mb-4">About Us</h1>
            <p className="text-[18px] font-normal text-[#A3A3A3] max-w-3xl">
              We believe that safety should be accessible to everyone. We've built a small team of passionate
              individuals who are committed to creating innovative solutions to protect lives and improve security.
            </p>
          </div>

          {/* Company Values */}
          <div className="mb-16 space-y-12">
            <div>
              <h2 className="text-[24px] font-medium text-[#0A0A0A] mb-4">Ethos</h2>
              <p className="text-[16px] font-normal text-[#A3A3A3] max-w-3xl">
                We believe that technology should be used for good, not for profit. It is our responsibility to improve
                people's lives and face the real-world challenges. At Artemis, we are committed to saving lives,
                enhancing security, and making a difference in critical situations.
              </p>
            </div>

            <div>
              <h2 className="text-[24px] font-medium text-[#0A0A0A] mb-4">Mission</h2>
              <p className="text-[16px] font-normal text-[#A3A3A3] max-w-3xl">
                Our mission is to create technology that saves lives, reduces risks, and improves safety for everyone,
                everywhere. We aim to transform how emergency response works, harnessing the power of AI to make
                real-time decisions and connect people with the help they need.
              </p>
            </div>

            <div>
              <h2 className="text-[24px] font-medium text-[#0A0A0A] mb-4">Vision</h2>
              <p className="text-[16px] font-normal text-[#A3A3A3] max-w-3xl">
                We envision a world where safety is not a luxury, but an everyday reality for everyone. With Artemis, we
                aim to build a future where technology serves humanity, ensuring that every community can thrive in an
                environment of security and peace.
              </p>
            </div>

            <div>
              <h2 className="text-[24px] font-medium text-[#0A0A0A] mb-4">Our Approach</h2>
              <p className="text-[16px] font-normal text-[#A3A3A3] max-w-3xl">
                We focus on building solutions that are both innovative and practical. We combine cutting-edge AI, deep
                learning models, and real-time data to solve real-world problems. Our approach is human-centered,
                ensuring that every decision we make keeps the safety and well-being of individuals at the forefront.
              </p>
            </div>
          </div>

          {/* Team Members */}
          <div className="mb-16">
            <h2 className="text-[24px] font-medium text-[#0A0A0A] mb-8">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TeamMember
                name="Sourabh Singh"
                role="Head of AI & Product"
                bio="Sourabh is an incredible engineer who combines strong technical knowledge with a clear product vision. At Artemis, he leads the development of the platform and AI models, ensuring that every solution solves real-world problems."
                socialLinks={{
                  github: true,
                  linkedin: true,
                  twitter: true,
                }}
              />
              <TeamMember
                name="Sarah Haddad"
                role="Lead AI Engineer"
                bio="Sarah is a talented AI engineer who plays a key role in the development of Artemis. She has been responsible for creating datasets, and her most significant contribution is the development of Archer, an incredible model that is a core part of the future of our initiative."
                socialLinks={{
                  github: true,
                  linkedin: true,
                  twitter: false,
                }}
              />
              <TeamMember
                name="Tobias Adane"
                role="Founder"
                bio="Responsible for structuring AI models and giving them a clear purpose. Focused on finding the best solutions to real-world problems, ensuring every decision is human-centered. Committed to making technology serve people and solving problems that truly matter."
                socialLinks={{
                  github: true,
                  linkedin: true,
                  twitter: false,
                }}
              />
            </div>
          </div>

          {/* Join Our Team */}
          <div className="bg-white border border-[#F5F5F5] rounded-[16px] p-8 text-center">
            <h2 className="text-[24px] font-medium text-[#0A0A0A] mb-4">Join Our Team</h2>
            <p className="text-[16px] font-normal text-[#A3A3A3] mb-6 max-w-xl mx-auto">
              We're always looking for talented individuals who are passionate about using technology to make the world
              a safer place.
            </p>
            <Link
              href="/contact"
              className="px-4 py-2.5 rounded-full bg-[#2563EB] text-white text-[10px] font-medium hover:bg-[#2563EB]/90 transition-colors inline-block"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
