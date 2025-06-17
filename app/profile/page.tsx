'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C3E50]"></div>
      </div>
    )
  }

  if (!user) {
    router.push('/')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-[#2C3E50]">Profile</h1>
            <Button 
              onClick={handleSignOut}
              variant="outline"
              className="text-[#2C3E50] hover:bg-[#2C3E50] hover:text-white"
            >
              Sign Out
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-medium text-gray-500">Email</h2>
              <p className="mt-1 text-lg text-[#2C3E50]">{user.email}</p>
            </div>
            
            <div>
              <h2 className="text-sm font-medium text-gray-500">Last Sign In</h2>
              <p className="mt-1 text-lg text-[#2C3E50]">
                {new Date(user.last_sign_in_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 