'use client'

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { checkUserProfile, hasCompleteProfile } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { User, Search, Filter, Heart, MapPin, Bed, Bath, Square, Menu, Home, LogOut, X, Calendar, ChevronLeft, ChevronRight, Users, Car, Footprints } from "lucide-react"
import { supabase } from "@/lib/supabase"
import LocationSearchInput from '@/components/LocationSearchInput'
import DatePicker from '@/components/ui/date-picker'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import FilterDialog, { FilterState } from '@/components/FilterDialog'
import ListingCard from '@/components/ListingCard'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog'
import { useRef } from "react"
import { createClient } from "@supabase/supabase-js"

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
  const [filterState, setFilterState] = useState<FilterState>({
    subleaseType: '',
    furnishing: '',
    leaseType: '',
    totalBedrooms: '',
    availableBedrooms: '',
    totalBathrooms: '',
    minPrice: '',
    maxPrice: '',
  })
  const [strictMatches, setStrictMatches] = useState<any[]>([])
  const [areaMatches, setAreaMatches] = useState<any[]>([])
  const [loadingListings, setLoadingListings] = useState(false)
  const [selectedListing, setSelectedListing] = useState<any | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const defaultLocationSet = useRef(false)
  const [listerEmail, setListerEmail] = useState<string | null>(null)
  const [listerName, setListerName] = useState<string | null>(null)
  const [currentUserName, setCurrentUserName] = useState<string | null>(null)
  const [walkingDistance, setWalkingDistance] = useState<string | null>(null)
  const [drivingDistance, setDrivingDistance] = useState<string | null>(null)
  const [calculatingDistance, setCalculatingDistance] = useState(false)
  const [customDistanceLocation, setCustomDistanceLocation] = useState('')

  // Add Supabase client (client-side)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

  // Fetch lister email and name when selectedListing changes
  useEffect(() => {
    async function fetchListerInfo() {
      if (selectedListing && selectedListing.user_id) {
        const { data, error } = await supabase
          .from("profiles")
          .select("email, full_name")
          .eq("id", selectedListing.user_id)
          .single()
        if (!error && data) {
          setListerEmail(data.email || null)
          setListerName(data.full_name || null)
        } else {
          setListerEmail(null)
          setListerName(null)
        }
      } else {
        setListerEmail(null)
        setListerName(null)
      }
    }
    fetchListerInfo()
  }, [selectedListing])

  // Reset image index when a new listing is selected
  useEffect(() => {
    setCurrentImageIndex(0)
  }, [selectedListing])

  // Set default location when listing is selected
  useEffect(() => {
    if (selectedListing && profile?.university_area) {
      setCustomDistanceLocation(profile.university_area)
      // Clear previous results when switching listings
      setWalkingDistance(null)
      setDrivingDistance(null)
      calculateDistance(selectedListing.address, profile.university_area)
    } else {
      setWalkingDistance(null)
      setDrivingDistance(null)
      setCalculatingDistance(false)
      setCustomDistanceLocation('')
    }
  }, [selectedListing, profile?.university_area])

  // Fetch current user's name on mount
  useEffect(() => {
    async function fetchCurrentUserName() {
      if (user?.id) {
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single()
        if (!error && data?.full_name) {
          setCurrentUserName(data.full_name)
        } else {
          setCurrentUserName(null)
        }
      }
    }
    fetchCurrentUserName()
  }, [user])

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

  // Set default location from profile.university_area only once
  useEffect(() => {
    if (
      profile &&
      profile.university_area &&
      !location &&
      !defaultLocationSet.current
    ) {
      setLocation(profile.university_area)
      defaultLocationSet.current = true
    }
  }, [profile])

  // Fetch all listings on mount or when location changes
  useEffect(() => {
    const fetchListings = async () => {
      setLoadingListings(true)
      let query = supabase.from('listings').select('*')
      let city = ''
      let state = ''
      if (location) {
        // Extract city and state (first two parts before commas)
        const parts = location.split(',').map(p => p.trim())
        city = parts[0] || ''
        state = parts[1] || ''
      }
      const { data, error } = await query.order('created_at', { ascending: false })
      let areaListings = data || []
      if (city && state) {
        // Only show listings where address includes both city and state (case-insensitive)
        areaListings = areaListings.filter(listing => {
          const addr = (listing.address || '').toLowerCase()
          return addr.includes(city.toLowerCase()) && addr.includes(state.toLowerCase())
        })
      }
      // Filter out listings where user_id matches current user
      areaListings = user ? areaListings.filter(listing => listing.user_id !== user.id) : areaListings

      // Strict filter matching
      const strictMatches = areaListings.filter(listing => {
        // Move-in date: user's move-in should be within listing's availability window
        if (moveInDate && listing.move_in_date && listing.move_out_date) {
          const userMoveIn = new Date(moveInDate)
          const listingMoveIn = new Date(listing.move_in_date)
          const listingMoveOut = new Date(listing.move_out_date)
          if (userMoveIn < listingMoveIn || userMoveIn > listingMoveOut) return false
        }
        // Move-out date: user's move-out should be within listing's availability window
        if (moveOutDate && listing.move_in_date && listing.move_out_date) {
          const userMoveOut = new Date(moveOutDate)
          const listingMoveIn = new Date(listing.move_in_date)
          const listingMoveOut = new Date(listing.move_out_date)
          if (userMoveOut < listingMoveIn || userMoveOut > listingMoveOut) return false
        }
        // If both dates are set, ensure move-out is after move-in
        if (moveInDate && moveOutDate) {
          const userMoveIn = new Date(moveInDate)
          const userMoveOut = new Date(moveOutDate)
          if (userMoveOut <= userMoveIn) return false
        }
        // Sublease type
        if (filterState.subleaseType && listing.sublease_type !== filterState.subleaseType) return false
        // Furnishing
        if (filterState.furnishing && listing.furnishing !== filterState.furnishing) return false
        // Lease type
        if (filterState.leaseType && listing.lease_type !== filterState.leaseType) return false
        // Bedrooms
        if (filterState.totalBedrooms && String(listing.total_bedrooms) !== filterState.totalBedrooms) return false
        if (filterState.availableBedrooms && String(listing.available_bedrooms) !== filterState.availableBedrooms) return false
        // Bathrooms
        if (filterState.totalBathrooms && String(listing.total_bathrooms) !== filterState.totalBathrooms) return false
        // Price
        if (filterState.minPrice && Number(listing.price) < Number(filterState.minPrice)) return false
        if (filterState.maxPrice && Number(listing.price) > Number(filterState.maxPrice)) return false
        return true
      })
      // Area matches are those in area but not strict matches
      const areaMatches = areaListings.filter(listing => !strictMatches.includes(listing))
      setStrictMatches(strictMatches)
      setAreaMatches(areaMatches)
      setLoadingListings(false)
    }
    fetchListings()
  }, [location, user, moveInDate, moveOutDate, filterState])

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

  const handleFilterChange = (newFilter: FilterState) => setFilterState(newFilter)
  const handleFilterApply = () => {/* TODO: implement filter logic */}
  const handleFilterClear = () => setFilterState({
    subleaseType: '',
    furnishing: '',
    leaseType: '',
    totalBedrooms: '',
    availableBedrooms: '',
    totalBathrooms: '',
    minPrice: '',
    maxPrice: '',
  })

  // Calculate distance from listing to user's location (both walking and driving)
  const calculateDistance = async (listingAddress: string, fromLocation: string) => {
    if (!listingAddress || !fromLocation || !window.google) return
    
    setCalculatingDistance(true)
    // Don't clear existing results to prevent layout jump
    
    try {
      const service = new window.google.maps.DistanceMatrixService()
      
      // Calculate driving distance
      service.getDistanceMatrix({
        origins: [listingAddress],
        destinations: [fromLocation],
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.IMPERIAL,
        avoidHighways: false,
        avoidTolls: false,
      }, (response, status) => {
        if (status === 'OK' && response?.rows?.[0]?.elements?.[0]?.status === 'OK') {
          const distance = response.rows[0].elements[0].distance?.text
          const duration = response.rows[0].elements[0].duration?.text
          if (distance && duration) {
            setDrivingDistance(`${distance} • ${duration}`)
          } else {
            setDrivingDistance('Unavailable')
          }
        } else {
          setDrivingDistance('Unavailable')
        }
      })
      
      // Calculate walking distance
      service.getDistanceMatrix({
        origins: [listingAddress],
        destinations: [fromLocation],
        travelMode: window.google.maps.TravelMode.WALKING,
        unitSystem: window.google.maps.UnitSystem.IMPERIAL,
      }, (response, status) => {
        if (status === 'OK' && response?.rows?.[0]?.elements?.[0]?.status === 'OK') {
          const distance = response.rows[0].elements[0].distance?.text
          const duration = response.rows[0].elements[0].duration?.text
          if (distance && duration) {
            setWalkingDistance(`${distance} • ${duration}`)
          } else {
            setWalkingDistance('Unavailable')
          }
        } else {
          setWalkingDistance('Unavailable')
        }
        setCalculatingDistance(false)
      })
      
    } catch (error) {
      console.error('Distance calculation error:', error)
      setWalkingDistance('Unavailable')
      setDrivingDistance('Unavailable')
      setCalculatingDistance(false)
    }
  }

  // Handle manual distance calculation
  const handleCalculateDistance = () => {
    if (selectedListing && customDistanceLocation.trim()) {
      calculateDistance(selectedListing.address, customDistanceLocation.trim())
    }
  }

  // Add a date formatting helper
  const formatDatePretty = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  // Generate the email body template
  const emailBody = encodeURIComponent(
    `Hi${listerName ? ` ${listerName}` : ''},\n\n` +
    `My name is ${currentUserName || 'a UniHabitat user'} and I found your listing on UniHabitat. I’m interested in your ${selectedListing?.sublease_type === 'private-bedroom' ? 'Private Bedroom' : selectedListing?.sublease_type === 'entire-place' ? 'Entire Place' : 'unit'} available from ${formatDatePretty(selectedListing?.move_in_date)} to ${formatDatePretty(selectedListing?.move_out_date)}.\n\n` +
    `Could you please share more details or let me know if it’s still available?\n\n` +
    `Thank you!\n${currentUserName || ''}`
  )

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
      <header className="bg-[#FDF6ED]/90 backdrop-blur-md pt-4 pb-3">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => router.push('/')}
                className="text-2xl font-bold text-[#2C3E50] tracking-tight hover:text-[#34495E] transition-colors cursor-pointer"
              >
                UniHabitat
              </button>
            </div>

            {/* Navigation & Profile */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.push('/dashboard/list')}
                className="text-base font-medium text-[#2C3E50] hover:text-[#34495E] transition-colors"
              >
                List your place
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 bg-white shadow hover:bg-[#F5E6D6] transition-all"
              >
                {profile?.avatar_url ? (
                  <Image src={profile.avatar_url} alt="Profile" width={32} height={32} className="rounded-full object-cover" />
                ) : (
                  <Menu className="w-6 h-6 text-[#2C3E50]" />
                )}
              </button>
            </div>
          </div>

          {/* Housing Search Interface */}
          <div className="bg-[#FDF6ED] py-2">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
              <div className="max-w-4xl mx-auto">
                {/* Compact Search Bar */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 px-2 py-1 flex items-center gap-2 min-h-[72px] relative z-[200]">
                  {/* Filters Button */}
                  <div className="flex-shrink-0 flex flex-col items-center justify-center h-full">
                    <FilterDialog
                      filter={filterState}
                      onChange={handleFilterChange}
                      onApply={handleFilterApply}
                      onClear={handleFilterClear}
                    />
                  </div>

                  {/* Location */}
                  <div className="flex-1 min-w-0 px-2 flex flex-col justify-center gap-1">
                    <span className="text-xs font-semibold text-[#2C3E50] leading-tight pl-3">Location</span>
                    <LocationSearchInput
                      value={location}
                      onSelect={(address, latLng) => setLocation(address)}
                      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
                      className="w-full h-9 text-sm text-[#8A939B] bg-white rounded-xl px-3 py-1 shadow-none border-none focus:ring-0 focus:border-none placeholder-[#8A939B]"
                    />
                  </div>

                  {/* Divider */}
                  <div className="w-px h-8 bg-gray-100 mx-1"></div>

                  {/* Move-in Date */}
                  <div className="flex-1 min-w-0 px-2 flex flex-col justify-center gap-1">
                    <span className="text-xs font-semibold text-[#2C3E50] leading-tight mt-[-4px]">Move-in</span>
                    <div className="flex items-center w-full h-[28px]">
                      <DatePicker
                        type="move-in"
                        value={moveInDate}
                        onChange={setMoveInDate}
                        placeholder="Add move-in"
                        className="w-full text-sm text-[#8A939B] placeholder-[#8A939B] bg-transparent border-0 focus:outline-none leading-tight p-0 h-full"
                      />
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="w-px h-8 bg-gray-100 mx-1"></div>

                  {/* Move-out Date */}
                  <div className="flex-1 min-w-0 px-2 flex flex-col justify-center gap-1">
                    <span className="text-xs font-semibold text-[#2C3E50] leading-tight mt-[-4px]">Move-out</span>
                    <div className="flex items-center w-full h-[28px]">
                      <DatePicker
                        type="move-out"
                        value={moveOutDate}
                        onChange={setMoveOutDate}
                        placeholder="Add move-out"
                        minDate={moveInDate}
                        className="w-full text-sm text-[#8A939B] placeholder-[#8A939B] bg-transparent border-0 focus:outline-none leading-tight p-0 h-full"
                      />
                    </div>
                  </div>

                  {/* Search Button */}
                  <div className="flex-shrink-0 flex flex-col items-center justify-center h-full">
                    <button
                      type="submit"
                      className="w-9 h-9 bg-[#2C3E50] hover:bg-[#34495E] text-white rounded-full transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
                      style={{ fontSize: '1.1rem' }}
                    >
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
        <Dialog open={!!selectedListing} onOpenChange={open => !open && setSelectedListing(null)}>
          <DialogContent className="max-w-3xl w-full p-0">
            {selectedListing && (
              <div className="flex flex-col">
                {/* Image Section */}
                <div className="w-full h-80 bg-gray-100 rounded-t-lg overflow-hidden relative flex items-center justify-center">
                  {selectedListing.images && selectedListing.images.length > 0 ? (
                    <>
                      <img
                        src={selectedListing.images[currentImageIndex]}
                        alt={selectedListing.title}
                        className="w-full h-full object-contain"
                      />
                      {/* Left arrow */}
                      {selectedListing.images.length > 1 && currentImageIndex > 0 && (
                        <button
                          onClick={() => setCurrentImageIndex(currentImageIndex - 1)}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                      )}
                      {/* Right arrow */}
                      {selectedListing.images.length > 1 && currentImageIndex < selectedListing.images.length - 1 && (
                        <button
                          onClick={() => setCurrentImageIndex(currentImageIndex + 1)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      )}
                      {/* Image count badge */}
                      {selectedListing.images.length > 1 && (
                        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {currentImageIndex + 1} / {selectedListing.images.length}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <span className="text-8xl select-none">🏠</span>
                      <span className="mt-4 text-sm text-gray-500 text-center px-4">(No images available for this listing)</span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-8">
                  {/* Header */}
                  <div className="mb-8">
                    <DialogTitle className="text-3xl font-bold text-[#2C3E50] mb-3">
                      {listerName && selectedListing?.sublease_type ? (
                        `${listerName}'s ${selectedListing.sublease_type === 'private-bedroom' ? 'Private Bedroom' : selectedListing.sublease_type === 'entire-place' ? 'Entire Place' : 'Unit'}`
                      ) : (
                        selectedListing?.title
                      )}
                    </DialogTitle>
                    <DialogDescription className="text-lg text-[#34495E]">
                      {selectedListing.address}
                      {selectedListing.unit_number && `, Unit ${selectedListing.unit_number}`}
                    </DialogDescription>
                  </div>

                  {/* Price Highlight */}
                  <div className="bg-gradient-to-r from-[#FDF6ED] to-[#F5E6D6] rounded-2xl p-6 mb-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#34495E] mb-1">Monthly Rent</p>
                        <p className="text-3xl font-bold text-[#2C3E50]">${selectedListing.price}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-[#34495E] mb-1">Available</p>
                        <p className="text-lg font-semibold text-green-600">
                          {selectedListing.available_bedrooms} of {selectedListing.total_bedrooms} bedrooms
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-[#2C3E50] mb-4 flex items-center">
                          <Home className="w-5 h-5 mr-2 text-[#34495E]" />
                          Property Details
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="font-medium text-[#34495E] flex items-center"><Home className="w-4 h-4 mr-1 text-[#BFAE9B]" />Type</span>
                            <span className="text-[#2C3E50] capitalize">{selectedListing.sublease_type === 'private-bedroom' ? 'Private Bedroom' : selectedListing.sublease_type === 'entire-place' ? 'Entire Place' : selectedListing.sublease_type}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="font-medium text-[#34495E] flex items-center"><Bed className="w-4 h-4 mr-1 text-[#BFAE9B]" />Furnishing</span>
                            <span className="text-[#2C3E50] capitalize">{selectedListing.furnishing?.replace('-', ' ')}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="font-medium text-[#34495E] flex items-center"><Calendar className="w-4 h-4 mr-1 text-[#BFAE9B]" />Lease Type</span>
                            <span className="text-[#2C3E50] capitalize">{selectedListing.lease_type?.replace('-', ' ')}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="font-medium text-[#34495E] flex items-center"><Bath className="w-4 h-4 mr-1 text-[#BFAE9B]" />Bathrooms</span>
                            <span className="text-[#2C3E50]">{selectedListing.total_bathrooms}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-[#2C3E50] mb-4 flex items-center">
                          <Calendar className="w-5 h-5 mr-2 text-[#34495E]" />
                          Availability
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="font-medium text-[#34495E] flex items-center"><Calendar className="w-4 h-4 mr-1 text-[#BFAE9B]" />Move-in Date</span>
                            <span className="text-[#2C3E50]">{formatDatePretty(selectedListing.move_in_date)}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="font-medium text-[#34495E] flex items-center"><Calendar className="w-4 h-4 mr-1 text-[#BFAE9B]" />Move-out Date</span>
                            <span className="text-[#2C3E50]">{formatDatePretty(selectedListing.move_out_date)}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="font-medium text-[#34495E] flex items-center"><Users className="w-4 h-4 mr-1 text-[#BFAE9B]" />Available Bedrooms</span>
                            <span className="text-[#2C3E50]">{selectedListing.available_bedrooms} of {selectedListing.total_bedrooms}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Distance Calculator Section */}
                  <div className="bg-gradient-to-r from-[#FDF6ED] to-[#F5E6D6] rounded-2xl p-6 mb-8 border border-[#E8D5C4]">
                    <h3 className="text-lg font-semibold text-[#2C3E50] mb-4 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-[#34495E]" />
                      Calculate Distance
                    </h3>
                    
                    {/* Distance Input and Calculate Button */}
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-[#34495E] mb-2">
                            From location (e.g., your dorm, library, workplace)
                          </label>
                          <LocationSearchInput
                            value={customDistanceLocation}
                            onSelect={(address, latLng) => {
                              setCustomDistanceLocation(address)
                              // Auto-calculate distance when location is selected from dropdown
                              if (selectedListing && address.trim()) {
                                setTimeout(() => calculateDistance(selectedListing.address, address), 100)
                              }
                            }}
                            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
                            className="px-4 py-3 border border-[#E8D5C4] rounded-xl focus:ring-2 focus:ring-[#2C3E50] focus:border-transparent bg-white text-[#2C3E50] placeholder-[#34495E]/60"
                          />
                        </div>
                        <div className="flex-shrink-0 flex items-end">
                          <button
                            onClick={handleCalculateDistance}
                            disabled={calculatingDistance || !customDistanceLocation.trim()}
                            className="px-6 py-3 bg-[#2C3E50] text-white rounded-xl font-semibold hover:bg-[#34495E] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {calculatingDistance ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Calculating
                              </>
                            ) : (
                              <>
                                <MapPin className="w-4 h-4" />
                                {(walkingDistance || drivingDistance) ? 'Recalculate' : 'Calculate'}
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                      
                      {/* Distance Result */}
                      {(walkingDistance || drivingDistance || calculatingDistance) && (
                        <div className="bg-white rounded-xl p-4 border border-[#E8D5C4] shadow-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              {calculatingDistance ? (
                                <div className="flex items-center gap-3">
                                  <div className="w-4 h-4 border-2 border-[#2C3E50] border-t-transparent rounded-full animate-spin"></div>
                                  <span className="text-base font-medium text-[#34495E]">Calculating distance...</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-8">
                                  {walkingDistance && (
                                    <div className="flex items-center gap-2">
                                      <Footprints className="w-4 h-4 text-[#34495E]" />
                                      <span className="text-base font-medium text-[#2C3E50]">{walkingDistance}</span>
                                    </div>
                                  )}
                                  {drivingDistance && (
                                    <div className="flex items-center gap-2">
                                      <Car className="w-4 h-4 text-[#34495E]" />
                                      <span className="text-base font-medium text-[#2C3E50]">{drivingDistance}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                              <p className="text-sm text-[#34495E] mt-1">
                                From {customDistanceLocation.split(',')[0] || 'your location'}
                              </p>
                            </div>
                            <div className="flex-shrink-0 ml-4">
                              <div className="w-12 h-12 bg-[#FDF6ED] rounded-xl border border-[#E8D5C4] flex items-center justify-center shadow-sm">
                                <MapPin className="w-6 h-6 text-[#2C3E50]" />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col items-center gap-4 pt-6 border-t border-gray-100">
                    {listerEmail ? (
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${listerEmail}&su=${encodeURIComponent('Inquiry about your UniHabitat listing')}&body=${emailBody}`}
                        className="bg-[#2C3E50] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#34495E] transition-colors duration-200 text-center w-60 text-lg"
                        style={{ display: 'inline-block' }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {`Contact${listerName ? ` ${listerName}` : ' Lister'}`}
                      </a>
                    ) : (
                      <button
                        className="bg-[#2C3E50] text-white py-3 px-6 rounded-xl font-semibold opacity-50 cursor-not-allowed w-60 text-lg"
                        disabled
                      >
                        Contact Lister
                      </button>
                    )}
                    {!listerEmail && (
                      <span className="text-xs text-red-500 mt-2">Lister email could not be fetched.</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
          {loadingListings ? (
            <div className="w-full flex justify-center items-center min-h-[200px]">
              <div className="w-8 h-8 border-2 border-[#2C3E50] border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-4 text-[#34495E] text-lg">Loading listings...</span>
            </div>
          ) : (
            <>
              {strictMatches.length > 0 ? (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
                  {strictMatches.map(listing => (
                    <DialogTrigger asChild key={listing.id}>
                      {/* Pass full listing to setSelectedListing so user_id is available */}
                      <div onClick={() => setSelectedListing(listing)}>
                        <ListingCard listing={{
                          id: listing.id,
                          title: listing.title,
                          location: listing.address || '',
                          price: listing.price,
                          image: (listing.images && listing.images.length > 0) ? listing.images[0] : '/public/images/landingpage.png',
                          type: listing.sublease_type || 'Unit',
                          available: listing.available !== false,
                          rating: listing.rating || 5,
                          move_in_date: listing.move_in_date,
                          move_out_date: listing.move_out_date,
                          total_bedrooms: listing.total_bedrooms,
                          total_bathrooms: listing.total_bathrooms,
                        }} />
                      </div>
                    </DialogTrigger>
                  ))}
                </div>
              ) : (
                <>
                  <div className="text-center w-full mb-8">
                    <span className="text-[#BFAE9B] text-lg font-semibold block mb-2">Oops, no matching listing found for your filters.</span>
                    {areaMatches.length > 0 && (
                      <span className="text-[#34495E] text-base">Here are some other listings in your area:</span>
                    )}
                  </div>
                  {areaMatches.length > 0 ? (
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
                      {areaMatches.map(listing => (
                        <DialogTrigger asChild key={listing.id}>
                          {/* Pass full listing to setSelectedListing so user_id is available */}
                          <div onClick={() => setSelectedListing(listing)}>
                            <ListingCard listing={{
                              id: listing.id,
                              title: listing.title,
                              location: listing.address || '',
                              price: listing.price,
                              image: (listing.images && listing.images.length > 0) ? listing.images[0] : '/public/images/landingpage.png',
                              type: listing.sublease_type || 'Unit',
                              available: listing.available !== false,
                              rating: listing.rating || 5,
                              move_in_date: listing.move_in_date,
                              move_out_date: listing.move_out_date,
                              total_bedrooms: listing.total_bedrooms,
                              total_bathrooms: listing.total_bathrooms,
                            }} />
                          </div>
                        </DialogTrigger>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center w-full">
                      <span className="text-[#BFAE9B] text-lg">No listings to display yet.</span>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </Dialog>
      </div>
    </div>
  )
} 