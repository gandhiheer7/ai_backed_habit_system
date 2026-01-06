import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log("[API /api/auth/signup] Signup request received")
  try {
    const { email, password, displayName, role } = await request.json()
    console.log(`[API] Processing signup for email: ${email}, role: ${role}`)

    // 1. Create User in Auth (Supabase Auth)
    const supabase = await createServerSupabaseClient()
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          role: role
        }
      }
    })

    if (authError) {
      console.error("[API] Supabase Auth Error:", authError.message)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    const userId = authData.user?.id
    console.log("[API] Auth user created with ID:", userId)

    if (userId) {
      // 2. Create User Profile in 'users' table
      console.log("[API] Inserting into 'users' table...")
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: email,
          display_name: displayName,
          role: role,
          created_at: new Date().toISOString()
        })

      if (profileError) {
        console.error('[API] Profile creation error (Non-fatal):', profileError)
      } else {
        console.log("[API] Profile insertion successful")
      }
    }

    return NextResponse.json({ success: true, user: authData.user }, { status: 201 })
  } catch (error: any) {
    console.error('[API] Signup Fatal Error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}