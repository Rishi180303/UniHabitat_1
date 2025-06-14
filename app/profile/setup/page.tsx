'use client'

import { useAuth } from '@/components/auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Calendar, GraduationCap, Home, Users, DollarSign, MapPin, User, BookOpen } from 'lucide-react'

interface ProfileFormData {
  fullName: string
  university: string
  major: string
  graduationYear: string
  moveInDate: string
  budget: string
  preferredLocation: string
  roommates: string
  bio: string
}

export default function ProfileSetup() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: '',
    university: '',
    major: '',
    graduationYear: '',
    moveInDate: '',
    budget: '',
    preferredLocation: '',
    roommates: '',
    bio: ''
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          email: user?.email,
          ...formData,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
      
      router.push('/dashboard')
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF6ED]">
        <div className="animate-pulse text-[#2C3E50] text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDF6ED]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#2C3E50]">UniHabitat</h1>
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{user.email}</span>
              <Button 
                onClick={handleLogout}
                className="bg-red-500 text-white hover:bg-red-600"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#2C3E50] text-white flex items-center justify-center">1</div>
                <div className="ml-2 text-[#2C3E50] font-medium">Account</div>
              </div>
              <div className="w-16 h-0.5 bg-[#2C3E50]"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#2C3E50] text-white flex items-center justify-center">2</div>
                <div className="ml-2 text-[#2C3E50] font-medium">Profile</div>
              </div>
              <div className="w-16 h-0.5 bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center">3</div>
                <div className="ml-2 text-gray-600 font-medium">Preferences</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-[#2C3E50] mb-3">
                  Complete Your Profile
                </h2>
                <p className="text-gray-600">
                  Help us find your perfect student housing match
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 text-[#2C3E50]">
                    <User className="h-5 w-5" />
                    <h3 className="text-xl font-semibold">Personal Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="focus:ring-2 focus:ring-[#2C3E50] focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="university" className="text-sm font-medium text-gray-700">
                        University
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="university"
                          name="university"
                          value={formData.university}
                          onChange={handleInputChange}
                          placeholder="Your University"
                          className="pl-10 focus:ring-2 focus:ring-[#2C3E50] focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="major" className="text-sm font-medium text-gray-700">
                        Major
                      </label>
                      <div className="relative">
                        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="major"
                          name="major"
                          value={formData.major}
                          onChange={handleInputChange}
                          placeholder="Your Major"
                          className="pl-10 focus:ring-2 focus:ring-[#2C3E50] focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="graduationYear" className="text-sm font-medium text-gray-700">
                        Expected Graduation Year
                      </label>
                      <Input
                        id="graduationYear"
                        name="graduationYear"
                        value={formData.graduationYear}
                        onChange={handleInputChange}
                        placeholder="2025"
                        className="focus:ring-2 focus:ring-[#2C3E50] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Housing Preferences Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 text-[#2C3E50]">
                    <Home className="h-5 w-5" />
                    <h3 className="text-xl font-semibold">Housing Preferences</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="moveInDate" className="text-sm font-medium text-gray-700">
                        Preferred Move-in Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="moveInDate"
                          name="moveInDate"
                          type="date"
                          value={formData.moveInDate}
                          onChange={handleInputChange}
                          className="pl-10 focus:ring-2 focus:ring-[#2C3E50] focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="budget" className="text-sm font-medium text-gray-700">
                        Monthly Budget
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="budget"
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          placeholder="e.g., $1000"
                          className="pl-10 focus:ring-2 focus:ring-[#2C3E50] focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="preferredLocation" className="text-sm font-medium text-gray-700">
                        Preferred Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="preferredLocation"
                          name="preferredLocation"
                          value={formData.preferredLocation}
                          onChange={handleInputChange}
                          placeholder="e.g., Near Campus, Downtown"
                          className="pl-10 focus:ring-2 focus:ring-[#2C3E50] focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="roommates" className="text-sm font-medium text-gray-700">
                        Roommate Preference
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="roommates"
                          name="roommates"
                          value={formData.roommates}
                          onChange={handleInputChange}
                          placeholder="e.g., 1-2 roommates"
                          className="pl-10 focus:ring-2 focus:ring-[#2C3E50] focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio Section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-[#2C3E50]">
                    <User className="h-5 w-5" />
                    <h3 className="text-xl font-semibold">About Me</h3>
                  </div>
                  <div className="space-y-2">
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself and your housing preferences..."
                      className="w-full h-32 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2C3E50] focus:border-transparent resize-none"
                      required
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <Button
                    type="submit"
                    className="w-full bg-[#2C3E50] text-white hover:bg-[#34495E] py-6 text-lg font-medium transition-all duration-300"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving Profile...' : 'Complete Profile Setup'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 