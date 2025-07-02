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
  Eye
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import UniversitySearch from '@/components/UniversitySearch'

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

  const isEditValid = editData && editData.full_name && editData.university && editData.year

  const getFieldError = (fieldName: string) => {
    if (!editMode) return null;
    if (!editData?.[fieldName] && ['full_name', 'university', 'year'].includes(fieldName)) {
      return 'This field is required';
    }
    return null;
  }

  const handleSaveEdit = async () => {
    if (!user) return;
    if (!isEditValid) {
      const missingFields = [];
      if (!editData?.full_name) missingFields.push('Full Name');
      if (!editData?.university) missingFields.push('University');
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
      <div className="bg-[#FDF6ED]/90 backdrop-blur-xl border-b border-[#F5E6D6] sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToDashboard}
                className="p-2 rounded-full hover:bg-[#F5E6D6] transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-[#2C3E50]" />
              </button>
              <div>
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#2C3E50] to-[#34495E] bg-clip-text text-transparent tracking-tight">
                  Profile
                </h1>
                <p className="text-[#34495E] mt-1 font-medium">Manage your account</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {!editMode && (
                <Button
                  onClick={handleEditProfile}
                  className="bg-gradient-to-r from-[#2C3E50] to-[#34495E] text-white px-4 py-2 rounded-2xl font-semibold shadow hover:from-[#34495E] hover:to-[#2C3E50]"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 px-4 py-2 rounded-2xl font-semibold"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:w-1/3 w-full flex-shrink-0"
          >
            <div className="bg-[#2C3E50]/90 rounded-3xl shadow-lg border border-[#F5E6D6] p-8 text-center flex flex-col items-center">
              {/* Avatar */}
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-[#34495E]/30 to-[#2C3E50]/30 flex items-center justify-center">
                  {editMode ? (
                    <Input
                      id="avatar_url"
                      name="avatar_url"
                      value={editData?.avatar_url || ''}
                      onChange={handleEditChange}
                      placeholder="Avatar URL"
                      className="w-full h-full text-center"
                    />
                  ) : profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-[#34495E]" />
                  )}
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">{profile?.full_name}</h2>
              <p className="text-[#FDF6ED] mb-2">{profile?.email}</p>
              <div className="flex flex-col items-center gap-2 text-[#FDF6ED] mt-4">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {profile?.university}
                </span>
                <span className="inline-flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Class of {profile?.year}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Info + Listings Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:w-2/3 w-full flex flex-col gap-8"
          >
            {/* Personal Information */}
            <div className="bg-[#F5E6D6]/90 rounded-3xl shadow-xl p-8 mb-4">
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
                      className={getFieldError('full_name') ? 'border-red-500 bg-red-50' : ''}
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
            <div className="bg-[#F5E6D6]/90 rounded-3xl shadow-xl p-8 mb-4">
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
                      className={getFieldError('year') ? 'border-red-500 bg-red-50' : ''}
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
            <div className="bg-[#F5E6D6]/90 rounded-3xl shadow-xl p-8 mb-4">
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
                    className="w-full min-h-[100px] rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#2C3E50] focus:border-transparent"
                  />
                ) : (
                  <p className="text-lg text-slate-900 leading-relaxed">
                    {profile?.bio || 'No bio added yet. Click "Edit Profile" to add your bio.'}
                  </p>
                )}
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-[#F5E6D6]/90 rounded-3xl shadow-xl p-8 mb-4">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-slate-600" />
                Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-slate-600 mb-2 block">Member Since</label>
                  <p className="text-lg font-semibold text-slate-900">
                    {profile?.created_at 
                      ? new Date(profile.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'Recently'
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 mb-2 block">Last Sign In</label>
                  <p className="text-lg font-semibold text-slate-900">
                    {user.last_sign_in_at 
                      ? new Date(user.last_sign_in_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'Recently'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Your Listings */}
            <div className="w-full">
              <div className="border-t border-[#E8D5C4] my-12" />
              <div className="bg-gradient-to-br from-[#FDF6ED] to-[#F5E6D6] rounded-3xl shadow-xl border border-[#F5E6D6] p-10 mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                  <div>
                    <h3 className="text-2xl font-extrabold text-[#2C3E50] flex items-center mb-2">
                      <Home className="w-6 h-6 mr-2 text-orange-600" />
                      Your Listings
                    </h3>
                    <p className="text-[#34495E] text-base">All the units you're currently listing for rent or sublease. Click edit to update details or add a new listing below.</p>
                  </div>
                  <Button
                    onClick={() => router.push('/dashboard/list')}
                    className="bg-gradient-to-r from-[#2C3E50] to-[#34495E] text-white px-6 py-3 rounded-2xl font-semibold shadow hover:from-[#34495E] hover:to-[#2C3E50] text-lg"
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
                      className="bg-gradient-to-r from-[#2C3E50] to-[#34495E] text-white px-8 py-4 rounded-2xl font-semibold shadow hover:from-[#34495E] hover:to-[#2C3E50] text-lg"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Create Your First Listing
                    </Button>
                  </div>
                ) : (
                  <div className="w-full flex flex-wrap justify-center gap-10">
                    {listings.map((listing) => (
                      <motion.div
                        key={listing.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white min-w-[320px] max-w-[400px] w-full rounded-2xl p-8 border border-[#F5E6D6] shadow-lg hover:shadow-2xl transition-all duration-200 flex flex-col justify-between"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex flex-col gap-4 mb-6">
                          <h4 className="text-2xl font-bold text-[#2C3E50] mb-1">{listing.title}</h4>
                          <span className={`inline-block mb-2 px-4 py-1 rounded-full text-base font-semibold ${
                            listing.sublease_type === 'private-bedroom' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {listing.sublease_type === 'private-bedroom' ? 'Private Bedroom' : 'Entire Place'}
                          </span>
                          <div className="flex items-center gap-2 text-[#34495E] text-lg">
                            <MapPin className="w-5 h-5" />
                            <span>{listing.address}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[#34495E] text-xl font-bold">
                            <DollarSign className="w-5 h-5" />
                            <span>${listing.price}/month</span>
                          </div>
                          <div className="flex items-center gap-6 text-[#34495E] text-base mt-2">
                            <div className="flex items-center gap-2">
                              <Bed className="w-5 h-5" />
                              <span>{listing.total_bedrooms} bed</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Bath className="w-5 h-5" />
                              <span>{listing.total_bathrooms} bath</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-[#34495E] text-base mt-2">
                            <Calendar className="w-5 h-5" />
                            <span>Available: {listing.move_in_date} - {listing.move_out_date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[#34495E] text-base mt-2">
                            <Clock className="w-5 h-5" />
                            <span>Created: {new Date(listing.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 mt-auto w-full">
                          <Button
                            size="lg"
                            className="bg-gradient-to-r from-[#2C3E50] to-[#34495E] text-white text-lg font-semibold rounded-2xl shadow w-full py-4 hover:from-[#34495E] hover:to-[#2C3E50] flex items-center justify-center"
                            onClick={() => router.push(`/dashboard/list?edit=1&listingId=${listing.id}`)}
                          >
                            <Edit3 className="w-5 h-5 mr-2" />
                            Edit Listing
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Save/Cancel Buttons */}
            {editMode && (
              <div className="flex flex-col items-end pt-4 space-y-2">
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
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-2xl"
                    disabled={saving || !isEditValid}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
} 