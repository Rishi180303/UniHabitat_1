'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export default function Navigation() {
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
        className="text-gray-600 hover:text-green-600 transition-colors"
      >
        How It Works
      </button>
      <button 
        onClick={() => scrollToSection('contact')}
        className="text-gray-600 hover:text-green-600 transition-colors"
      >
        Contact
      </button>
      <Button className="gradient-bg text-white hover:opacity-90 transition-opacity">
        Sign In
      </Button>
    </nav>
  )
} 