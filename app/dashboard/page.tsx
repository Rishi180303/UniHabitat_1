'use client'

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { checkUserProfile, hasCompleteProfile } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { User, Search, Filter, Heart, MapPin, Bed, Bath, Square, Menu, Home, LogOut, X } from "lucide-react"
import { supabase } from "@/lib/supabase"

// Dummy data for listings
const dummyListings = [
  {
    id: 1,
    title: "Cozy Studio Near Campus",
    price: "$1,200",
    location: "Berkeley, CA",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 450,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    available: true
  },
  {
    id: 2,
    title: "Modern 2BR Apartment",
    price: "$2,100",
    location: "Oakland, CA",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 850,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
    available: true
  },
  {
    id: 3,
    title: "Luxury Penthouse Suite",
    price: "$3,500",
    location: "San Francisco, CA",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1200,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
    available: false
  },
  {
    id: 4,
    title: "Student-Friendly 1BR",
    price: "$1,800",
    location: "Palo Alto, CA",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 600,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
    available: true
  },
  {
    id: 5,
    title: "Family Home with Garden",
    price: "$2,800",
    location: "Mountain View, CA",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1400,
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop",
    available: true
  },
  {
    id: 6,
    title: "Downtown Loft",
    price: "$2,300",
    location: "San Jose, CA",
    bedrooms: 2,
    bathrooms: 1,
    sqft: 900,
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop",
    available: true
  },
  {
    id: 7,
    title: "Beachfront Condo",
    price: "$4,200",
    location: "Santa Cruz, CA",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1100,
    image: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=400&h=300&fit=crop",
    available: false
  },
  {
    id: 8,
    title: "Historic Victorian",
    price: "$3,100",
    location: "Alameda, CA",
    bedrooms: 4,
    bathrooms: 2,
    sqft: 1800,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
    available: true
  }
]

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

  const filteredListings = filter === 'all' 
    ? dummyListings 
    : dummyListings.filter(listing => 
        filter === 'available' ? listing.available : !listing.available
      )

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-slate-600 mt-1 font-medium">Find your perfect student housing</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                  className="appearance-none bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl px-4 py-2.5 pr-10 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              >
                <option value="all">All Listings</option>
                <option value="available">Available</option>
                <option value="rented">Rented</option>
              </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
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
            className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-200/50 p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Welcome back, {profile.full_name}! 👋
            </h2>
            <p className="text-slate-600 font-medium">
              {profile.university} • {profile.major} • Class of {profile.graduation_year}
            </p>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-200/50 p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Total Listings</p>
                <p className="text-2xl font-bold text-slate-900">{dummyListings.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-200/50 p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Available</p>
                <p className="text-2xl font-bold text-slate-900">{dummyListings.filter(l => l.available).length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-200/50 p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Rented</p>
                <p className="text-2xl font-bold text-slate-900">{dummyListings.filter(l => !l.available).length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-200/50 p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Saved</p>
                <p className="text-2xl font-bold text-slate-900">0</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredListings.map((listing, index) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white/70 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-200/50 overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
            >
              <div className="relative">
                <img 
                  src={listing.image} 
                  alt={listing.title}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {!listing.available && (
                  <div className="absolute top-4 right-4 bg-rose-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm">
                    Rented
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200">
                    <Heart className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-slate-900 text-lg leading-tight">{listing.title}</h3>
                </div>
                <div className="flex items-center mb-4">
                  <p className="text-2xl font-bold text-blue-600">${listing.price}</p>
                  <span className="text-slate-500 ml-1">/month</span>
                </div>
                <div className="flex items-center mb-4 text-slate-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">{listing.location}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <div className="flex items-center">
                    <Bed className="w-4 h-4 mr-1" />
                    <span>{listing.bedrooms}</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-4 h-4 mr-1" />
                    <span>{listing.bathrooms}</span>
                  </div>
                  <div className="flex items-center">
                    <Square className="w-4 h-4 mr-1" />
                  <span>{listing.sqft} sqft</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
} 