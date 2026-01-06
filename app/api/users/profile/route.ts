import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET: Fetch user profile
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(profile)
  } catch (error: any) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PUT: Update user profile
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      display_name,
      role,
      professional_focus,
      theme,
      ai_intensity,
      weekend_monitoring,
      smart_rescheduling,
      briefing_time,
      deep_work_protection,
    } = body

    // Update the profile
    const { data: updatedProfile, error: updateError } = await supabase
      .from('users')
      .update({
        display_name: display_name || null,
        role: role || null,
        professional_focus: professional_focus || null,
        theme: theme || 'dark',
        ai_intensity: ai_intensity ?? 50,
        weekend_monitoring: weekend_monitoring ?? false,
        smart_rescheduling: smart_rescheduling ?? true,
        briefing_time: briefing_time || '08:00',
        deep_work_protection: deep_work_protection ?? true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single()

    if (updateError) {
      throw updateError
    }

    return NextResponse.json(updatedProfile)
  } catch (error: any) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: 500 }
    )
  }
}