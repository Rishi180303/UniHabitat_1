'use client'

import { useAuth } from '@/components/auth-provider'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { GraduationCap, BookOpen, User, ArrowRight, ArrowLeft, Image as ImageIcon } from 'lucide-react'
import { checkUserProfile, hasCompleteProfile } from '@/lib/utils'
import UniversitySearch from '@/components/UniversitySearch'

interface ProfileFormData {
  full_name: string
  university: string
  graduation_year: string
  bio: string
  avatar_url: string
}

type Step = 'personal' | 'academic' | 'about' | 'avatar'

export default function ProfileSetup() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('edit') === '1';
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState<Step>('personal')
  const [checkingProfile, setCheckingProfile] = useState(true)
  const [profileComplete, setProfileComplete] = useState(false)
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: '',
    university: '',
    graduation_year: '',
    bio: '',
    avatar_url: ''
  })
  const [universityDropdownOpen, setUniversityDropdownOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
      return
    }

    // In edit mode, always load the profile and prefill
    if (user && checkingProfile) {
      checkUserProfile(user.id).then((userProfile) => {
        if (userProfile) {
          if (isEditMode) {
            setFormData({
              full_name: userProfile.full_name || '',
              university: userProfile.university || '',
              graduation_year: userProfile.year || '',
              bio: userProfile.bio || '',
              avatar_url: userProfile.avatar_url || ''
            })
            setCheckingProfile(false)
          } else {
            // If not in edit mode and profile is complete, redirect to dashboard
            if (hasCompleteProfile(userProfile)) {
              setProfileComplete(true)
              router.push('/dashboard')
              return
            }
            setCheckingProfile(false)
          }
        } else {
          setCheckingProfile(false)
        }
      })
    }
  }, [user, loading, router, checkingProfile, isEditMode])

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
    if (!formData.full_name || !formData.university || !formData.graduation_year || !formData.bio) {
      alert('Please fill in all required fields before submitting.')
      return
    }
    setIsSubmitting(true)
    try {
      const profileData = {
        id: user?.id,
        email: user?.email,
        full_name: formData.full_name,
        university: formData.university,
        year: formData.graduation_year,
        bio: formData.bio,
        avatar_url: formData.avatar_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(formData.full_name),
        created_at: new Date().toISOString()
      }
      const { data, error } = await supabase
        .from('profiles')
        .upsert(profileData)
        .select()
      if (error) throw error
      setProfileComplete(true)
      if (isEditMode) {
        router.push('/profile')
      } else {
        router.push('/dashboard')
      }
    } catch (error: any) {
      alert(`Error saving profile: ${error.message || 'Please try again.'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep === 'personal') setCurrentStep('academic')
    else if (currentStep === 'academic') setCurrentStep('about')
    else if (currentStep === 'about') setCurrentStep('avatar')
  }

  const prevStep = () => {
    if (currentStep === 'academic') setCurrentStep('personal')
    else if (currentStep === 'about') setCurrentStep('academic')
    else if (currentStep === 'avatar') setCurrentStep('about')
  }

  if (loading || checkingProfile || profileComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF6ED]">
        <div className="animate-pulse text-[#2C3E50] text-lg">
          {profileComplete ? (isEditMode ? 'Redirecting to profile...' : 'Redirecting to dashboard...') : 'Loading...'}
        </div>
      </div>
    )
  }

  // If no user, redirect (handled by useEffect)
  if (!user) {
    return null
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'personal':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-[#2C3E50] mb-3">
                Tell us about yourself
              </h2>
              <p className="text-gray-600">
                Let's start with your basic information
              </p>
            </div>
            <div className="max-w-md mx-auto space-y-6">
              <div className="space-y-2">
                <label htmlFor="full_name" className="text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="pl-10 focus:ring-2 focus:ring-[#2C3E50] focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div className="pt-6">
                <Button
                  type="button"
                  onClick={nextStep}
                  className="w-full bg-[#2C3E50] text-white hover:bg-[#34495E] py-6 text-lg font-medium transition-all duration-300"
                >
                  Continue <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )
      case 'academic':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-[#2C3E50] mb-3">
                Academic Information
              </h2>
              <p className="text-gray-600">
                Tell us about your university and studies
              </p>
            </div>
            <div className="max-w-md mx-auto space-y-6">
              <div className={`space-y-2 transition-all duration-200 ${universityDropdownOpen ? 'mb-40' : ''}`}>
                <label htmlFor="university" className="text-sm font-medium text-gray-700">
                  University
                </label>
                <UniversitySearch
                  value={formData.university}
                  onChange={(value) => setFormData(prev => ({ ...prev, university: value }))}
                  placeholder="Search for your university"
                  className="w-full"
                  onDropdownOpenChange={setUniversityDropdownOpen}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="graduation_year" className="text-sm font-medium text-gray-700">
                  Expected Graduation Year
                </label>
                <div className="relative">
                  <Input
                    id="graduation_year"
                    name="graduation_year"
                    value={formData.graduation_year}
                    onChange={handleInputChange}
                    placeholder="2026"
                    className="pl-4 focus:ring-2 focus:ring-[#2C3E50] focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  onClick={prevStep}
                  variant="outline"
                  className="flex items-center"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" /> Back
                </Button>
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-[#2C3E50] text-white hover:bg-[#34495E] px-8"
                >
                  Continue <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )
      case 'about':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-[#2C3E50] mb-3">
                About You
              </h2>
              <p className="text-gray-600">
                Share a little about yourself
              </p>
            </div>
            <div className="max-w-md mx-auto space-y-6">
              <div className="space-y-2">
                <label htmlFor="bio" className="text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about your interests, hobbies, or what you're looking for in a place to live."
                  className="w-full min-h-[100px] rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#2C3E50] focus:border-transparent"
                  required
                />
              </div>
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  onClick={prevStep}
                  variant="outline"
                  className="flex items-center"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" /> Back
                </Button>
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-[#2C3E50] text-white hover:bg-[#34495E] px-8"
                >
                  Continue <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )
      case 'avatar':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-[#2C3E50] mb-3">
                Add a Profile Picture
              </h2>
              <p className="text-gray-600">
                Paste a link to your avatar or leave blank for a default
              </p>
            </div>
            <div className="max-w-md mx-auto space-y-6">
              <div className="space-y-2">
                <label htmlFor="avatar_url" className="text-sm font-medium text-gray-700">
                  Avatar URL
                </label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="avatar_url"
                    name="avatar_url"
                    value={formData.avatar_url}
                    onChange={handleInputChange}
                    placeholder="https://example.com/avatar.png"
                    className="pl-10 focus:ring-2 focus:ring-[#2C3E50] focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  onClick={prevStep}
                  variant="outline"
                  className="flex items-center"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" /> Back
                </Button>
                <Button
                  type="submit"
                  className="bg-[#2C3E50] text-white hover:bg-[#34495E] px-8"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Finish'}
                </Button>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit} className="min-h-screen flex flex-col justify-center items-center bg-[#FDF6ED] py-12">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        {renderStep()}
      </div>
    </form>
  )
} 