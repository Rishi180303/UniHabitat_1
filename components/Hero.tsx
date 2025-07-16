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

export default function Hero() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup')
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

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center hero-bg-pattern py-20">
      <HeroBackground />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 lg:px-8 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center w-full">
          {/* Main Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 mt-32"
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