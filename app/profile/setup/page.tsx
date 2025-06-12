'use client'

import { useAuth } from '@/components/auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProfileSetup() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDF6ED] py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-[#2C3E50] mb-6">
            Complete Your Profile
          </h1>
          <p className="text-gray-600 mb-8">
            Welcome to UniHabitat! Let's get your profile set up.
          </p>
          
          {/* Placeholder for profile setup form */}
          <div className="space-y-4">
            <p className="text-gray-500 italic">
              Profile setup form will be implemented here...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 