"use client"

import { useEffect, useRef, useState } from "react"
import { SectionHeading } from "./section-heading"

interface TeamMember {
  name: string
  position: string
  image: string
  specialization?: string
}

interface TeamProps {
  title: string
  description?: string
  organization: string
  members: TeamMember[]
}

export function Team({ title, description, organization, members }: TeamProps) {
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"))
          if (entry.isIntersecting) {
            setVisibleCards((prev) => {
              if (!prev.includes(index)) {
                return [...prev, index]
              }
              return prev
            })
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    )

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card)
    })

    return () => {
      cardsRef.current.forEach((card) => {
        if (card) observer.unobserve(card)
      })
    }
  }, [members])

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-white to-white pointer-events-none" />
      
      <div className="container relative">
        {title && (
          <div className="mb-16">
            <SectionHeading
              title={title}
              description={description}
            />
          </div>
        )}

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{organization}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {members.map((member, index) => (
            <div
              key={index}
              ref={(el) => {
                cardsRef.current[index] = el
              }}
              data-index={index}
              className={`
                relative group
                transition-all duration-700 ease-out
                ${
                  visibleCards.includes(index)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-12"
                }
              `}
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              {/* Card */}
              <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                {/* Image container with gradient overlay */}
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
                  
                  {/* Placeholder avatar with initials */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
                  <div className="absolute bottom-4 left-4 w-16 h-16 bg-blue-400/20 rounded-full blur-xl" />
                </div>

                {/* Content */}
                <div className="p-6 relative">
                  <h4 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                    {member.name}
                  </h4>
                  <p className="text-sm text-blue-600 font-medium mb-2">
                    {member.position}
                  </p>
                  {member.specialization && (
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {member.specialization}
                    </p>
                  )}

                  {/* Decorative bottom accent */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </div>
              </div>

              {/* Fade effect at the top */}
              <div className="absolute -top-8 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
