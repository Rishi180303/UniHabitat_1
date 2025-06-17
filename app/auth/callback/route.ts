import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const error = requestUrl.searchParams.get('error')
    const error_description = requestUrl.searchParams.get('error_description')
    const error_code = requestUrl.searchParams.get('error_code')
    const type = requestUrl.searchParams.get('type')

    console.log('Auth Callback Debug - Full Request:', {
      url: request.url,
      code: code ? 'present' : 'missing',
      error,
      error_description,
      error_code,
      type,
      searchParams: Object.fromEntries(requestUrl.searchParams.entries()),
      headers: Object.fromEntries(request.headers.entries()),
      timestamp: new Date().toISOString()
    })

    if (error) {
      console.error('Auth Error Details:', { 
        error, 
        error_description,
        error_code,
        type,
        timestamp: new Date().toISOString()
      })
      return NextResponse.redirect(
        `${requestUrl.origin}/?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(error_description || '')}&error_code=${encodeURIComponent(error_code || '')}`
      )
    }

    if (code) {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
      
      try {
        console.log('Attempting to exchange code for session...', {
          code: code.substring(0, 10) + '...', // Log only part of the code for security
          timestamp: new Date().toISOString()
        })

        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        
        if (exchangeError) {
          console.error('Code exchange error:', {
            error: exchangeError,
            message: exchangeError.message,
            status: exchangeError.status,
            timestamp: new Date().toISOString()
          })
          return NextResponse.redirect(
            `${requestUrl.origin}/?error=${encodeURIComponent(exchangeError.message)}`
          )
        }
        
        console.log('Code exchange successful', {
          timestamp: new Date().toISOString()
        })
        // Redirect to profile page after successful login
        return NextResponse.redirect(`${requestUrl.origin}/profile`)
      } catch (e) {
        console.error('Unexpected error during code exchange:', {
          error: e,
          timestamp: new Date().toISOString()
        })
        return NextResponse.redirect(
          `${requestUrl.origin}/?error=${encodeURIComponent('unexpected_error')}`
        )
      }
    }

    console.log('No code or error found in callback', {
      timestamp: new Date().toISOString()
    })
    return NextResponse.redirect(requestUrl.origin)
  } catch (e) {
    console.error('Top-level error in auth callback:', {
      error: e,
      timestamp: new Date().toISOString()
    })
    return NextResponse.redirect(
      `${new URL(request.url).origin}/?error=${encodeURIComponent('server_error')}`
    )
  }
} 