'use client'

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState } from 'react'

interface MobileMenuProps {
  isScrolled: boolean
}

export default function MobileMenu({ isScrolled }: MobileMenuProps) {
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
        className={`transition-colors ${
          isScrolled 
            ? 'text-gray-600 hover:bg-gray-100' 
            : 'text-white hover:bg-white/10'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {isOpen && (
        <div className={`absolute top-20 left-0 right-0 ${
          isScrolled ? 'bg-white shadow-lg' : 'glass-effect'
        }`}>
          <div className="container mx-auto px-4 py-4 space-y-4">
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className={`block w-full text-left transition-colors py-2 ${
                isScrolled 
                  ? 'text-gray-600 hover:text-green-600' 
                  : 'text-white/80 hover:text-white'
              }`}
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className={`block w-full text-left transition-colors py-2 ${
                isScrolled 
                  ? 'text-gray-600 hover:text-green-600' 
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Contact
            </button>
            <Button 
              className={`w-full transition-all duration-300 ${
                isScrolled 
                  ? 'gradient-bg text-white hover:opacity-90' 
                  : 'glass-effect text-white hover:bg-white/20'
              }`}
            >
              Sign In
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 