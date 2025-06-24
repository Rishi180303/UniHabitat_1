'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth-provider'
import { checkUserProfile } from '@/lib/utils'
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
  Clock
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import UniversitySearch from '@/components/UniversitySearch'

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        const userProfile = await checkUserProfile(user.id)
        setProfile(userProfile)
        setProfileLoading(false)
        setEditData(userProfile)
      }
    }

    if (!loading) {
      if (!user) {
        router.push('/')
        return
      }
      loadProfile()
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToDashboard}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Profile
                </h1>
                <p className="text-slate-600 mt-1 font-medium">Manage your account</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {!editMode && (
                <Button
                  onClick={handleEditProfile}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-2xl transition-all duration-200"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 px-4 py-2 rounded-2xl transition-all duration-200"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-200/50 p-8 text-center">
              {/* Avatar */}
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
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
                      alt={profile.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-white" />
                  )}
                </div>
              </div>

              {/* Name */}
              {editMode ? (
                <Input
                  id="full_name"
                  name="full_name"
                  value={editData?.full_name || ''}
                  onChange={handleEditChange}
                  placeholder="Full Name"
                  className={`mt-4 text-center ${getFieldError('full_name') ? 'border-red-500 bg-red-50' : ''}`}
                />
              ) : (
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {profile?.full_name || 'Your Name'}
                </h2>
              )}
              {getFieldError('full_name') && (
                <p className="text-red-500 text-xs mt-1">Full name is required</p>
              )}

              {/* Email */}
              <div className="flex items-center justify-center space-x-2 text-slate-600 mb-4">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{user.email}</span>
              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                Active Student
              </div>
            </div>
          </motion.div>

          {/* Profile Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Personal Information */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-200/50 p-8">
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
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-200/50 p-8">
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
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-200/50 p-8">
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
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-200/50 p-8">
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