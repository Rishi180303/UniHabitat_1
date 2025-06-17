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
      title: "Mobile-First Design",
      description: "Browse and manage listings on any device with our responsive, mobile-optimized platform.",
      emoji: "📱"
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
            Why Choose UniHabitat? <span className="text-3xl">🏠</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're making student housing simple, safe, and stress-free with our unique features
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-12">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl">{feature.emoji}</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#2C3E50]">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 