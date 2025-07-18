'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Menu, User } from "lucide-react"
import { useAuth } from "./auth-provider"
import { supabase } from "@/lib/supabase"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"
import AuthModal from "./AuthModal"
import { motion } from "framer-motion"

interface NavigationProps {
  isScrolled: boolean
}

export default function Navigation({ isScrolled }: NavigationProps) {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const isLandingPage = pathname === '/'

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Error logging out:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode)
    setIsAuthModalOpen(true)
  }

  return (
    <motion.nav 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="flex items-center space-x-8"
    >
      {isLandingPage && (
        <>
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
        </>
      )}
      
      {user ? (
        isLandingPage ? (
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu((v) => !v)}
              className={`flex items-center justify-center w-11 h-11 rounded-full border-2 border-[#2C3E50]/10 bg-white/60 hover:bg-[#FDF6ED] shadow transition-all duration-200 focus:outline-none`}
              aria-label="Open profile menu"
            >
              <User className="w-6 h-6 text-[#2C3E50]" />
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg py-2 z-50 border border-slate-100">
                <button
                  onClick={() => { router.push('/profile'); setShowProfileMenu(false); }}
                  className="w-full text-left px-4 py-2 text-[#2C3E50] hover:bg-[#FDF6ED] rounded-t-xl transition-colors"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-b-xl transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            )}
          </div>
        ) : (
        <div className="flex items-center space-x-4">
          <span className={`${
            isScrolled 
              ? 'text-gray-600' 
              : 'text-[#2C3E50]'
          }`}>
            {user.email}
          </span>
          <Button 
            onClick={handleLogout}
            className={`transition-all duration-300 ${
              isScrolled 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
        )
      ) : (
        <Button 
          onClick={() => handleOpenAuthModal('signin')}
          className={`transition-all duration-300 px-6 py-2 rounded-xl bg-[#2C3E50] text-white font-semibold shadow hover:bg-[#34495E] focus:ring-2 focus:ring-[#2C3E50]/40 focus:outline-none ${
            isScrolled 
              ? 'text-white' 
              : 'text-white'
          }`}
          style={{ minWidth: 100 }}
        >
          Sign In
        </Button>
      )}

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </motion.nav>
  )
} 