'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  useEffect(() => {
    // This page will be shown briefly while the server handles the authentication
    // The actual redirect happens in the route.ts file
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-[#FDF6ED] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <h1 className="text-2xl font-bold text-red-600">
            Authentication Error
          </h1>
          <p className="text-gray-600">
            {error === 'session' && 'There was a problem with your session. Please try signing in again.'}
            {error === 'user' && 'Could not verify your account. Please try signing in again.'}
            {error === 'unknown' && 'Something went wrong. Please try signing in again.'}
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-[#2C3E50] text-white rounded-md hover:bg-[#34495E] transition-colors"
          >
            Return to Home
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDF6ED] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <h1 className="text-2xl font-bold text-[#2C3E50]">
          Welcome back!
        </h1>
        <p className="text-gray-600">
          Verifying your magic link...
        </p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C3E50]"></div>
        </div>
      </motion.div>
    </div>
  )
} 