'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import AuthModal from '@/components/AuthModal'

export default function AuthError() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')
  const error_code = searchParams.get('error_code')

  const isExpiredLink = error_code === 'otp_expired' || error_description?.includes('expired')

  const handleRetry = () => {
    setIsAuthModalOpen(true)
  }

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF6ED] px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#2C3E50] mb-2">
            Authentication Error
          </h1>
          <p className="text-gray-600 mb-6">
            {isExpiredLink 
              ? "Your login link has expired. Please request a new one."
              : error_description || "An error occurred during authentication."
            }
          </p>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={handleRetry}
            className="w-full bg-[#2C3E50] text-white hover:bg-[#34495E] py-3"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          
          <Button 
            onClick={handleGoHome}
            variant="outline"
            className="w-full border-[#2C3E50] text-[#2C3E50] hover:bg-[#2C3E50] hover:text-white py-3"
          >
            Go to Home
          </Button>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="signin"
      />
    </div>
  )
} 