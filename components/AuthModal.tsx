'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "./auth-provider"
import { useRouter } from "next/navigation"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

type AuthMode = 'signup' | 'signin' | 'verify'

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [mode, setMode] = useState<AuthMode>('signup')
  const { user } = useAuth()
  const router = useRouter()

  const validatePassword = (pass: string) => {
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(pass)
    const hasLowerCase = /[a-z]/.test(pass)
    const hasNumbers = /\d/.test(pass)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass)

    if (pass.length < minLength) return 'Password must be at least 8 characters long'
    if (!hasUpperCase) return 'Password must contain at least one uppercase letter'
    if (!hasLowerCase) return 'Password must contain at least one lowercase letter'
    if (!hasNumbers) return 'Password must contain at least one number'
    if (!hasSpecialChar) return 'Password must contain at least one special character'
    return ''
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.endsWith('.edu')) {
      setMessage('⚠️ Please use your .edu email address to verify your student status')
      return
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      setMessage(`⚠️ ${passwordError}`)
      return
    }
    
    setIsLoading(true)
    setMessage('')
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            email: email,
            is_student: true
          }
        },
      })
      
      if (error) {
        setMessage(`⚠️ ${error.message}`)
        console.error('Supabase error:', error)
      } else {
        setMode('verify')
        setMessage('✅ Please check your email for the verification code. If you don\'t see it, check your spam folder.')
      }
    } catch (error) {
      setMessage('⚠️ An error occurred. Please try again.')
      console.error('Network or unexpected error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setMessage(`⚠️ ${error.message}`)
      } else {
        router.push('/profile/setup')
        onClose()
      }
    } catch (error) {
      setMessage('⚠️ An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email'
      })

      if (error) {
        setMessage(`⚠️ ${error.message}`)
      } else {
        router.push('/profile/setup')
        onClose()
      }
    } catch (error) {
      setMessage('⚠️ An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setEmail('')
    setPassword('')
    setOtp('')
    setMessage('')
    setMode('signup')
    onClose()
  }

  const renderForm = () => {
    switch (mode) {
      case 'signup':
        return (
          <form onSubmit={handleSignUp} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                .edu Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                required
              />
              <p className="text-xs text-gray-500">
                Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.
              </p>
            </div>

            {message && (
              <div className={`p-3 rounded-md ${
                message.includes('⚠️') 
                  ? 'bg-red-50 border border-red-200' 
                  : 'bg-green-50 border border-green-200'
              }`}>
                <p className={`text-sm font-medium ${
                  message.includes('⚠️') 
                    ? 'text-red-800' 
                    : 'text-green-800'
                }`}>
                  {message}
                </p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-[#2C3E50] text-white hover:bg-[#34495E]"
              disabled={isLoading}
            >
              {isLoading ? 'Signing up...' : 'Sign Up'}
            </Button>

            <p className="text-sm text-gray-500 text-center">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-sm text-[#2C3E50] hover:underline"
              >
                Already have an account? Sign in
              </button>
            </div>
          </form>
        )

      case 'signin':
        return (
          <form onSubmit={handleSignIn} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                required
              />
            </div>

            {message && (
              <div className={`p-3 rounded-md ${
                message.includes('⚠️') 
                  ? 'bg-red-50 border border-red-200' 
                  : 'bg-green-50 border border-green-200'
              }`}>
                <p className={`text-sm font-medium ${
                  message.includes('⚠️') 
                    ? 'text-red-800' 
                    : 'text-green-800'
                }`}>
                  {message}
                </p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-[#2C3E50] text-white hover:bg-[#34495E]"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-sm text-[#2C3E50] hover:underline"
              >
                Don't have an account? Sign up
              </button>
            </div>
          </form>
        )

      case 'verify':
        return (
          <form onSubmit={handleVerifyOTP} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="otp" className="text-sm font-medium text-gray-700">
                Verification Code
              </label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter the code from your email"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full"
                required
              />
            </div>

            {message && (
              <div className={`p-3 rounded-md ${
                message.includes('⚠️') 
                  ? 'bg-red-50 border border-red-200' 
                  : 'bg-green-50 border border-green-200'
              }`}>
                <p className={`text-sm font-medium ${
                  message.includes('⚠️') 
                    ? 'text-red-800' 
                    : 'text-green-800'
                }`}>
                  {message}
                </p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-[#2C3E50] text-white hover:bg-[#34495E]"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </Button>

            <p className="text-sm text-gray-500 text-center">
              Didn't receive the code? Check your spam folder or try again.
            </p>
          </form>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#2C3E50]">
            {mode === 'signup' ? 'Create Your Account' :
             mode === 'signin' ? 'Welcome Back' :
             'Verify Your Email'}
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            {mode === 'signup' ? 'Sign up with your .edu email to get started.' :
             mode === 'signin' ? 'Sign in to your account to continue.' :
             'Enter the verification code sent to your email.'}
          </DialogDescription>
        </DialogHeader>

        {renderForm()}
      </DialogContent>
    </Dialog>
  )
} 