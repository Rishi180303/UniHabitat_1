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
        className="text-white/80 hover:text-white transition-colors"
      >
        How It Works
      </button>
      <button 
        onClick={() => scrollToSection('contact')}
        className="text-white/80 hover:text-white transition-colors"
      >
        Contact
      </button>
      <Button className="glass-effect text-white hover:bg-white/20 transition-all duration-300">
        Sign In
      </Button>
    </nav>
  )
} 