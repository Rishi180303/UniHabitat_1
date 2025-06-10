'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

interface NavigationProps {
  isScrolled: boolean
}

export default function Navigation({ isScrolled }: NavigationProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className="hidden md:flex items-center space-x-8">
      <button 
        onClick={() => scrollToSection('how-it-works')}
        className={`transition-colors ${
          isScrolled 
            ? 'text-gray-600 hover:text-green-600' 
            : 'text-white/80 hover:text-white'
        }`}
      >
        How It Works
      </button>
      <button 
        onClick={() => scrollToSection('contact')}
        className={`transition-colors ${
          isScrolled 
            ? 'text-gray-600 hover:text-green-600' 
            : 'text-white/80 hover:text-white'
        }`}
      >
        Contact
      </button>
      <Button 
        className={`transition-all duration-300 ${
          isScrolled 
            ? 'gradient-bg text-white hover:opacity-90' 
            : 'glass-effect text-white hover:bg-white/20'
        }`}
      >
        Sign In
      </Button>
    </nav>
  )
} 