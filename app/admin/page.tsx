'use client'

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { isAdminUser } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { 
  Check, 
  X, 
  Eye, 
  MapPin, 
  DollarSign, 
  Bed, 
  Bath, 
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  Home,
  LogOut
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function AdminDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [pendingListings, setPendingListings] = useState<any[]>([])
  const [loadingListings, setLoadingListings] = useState(true)
  const [selectedListing, setSelectedListing] = useState<any | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [processingListing, setProcessingListing] = useState<string | null>(null)

  // Check if user is admin and redirect if not
  useEffect(() => {
    if (!loading) {
      if (!user || !isAdminUser(user.email)) {
        router.push('/')
        return
      }
    }
  }, [user, loading, router])

    // Fetch pending listings
  useEffect(() => {
    const fetchPendingListings = async () => {
      try {
        const { data, error } = await supabase
          .from('listings')
          .select(`
            *,
            profiles:user_id (
              full_name,
              email,
              university
            )
          `)
          .or('status.eq.pending,status.is.null') // Include pending and existing listings (null status)
          .order('created_at', { ascending: false })

        if (error) throw error
        setPendingListings(data || [])
      } catch (error) {
        console.error('Error fetching pending listings:', error)
      } finally {
        setLoadingListings(false)
      }
    }

    if (user && isAdminUser(user.email)) {
      fetchPendingListings()
    }
  }, [user])

  const handleApprove = async (listingId: string) => {
    setProcessingListing(listingId)
    try {
      console.log('DEBUG: Approving listing:', listingId)
      const { data, error } = await supabase
        .from('listings')
        .update({ status: 'approved' })
        .eq('id', listingId)
        .select()

      console.log('DEBUG: Approve update result:', { data, error })

      if (error) throw error

      // Remove from pending list
      setPendingListings(prev => prev.filter(listing => listing.id !== listingId))
      setSelectedListing(null)
      
      alert('Listing approved successfully!')
    } catch (error) {
      console.error('Error approving listing:', error)
      alert('Error approving listing. Please try again.')
    } finally {
      setProcessingListing(null)
    }
  }

  const handleReject = async (listingId: string) => {
    setProcessingListing(listingId)
    try {
      console.log('DEBUG: Rejecting listing:', listingId)
      const { data, error } = await supabase
        .from('listings')
        .update({ status: 'rejected' })
        .eq('id', listingId)
        .select()

      console.log('DEBUG: Reject update result:', { data, error })

      if (error) throw error

      // Remove from pending list
      setPendingListings(prev => prev.filter(listing => listing.id !== listingId))
      setSelectedListing(null)
      
      alert('Listing rejected successfully!')
    } catch (error) {
      console.error('Error rejecting listing:', error)
      alert('Error rejecting listing. Please try again.')
    } finally {
      setProcessingListing(null)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const formatDatePretty = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  // Show loading while checking auth
  if (loading || (user && !isAdminUser(user.email))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF6ED]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-[#2C3E50] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#34495E] font-medium">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user || !isAdminUser(user.email)) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#FDF6ED]">
      {/* Header */}
      <header className="bg-[#2C3E50] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">UniHabitat Admin</h1>
              <p className="text-[#FDF6ED] mt-1">Listing Review Dashboard</p>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[#2C3E50]"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-2">
            Listings Requiring Review ({pendingListings.length})
          </h2>
          <p className="text-[#34495E]">
            Review new submissions and legacy listings. Legacy listings are pre-existing listings that need approval.
          </p>
        </div>

        {loadingListings ? (
                     <div className="flex items-center justify-center py-16">
             <div className="w-8 h-8 border-2 border-[#2C3E50] border-t-transparent rounded-full animate-spin"></div>
             <span className="ml-4 text-[#34495E] text-lg">Loading listings...</span>
           </div>
        ) : pendingListings.length === 0 ? (
                     <div className="text-center py-16">
             <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
             <h3 className="text-2xl font-bold text-[#2C3E50] mb-2">All caught up!</h3>
             <p className="text-[#34495E] text-lg">No listings requiring review at the moment.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingListings.map((listing) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-[#F5E6D6] shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden"
              >
                {/* Image */}
                <div className="h-48 bg-gray-100 relative">
                  {listing.images && listing.images.length > 0 ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Home className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                                     <div className={`absolute top-2 right-2 text-white px-2 py-1 rounded-full text-xs font-semibold ${
                     listing.status === 'pending' ? 'bg-orange-500' : 'bg-blue-500'
                   }`}>
                     {listing.status === 'pending' ? 'PENDING' : 'LEGACY'}
                   </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#2C3E50] mb-2">{listing.title}</h3>
                  
                  {/* Submitter Info */}
                  <div className="flex items-center gap-2 text-sm text-[#34495E] mb-3 bg-[#F5E6D6] rounded-lg p-2">
                    <User className="w-4 h-4" />
                    <span>{listing.profiles?.full_name}</span>
                    <span>•</span>
                    <span>{listing.profiles?.university}</span>
                  </div>

                  <div className="space-y-2 text-sm text-[#34495E] mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{listing.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span>${listing.price}/month</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Bed className="w-4 h-4" />
                        <span>{listing.total_bedrooms} bed</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="w-4 h-4" />
                        <span>{listing.total_bathrooms} bath</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDatePretty(listing.move_in_date)} - {formatDatePretty(listing.move_out_date)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setSelectedListing(listing)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Review
                    </Button>
                    <Button
                      onClick={() => handleApprove(listing.id)}
                      disabled={processingListing === listing.id}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleReject(listing.id)}
                      disabled={processingListing === listing.id}
                      size="sm"
                      variant="destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detailed Review Modal */}
      <Dialog open={!!selectedListing} onOpenChange={open => !open && setSelectedListing(null)}>
        <DialogContent className="max-w-4xl w-full p-0 max-h-[90vh] overflow-y-auto">
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
                    {/* Navigation arrows */}
                    {selectedListing.images.length > 1 && currentImageIndex > 0 && (
                      <button
                        onClick={() => setCurrentImageIndex(currentImageIndex - 1)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                    )}
                    {selectedListing.images.length > 1 && currentImageIndex < selectedListing.images.length - 1 && (
                      <button
                        onClick={() => setCurrentImageIndex(currentImageIndex + 1)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    )}
                    {/* Image count */}
                    {selectedListing.images.length > 1 && (
                      <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {selectedListing.images.length}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <Home className="w-16 h-16 text-gray-400" />
                    <span className="mt-4 text-gray-500">No images available</span>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-8">
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-3xl font-bold text-[#2C3E50]">
                    Review Listing: {selectedListing.title}
                  </DialogTitle>
                </DialogHeader>

                {/* Submitter Information */}
                <div className="bg-[#F5E6D6] rounded-2xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-[#2C3E50] mb-3">Submitted by</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm text-[#34495E]">Name</span>
                      <p className="font-semibold">{selectedListing.profiles?.full_name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-[#34495E]">Email</span>
                      <p className="font-semibold">{selectedListing.profiles?.email}</p>
                    </div>
                    <div>
                      <span className="text-sm text-[#34495E]">University</span>
                      <p className="font-semibold">{selectedListing.profiles?.university}</p>
                    </div>
                  </div>
                </div>

                {/* Listing Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-lg font-semibold text-[#2C3E50] mb-4">Property Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-[#34495E]">Address</span>
                        <span className="font-semibold">{selectedListing.address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#34495E]">Type</span>
                        <span className="font-semibold capitalize">{selectedListing.sublease_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#34495E]">Monthly Rent</span>
                        <span className="font-semibold">${selectedListing.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#34495E]">Bedrooms</span>
                        <span className="font-semibold">{selectedListing.total_bedrooms} total, {selectedListing.available_bedrooms} available</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#34495E]">Bathrooms</span>
                        <span className="font-semibold">{selectedListing.total_bathrooms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#34495E]">Furnishing</span>
                        <span className="font-semibold capitalize">{selectedListing.furnishing}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[#2C3E50] mb-4">Availability</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-[#34495E]">Move-in Date</span>
                        <span className="font-semibold">{formatDatePretty(selectedListing.move_in_date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#34495E]">Move-out Date</span>
                        <span className="font-semibold">{formatDatePretty(selectedListing.move_out_date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#34495E]">Lease Type</span>
                        <span className="font-semibold capitalize">{selectedListing.lease_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#34495E]">Created</span>
                        <span className="font-semibold">{formatDatePretty(selectedListing.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <Button
                    onClick={() => handleReject(selectedListing.id)}
                    disabled={processingListing === selectedListing.id}
                    variant="destructive"
                    size="lg"
                    className="flex-1"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Reject Listing
                  </Button>
                  <Button
                    onClick={() => handleApprove(selectedListing.id)}
                    disabled={processingListing === selectedListing.id}
                    size="lg"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Approve Listing
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 