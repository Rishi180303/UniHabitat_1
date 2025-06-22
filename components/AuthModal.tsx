'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "./auth-provider"
import { useRouter } from "next/navigation"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'signin' | 'signup' | 'verify'
}

export default function AuthModal({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'verify'>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const { user, refreshUser } = useAuth()
  const router = useRouter()

  // Reset mode when modal opens or initialMode changes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode)
      setEmail('')
      setPassword('')
      setOtp('')
      setMessage(null)
    }
  }, [isOpen, initialMode])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const redirectTo = new URL('/auth/callback', window.location.origin).toString()
    
    console.log('Auth Debug - Starting authentication:', {
      mode,
      email,
      redirectTo,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      origin: window.location.origin
    })

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
          shouldCreateUser: mode === 'signup',
        },
      })

      console.log('Auth Debug - OTP Response:', {
        error: error ? {
          message: error.message,
          status: error.status,
          name: error.name
        } : null,
        timestamp: new Date().toISOString(),
        redirectTo
      })

      if (error) {
        throw error
      }

      setMessage({
        type: 'success',
        text: 'Check your email for the login link!'
      })
    } catch (error: any) {
      console.error('Auth Debug - Error details:', {
        error: {
          message: error.message,
          status: error.status,
          name: error.name,
          stack: error.stack
        },
        timestamp: new Date().toISOString()
      })

      setMessage({
        type: 'error',
        text: error.message || 'An error occurred. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.endsWith('.edu')) {
      setMessage({
        type: 'error',
        text: '⚠️ Please use your .edu email address to verify your student status'
      })
      return
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      setMessage({
        type: 'error',
        text: `⚠️ ${passwordError}`
      })
      return
    }
    
    setIsLoading(true)
    setMessage(null)
    
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
        setMessage({
          type: 'error',
          text: `⚠️ ${error.message}`
        })
        console.error('Supabase error:', error)
      } else {
        setMode('verify')
        setMessage({
          type: 'success',
          text: '✅ Please check your email for the verification code. If you don\'t see it, check your spam folder.'
        })
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: '⚠️ An error occurred. Please try again.'
      })
      console.error('Network or unexpected error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email'
      })

      if (error) {
        if (error.message.includes('Invalid OTP')) {
          setMessage({
            type: 'error',
            text: '⚠️ Invalid verification code. Please check the code and try again.'
          })
        } else if (error.message.includes('expired')) {
          setMessage({
            type: 'error',
            text: '⚠️ Verification code has expired. Please request a new code.'
          })
        } else if (error.message.includes('rate limit')) {
          setMessage({
            type: 'error',
            text: '⚠️ Too many attempts. Please wait a few minutes before trying again.'
          })
        } else {
          setMessage({
            type: 'error',
            text: `⚠️ ${error.message}`
          })
        }
      } else {
        setMessage({
          type: 'success',
          text: '✅ Email verified successfully! Redirecting...'
        })
        setTimeout(() => {
          // Check if user has completed profile setup
          const checkProfile = async () => {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user?.id)
              .single()

            if (profile) {
              router.push('/dashboard')
            } else {
              router.push('/profile/setup')
            }
            onClose()
          }
          checkProfile()
        }, 1500)
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: '⚠️ An error occurred. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setEmail('')
    setPassword('')
    setOtp('')
    setMessage(null)
    setMode('signin')
    onClose()
  }

  const renderForm = () => {
    switch (mode) {
      case 'signup':
        return (
          <form onSubmit={handleSignUp} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="email">.edu Email Address</Label>
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
              <Label htmlFor="password">Password</Label>
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
                message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                <p className={`text-sm font-medium ${
                  message.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {message.text}
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
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>

            {message && (
              <div className={`p-3 rounded-md ${
                message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                <p className={`text-sm font-medium ${
                  message.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {message.text}
                </p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-[#2C3E50] text-white hover:bg-[#34495E]"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Sign In'}
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
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter the 6-digit code from your email"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full"
                required
                maxLength={6}
                pattern="[0-9]*"
                inputMode="numeric"
              />
              <p className="text-xs text-gray-500">
                Enter the 6-digit code sent to your email address
              </p>
            </div>

            {message && (
              <div className={`p-3 rounded-md ${
                message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                <p className={`text-sm font-medium ${
                  message.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {message.text}
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

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-500">
                Didn't receive the code? Check your spam folder.
              </p>
              <button
                type="button"
                onClick={() => {
                  setMode('signup')
                  setMessage(null)
                }}
                className="text-sm text-[#2C3E50] hover:underline"
              >
                Try a different email
              </button>
            </div>
          </form>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#2C3E50]">
            {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Verify Email'}
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