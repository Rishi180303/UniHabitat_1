'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import HeroBackground from "./HeroBackground"
import AuthModal from "./AuthModal"
import { useState } from "react"

export default function Hero() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <HeroBackground />
      
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-[#2C3E50] mb-6">
          Find Your Next Home on Campus
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto">
          The trusted platform for students to find and list off-campus housing
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-[#2C3E50] to-[#34495E] text-white hover:from-[#34495E] hover:to-[#2C3E50] transition-all duration-300"
            onClick={() => setIsAuthModalOpen(true)}
          >
            Find Your Home
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-white text-[#2C3E50] border-[#2C3E50]/20 hover:bg-[#FDF6ED] hover:text-[#34495E] transition-all duration-300"
            onClick={() => setIsAuthModalOpen(true)}
          >
            List Your Unit
          </Button>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </section>
  )
} 