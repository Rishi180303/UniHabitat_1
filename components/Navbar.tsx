'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState } from "react"
import AuthModal from "./AuthModal"

export default function Navbar() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')

  const handleOpenAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode)
    setIsAuthModalOpen(true)
  }

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false)
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-white">
              UniHabitat
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/search" className="text-white/80 hover:text-white transition-colors">
                Find Housing
              </Link>
              <Link href="/list" className="text-white/80 hover:text-white transition-colors">
                List Property
              </Link>
              <Button 
                size="lg"
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                onClick={() => handleOpenAuthModal('signin')}
              >
                Sign In
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-white">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        initialMode={authMode}
      />
    </>
  )
} 