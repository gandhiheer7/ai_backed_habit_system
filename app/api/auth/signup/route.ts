import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger' // IMPORT LOGGER

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, displayName } = body

    logger.info('Signup request received', { email }) // CHANGED

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

    if (error) {
      logger.error('Auth signup error', error) // CHANGED
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    logger.info('Auth user created', { userId: data.user?.id }) // CHANGED

    // Create user profile in public.users table
    if (data.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email || email.toLowerCase().trim(),
          display_name: displayName,
        })

      if (profileError) {
        logger.error('Profile insert error', profileError) // CHANGED
      } else {
        logger.info('Profile created successfully', { userId: data.user.id }) // CHANGED
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
    logger.error('Signup fatal error', error) // CHANGED
    return NextResponse.json(
      { error: error.message || 'Signup failed' },
      { status: 500 }
    )
  }
}