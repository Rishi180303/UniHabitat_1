'use client'

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { checkUserProfile, hasCompleteProfile } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { User, Search, Filter, Heart, MapPin, Bed, Bath, Square, Menu, Home, LogOut, X } from "lucide-react"
import { supabase } from "@/lib/supabase"
import LocationSearchInput from '@/components/LocationSearchInput'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [filter, setFilter] = useState('all')
  const [profile, setProfile] = useState<any>(null)
  const [checkingProfile, setCheckingProfile] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [moveInDate, setMoveInDate] = useState('')
  const [moveOutDate, setMoveOutDate] = useState('')
  const [location, setLocation] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
      return
    }

    if (user && checkingProfile) {
      checkUserProfile(user.id).then((userProfile) => {
        setProfile(userProfile)
        setCheckingProfile(false)
        
        // If user doesn't have a complete profile, redirect to setup
        if (!hasCompleteProfile(userProfile)) {
          router.push('/profile/setup')
        }
      })
    }
  }, [user, loading, router, checkingProfile])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Error logging out:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleMenuAction = (action: 'profile' | 'homepage' | 'logout') => {
    setIsMenuOpen(false)
    
    switch (action) {
      case 'profile':
        router.push('/profile')
        break
      case 'homepage':
        router.push('/')
        break
      case 'logout':
        handleLogout()
        break
    }
  }

  // Show loading while checking profile
  if (loading || checkingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF6ED]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-[#2C3E50] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#34495E] font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // If no user, redirect (handled by useEffect)
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#FDF6ED]">
      {/* Modern Dashboard Header */}
      <header className="sticky top-0 z-50 bg-[#FDF6ED]/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-8 h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#2C3E50] tracking-tight">UniHabitat</span>
          </div>

          {/* Pill-shaped Search Bar */}
          <form className="flex items-center bg-white rounded-full shadow px-4 py-2 gap-6 w-full max-w-2xl mx-8 border border-[#F5E6D6]">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#2C3E50]" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#34495E] leading-none">Location</span>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="Add location"
                  className="bg-transparent outline-none text-sm font-medium text-[#2C3E50] placeholder-[#BFAE9B] min-w-[120px]"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[#34495E] leading-none">Move-in</span>
              <input
                type="date"
                value={moveInDate}
                onChange={e => setMoveInDate(e.target.value)}
                placeholder="Add move-in"
                className="bg-transparent outline-none text-sm font-medium text-[#2C3E50] placeholder-[#BFAE9B] min-w-[100px]"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[#34495E] leading-none">Move-out</span>
              <input
                type="date"
                value={moveOutDate}
                onChange={e => setMoveOutDate(e.target.value)}
                placeholder="Add move-out"
                className="bg-transparent outline-none text-sm font-medium text-[#2C3E50] placeholder-[#BFAE9B] min-w-[100px]"
              />
            </div>
            <button type="submit" className="ml-2 bg-gradient-to-r from-[#2C3E50] to-[#34495E] hover:from-[#34495E] hover:to-[#2C3E50] rounded-full p-2 flex items-center justify-center transition-colors shadow">
              <Search className="w-5 h-5 text-white" />
            </button>
          </form>

          {/* Navigation & Hamburger/Profile */}
          <div className="flex items-center gap-6">
            <button className="text-base font-medium text-[#2C3E50] hover:text-[#34495E] transition-colors">List your place</button>
            {/* Hamburger/Profile menu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="ml-2 flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 bg-white shadow hover:bg-[#F5E6D6] transition-all"
            >
              {profile?.avatar_url ? (
                <Image src={profile.avatar_url} alt="Profile" width={32} height={32} className="rounded-full object-cover" />
              ) : (
                <Menu className="w-6 h-6 text-[#2C3E50]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hamburger Menu Overlay */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          onClick={() => setIsMenuOpen(false)}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 h-full w-80 bg-[#FDF6ED]/95 backdrop-blur-xl border-l border-[#F5E6D6] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-[#2C3E50]">Menu</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-[#F5E6D6] transition-colors shadow-sm"
                >
                  <X className="w-5 h-5 text-[#2C3E50]" />
                </button>
              </div>

              <div className="space-y-2">
                {/* Profile Option */}
                <button
                  onClick={() => handleMenuAction('profile')}
                  className="w-full flex items-center space-x-3 p-4 rounded-2xl hover:bg-[#F5E6D6] transition-all duration-200 group shadow-md hover:shadow-lg"
                >
                  <div className="p-2 bg-gradient-to-br from-[#2C3E50] to-[#34495E] rounded-xl shadow-md">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-[#2C3E50]">Profile</p>
                    <p className="text-sm text-[#34495E]">Manage your account</p>
                  </div>
                </button>

                {/* Homepage Option */}
                <button
                  onClick={() => handleMenuAction('homepage')}
                  className="w-full flex items-center space-x-3 p-4 rounded-2xl hover:bg-[#F5E6D6] transition-all duration-200 group shadow-md hover:shadow-lg"
                >
                  <div className="p-2 bg-gradient-to-br from-[#34495E] to-[#2C3E50] rounded-xl shadow-md">
                    <Home className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-[#2C3E50]">Homepage</p>
                    <p className="text-sm text-[#34495E]">Back to landing page</p>
                  </div>
                </button>

                {/* Logout Option */}
                <button
                  onClick={() => handleMenuAction('logout')}
                  disabled={isLoggingOut}
                  className="w-full flex items-center space-x-3 p-4 rounded-2xl hover:bg-red-50 transition-all duration-200 group shadow-md hover:shadow-lg"
                >
                  <div className="p-2 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl shadow-md">
                    <LogOut className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-[#2C3E50]">
                      {isLoggingOut ? 'Logging out...' : 'Logout'}
                    </p>
                    <p className="text-sm text-[#34495E]">Sign out of your account</p>
                  </div>
                </button>
              </div>

              {/* User Info */}
              {profile && (
                <div className="mt-8 p-4 bg-[#F5E6D6] rounded-2xl shadow-md">
                  <p className="text-sm font-medium text-[#34495E] mb-1">Signed in as</p>
                  <p className="font-semibold text-[#2C3E50]">{profile.full_name}</p>
                  <p className="text-sm text-[#34495E]">{user.email}</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Listings Grid */}
        <div className="w-full flex flex-wrap justify-center gap-10">
          {/* TODO: Render filtered listings here. For now, show empty state. */}
          <span className="text-[#BFAE9B] text-lg">No listings to display yet.</span>
        </div>
      </div>
    </div>
  )
} 