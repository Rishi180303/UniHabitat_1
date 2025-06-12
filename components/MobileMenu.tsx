'use client'

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState } from 'react'
import { useAuth } from "./auth-provider"
import { supabase } from "@/lib/supabase"
import { useRouter, usePathname } from "next/navigation"
import AuthModal from "./AuthModal"

interface MobileMenuProps {
  isScrolled: boolean
}

export default function MobileMenu({ isScrolled }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')

  const isLandingPage = pathname === '/'

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsOpen(false)
    }
  }

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await supabase.auth.signOut()
      router.push('/')
      setIsOpen(false)
    } catch (error) {
      console.error('Error logging out:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode)
    setIsAuthModalOpen(true)
    setIsOpen(false)
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
            {isLandingPage && (
              <>
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
              </>
            )}
            
            {!isLandingPage && user && (
              <>
                <div className="py-2 text-gray-600 border-t border-gray-200">
                  {user.email}
                </div>
                <Button 
                  onClick={handleLogout}
                  className="w-full bg-red-500 text-white hover:bg-red-600"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging out...' : 'Logout'}
                </Button>
              </>
            )}

            {isLandingPage && !user && (
              <div className="space-y-3 pt-2 border-t border-gray-200">
                <Button 
                  onClick={() => handleOpenAuthModal('signin')}
                  className="w-full bg-[#2C3E50] text-white hover:bg-[#34495E]"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => handleOpenAuthModal('signup')}
                  variant="outline"
                  className="w-full border-[#2C3E50] text-[#2C3E50] hover:bg-[#2C3E50] hover:text-white"
                >
                  Create Account
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  )
} 