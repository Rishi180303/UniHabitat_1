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



    if (error) {

      return NextResponse.redirect(
        `${requestUrl.origin}/auth/error?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(error_description || '')}&error_code=${encodeURIComponent(error_code || '')}`
      )
    }

    if (code) {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
      
      try {


        // First, try to exchange the code for a session
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        

        
        if (exchangeError) {
          console.error('Code exchange error:', exchangeError)
          return NextResponse.redirect(
            `${requestUrl.origin}/auth/error?error=${encodeURIComponent(exchangeError.message)}`
          )
        }

        // Verify we have a user
        if (!data?.user) {
          console.error('No user data after code exchange')
          return NextResponse.redirect(
            `${requestUrl.origin}/auth/error?error=${encodeURIComponent('No user data received')}`
          )
        }
        
        // Redirect to dashboard after successful login
        return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
      } catch (e) {
        console.error('Unexpected error during code exchange:', e)
        return NextResponse.redirect(
          `${requestUrl.origin}/auth/error?error=${encodeURIComponent('unexpected_error')}`
        )
      }
    }

    return NextResponse.redirect(requestUrl.origin)
  } catch (e) {
    console.error('Top-level error in auth callback:', e)
    return NextResponse.redirect(
      `${new URL(request.url).origin}/auth/error?error=${encodeURIComponent('server_error')}`
    )
  }
} 