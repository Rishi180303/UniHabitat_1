'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Menu, User, X, LogOut, Home } from "lucide-react"
import { useAuth } from "./auth-provider"
import { supabase } from "@/lib/supabase"
import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import AuthModal from "./AuthModal"
import { motion } from "framer-motion"
import Image from 'next/image'
import { checkUserProfile } from '@/lib/utils'

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
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [profile, setProfile] = useState<any>(null)

  const isLandingPage = pathname === '/'

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        const userProfile = await checkUserProfile(user.id)
        setProfile(userProfile)
      } else {
        setProfile(null)
      }
    }

    loadProfile()
  }, [user])

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
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 bg-white shadow hover:bg-[#F5E6D6] transition-all"
              aria-label="Open profile menu"
            >
              {profile?.avatar_url ? (
                <Image src={profile.avatar_url} alt="Profile" width={32} height={32} className="rounded-full object-cover" />
              ) : (
                <User className="w-7 h-7 text-[#2C3E50]" />
              )}
            </button>
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

      {/* Hamburger Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="absolute right-4 top-4 w-64 bg-white/95 backdrop-blur-xl rounded-2xl border border-[#F5E6D6] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#2C3E50]">Menu</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-[#F5E6D6] transition-colors"
                >
                  <X className="w-4 h-4 text-[#2C3E50]" />
                </button>
              </div>

              <div className="space-y-1">
                {/* Dashboard Option */}
                <button
                  onClick={() => { router.push('/dashboard'); setIsMenuOpen(false); }}
                  className="w-full flex items-center space-x-3 p-2.5 rounded-lg hover:bg-[#F5E6D6] transition-all duration-200 text-left"
                >
                  <Home className="w-4 h-4 text-[#2C3E50]" />
                  <span className="font-medium text-[#2C3E50]">Dashboard</span>
                </button>

                {/* Profile Option */}
                <button
                  onClick={() => { router.push('/profile'); setIsMenuOpen(false); }}
                  className="w-full flex items-center space-x-3 p-2.5 rounded-lg hover:bg-[#F5E6D6] transition-all duration-200 text-left"
                >
                  <User className="w-4 h-4 text-[#2C3E50]" />
                  <span className="font-medium text-[#2C3E50]">Profile</span>
                </button>

                {/* Logout Option */}
                <button
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  disabled={isLoading}
                  className="w-full flex items-center space-x-3 p-2.5 rounded-lg hover:bg-red-50 transition-all duration-200 text-left"
                >
                  <LogOut className="w-4 h-4 text-red-600" />
                  <span className="font-medium text-red-600">
                    {isLoading ? 'Logging out...' : 'Logout'}
                  </span>
                </button>
              </div>

              {/* User Info */}
              {profile && (
                <div className="mt-4 pt-3 border-t border-[#F5E6D6]">
                  <p className="text-xs text-[#34495E] mb-1">Signed in as</p>
                  <p className="font-semibold text-[#2C3E50] text-sm">{profile.full_name}</p>
                  <p className="text-xs text-[#34495E] truncate">{user?.email}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </motion.nav>
  )
} 