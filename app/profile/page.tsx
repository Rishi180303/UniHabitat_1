'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth-provider'
import { checkUserProfile, getUserListings } from '@/lib/utils'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  GraduationCap, 
  Calendar, 
  Edit3, 
  ArrowLeft,
  Camera,
  MapPin,
  BookOpen,
  Clock,
  Home,
  Bed,
  Bath,
  DollarSign,
  Plus,
  Eye,
  Trash2,
  X,
  Menu,
  LogOut,
  Settings,
  Heart
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import UniversitySearch from '@/components/UniversitySearch'
import LocationSearchInput from '@/components/LocationSearchInput'
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog'
import ImageCropper from '@/components/ImageCropper'

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [listings, setListings] = useState<any[]>([])
  const [listingsLoading, setListingsLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  const [deletingListing, setDeletingListing] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [listingToDelete, setListingToDelete] = useState<any>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [showCropper, setShowCropper] = useState(false)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('profile')
  const router = useRouter()

  useEffect(() => {
    const loadProfileAndListings = async () => {
      if (user) {
        // Load profile
        const userProfile = await checkUserProfile(user.id)
        setProfile(userProfile)
        setProfileLoading(false)
        setEditData(userProfile)

        // Load listings
        const userListings = await getUserListings(user.id)
    
        setListings(userListings)
        setListingsLoading(false)
      }
    }

    if (!loading) {
      if (!user) {
        router.push('/')
        return
      }
      loadProfileAndListings()
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleEditProfile = () => {
    setEditData(profile)
    setEditMode(true)
  }

  const handleCancelEdit = () => {
    setEditData(profile)
    setEditMode(false)
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setEditError('Please select a valid image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setEditError('Image size must be less than 5MB')
      return
    }

    setEditError(null)
    setSelectedImageFile(file)
    
    // Create preview for cropping
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
      setShowCropper(true)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setEditData((prev: any) => ({ ...prev, avatar_url: '' }))
    setImagePreview(null)
    setSelectedImageFile(null)
  }

  const handleCropComplete = async (croppedBlob: Blob) => {
    if (!user) return

    setUploadingImage(true)
    setShowCropper(false)
    setEditError(null)

    try {
      // Convert blob to file
      const file = new File([croppedBlob], 'cropped-image.jpg', { type: 'image/jpeg' })

      // Upload to Supabase Storage
      const fileName = `${user.id}-${Date.now()}.jpg`
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      // Update edit data
      setEditData((prev: any) => ({ ...prev, avatar_url: publicUrl }))
      setImagePreview(URL.createObjectURL(croppedBlob))
    } catch (err: any) {
      setEditError('Error uploading image: ' + (err.message || 'Please try again.'))
      setImagePreview(null)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleCropCancel = () => {
    setShowCropper(false)
    setImagePreview(null)
    setSelectedImageFile(null)
  }

  const isEditValid = editData && editData.full_name && editData.university && editData.university_area && editData.year

  const getFieldError = (fieldName: string) => {
    if (!editMode) return null;
    if (!editData?.[fieldName] && ['full_name', 'university', 'university_area', 'year'].includes(fieldName)) {
      return 'This field is required';
    }
    return null;
  }

  const handleSaveEdit = async () => {
    if (!user) return;
    if (!isEditValid || !editData?.university || editData.university.trim() === "") {
      const missingFields = [];
      if (!editData?.full_name) missingFields.push('Full Name');
      if (!editData?.university || editData.university.trim() === "") missingFields.push('University');
      if (!editData?.university_area) missingFields.push('University Area');
      if (!editData?.year) missingFields.push('Graduation Year');
      setEditError(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }
    setSaving(true)
    setEditError(null)
    try {
      const updatedProfile = {
        ...editData,
        id: user.id,
        email: user.email,
        year: editData.year || '',
        avatar_url: editData.avatar_url || '',
      }
      const { error } = await supabase.from('profiles').upsert(updatedProfile)
      if (error) throw error
      setProfile(updatedProfile)
      setEditMode(false)
    } catch (err: any) {
      setEditError('Error saving profile: ' + (err.message || 'Please try again.'))
    } finally {
      setSaving(false)
    }
  }

  const handleBackToDashboard = () => {
    router.push('/dashboard')
  }

  const handleDeleteListing = async (listingId: string) => {
    const listing = listings.find(l => l.id === listingId)
    if (!listing) return
    
    setListingToDelete(listing)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!listingToDelete || !user) return
    
    setDeletingListing(listingToDelete.id)
    setDeleteDialogOpen(false)
    
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingToDelete.id)
        .eq('user_id', user.id)
      
      if (error) throw error
      
      // Remove the listing from the local state
      setListings(prev => prev.filter(listing => listing.id !== listingToDelete.id))
    } catch (err: any) {
      console.error('Error deleting listing:', err)
      alert('Error deleting listing: ' + (err.message || 'Please try again.'))
    } finally {
      setDeletingListing(null)
      setListingToDelete(null)
    }
  }

  const cancelDelete = () => {
    setDeleteDialogOpen(false)
    setListingToDelete(null)
  }

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF6ED]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-[#2C3E50] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#34495E] font-medium">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#FDF6ED]">
      {/* Header */}
      <div className="bg-[#FDF6ED] sticky top-0 z-50 border-b border-[#F5E6D6]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-extrabold text-[#2C3E50] tracking-tight">
                UniHabitat
              </h1>
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 bg-white shadow hover:bg-[#F5E6D6] transition-all"
            >
              <Menu className="w-6 h-6 text-[#2C3E50]" />
            </button>
          </div>
        </div>
      </div>

      {/* Hamburger Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
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
                {/* Dashboard Option */}
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full flex items-center space-x-3 p-4 rounded-2xl hover:bg-[#F5E6D6] transition-all duration-200 group shadow-md hover:shadow-lg"
                >
                  <div className="p-2 bg-gradient-to-br from-[#2C3E50] to-[#34495E] rounded-xl shadow-md">
                    <Home className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-[#2C3E50]">Dashboard</p>
                    <p className="text-sm text-[#34495E]">Browse housing listings</p>
                  </div>
                </button>

                {/* Landing Page Option */}
                <button
                  onClick={() => router.push('/')}
                  className="w-full flex items-center space-x-3 p-4 rounded-2xl hover:bg-[#F5E6D6] transition-all duration-200 group shadow-md hover:shadow-lg"
                >
                  <div className="p-2 bg-gradient-to-br from-[#34495E] to-[#2C3E50] rounded-xl shadow-md">
                    <ArrowLeft className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-[#2C3E50]">Landing Page</p>
                    <p className="text-sm text-[#34495E]">Back to homepage</p>
                  </div>
                </button>

                {/* Logout Option */}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-3 p-4 rounded-2xl hover:bg-red-50 transition-all duration-200 group shadow-md hover:shadow-lg"
                >
                  <div className="p-2 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl shadow-md">
                    <LogOut className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-[#2C3E50]">Logout</p>
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
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Page Title */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#2C3E50] mb-2">My Profile</h1>
            <p className="text-[#34495E] text-lg">Manage your account and personal information</p>
          </div>

          {/* Layout with Sidebar and Content */}
          <div className="flex gap-8">
            {/* Left Sidebar Navigation */}
            <div className="w-64 flex-shrink-0">
              <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-28">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveSection('profile')}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl text-left transition-all duration-300 ${
                      activeSection === 'profile'
                        ? 'bg-[#2C3E50] text-white shadow-lg'
                        : 'text-[#2C3E50] hover:bg-[#FDF6ED] hover:shadow-md'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">My Profile</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveSection('preferences')}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl text-left transition-all duration-300 ${
                      activeSection === 'preferences'
                        ? 'bg-[#2C3E50] text-white shadow-lg'
                        : 'text-[#2C3E50] hover:bg-[#FDF6ED] hover:shadow-md'
                    }`}
                  >
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Preferences</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveSection('listings')}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl text-left transition-all duration-300 ${
                      activeSection === 'listings'
                        ? 'bg-[#2C3E50] text-white shadow-lg'
                        : 'text-[#2C3E50] hover:bg-[#FDF6ED] hover:shadow-md'
                    }`}
                  >
                    <Home className="w-5 h-5" />
                    <span className="font-medium">My Listings</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveSection('favourites')}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl text-left transition-all duration-300 ${
                      activeSection === 'favourites'
                        ? 'bg-[#2C3E50] text-white shadow-lg'
                        : 'text-[#2C3E50] hover:bg-[#FDF6ED] hover:shadow-md'
                    }`}
                  >
                    <Heart className="w-5 h-5" />
                    <span className="font-medium">Favourites</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 min-h-[600px]">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {activeSection === 'profile' && (
                  <div className="space-y-8">

          {/* Profile Header with Avatar - Centered */}
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <div className="flex flex-col items-center">
              {/* Avatar */}
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-[#F5E6D6] to-[#E8D5C4] flex items-center justify-center relative border-4 border-[#F5E6D6]">
                  {editMode ? (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      {imagePreview || editData?.avatar_url ? (
                        <img 
                          src={imagePreview || editData.avatar_url} 
                          alt="Avatar Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-16 h-16 text-[#2C3E50]" />
                      )}
                      {uploadingImage && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <label className="cursor-pointer bg-black/70 text-white p-2 rounded-full hover:bg-black/80 transition-colors">
                          <Camera className="w-4 h-4" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={uploadingImage}
                          />
                        </label>
                      </div>
                      {(imagePreview || editData?.avatar_url) && (
                        <button
                          onClick={removeImage}
                          className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                          disabled={uploadingImage}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ) : profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-[#2C3E50]" />
                  )}
                </div>
                {editMode && (
                  <div className="mt-2 text-center">
                    <label className="text-xs text-[#2C3E50] cursor-pointer hover:text-[#34495E] transition-colors">
                      Click to upload image
                    </label>
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <h1 className="text-4xl font-bold text-[#2C3E50] mb-2">{profile?.full_name || 'Your Name'}</h1>
              <p className="text-[#34495E] text-lg mb-4">{profile?.email}</p>
              
              {/* Quick Info Cards */}
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <div className="bg-[#FDF6ED] px-4 py-2 rounded-2xl border border-[#F5E6D6]">
                  <span className="inline-flex items-center gap-2 text-[#2C3E50] font-medium">
                    <MapPin className="w-4 h-4" />
                    {profile?.university || 'University'}
                  </span>
                </div>
                <div className="bg-[#FDF6ED] px-4 py-2 rounded-2xl border border-[#F5E6D6]">
                  <span className="inline-flex items-center gap-2 text-[#2C3E50] font-medium">
                    <GraduationCap className="w-4 h-4" />
                    Class of {profile?.year || 'Year'}
                  </span>
                </div>
              </div>

              {/* Edit Button */}
              {!editMode && (
                <Button
                  onClick={handleEditProfile}
                  className="bg-[#2C3E50] text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:bg-[#34495E] transition-all"
                >
                  <Edit3 className="w-5 h-5 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          {/* Personal Information */}
            <div className="bg-white rounded-3xl shadow-lg p-8 mb-4">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-slate-600 mb-2 block">Full Name</label>
                  {editMode ? (
                    <Input
                      id="full_name"
                      name="full_name"
                      value={editData?.full_name || ''}
                      onChange={handleEditChange}
                      placeholder="Full Name"
                      className={`w-full h-10 text-base bg-white border border-[#E8D5C4] rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#2C3E50] focus:border-[#2C3E50] placeholder-[#8A939B] ${getFieldError('full_name') ? 'border-red-500 bg-red-50' : ''}`}
                    />
                  ) : (
                    <p className="text-lg font-semibold text-slate-900">
                      {profile?.full_name || 'Not set'}
                    </p>
                  )}
                  {getFieldError('full_name') && (
                    <p className="text-red-500 text-xs mt-1">Full name is required</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 mb-2 block">Email Address</label>
                  <p className="text-lg font-semibold text-slate-900">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-white rounded-3xl shadow-lg p-8 mb-4">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-emerald-600" />
                Academic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-slate-600 mb-2 block flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    University
                  </label>
                  {editMode ? (
                    <UniversitySearch
                      value={editData?.university || ''}
                      onChange={(value) => setEditData((prev: any) => ({ ...prev, university: value }))}
                      placeholder="Search for your university"
                      className="w-full"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-slate-900">
                      {profile?.university || 'Not set'}
                    </p>
                  )}
                  {getFieldError('university') && (
                    <p className="text-red-500 text-xs mt-1">University is required</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 mb-2 block flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    University Area/Location
                  </label>
                  {editMode ? (
                    <LocationSearchInput
                      value={editData?.university_area || ''}
                      onSelect={(address) => setEditData((prev: any) => ({ ...prev, university_area: address }))}
                      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
                      className="w-full h-10 text-base bg-white border border-[#E8D5C4] rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#2C3E50] focus:border-[#2C3E50] placeholder-[#8A939B]"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-slate-900">
                      {profile?.university_area || 'Not set'}
                    </p>
                  )}
                  {getFieldError('university_area') && (
                    <span className="text-xs text-red-500">{getFieldError('university_area')}</span>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 mb-2 block flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Graduation Year
                  </label>
                  {editMode ? (
                    <Input
                      id="year"
                      name="year"
                      value={editData?.year || ''}
                      onChange={handleEditChange}
                      placeholder="Graduation Year"
                      className={`w-full h-10 text-base bg-white border border-[#E8D5C4] rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#2C3E50] focus:border-[#2C3E50] placeholder-[#8A939B] ${getFieldError('year') ? 'border-red-500 bg-red-50' : ''}`}
                    />
                  ) : (
                    <p className="text-lg font-semibold text-slate-900">
                      {profile?.year || 'Not set'}
                    </p>
                  )}
                  {getFieldError('year') && (
                    <p className="text-red-500 text-xs mt-1">Graduation year is required</p>
                  )}
                </div>
              </div>
            </div>

            {/* About Me */}
            <div className="bg-white rounded-3xl shadow-lg p-8 mb-4">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-purple-600" />
                About Me
              </h3>
              <div>
                <label className="text-sm font-medium text-slate-600 mb-2 block">Bio</label>
                {editMode ? (
                  <textarea
                    id="bio"
                    name="bio"
                    value={editData?.bio || ''}
                    onChange={handleEditChange}
                    placeholder="Tell us about yourself"
                    className="w-full min-h-[100px] rounded-xl border border-[#E8D5C4] bg-white px-3 py-2 text-base focus:ring-2 focus:ring-[#2C3E50] focus:border-[#2C3E50] placeholder-[#8A939B]"
                  />
                ) : (
                  <p className="text-lg text-slate-900 leading-relaxed">
                    {profile?.bio || 'No bio added yet. Click "Edit Profile" to add your bio.'}
                  </p>
                )}
              </div>
            </div>

            {/* Save/Cancel Buttons */}
            {editMode && (
              <div className="flex flex-col items-end pt-4 space-y-2 mb-8">
                {editError && (
                  <span className="text-red-600 text-sm mb-2">{editError}</span>
                )}
                <div className="flex space-x-4">
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    className="px-6 py-2 rounded-2xl"
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
                    className="bg-[#2C3E50] text-white px-6 py-2 rounded-2xl font-semibold shadow hover:bg-[#34495E]"
                    disabled={saving || !isEditValid}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            )}
                  </div>
                )}

                {activeSection === 'preferences' && (
                  <div className="space-y-8">
                    <div className="bg-white rounded-3xl shadow-lg p-8">
                      <h2 className="text-2xl font-bold text-[#2C3E50] mb-6 flex items-center">
                        <Settings className="w-6 h-6 mr-3" />
                        Preferences
                      </h2>
                      <div className="text-center py-12">
                        <Settings className="w-16 h-16 text-[#BFAE9B] mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">Coming Soon</h3>
                        <p className="text-[#34495E]">Preference settings will be available in a future update.</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'listings' && (
                  <div className="space-y-8">
                    <div className="bg-white rounded-3xl shadow-lg p-8">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                        <div>
                          <h2 className="text-2xl font-bold text-[#2C3E50] flex items-center mb-2">
                            <Home className="w-6 h-6 mr-3" />
                            My Listings
                          </h2>
                          <p className="text-[#34495E]">All the units you're currently listing for rent or sublease.</p>
                        </div>
                        <Button
                          onClick={() => router.push('/dashboard/list')}
                          className="bg-[#2C3E50] text-white px-6 py-3 rounded-2xl font-semibold shadow hover:bg-[#34495E]"
                        >
                          <Plus className="w-5 h-5 mr-2" />
                          Add New Listing
                        </Button>
                      </div>

                      {listingsLoading ? (
                        <div className="flex items-center justify-center py-16">
                          <div className="w-8 h-8 border-2 border-[#2C3E50] border-t-transparent rounded-full animate-spin"></div>
                          <span className="ml-4 text-[#34495E] text-lg">Loading your listings...</span>
                        </div>
                      ) : listings.length === 0 ? (
                        <div className="text-center py-16">
                          <Home className="w-14 h-14 text-[#BFAE9B] mx-auto mb-4" />
                          <h4 className="text-2xl font-bold text-[#2C3E50] mb-2">No listings yet</h4>
                          <p className="text-[#34495E] mb-6 text-lg">Start by creating your first listing to rent out your space.</p>
                          <Button
                            onClick={() => router.push('/dashboard/list')}
                            className="bg-[#2C3E50] text-white px-8 py-4 rounded-2xl font-semibold shadow hover:bg-[#34495E] text-lg"
                          >
                            <Plus className="w-5 h-5 mr-2" />
                            Create Your First Listing
                          </Button>
                        </div>
                      ) : (
                        <div className="grid gap-6" style={{ 
                          gridTemplateColumns: listings.length >= 3 
                            ? `repeat(${Math.min(listings.length, 3)}, 1fr)` 
                            : 'repeat(auto-fit, minmax(320px, 320px))',
                          justifyContent: listings.length < 3 ? 'flex-start' : 'stretch'
                        }}>
                          {listings.map((listing) => (
                            <motion.div
                              key={listing.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-[#FDF6ED] rounded-xl p-6 border border-[#E8D5C4] shadow-md hover:shadow-lg transition-all duration-200 min-h-[320px]"
                              whileHover={{ scale: 1.03 }}
                            >
                              <div className="flex flex-col h-full">
                                <h4 className="text-sm font-bold text-[#2C3E50] mb-3 line-clamp-2 leading-tight">{listing.title}</h4>
                                
                                <div className="flex flex-col gap-2 mb-4">
                                  <span className={`px-3 py-1.5 rounded-lg text-xs font-medium text-center ${
                                    listing.status === 'approved' ? 'bg-green-100 text-green-700' :
                                    listing.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                    'bg-red-100 text-red-700'
                                  }`}>
                                    {listing.status === 'approved' ? 'Approved' :
                                     listing.status === 'pending' ? 'Pending' :
                                     'Rejected'}
                                  </span>
                                  <span className={`px-3 py-1.5 rounded-lg text-xs font-medium text-center ${
                                    listing.sublease_type === 'private-bedroom' 
                                      ? 'bg-blue-100 text-blue-700' 
                                      : 'bg-purple-100 text-purple-700'
                                  }`}>
                                    {listing.sublease_type === 'private-bedroom' ? 'Private Room' : 'Entire Place'}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 mb-3">
                                  <DollarSign className="w-4 h-4 text-green-600" />
                                  <span className="text-base font-bold text-green-700">${listing.price}/month</span>
                                </div>
                                
                                <div className="flex items-start gap-2 mb-3">
                                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{listing.address}</span>
                                </div>
                                
                                <div className="flex gap-4 text-sm text-gray-600 mb-4">
                                  <span>{listing.total_bedrooms} bed</span>
                                  <span>{listing.total_bathrooms} bath</span>
                                </div>
                                
                                <div className="flex gap-2 mt-auto">
                                  <Button
                                    size="sm"
                                    className="bg-[#2C3E50] text-white text-sm rounded-lg flex-1 py-2 hover:bg-[#34495E]"
                                    onClick={() => router.push(`/dashboard/list?edit=1&listingId=${listing.id}`)}
                                  >
                                    <Edit3 className="w-4 h-4 mr-1" />
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-red-200 text-red-600 hover:bg-red-50 text-sm rounded-lg flex-1 py-2"
                                    onClick={() => handleDeleteListing(listing.id)}
                                    disabled={deletingListing === listing.id}
                                  >
                                    {deletingListing === listing.id ? (
                                      <div className="w-4 h-4 border border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                      <Trash2 className="w-4 h-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeSection === 'favourites' && (
                  <div className="space-y-8">
                    <div className="bg-white rounded-3xl shadow-lg p-8">
                      <h2 className="text-2xl font-bold text-[#2C3E50] mb-6 flex items-center">
                        <Heart className="w-6 h-6 mr-3" />
                        Favourites
                      </h2>
                      <div className="text-center py-12">
                        <Heart className="w-16 h-16 text-[#BFAE9B] mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">Coming Soon</h3>
                        <p className="text-[#34495E]">Save your favorite listings and they'll appear here.</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>


      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        listingTitle={listingToDelete?.title || 'this listing'}
        isLoading={deletingListing === listingToDelete?.id}
      />

      {/* Image Cropper */}
      {showCropper && imagePreview && (
        <ImageCropper
          imageSrc={imagePreview}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  )
} 