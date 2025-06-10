'use client'

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState } from 'react'

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsOpen(false)
    }
  }

  return (
    <div className="md:hidden">
      <Button 
        variant="ghost" 
        className="text-white hover:bg-white/10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {isOpen && (
        <div className="absolute top-20 left-0 right-0 glass-effect">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="block w-full text-left text-white/80 hover:text-white transition-colors py-2"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left text-white/80 hover:text-white transition-colors py-2"
            >
              Contact
            </button>
            <Button className="w-full glass-effect text-white hover:bg-white/20 transition-all duration-300">
              Sign In
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 