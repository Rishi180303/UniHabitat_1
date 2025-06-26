'use client'

import { motion } from "framer-motion"

export default function Features() {
  const features = [
    {
      title: "Verified .edu Users",
      description: "All listings are verified by students with valid .edu email addresses, ensuring a safe and trustworthy community.",
      emoji: "🎓"
    },
    {
      title: "Easy Listing Creation",
      description: "Create and manage your property listings in minutes with our intuitive interface and smart templates.",
      emoji: "✨"
    },
    {
      title: "Community-Driven Safety",
      description: "Our platform is built on student trust. Users can rate, review, and report listings to keep the community safe and reliable for everyone.",
      emoji: "🛡️"
    }
  ]

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
            How UniHabitat Works <span className="text-3xl">🔑</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A simple, safe, and modern way to find student housing
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto flex flex-col gap-24">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              className="flex flex-col md:flex-row items-center md:items-start gap-8 relative"
            >
              {/* Step number and vertical line */}
              <div className="flex flex-col items-center md:items-start min-w-[60px]">
                <div className="w-12 h-12 rounded-full bg-[#2C3E50] flex items-center justify-center text-white text-2xl font-bold mb-2 shadow-md">
                  {index + 1}
                </div>
                {index < features.length - 1 && (
                  <div className="hidden md:block w-1 h-24 bg-[#2C3E50]/10 mx-auto my-2 rounded-full" />
                )}
              </div>
              {/* Emoji/Icon and content */}
              <div className="flex-1 text-center md:text-left">
                <div className="text-4xl mb-4">{feature.emoji}</div>
                <h3 className="text-2xl md:text-3xl font-bold text-[#2C3E50] mb-3">
                  {feature.title}
                </h3>
                <p className="text-lg text-[#34495E] max-w-xl mx-auto md:mx-0">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 