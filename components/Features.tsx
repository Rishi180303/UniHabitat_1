'use client'

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"

export default function Features() {
  const [activeTab, setActiveTab] = useState("renters")

  const rentersSteps = [
    {
      title: "Search for Housing",
      description: "Browse verified listings from fellow students near your campus. Filter by location, price, and amenities to find your perfect match.",
      emoji: "🔍"
    },
    {
      title: "View Listing Details",
      description: "See comprehensive property information including photos, pricing, availability dates, and contact details for each listing.",
      emoji: "📋"
    },
    {
      title: "Contact Listers Directly",
      description: "Reach out to student landlords through their provided contact information to schedule viewings and discuss rental terms.",
      emoji: "📞"
    }
  ]

  const listersSteps = [
    {
      title: "Create Your Listing",
      description: "Post your room or apartment in minutes with our simple form. Include photos, pricing, and availability details to attract tenants.",
      emoji: "📝"
    },
    {
      title: "Manage Your Listings",
      description: "Edit, update, or remove your listings anytime from your profile dashboard. Keep your property information current.",
      emoji: "⚙️"
    },
    {
      title: "Handle Inquiries",
      description: "Respond to student inquiries through your provided contact information. Schedule viewings and finalize agreements directly.",
      emoji: "💬"
    }
  ]

  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-50px" })

  const currentSteps = activeTab === "renters" ? rentersSteps : listersSteps

  return (
    <section id="how-it-works" className="py-24 bg-[#FDF6ED]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#2C3E50] mb-6">
            How UniHabitat Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            A simple, safe, and modern way to find student housing
          </p>

          {/* Toggle Button */}
          <div className="flex justify-center">
            <div className="bg-white/50 p-1 rounded-full shadow-sm">
              <button
                onClick={() => setActiveTab("renters")}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === "renters"
                    ? "bg-[#2C3E50] text-white shadow-md"
                    : "text-[#2C3E50] hover:text-[#34495E]"
                }`}
              >
                Renters
              </button>
              <button
                onClick={() => setActiveTab("listers")}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === "listers"
                    ? "bg-[#2C3E50] text-white shadow-md"
                    : "text-[#2C3E50] hover:text-[#34495E]"
                }`}
              >
                Listers
              </button>
            </div>
          </div>
        </motion.div>

        <div ref={containerRef} className="max-w-3xl mx-auto flex flex-col gap-24">
          {currentSteps.map((step, index) => (
            <motion.div
              key={`${activeTab}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.2,
                ease: "easeOut"
              }}
              className="flex flex-col md:flex-row items-center md:items-start gap-8 relative"
            >
              {/* Step number and vertical line */}
              <div className="flex flex-col items-center md:items-start min-w-[60px]">
                <div className="w-12 h-12 rounded-full bg-[#2C3E50] flex items-center justify-center text-white text-2xl font-bold mb-2 shadow-md">
                  {index + 1}
                </div>
                {index < currentSteps.length - 1 && (
                  <div className="hidden md:block w-1 h-24 bg-[#2C3E50]/10 mx-auto my-2 rounded-full" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-[#2C3E50] mb-3">
                  {step.title}
                </h3>
                <p className="text-lg text-[#34495E] max-w-xl mx-auto md:mx-0">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 