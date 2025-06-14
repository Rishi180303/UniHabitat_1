'use client'

import { useAuth } from '@/components/auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { GraduationCap, BookOpen, User, ArrowRight, ArrowLeft } from 'lucide-react'

interface ProfileFormData {
  fullName: string
  university: string
  major: string
  graduationYear: string
  bio: string
}

type Step = 'personal' | 'academic' | 'about'

export default function ProfileSetup() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState<Step>('personal')
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: '',
    university: '',
    major: '',
    graduationYear: '',
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

  const nextStep = () => {
    if (currentStep === 'personal') setCurrentStep('academic')
    else if (currentStep === 'academic') setCurrentStep('about')
  }

  const prevStep = () => {
    if (currentStep === 'academic') setCurrentStep('personal')
    else if (currentStep === 'about') setCurrentStep('academic')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF6ED]">
        <div className="animate-pulse text-[#2C3E50] text-lg">Loading...</div>
      </div>
    )
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
                <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
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

              <div className="pt-6 flex space-x-4">
                <Button
                  type="button"
                  onClick={prevStep}
                  variant="outline"
                  className="flex-1 border-[#2C3E50] text-[#2C3E50] hover:bg-[#2C3E50] hover:text-white py-6 text-lg font-medium transition-all duration-300"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" /> Back
                </Button>
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 bg-[#2C3E50] text-white hover:bg-[#34495E] py-6 text-lg font-medium transition-all duration-300"
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
                Tell us a bit more about yourself
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
                  placeholder="Tell us about yourself..."
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2C3E50] focus:border-transparent resize-none"
                  required
                />
              </div>

              <div className="pt-6 flex space-x-4">
                <Button
                  type="button"
                  onClick={prevStep}
                  variant="outline"
                  className="flex-1 border-[#2C3E50] text-[#2C3E50] hover:bg-[#2C3E50] hover:text-white py-6 text-lg font-medium transition-all duration-300"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" /> Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#2C3E50] text-white hover:bg-[#34495E] py-6 text-lg font-medium transition-all duration-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Complete Profile'}
                </Button>
              </div>
            </div>
          </div>
        )
    }
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
          <div className="mb-12">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep === 'personal' ? 'bg-[#2C3E50] text-white' : 'bg-gray-200 text-gray-600'
                }`}>1</div>
                <div className={`ml-2 font-medium ${
                  currentStep === 'personal' ? 'text-[#2C3E50]' : 'text-gray-600'
                }`}>Personal</div>
              </div>
              <div className="w-16 h-0.5 bg-gray-300"></div>
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep === 'academic' ? 'bg-[#2C3E50] text-white' : 'bg-gray-200 text-gray-600'
                }`}>2</div>
                <div className={`ml-2 font-medium ${
                  currentStep === 'academic' ? 'text-[#2C3E50]' : 'text-gray-600'
                }`}>Academic</div>
              </div>
              <div className="w-16 h-0.5 bg-gray-300"></div>
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep === 'about' ? 'bg-[#2C3E50] text-white' : 'bg-gray-200 text-gray-600'
                }`}>3</div>
                <div className={`ml-2 font-medium ${
                  currentStep === 'about' ? 'text-[#2C3E50]' : 'text-gray-600'
                }`}>About</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <form onSubmit={handleSubmit}>
                {renderStep()}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 