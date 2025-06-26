'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import HeroBackground from "./HeroBackground"
import AuthModal from "./AuthModal"
import { useState } from "react"
import { motion } from "framer-motion"
import { useAuth } from "./auth-provider"
import { supabase } from "@/lib/supabase"
import Image from "next/image"

export default function Hero() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup')
  const { user } = useAuth()

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
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <HeroBackground />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center lg:items-stretch">
          {/* Left side - Text content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left flex flex-col justify-center h-full"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-[#2C3E50] leading-tight">
                <span className="block">Find student housing</span>
                <span className="block text-[#34495E]">from real students</span>
              </h1>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-xl md:text-2xl text-gray-700 mb-12 max-w-2xl mx-auto lg:mx-0 font-medium"
            >
              The safest way to find and list off-campus housing near your university
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-[#2C3E50] to-[#34495E] text-white hover:from-[#34495E] hover:to-[#2C3E50] transition-all duration-300"
                onClick={handleOpenAuthModal}
              >
                Find Your Home
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white text-[#2C3E50] border-[#2C3E50]/20 hover:bg-[#FDF6ED] hover:text-[#34495E] transition-all duration-300"
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
          </motion.div>

          {/* Right side - Image */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center lg:justify-end h-full items-stretch"
          >
            <div className="relative w-full max-w-lg lg:max-w-xl flex flex-col h-full justify-center">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl h-full flex items-stretch">
                <Image
                  src="/images/landingpage.png"
                  alt="Student housing illustration"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                />
                {/* Subtle gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
              </div>
              {/* Floating decorative elements */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-[#2C3E50]/10 to-[#34495E]/10 rounded-full backdrop-blur-sm border border-white/20"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-br from-[#FDF6ED] to-white rounded-full shadow-lg border border-[#F5E6D6]"
              />
            </div>
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