'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "./auth-provider"
import { useRouter } from "next/navigation"
import { isAdminUser } from "@/lib/utils"

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

  // Reset form when modal opens or initialMode changes
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

    console.log('Auth Debug - Starting authentication:', {
      mode,
      email,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      origin: window.location.origin,
      hostname: window.location.hostname,
      port: window.location.port
    })

    try {
      let result: any = null
      
      if (mode === 'signup') {
        // For signup, first check if user already exists
        if (!email.endsWith('.edu')) {
          throw new Error('Please use your .edu email address to verify your student status')
        }
        
        // Check if user already exists by attempting to sign in with a dummy password
        // This will fail with "Invalid login credentials" if user exists, or "User not found" if user doesn't exist
        const { error: checkError } = await supabase.auth.signInWithPassword({
          email,
          password: 'dummy_password_for_check'
        })
        
        // If error message indicates user exists (Invalid login credentials), switch to signin mode
        if (checkError && checkError.message.includes('Invalid login credentials')) {
          setMode('signin')
          setMessage({
            type: 'error',
            text: 'This email is already registered. Please sign in instead.'
          })
          return
        }
        
        // User doesn't exist, proceed with signup OTP
        result = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: true,
            data: {
              email: email,
              is_student: true
            }
          }
        })

        console.log('Signup OTP result:', {
          error: result.error ? {
            message: result.error.message,
            status: result.error.status,
            name: result.error.name
          } : null,
          success: !result.error,
          timestamp: new Date().toISOString()
        })
      } else if (mode === 'signin') {
        // For signin, use password authentication
        if (!password) {
          throw new Error('Password is required for sign in')
        }
        
        result = await supabase.auth.signInWithPassword({
          email,
          password
        })
      }

      if (!result) {
        throw new Error('Authentication failed - no response received')
      }

      console.log('Auth Debug - Response:', {
        error: result.error ? {
          message: result.error.message,
          status: result.error.status,
          name: result.error.name
        } : null,
        data: result.data ? 'present' : 'missing',
        timestamp: new Date().toISOString()
      })

      if (result.error) {
        throw result.error
      }

      if (mode === 'signup') {
        setMode('verify')
        setMessage({
          type: 'success',
          text: 'Check your email for the verification code!'
        })
      } else if (mode === 'signin') {
        setMessage({
          type: 'success',
          text: 'Sign in successful! Redirecting...'
        })
        setTimeout(() => {
          onClose()
          // Check if admin user and redirect accordingly
          if (isAdminUser(email)) {
            router.push('/admin')
          } else {
            router.push('/dashboard')
          }
        }, 1500)
      }
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

      // Handle specific error cases - log the exact error message
      console.log('Error message analysis:', {
        message: error.message,
        includesAlready: error.message.includes('already'),
        includesRegistered: error.message.includes('registered'),
        includesExists: error.message.includes('exists'),
        includesUser: error.message.includes('user'),
        fullMessage: error.message
      })

      // Handle specific error cases
      if (error.message.includes('already registered') || 
          error.message.includes('already exists') ||
          error.message.includes('User already registered') ||
          error.message.includes('already been registered')) {
        setMode('signin')
        setMessage({
          type: 'error',
          text: 'This email is already registered. Please sign in instead.'
        })
      } else {
        setMessage({
          type: 'error',
          text: error.message || 'An error occurred. Please try again.'
        })
      }
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
            text: 'Invalid verification code. Please check the code and try again.'
          })
        } else if (error.message.includes('expired')) {
          setMessage({
            type: 'error',
            text: 'Verification code has expired. Please request a new code.'
          })
        } else {
          setMessage({
            type: 'error',
            text: error.message
          })
        }
      } else {
        // After successful OTP verification, update the user's password
        if (password) {
          console.log('Updating user password after OTP verification...')
          const { error: updateError } = await supabase.auth.updateUser({
            password: password
          })
          
          if (updateError) {
            console.error('Password update error:', updateError)
            // Don't fail the whole process if password update fails
            // The user can still access their account
          } else {
            console.log('Password updated successfully')
          }
        }

        setMessage({
          type: 'success',
          text: 'Email verified successfully! Redirecting...'
        })
        setTimeout(() => {
          // Check if user has completed profile setup
          const checkProfile = async () => {
            // Check if admin user and redirect accordingly
            if (isAdminUser(email)) {
              router.push('/admin')
              onClose()
              return
            }

            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('email', email)
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
        text: 'An error occurred. Please try again.'
      })
      console.error('Network or unexpected error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setEmail('')
    setPassword('')
    setOtp('')
    setMessage(null)
    setMode(initialMode)
    onClose()
  }

  const renderForm = () => {
    if (mode === 'verify') {
      return (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div>
            <Label htmlFor="otp" className="text-[#2C3E50] font-medium">Verification Code</Label>
            <Input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the code from your email"
              required
              className="border-[#F5E6D6] focus:border-[#2C3E50] focus:ring-[#2C3E50]"
            />
          </div>
          <Button type="submit" className="w-full bg-[#2C3E50] text-white hover:bg-[#34495E] transition-all duration-300" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </Button>
        </form>
      )
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-[#2C3E50] font-medium">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={mode === 'signup' ? "your.email@university.edu" : "Enter your email"}
            required
            className="border-[#F5E6D6] focus:border-[#2C3E50] focus:ring-[#2C3E50]"
          />
          {mode === 'signup' && (
            <p className="text-sm text-[#34495E] mt-1">
              Use your .edu email to verify your student status
            </p>
          )}
        </div>
        
        {mode === 'signin' && (
          <div>
            <Label htmlFor="password" className="text-[#2C3E50] font-medium">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="border-[#F5E6D6] focus:border-[#2C3E50] focus:ring-[#2C3E50]"
            />
          </div>
        )}
        
        {mode === 'signup' && (
          <div>
            <Label htmlFor="password" className="text-[#2C3E50] font-medium">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              className="border-[#F5E6D6] focus:border-[#2C3E50] focus:ring-[#2C3E50]"
            />
            <p className="text-sm text-[#34495E] mt-1">
              Password must be at least 8 characters with uppercase, lowercase, number, and special character.
            </p>
          </div>
        )}

        <Button type="submit" className="w-full bg-[#2C3E50] text-white hover:bg-[#34495E] transition-all duration-300" disabled={isLoading}>
          {isLoading 
            ? (mode === 'signup' ? 'Sending verification...' : 'Signing in...') 
            : (mode === 'signup' ? 'Sign Up' : 'Sign In')
          }
        </Button>
      </form>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-[#FDF6ED] via-white to-[#F5E6D6] border-2 border-[#F5E6D6] shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#2C3E50] text-2xl font-bold">
            {mode === 'verify' ? 'Verify Your Email' : (mode === 'signup' ? 'Create Account' : 'Sign In')}
          </DialogTitle>
          <DialogDescription className="text-[#34495E] text-base">
            {mode === 'verify' 
              ? 'Enter the verification code sent to your email'
              : mode === 'signup'
              ? 'Create your student account with your .edu email'
              : 'Sign in to your account'
            }
          </DialogDescription>
        </DialogHeader>

        {message && (
          <div className={`p-4 rounded-xl text-sm border-2 ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border-green-200' 
              : 'bg-red-50 text-red-800 border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {renderForm()}

        {mode !== 'verify' && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-sm text-[#2C3E50] hover:text-[#34495E] font-medium transition-colors"
            >
              {mode === 'signin' 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 