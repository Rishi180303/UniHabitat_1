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
  initialMode?: 'signin' | 'signup'
}

export default function AuthModal({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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

    // Test Supabase configuration
    console.log('Supabase Debug - Configuration:', {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      timestamp: new Date().toISOString()
    })

    try {
      let result
      
      if (mode === 'signup') {
        // For signup, use OTP (magic link) - no password needed
        if (!email.endsWith('.edu')) {
          throw new Error('Please use your .edu email address to verify your student status')
        }
        
        const redirectTo = 'http://localhost:3000/auth/callback'
        
        result = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: redirectTo,
            shouldCreateUser: true,
            data: {
              email: email,
              is_student: true
            }
          }
        })
      } else {
        // For signin, use password authentication
        if (!password) {
          throw new Error('Password is required for sign in')
        }
        
        result = await supabase.auth.signInWithPassword({
          email,
          password
        })
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
        setMessage({
          type: 'success',
          text: 'Check your email for the verification link!'
        })
      } else {
        setMessage({
          type: 'success',
          text: 'Sign in successful! Redirecting...'
        })
        setTimeout(() => {
          onClose()
          router.push('/dashboard')
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

      setMessage({
        type: 'error',
        text: error.message || 'An error occurred. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setEmail('')
    setPassword('')
    setMessage(null)
    setMode(initialMode)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'signup' ? 'Create Account' : 'Sign In'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'signup'
              ? 'Create your student account with your .edu email'
              : 'Sign in to your account'
            }
          </DialogDescription>
        </DialogHeader>

        {message && (
          <div className={`p-3 rounded-md text-sm ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={mode === 'signup' ? "your.email@university.edu" : "Enter your email"}
              required
            />
            {mode === 'signup' && (
              <p className="text-sm text-gray-500 mt-1">
                Use your .edu email to verify your student status
              </p>
            )}
          </div>
          
          {mode === 'signin' && (
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
          )}
          
          {mode === 'signup' && (
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Password must be at least 8 characters with uppercase, lowercase, number, and special character.
              </p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading 
              ? (mode === 'signup' ? 'Sending verification...' : 'Signing in...') 
              : (mode === 'signup' ? 'Sign Up' : 'Sign In')
            }
          </Button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {mode === 'signin' 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"
            }
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 