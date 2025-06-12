'use client'

import { useAuth } from '@/components/auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'

export default function ProfileSetup() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
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
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-3xl font-bold text-[#2C3E50] mb-6">
            Complete Your Profile
          </h2>
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