'use client'

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { checkUserProfile, hasCompleteProfile } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { User, Search, Filter, Heart, MapPin, Bed, Bath, Square, Menu, Home, LogOut, X } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [filter, setFilter] = useState('all')
  const [profile, setProfile] = useState<any>(null)
  const [checkingProfile, setCheckingProfile] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

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
      {/* Header */}
      <div className="bg-[#FDF6ED]/90 backdrop-blur-xl border-b border-[#F5E6D6] sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-[#2C3E50]">Dashboard</h1>
              <p className="text-[#34495E] mt-1 font-medium">Find your perfect student housing</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="appearance-none bg-[#FDF6ED]/80 border border-[#F5E6D6] rounded-2xl px-4 py-2.5 pr-10 text-[#2C3E50] font-medium focus:outline-none focus:ring-2 focus:ring-[#2C3E50]/10 focus:border-[#2C3E50] transition-all duration-200 shadow-md"
                >
                  <option value="all">All Listings</option>
                  <option value="available">Available</option>
                  <option value="rented">Rented</option>
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BFAE9B] pointer-events-none" />
              </div>
              
              {/* Hamburger Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2.5 bg-[#FDF6ED]/70 backdrop-blur-sm border border-[#F5E6D6] rounded-2xl hover:bg-[#FDF6ED] hover:border-[#E8D5C4] transition-all duration-200 shadow-md"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-[#2C3E50]" />
                ) : (
                  <Menu className="w-5 h-5 text-[#2C3E50]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

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
        {/* Welcome Message */}
        {profile && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#FDF6ED]/90 backdrop-blur-sm rounded-3xl shadow-xl border border-[#F5E6D6] p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-[#2C3E50] mb-2">
              Welcome back, {profile.full_name}! 👋
            </h2>
            <p className="text-[#34495E] font-medium">
              {profile.university} • {profile.major} • Class of {profile.graduation_year}
            </p>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-[#FDF6ED]/90 backdrop-blur-sm rounded-3xl shadow-xl border border-[#F5E6D6] p-6 flex flex-col items-center justify-center min-h-[120px]">
            <span className="text-[#BFAE9B] text-lg">No listing data yet</span>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="flex flex-col items-center justify-center py-16">
          <span className="text-[#BFAE9B] text-lg">No listings to display yet.</span>
        </div>
      </div>
    </div>
  )
} 