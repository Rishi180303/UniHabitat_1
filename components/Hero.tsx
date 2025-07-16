'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import HeroBackground from "./HeroBackground"
import AuthModal from "./AuthModal"
import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useAuth } from "./auth-provider"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import { Plus, X } from "lucide-react"

export default function Hero() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup')
  const [expandedCard, setExpandedCard] = useState<number | null>(null)
  const { user } = useAuth()

  // Scroll progress for parallax effect
  const { scrollY } = useScroll()
  const imageScale = useTransform(scrollY, [0, 500], [1.3, 1])
  const imageOpacity = useTransform(scrollY, [0, 300], [1, 0.8])
  const imageY = useTransform(scrollY, [0, 500], [0, 50])

  const handleOpenAuthModal = async () => {
    // Check if user is already logged in
    if (user) {
      // If logged in, redirect to dashboard
      window.location.href = '/dashboard'
      return
    }

    // For now, default to signup mode
    // In a real app, you might want to check if the email exists
    // but for simplicity, we'll let users choose signin/signup
    setAuthMode('signup')
    setIsAuthModalOpen(true)
  }

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false)
  }

  const handleCardToggle = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index)
  }

  const featureCards = [
    {
      title: "Real Students, Real Homes",
      description: "Every listing comes from a fellow student, so you know you're connecting with people who understand your needs and campus life."
    },
    {
      title: "List or Find in Minutes",
      description: "Skip the hassle. Our platform makes it easy to post your place or discover your next home, all in just a few clicks."
    },
    {
      title: "Details That Matter",
      description: "See the info you care about, like photos, pricing, and availability, so you can make the right move with confidence."
    },
    {
      title: "In-App Messaging",
      description: "Coming Soon: Chat directly with landlords and roommates through our secure messaging system. No more phone tag or missed connections."
    },
    {
      title: "Smart Matching",
      description: "Coming Soon: Our AI-powered system will match you with the perfect housing based on your preferences, budget, and lifestyle."
    }
  ]

  return (
    <section className="relative w-full h-[100vh] flex items-center justify-center overflow-hidden hero-bg-pattern">
      <HeroBackground />

      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 w-full max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center w-full">
          {/* Main Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 mt-20"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-[#2C3E50] leading-tight flex flex-col items-center">
              <span className="block">Find student housing</span>
              <span className="block relative mt-3">
                <span className="text-[#34495E]">from real students</span>
                <motion.span
                  layoutId="underline"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="absolute left-0 -bottom-1 h-1 bg-[#34495E] rounded-full"
                  style={{ width: '100%' }}
                />
              </span>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-2xl md:text-3xl text-gray-700 mb-16 max-w-3xl mx-auto font-medium"
          >
            The safest way to find and list off-campus housing near your university
          </motion.p>
      
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
          >
            <Button 
              size="lg" 
              className="bg-[#2C3E50] text-white hover:bg-[#34495E] transition-all duration-300 text-lg px-8 py-4"
              onClick={handleOpenAuthModal}
            >
              Find Your Home
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white text-[#2C3E50] border-[#2C3E50]/20 hover:bg-[#FDF6ED] hover:text-[#34495E] transition-all duration-300 text-lg px-8 py-4"
              onClick={() => {
                if (user) {
                  window.location.href = '/dashboard/list'
                } else {
                  setAuthMode('signup')
                  setIsAuthModalOpen(true)
                }
              }}
            >
              List Your Unit
            </Button>
          </motion.div>

          {/* Feature Cards Row */}
          <div className="flex flex-col gap-8 justify-center items-center mt-6 w-full max-w-6xl mx-auto">
            {/* Top Row - 3 Cards */}
            <div className="flex gap-6 justify-center items-stretch w-full">
              {featureCards.slice(0, 3).map((card, index) => (
                <motion.div 
                  key={index}
                  className="flex-1 min-w-[220px] max-w-[280px] bg-white rounded-3xl shadow-lg border border-[#F5E6D6] p-0 flex flex-col items-center relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
                  animate={{ 
                    height: expandedCard === index ? "auto" : "120px",
                    minHeight: expandedCard === index ? "200px" : "120px"
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="p-7 flex flex-col items-center w-full relative">
                    {/* Toggle Button */}
                    <button
                      onClick={() => handleCardToggle(index)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[#2C3E50]/20 text-[#2C3E50] flex items-center justify-center hover:bg-[#2C3E50]/30 transition-all duration-200 z-10 backdrop-blur-sm"
                    >
                      {expandedCard === index ? (
                        <X className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </button>
                    
                    {/* Title */}
                    <h4 className="font-bold text-lg text-[#2C3E50] mb-2 mt-2 text-center">
                      {card.title}
                    </h4>
                    
                    {/* Description - Animated */}
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ 
                        opacity: expandedCard === index ? 1 : 0,
                        height: expandedCard === index ? "auto" : 0
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="text-sm text-[#34495E] text-center">
                        {card.description}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Bottom Row - 2 Cards Centered */}
            <div className="flex gap-6 justify-center items-stretch w-full">
              {featureCards.slice(3, 5).map((card, index) => (
                <motion.div 
                  key={index + 3}
                  className="flex-1 min-w-[220px] max-w-[280px] bg-white rounded-3xl shadow-lg border border-[#F5E6D6] p-0 flex flex-col items-center relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
                  animate={{ 
                    height: expandedCard === (index + 3) ? "auto" : "120px",
                    minHeight: expandedCard === (index + 3) ? "200px" : "120px"
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="p-7 flex flex-col items-center w-full relative">
                    {/* Toggle Button */}
                    <button
                      onClick={() => handleCardToggle(index + 3)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[#2C3E50]/20 text-[#2C3E50] flex items-center justify-center hover:bg-[#2C3E50]/30 transition-all duration-200 z-10 backdrop-blur-sm"
                    >
                      {expandedCard === (index + 3) ? (
                        <X className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </button>
                    
                    {/* Title */}
                    <h4 className="font-bold text-lg text-[#2C3E50] mb-2 mt-2 text-center">
                      {card.title}
                    </h4>
                    
                    {/* Description - Animated */}
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ 
                        opacity: expandedCard === (index + 3) ? 1 : 0,
                        height: expandedCard === (index + 3) ? "auto" : 0
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="text-sm text-[#34495E] text-center">
                        {card.description}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={handleCloseAuthModal}
        initialMode={authMode}
      />
    </section>
  )
} 