'use client'

import { useSearchParams } from 'next/navigation'
import { Button } from './ui/button'
import AuthModal from './AuthModal'
import { useState } from 'react'

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  if (!error) return null

  const getErrorMessage = () => {
    if (error === 'access_denied' && errorDescription?.includes('expired')) {
      return 'Your login link has expired. Please request a new one.'
    }
    return errorDescription || 'An error occurred during authentication.'
  }

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
      <div className="bg-white p-4 rounded-lg shadow-lg border border-red-200">
        <div className="text-red-600 font-medium mb-2">Authentication Error</div>
        <p className="text-gray-600 mb-4">{getErrorMessage()}</p>
        <Button 
          onClick={() => setIsAuthModalOpen(true)}
          className="w-full bg-[#2C3E50] text-white hover:bg-[#34495E]"
        >
          Try Again
        </Button>
      </div>
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  )
} 