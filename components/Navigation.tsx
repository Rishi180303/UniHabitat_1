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
            ? 'text-gray-600 hover:text-[#2C3E50]' 
            : 'text-[#2C3E50] hover:text-[#34495E]'
        }`}
      >
        How It Works
      </button>
      <button 
        onClick={() => scrollToSection('contact')}
        className={`transition-colors ${
          isScrolled 
            ? 'text-gray-600 hover:text-[#2C3E50]' 
            : 'text-[#2C3E50] hover:text-[#34495E]'
        }`}
      >
        Contact
      </button>
      <Button 
        className={`transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#2C3E50] text-white hover:bg-[#34495E]' 
            : 'bg-[#2C3E50] text-white hover:bg-[#34495E]'
        }`}
      >
        Sign In
      </Button>
    </nav>
  )
} 