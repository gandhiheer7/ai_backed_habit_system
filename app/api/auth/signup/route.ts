import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, displayName } = body

    console.log('Signup request:', { email, displayName })

    const supabase = await createServerSupabaseClient()

    // Sign up user
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    })

    console.log('Auth signup result:', { user: data.user?.id, error })

    if (error) {
      console.error('Auth signup error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Create user profile in public.users table
    if (data.user) {
      console.log('Creating user profile for:', data.user.id)

      const { data: insertData, error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email || email.toLowerCase().trim(),
          display_name: displayName,
        })

      if (profileError) {
        console.error('Profile insert error:', profileError)
        // Don't fail signup if profile creation fails - user can still login
      } else {
        console.log('Profile created successfully')
      }
    }

    return NextResponse.json(
      { 
        message: 'Account created successfully. Please check your email to confirm.',
        user: data.user 
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: error.message || 'Signup failed' },
      { status: 500 }
    )
  }
}