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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
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
      <div className="bg-white/90 backdrop-blur-xl border-b border-[#F5E6D6] sticky top-0 z-50">
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
                  className="appearance-none bg-white/80 border border-[#F5E6D6] rounded-2xl px-4 py-2.5 pr-10 text-[#2C3E50] font-medium focus:outline-none focus:ring-2 focus:ring-[#2C3E50]/10 focus:border-[#2C3E50] transition-all duration-200"
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
                className="p-2.5 bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl hover:bg-white hover:border-slate-300 transition-all duration-200"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-slate-700" />
                ) : (
                  <Menu className="w-5 h-5 text-slate-700" />
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
            className="absolute right-0 top-0 h-full w-80 bg-white/95 backdrop-blur-xl border-l border-slate-200/50 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-slate-900">Menu</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <div className="space-y-2">
                {/* Profile Option */}
                <button
                  onClick={() => handleMenuAction('profile')}
                  className="w-full flex items-center space-x-3 p-4 rounded-2xl hover:bg-slate-50 transition-all duration-200 group"
                >
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900">Profile</p>
                    <p className="text-sm text-slate-600">Manage your account</p>
                  </div>
                </button>

                {/* Homepage Option */}
                <button
                  onClick={() => handleMenuAction('homepage')}
                  className="w-full flex items-center space-x-3 p-4 rounded-2xl hover:bg-slate-50 transition-all duration-200 group"
                >
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                    <Home className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900">Homepage</p>
                    <p className="text-sm text-slate-600">Back to landing page</p>
                  </div>
                </button>

                {/* Logout Option */}
                <button
                  onClick={() => handleMenuAction('logout')}
                  disabled={isLoggingOut}
                  className="w-full flex items-center space-x-3 p-4 rounded-2xl hover:bg-red-50 transition-all duration-200 group"
                >
                  <div className="p-2 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl">
                    <LogOut className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900">
                      {isLoggingOut ? 'Logging out...' : 'Logout'}
                    </p>
                    <p className="text-sm text-slate-600">Sign out of your account</p>
                  </div>
                </button>
              </div>

              {/* User Info */}
              {profile && (
                <div className="mt-8 p-4 bg-slate-50 rounded-2xl">
                  <p className="text-sm font-medium text-slate-600 mb-1">Signed in as</p>
                  <p className="font-semibold text-slate-900">{profile.full_name}</p>
                  <p className="text-sm text-slate-600">{user.email}</p>
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
            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-sm border border-[#F5E6D6] p-8 mb-8"
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
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-sm border border-[#F5E6D6] p-6 flex flex-col items-center justify-center min-h-[120px]">
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