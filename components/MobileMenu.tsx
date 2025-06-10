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
            : 'text-[#2C3E50] hover:bg-gray-100'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {isOpen && (
        <div className={`absolute top-20 left-0 right-0 ${
          isScrolled ? 'bg-white shadow-lg' : 'bg-white shadow-lg'
        }`}>
          <div className="container mx-auto px-4 py-4 space-y-4">
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className={`block w-full text-left transition-colors py-2 ${
                isScrolled 
                  ? 'text-gray-600 hover:text-[#2C3E50]' 
                  : 'text-[#2C3E50] hover:text-[#34495E]'
              }`}
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className={`block w-full text-left transition-colors py-2 ${
                isScrolled 
                  ? 'text-gray-600 hover:text-[#2C3E50]' 
                  : 'text-[#2C3E50] hover:text-[#34495E]'
              }`}
            >
              Contact
            </button>
            <Button 
              className={`w-full transition-all duration-300 ${
                isScrolled 
                  ? 'bg-[#2C3E50] text-white hover:bg-[#34495E]' 
                  : 'bg-[#2C3E50] text-white hover:bg-[#34495E]'
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