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
      description: "Post your room or apartment in minutes with our simple form. Include photos, pricing, and availability details. Your listing will be submitted for review to ensure safety.",
      emoji: "📝"
    },
    {
      title: "Admin Review & Approval",
      description: "Our team personally reviews every listing to verify legitimacy and prevent scams. This keeps our platform safe and trustworthy for all students.",
      emoji: "🛡️"
    },
    {
      title: "Go Live & Connect",
      description: "Once approved, your listing goes live for students to discover. Manage your listings and respond to inquiries directly through provided contact info.",
      emoji: "✨"
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
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#2C3E50] mb-6">
            How UniHabitat Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            A simple, safe, and modern way to find student housing
          </p>

          {/* Modern Toggle Selector */}
          <div className="flex justify-center">
            <div className="relative bg-white p-2 rounded-2xl shadow-lg border border-gray-100 inline-flex">
              <motion.div
                className="absolute top-2 bottom-2 bg-gradient-to-r from-[#2C3E50] to-[#34495E] rounded-xl shadow-md"
                initial={false}
                animate={{
                  left: activeTab === "renters" ? "8px" : "50%",
                  width: activeTab === "renters" ? "calc(50% - 4px)" : "calc(50% - 4px)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              <button
                onClick={() => setActiveTab("renters")}
                className={`relative z-10 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  activeTab === "renters"
                    ? "text-white"
                    : "text-[#2C3E50] hover:text-[#34495E]"
                }`}
              >
                For Renters
              </button>
              <button
                onClick={() => setActiveTab("listers")}
                className={`relative z-10 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  activeTab === "listers"
                    ? "text-white"
                    : "text-[#2C3E50] hover:text-[#34495E]"
                }`}
              >
                For Listers
              </button>
            </div>
          </div>
        </motion.div>

        {/* Steps Grid */}
        <div ref={containerRef} className="max-w-7xl mx-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-3 gap-8"
          >
            {currentSteps.map((step, index) => (
              <motion.div
                key={`${activeTab}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.15,
                  ease: "easeOut"
                }}
                className="relative group"
              >
                {/* Connection Line */}
                {index < currentSteps.length - 1 && (
                  <div className="hidden md:block absolute top-20 left-full w-8 h-0.5 bg-gradient-to-r from-[#2C3E50]/20 to-transparent z-0" />
                )}

                {/* Card */}
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-50 group-hover:border-[#2C3E50]/10 h-full flex flex-col">
                  {/* Step Number Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2C3E50] to-[#34495E] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl font-bold text-white">{index + 1}</span>
                    </div>
                    <div className="text-4xl opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                      {step.emoji}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[#2C3E50] mb-4 group-hover:text-[#34495E] transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {step.description}
                    </p>
                  </div>

                  {/* Decorative Element */}
                  <div className="mt-6 h-1 w-12 bg-gradient-to-r from-[#2C3E50] to-[#34495E] rounded-full opacity-60 group-hover:w-20 transition-all duration-500" />
                </div>
              </motion.div>
            ))}
          </motion.div>


        </div>
      </div>
    </section>
  )
} 