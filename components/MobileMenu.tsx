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
        className="hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-6 w-6 text-gray-600" />
      </Button>

      {isOpen && (
        <div className="absolute top-20 left-0 right-0 bg-white border-b border-gray-100 shadow-lg">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="block w-full text-left text-gray-600 hover:text-green-600 transition-colors py-2"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left text-gray-600 hover:text-green-600 transition-colors py-2"
            >
              Contact
            </button>
            <Button className="w-full gradient-bg text-white hover:opacity-90 transition-opacity">
              Sign In
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 