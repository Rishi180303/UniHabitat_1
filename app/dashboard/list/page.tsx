'use client'

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Upload, Home, Bed, Bath, Calendar, MapPin, DollarSign, Camera, Check, ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { createListing, getListingById, updateListing } from '@/lib/listings'
import { useAuth } from '@/components/auth-provider'
import LocationSearchInput from '@/components/LocationSearchInput'

const steps = [
  { id: 1, title: "What you're subleasing", icon: Home, description: "Choose what you're offering" },
  { id: 2, title: "Furnishing details", icon: Bed, description: "Let guests know what to expect" },
  { id: 3, title: "Lease type", icon: Calendar, description: "Sublease or new lease" },
  { id: 4, title: "Property details", icon: Home, description: "Bedrooms and bathrooms" },
  { id: 5, title: "Availability", icon: Calendar, description: "When it's available" },
  { id: 6, title: "Location", icon: MapPin, description: "Address and unit details" },
  { id: 7, title: "Pricing", icon: DollarSign, description: "Monthly rent amount" },
  { id: 8, title: "Photos & media", icon: Camera, description: "Add photos and videos" },
  { id: 9, title: "Review & submit", icon: Check, description: "Final review and publish" }
]

export default function ListUnit() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const editMode = searchParams.get('edit') === '1';
  const listingId = searchParams.get('listingId');
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: What you're subleasing
    subleaseType: '', // 'private-bedroom' | 'entire-place'
    
    // Step 2: Furnishing
    furnishing: '', // 'move-in-ready' | 'furnished' | 'unfurnished'
    
    // Step 3: Lease type
    leaseType: '', // 'sublease' | 'new-lease'
    
    // Step 4: Property details
    totalBedrooms: '',
    availableBedrooms: '',
    totalBathrooms: '',
    
    // Step 5: Availability
    moveInDate: '',
    moveOutDate: '',
    
    // Step 6: Location
    address: '',
    unitNumber: '',
    
    // Step 7: Pricing
    monthlyRent: '',
    
    // Step 8: Media
    photos: [] as File[],
    video: null as File | null,
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Prefill form in edit mode
  useEffect(() => {
    if (editMode && listingId) {
      getListingById(listingId).then(listing => {
        if (listing) {
          setFormData({
            subleaseType: listing.sublease_type || '',
            furnishing: listing.furnishing || '',
            leaseType: listing.lease_type || '',
            totalBedrooms: listing.total_bedrooms?.toString() || '',
            availableBedrooms: listing.available_bedrooms?.toString() || '',
            totalBathrooms: listing.total_bathrooms?.toString() || '',
            moveInDate: listing.move_in_date || '',
            moveOutDate: listing.move_out_date || '',
            address: listing.address || '',
            unitNumber: listing.unit_number || '',
            monthlyRent: listing.price?.toString() || '',
            photos: [], // You may want to handle existing images differently
            video: null, // You may want to handle existing video differently
          })
        }
      })
    }
  }, [editMode, listingId])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files)
      setFormData(prev => ({ ...prev, photos: [...prev.photos, ...newPhotos] }))
    }
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, video: e.target.files![0] }))
    }
  }

  const removePhoto = (index: number) => {
    setFormData(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handlePublishListing = async () => {
    if (!user) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const listing = {
        user_id: user.id,
        title: `${formData.subleaseType === 'private-bedroom' ? 'Private Bedroom' : 'Entire Place'} near campus`,
        description: '',
        address: formData.address,
        unit_number: formData.unitNumber,
        university: '',
        price: Number(formData.monthlyRent),
        sublease_type: formData.subleaseType,
        furnishing: formData.furnishing,
        lease_type: formData.leaseType,
        total_bedrooms: Number(formData.totalBedrooms),
        available_bedrooms: Number(formData.availableBedrooms),
        total_bathrooms: Number(formData.totalBathrooms),
        move_in_date: formData.moveInDate,
        move_out_date: formData.moveOutDate,
        amenities: [],
        images: [],
        video_url: '',
        created_at: new Date().toISOString(),
      }
      if (editMode && listingId) {
        // Update existing listing
        await updateListing({ ...listing, id: listingId })
      } else {
        // Create new listing
        await createListing(listing)
      }
      setSubmitSuccess(true)
      setTimeout(() => router.push('/dashboard'), 1500)
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to save listing')
      console.error('DEBUG: Supabase insert/update error', err)
    } finally {
      setSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-[#2C3E50] mb-2">What are you subleasing?</h3>
              <p className="text-[#34495E] mb-6">Just your bedroom, or your entire apartment?</p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => handleInputChange('subleaseType', 'private-bedroom')}
                className={`w-full p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                  formData.subleaseType === 'private-bedroom'
                    ? 'border-[#2C3E50] bg-[#F5E6D6] shadow-lg'
                    : 'border-[#F5E6D6] bg-[#FDF6ED] hover:border-[#E8D5C4] hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-semibold text-[#2C3E50] mb-2">Private bedroom</h4>
                    <p className="text-[#34495E]">Rent out just your bedroom in a shared apartment</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    formData.subleaseType === 'private-bedroom' 
                      ? 'border-[#2C3E50] bg-[#2C3E50]' 
                      : 'border-[#BFAE9B]'
                  }`}>
                    {formData.subleaseType === 'private-bedroom' && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleInputChange('subleaseType', 'entire-place')}
                className={`w-full p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                  formData.subleaseType === 'entire-place'
                    ? 'border-[#2C3E50] bg-[#F5E6D6] shadow-lg'
                    : 'border-[#F5E6D6] bg-[#FDF6ED] hover:border-[#E8D5C4] hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-semibold text-[#2C3E50] mb-2">Entire place</h4>
                    <p className="text-[#34495E]">Rent out the complete apartment or house</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    formData.subleaseType === 'entire-place' 
                      ? 'border-[#2C3E50] bg-[#2C3E50]' 
                      : 'border-[#BFAE9B]'
                  }`}>
                    {formData.subleaseType === 'entire-place' && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
              </button>
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-[#2C3E50] mb-2">Is it furnished?</h3>
              <p className="text-[#34495E] mb-6">Let your guest know what to expect</p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => handleInputChange('furnishing', 'move-in-ready')}
                className={`w-full p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                  formData.furnishing === 'move-in-ready'
                    ? 'border-[#2C3E50] bg-[#F5E6D6] shadow-lg'
                    : 'border-[#F5E6D6] bg-[#FDF6ED] hover:border-[#E8D5C4] hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-semibold text-[#2C3E50] mb-2">Move-in ready</h4>
                    <p className="text-[#34495E]">Fully equipped with essentials included</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    formData.furnishing === 'move-in-ready' 
                      ? 'border-[#2C3E50] bg-[#2C3E50]' 
                      : 'border-[#BFAE9B]'
                  }`}>
                    {formData.furnishing === 'move-in-ready' && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleInputChange('furnishing', 'furnished')}
                className={`w-full p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                  formData.furnishing === 'furnished'
                    ? 'border-[#2C3E50] bg-[#F5E6D6] shadow-lg'
                    : 'border-[#F5E6D6] bg-[#FDF6ED] hover:border-[#E8D5C4] hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-semibold text-[#2C3E50] mb-2">Furnished</h4>
                    <p className="text-[#34495E]">Includes furniture shown in photos</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    formData.furnishing === 'furnished' 
                      ? 'border-[#2C3E50] bg-[#2C3E50]' 
                      : 'border-[#BFAE9B]'
                  }`}>
                    {formData.furnishing === 'furnished' && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleInputChange('furnishing', 'unfurnished')}
                className={`w-full p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                  formData.furnishing === 'unfurnished'
                    ? 'border-[#2C3E50] bg-[#F5E6D6] shadow-lg'
                    : 'border-[#F5E6D6] bg-[#FDF6ED] hover:border-[#E8D5C4] hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-semibold text-[#2C3E50] mb-2">Unfurnished</h4>
                    <p className="text-[#34495E]">Empty space, no furniture provided</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    formData.furnishing === 'unfurnished' 
                      ? 'border-[#2C3E50] bg-[#2C3E50]' 
                      : 'border-[#BFAE9B]'
                  }`}>
                    {formData.furnishing === 'unfurnished' && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
              </button>
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-[#2C3E50] mb-2">What type of lease will this be?</h3>
              <p className="text-[#34495E] mb-6">Is this a sublease or new lease?</p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => handleInputChange('leaseType', 'sublease')}
                className={`w-full p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                  formData.leaseType === 'sublease'
                    ? 'border-[#2C3E50] bg-[#F5E6D6] shadow-lg'
                    : 'border-[#F5E6D6] bg-[#FDF6ED] hover:border-[#E8D5C4] hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-semibold text-[#2C3E50] mb-2">Sublease</h4>
                    <p className="text-[#34495E]">Rent from the current tenant</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    formData.leaseType === 'sublease' 
                      ? 'border-[#2C3E50] bg-[#2C3E50]' 
                      : 'border-[#BFAE9B]'
                  }`}>
                    {formData.leaseType === 'sublease' && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleInputChange('leaseType', 'new-lease')}
                className={`w-full p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                  formData.leaseType === 'new-lease'
                    ? 'border-[#2C3E50] bg-[#F5E6D6] shadow-lg'
                    : 'border-[#F5E6D6] bg-[#FDF6ED] hover:border-[#E8D5C4] hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-semibold text-[#2C3E50] mb-2">New lease</h4>
                    <p className="text-[#34495E]">Rent directly from the property's owner</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    formData.leaseType === 'new-lease' 
                      ? 'border-[#2C3E50] bg-[#2C3E50]' 
                      : 'border-[#BFAE9B]'
                  }`}>
                    {formData.leaseType === 'new-lease' && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
              </button>
            </div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-[#2C3E50] mb-2">Property details</h3>
              <p className="text-[#34495E] mb-6">Tell us about the bedrooms and bathrooms</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-semibold text-[#2C3E50] mb-3">How many total bedrooms?</label>
                <select 
                  value={formData.totalBedrooms}
                  onChange={(e) => handleInputChange('totalBedrooms', e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-[#F5E6D6] bg-[#FDF6ED] text-[#2C3E50] font-medium focus:outline-none focus:border-[#2C3E50] transition-all duration-200"
                >
                  <option value="">Select bedrooms</option>
                  {[2, 3, 4, 5, 6, 7].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-lg font-semibold text-[#2C3E50] mb-3">How many rooms are available?</label>
                <select 
                  value={formData.availableBedrooms}
                  onChange={(e) => handleInputChange('availableBedrooms', e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-[#F5E6D6] bg-[#FDF6ED] text-[#2C3E50] font-medium focus:outline-none focus:border-[#2C3E50] transition-all duration-200"
                >
                  <option value="">Select available</option>
                  {[1, 2, 3, 4].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-lg font-semibold text-[#2C3E50] mb-3">How many bathrooms?</label>
                <select 
                  value={formData.totalBathrooms}
                  onChange={(e) => handleInputChange('totalBathrooms', e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-[#F5E6D6] bg-[#FDF6ED] text-[#2C3E50] font-medium focus:outline-none focus:border-[#2C3E50] transition-all duration-200"
                >
                  <option value="">Select bathrooms</option>
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-[#2C3E50] mb-2">Add availability</h3>
              <p className="text-[#34495E] mb-6">Add one or more date windows when your apartment is available</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Move-in Date Calendar */}
              <div>
                <label className="block text-lg font-semibold text-[#2C3E50] mb-4">Move-in date</label>
                <DatePicker 
                  selectedDate={formData.moveInDate}
                  onDateSelect={(date) => handleInputChange('moveInDate', date)}
                  minDate={new Date()}
                  placeholder="Select move-in date"
                />
              </div>

              {/* Move-out Date Calendar */}
              <div>
                <label className="block text-lg font-semibold text-[#2C3E50] mb-4">Move-out date</label>
                <DatePicker 
                  selectedDate={formData.moveOutDate}
                  onDateSelect={(date) => handleInputChange('moveOutDate', date)}
                  minDate={formData.moveInDate ? new Date(formData.moveInDate) : new Date()}
                  placeholder="Select move-out date"
                />
              </div>
            </div>

            <div className="pt-4">
              <Button 
                variant="outline" 
                className="border-[#F5E6D6] text-[#2C3E50] hover:bg-[#F5E6D6] transition-all duration-200"
              >
                Add another window
              </Button>
            </div>
          </motion.div>
        )

      case 6:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-[#2C3E50] mb-2">What's your address?</h3>
              <p className="text-[#34495E] mb-6">Your address is private until you approve a request to chat</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-lg font-semibold text-[#2C3E50] mb-3">Address</label>
                <LocationSearchInput
                  value={formData.address}
                  onSelect={(address, latLng) => {
                    handleInputChange('address', address);
                    handleInputChange('locationLatLng', latLng);
                  }}
                  apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-[#2C3E50] mb-3">Unit # (optional)</label>
                <input 
                  type="text"
                  value={formData.unitNumber}
                  onChange={(e) => handleInputChange('unitNumber', e.target.value)}
                  placeholder="Unit, apartment, or suite number"
                  className="w-full p-4 rounded-2xl border-2 border-[#F5E6D6] bg-[#FDF6ED] text-[#2C3E50] font-medium focus:outline-none focus:border-[#2C3E50] transition-all duration-200"
                />
              </div>
            </div>
          </motion.div>
        )

      case 7:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-[#2C3E50] mb-2">How much is the monthly rent?</h3>
              <p className="text-[#34495E] mb-6">UniHabitat will deposit your payout directly to your bank account</p>
            </div>
            
            <div>
              <label className="block text-lg font-semibold text-[#2C3E50] mb-3">Monthly rent</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl text-[#2C3E50] font-bold">$</span>
                <input 
                  type="number"
                  value={formData.monthlyRent}
                  onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
                  placeholder="0"
                  className="w-full p-4 pl-12 rounded-2xl border-2 border-[#F5E6D6] bg-[#FDF6ED] text-[#2C3E50] font-medium text-2xl focus:outline-none focus:border-[#2C3E50] transition-all duration-200"
                />
              </div>
            </div>
          </motion.div>
        )

      case 8:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-[#2C3E50] mb-2">Add your photos</h3>
              <p className="text-[#34495E] mb-6">Real photos give your apartment the best chance of getting booked</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-semibold text-[#2C3E50] mb-3">Upload photos</label>
                <div className="border-2 border-dashed border-[#F5E6D6] rounded-2xl p-8 text-center hover:border-[#E8D5C4] transition-all duration-200">
                  <Upload className="w-12 h-12 text-[#BFAE9B] mx-auto mb-4" />
                  <p className="text-[#34495E] mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-[#BFAE9B]">PNG, JPG, HEIC up to 120MB</p>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="inline-block mt-4 px-6 py-3 bg-[#2C3E50] text-white rounded-xl hover:bg-[#34495E] transition-all duration-200 cursor-pointer">
                    Choose Files
                  </label>
                </div>
              </div>

              {formData.photos.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-[#2C3E50] mb-3">Uploaded photos ({formData.photos.length})</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-[#F5E6D6] rounded-xl flex items-center justify-center overflow-hidden">
                          <span className="text-sm text-[#34495E] text-center px-2">{photo.name}</span>
                        </div>
                        <button
                          onClick={() => removePhoto(index)}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-lg font-semibold text-[#2C3E50] mb-3">Add a video walkthrough (optional)</label>
                <div className="border-2 border-dashed border-[#F5E6D6] rounded-2xl p-8 text-center hover:border-[#E8D5C4] transition-all duration-200">
                  <Camera className="w-12 h-12 text-[#BFAE9B] mx-auto mb-4" />
                  <p className="text-[#34495E] mb-2">Click to upload or drag and drop</p>
                  <input 
                    type="file" 
                    accept="video/*" 
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="inline-block mt-4 px-6 py-3 bg-[#2C3E50] text-white rounded-xl hover:bg-[#34495E] transition-all duration-200 cursor-pointer">
                    Choose Video
                  </label>
                </div>
                {formData.video && (
                  <div className="mt-4 p-4 bg-[#F5E6D6] rounded-xl">
                    <p className="text-[#2C3E50] font-medium">{formData.video.name}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )

      case 9:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-[#2C3E50] mb-2">Review your listing</h3>
              <p className="text-[#34495E] mb-6">Make sure everything looks correct before publishing</p>
            </div>
            
            <div className="bg-[#FDF6ED] rounded-2xl p-6 border border-[#F5E6D6] shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-[#2C3E50] mb-3">Property Details</h4>
                  <div className="space-y-2 text-[#34495E]">
                    <p><span className="font-medium">Type:</span> {formData.subleaseType === 'private-bedroom' ? 'Private Bedroom' : 'Entire Place'}</p>
                    <p><span className="font-medium">Furnishing:</span> {formData.furnishing === 'move-in-ready' ? 'Move-in Ready' : formData.furnishing === 'furnished' ? 'Furnished' : 'Unfurnished'}</p>
                    <p><span className="font-medium">Lease Type:</span> {formData.leaseType === 'sublease' ? 'Sublease' : 'New Lease'}</p>
                    <p><span className="font-medium">Bedrooms:</span> {formData.totalBedrooms} total, {formData.availableBedrooms} available</p>
                    <p><span className="font-medium">Bathrooms:</span> {formData.totalBathrooms}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-[#2C3E50] mb-3">Location & Pricing</h4>
                  <div className="space-y-2 text-[#34495E]">
                    <p><span className="font-medium">Address:</span> {formData.address}</p>
                    {formData.unitNumber && <p><span className="font-medium">Unit:</span> {formData.unitNumber}</p>}
                    <p><span className="font-medium">Monthly Rent:</span> ${formData.monthlyRent}</p>
                    <p><span className="font-medium">Available:</span> {formData.moveInDate} to {formData.moveOutDate}</p>
                    <p><span className="font-medium">Photos:</span> {formData.photos.length} uploaded</p>
                    {formData.video && <p><span className="font-medium">Video:</span> {formData.video.name}</p>}
                  </div>
                </div>
              </div>
            </div>

            {submitError && <div className="text-red-600 font-medium text-center">{submitError}</div>}
            {submitSuccess && <div className="text-green-600 font-medium text-center">Listing published! Redirecting...</div>}

            <Button 
              className="w-full bg-gradient-to-r from-[#2C3E50] to-[#34495E] text-white py-4 text-lg font-semibold hover:from-[#34495E] hover:to-[#2C3E50] transition-all duration-300 shadow-lg"
              onClick={handlePublishListing}
              disabled={submitting}
            >
              {submitting ? (editMode ? 'Saving...' : 'Publishing...') : (editMode ? 'Confirm Changes' : 'Publish Listing')}
            </Button>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#FDF6ED]">
      {/* Header */}
      <div className="bg-[#FDF6ED]/90 backdrop-blur-xl border-b border-[#F5E6D6] sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 rounded-full hover:bg-[#F5E6D6] transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-[#2C3E50]" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-[#2C3E50]">List Your Unit</h1>
                <p className="text-[#34495E] mt-1 font-medium">Step {currentStep} of {steps.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Steps */}
          <div className="lg:col-span-1">
            <div className="bg-[#FDF6ED]/90 backdrop-blur-sm rounded-3xl shadow-xl border border-[#F5E6D6] p-6 sticky top-32">
              <h2 className="text-xl font-bold text-[#2C3E50] mb-6">Progress</h2>
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const isActive = currentStep === step.id
                  const isCompleted = currentStep > step.id
                  const isUpcoming = currentStep < step.id
                  // If in edit mode, make step clickable
                  const stepButton = (
                    <div
                      key={step.id}
                      className={`flex items-start space-x-4 cursor-pointer ${isActive ? '' : 'hover:bg-[#F5E6D6]'}`}
                      onClick={() => editMode && setCurrentStep(step.id)}
                      style={{ pointerEvents: editMode ? 'auto' : 'none', opacity: editMode ? 1 : 1 }}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                        isActive 
                          ? 'bg-[#2C3E50] text-white shadow-lg' 
                          : isCompleted 
                            ? 'bg-[#34495E] text-white' 
                            : 'bg-[#F5E6D6] text-[#BFAE9B]'
                      }`}>
                        {isCompleted ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <step.icon className="w-5 h-5" />
                        )}
                      </div>
                      <div className={`flex-1 min-w-0 ${isUpcoming ? 'opacity-50' : ''}`}>
                        <h3 className={`font-semibold text-sm ${
                          isActive ? 'text-[#2C3E50]' : 'text-[#34495E]'
                        }`}>
                          {step.title}
                        </h3>
                        <p className="text-xs text-[#BFAE9B] mt-1">{step.description}</p>
                      </div>
                    </div>
                  );
                  // If not in edit mode, render as non-clickable
                  const stepDiv = (
                    <div key={step.id} className="flex items-start space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                        isActive 
                          ? 'bg-[#2C3E50] text-white shadow-lg' 
                          : isCompleted 
                            ? 'bg-[#34495E] text-white' 
                            : 'bg-[#F5E6D6] text-[#BFAE9B]'
                      }`}>
                        {isCompleted ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <step.icon className="w-5 h-5" />
                        )}
                      </div>
                      <div className={`flex-1 min-w-0 ${isUpcoming ? 'opacity-50' : ''}`}>
                        <h3 className={`font-semibold text-sm ${
                          isActive ? 'text-[#2C3E50]' : 'text-[#34495E]'
                        }`}>
                          {step.title}
                        </h3>
                        <p className="text-xs text-[#BFAE9B] mt-1">{step.description}</p>
                      </div>
                    </div>
                  );
                  return editMode ? stepButton : stepDiv;
                })}
              </div>
            </div>
          </div>

          {/* Right Side - Form Content */}
          <div className="lg:col-span-2">
            <div className="bg-[#FDF6ED]/90 backdrop-blur-sm rounded-3xl shadow-xl border border-[#F5E6D6] p-8">
              <AnimatePresence mode="wait">
                {renderStepContent()}
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-[#F5E6D6]">
                <Button 
                  variant="outline" 
                  onClick={prevStep} 
                  disabled={currentStep === 1}
                  className="border-[#F5E6D6] text-[#2C3E50] hover:bg-[#F5E6D6] transition-all duration-200 disabled:opacity-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                
                {currentStep < steps.length && (
                  <Button 
                    onClick={nextStep}
                    className="bg-gradient-to-r from-[#2C3E50] to-[#34495E] text-white hover:from-[#34495E] hover:to-[#2C3E50] transition-all duration-300 shadow-lg"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Calendar Component
function DatePicker({ 
  selectedDate, 
  onDateSelect, 
  minDate = new Date(), 
  placeholder = "Select date" 
}: {
  selectedDate: string
  onDateSelect: (date: string) => void
  minDate?: Date
  placeholder?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }
    
    // Add all days in the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    
    return days
  }

  const isDateDisabled = (date: Date) => {
    return date < minDate
  }

  const isDateSelected = (date: Date) => {
    return formatDate(date) === selectedDate
  }

  const handleDateClick = (date: Date) => {
    if (!isDateDisabled(date)) {
      onDateSelect(formatDate(date))
      setIsOpen(false)
    }
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const prevMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    if (newMonth >= new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)) {
      setCurrentMonth(newMonth)
    }
  }

  const days = getDaysInMonth(currentMonth)
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  return (
    <div className="relative">
      {/* Input Field */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 rounded-2xl border-2 border-[#F5E6D6] bg-[#FDF6ED] text-[#2C3E50] font-medium focus:outline-none focus:border-[#2C3E50] transition-all duration-200 text-left"
      >
        {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }) : placeholder}
      </button>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#F5E6D6] p-4 z-50">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="p-2 rounded-full hover:bg-[#F5E6D6] transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-[#2C3E50]" />
            </button>
            <h3 className="text-lg font-semibold text-[#2C3E50]">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <button
              onClick={nextMonth}
              className="p-2 rounded-full hover:bg-[#F5E6D6] transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-[#2C3E50]" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-[#BFAE9B] py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <div key={index} className="aspect-square">
                {day ? (
                  <button
                    onClick={() => handleDateClick(day)}
                    disabled={isDateDisabled(day)}
                    className={`w-full h-full rounded-lg text-sm font-medium transition-all duration-200 ${
                      isDateSelected(day)
                        ? 'bg-[#2C3E50] text-white shadow-md'
                        : isDateDisabled(day)
                          ? 'text-[#BFAE9B] cursor-not-allowed'
                          : 'text-[#2C3E50] hover:bg-[#F5E6D6] hover:shadow-sm'
                    }`}
                  >
                    {day.getDate()}
                  </button>
                ) : (
                  <div className="w-full h-full" />
                )}
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex justify-between mt-4 pt-4 border-t border-[#F5E6D6]">
            <button
              onClick={() => setIsOpen(false)}
              className="text-sm text-[#BFAE9B] hover:text-[#2C3E50] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-sm text-[#2C3E50] font-medium hover:text-[#34495E] transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 