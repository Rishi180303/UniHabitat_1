'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import HeroBackground from "./HeroBackground"
import AuthModal from "./AuthModal"
import { useState } from "react"
import { motion } from "framer-motion"
import { useAuth } from "./auth-provider"

export default function Hero() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { user } = useAuth()

  const text = "Find Your Next Home on Campus"
  const words = text.split(" ")

  const handleOpenAuthModal = () => {
    setIsAuthModalOpen(true)
  }

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false)
  }

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <HeroBackground />

      <div className="relative z-10 text-center px-4">
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {words.map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              className="text-4xl md:text-6xl font-bold text-[#2C3E50] inline-block"
            >
              {word}
            </motion.span>
          ))}
        </div>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto"
        >
          The trusted platform for students to find and list off-campus housing
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
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
            onClick={handleOpenAuthModal}
          >
            List Your Unit
          </Button>
        </motion.div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={handleCloseAuthModal}
        initialMode="signup"
      />
    </section>
  )
} 