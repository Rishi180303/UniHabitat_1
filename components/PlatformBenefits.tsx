import { motion } from "framer-motion"
import { MapPin, GraduationCap, Shield, Search, MessageCircle, Users } from "lucide-react"
import { useAuth } from "./auth-provider"
import { useState } from "react"
import AuthModal from "./AuthModal"

const benefits = [
  {
    icon: <GraduationCap className="w-8 h-8" />,
    title: "Students Only",
    subtitle: "Real students, real trust",
    description: "You need a .edu email to join, so everyone here is actually a student like you. No sketchy randos or fake accounts.",
    color: "from-blue-50 to-indigo-50",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "We Review Every Listing",
    subtitle: "Zero tolerance for scams",
    description: "We personally check every single listing before it goes live. If something looks off, it doesn't make it to the site.",
    color: "from-green-50 to-emerald-50",
    iconColor: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    icon: <MapPin className="w-8 h-8" />,
    title: "Distance Calculator",
    subtitle: "Know before you go",
    description: "See exactly how far a place is from campus, your dorm, or anywhere else. Walking time, driving time - we got you covered.",
    color: "from-purple-50 to-violet-50",
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    icon: <Search className="w-8 h-8" />,
    title: "Smart Search",
    subtitle: "Find exactly what you need",
    description: "Get perfect matches for your criteria, plus backup options in your area. No more scrolling through irrelevant listings.",
    color: "from-amber-50 to-orange-50",
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50"
  },
  {
    icon: <MessageCircle className="w-8 h-8" />,
    title: "Direct Messaging",
    subtitle: "Coming soon",
    description: "Chat directly with other students without sharing your personal info until you're ready. Keep conversations organized and safe.",
    color: "from-emerald-50 to-teal-50",
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
    comingSoon: true
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Roommate Matching",
    subtitle: "Coming soon", 
    description: "Find compatible roommates based on your lifestyle, study habits, and living preferences. No more living with strangers.",
    color: "from-pink-50 to-rose-50",
    iconColor: "text-pink-600",
    bgColor: "bg-pink-50",
    comingSoon: true
  }
]

export default function PlatformBenefits() {
  const { user } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup')

  const handleStartSearching = () => {
    if (user) {
      // If logged in, redirect to dashboard
      window.location.href = '/dashboard'
    } else {
      // If not logged in, open signup modal
      setAuthMode('signup')
      setIsAuthModalOpen(true)
    }
  }

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false)
  }

  return (
    <section className="py-24 bg-[#FDF6ED]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#2C3E50] mb-6">
            Why You Should Choose UniHabitat
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Student housing made simple, safe, and trustworthy
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative h-full flex"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              {/* Card Content */}
              <div className="relative bg-white rounded-3xl p-8 shadow-sm border border-gray-100 group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300 w-full flex flex-col">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl ${benefit.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={benefit.iconColor}>
                    {benefit.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-[#2C3E50] group-hover:text-[#34495E] transition-colors duration-300 mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                    {benefit.subtitle}
                  </p>
                  <p className="text-gray-600 leading-relaxed flex-1">
                    {benefit.comingSoon ? (
                      <>
                        <span className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold mb-2">
                          🚀 Coming Soon
                        </span>
                        <br />
                        {benefit.description}
                      </>
                    ) : (
                      benefit.description
                    )}
                  </p>
                </div>

                {/* Hover Effect */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-[#2C3E50] to-[#34495E] rounded-3xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Find Your Perfect Student Home?
            </h3>
            <p className="text-lg text-gray-200 mb-6">
              Join thousands of students who've already found their ideal housing through UniHabitat
            </p>
            <div className="flex justify-center">
              <button 
                onClick={handleStartSearching}
                className="bg-white text-[#2C3E50] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300"
              >
                Start Searching
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={handleCloseAuthModal}
        initialMode={authMode}
      />
    </section>
  )
} 