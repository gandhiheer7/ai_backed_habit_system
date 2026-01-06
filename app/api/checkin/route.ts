import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { checkinSchema } from '@/lib/validators'

export async function POST(request: NextRequest) {
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
    
    // VALIDATION: Use Zod schema
    const validationResult = checkinSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.format() },
        { status: 400 }
      )
    }

    const { habitId, status, reason, notes } = validationResult.data

    // Get today's date in YYYY-MM-DD format (UTC)
    const today = new Date().toISOString().split('T')[0]

    // Check if checkin already exists for today
    const { data: existingCheckin } = await supabase
      .from('checkins')
      .select('id')
      .eq('habit_id', habitId)
      .eq('date', today)
      .single()

    let result

    if (existingCheckin) {
      // Update existing checkin
      const { data, error } = await supabase
        .from('checkins')
        .update({
          status,
          reason: reason || null,
          notes: notes || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingCheckin.id)
        .select()
        .single()

      if (error) throw error
      result = data
    } else {
      // Create new checkin
      const { data, error } = await supabase
        .from('checkins')
        .insert({
          habit_id: habitId,
          user_id: user.id,
          status,
          date: today,
          reason: reason || null,
          notes: notes || null,
        })
        .select()
        .single()

      if (error) throw error
      result = data
    }

    // Update habit streak if completed
    if (status === 'completed') {
      const { data: habit } = await supabase
        .from('habits')
        .select('streak')
        .eq('id', habitId)
        .single()

      if (habit) {
        await supabase
          .from('habits')
          .update({
            streak: (habit.streak || 0) + 1,
            status: 'completed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', habitId)
      }
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    console.error('Checkin error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkin' },
      { status: 500 }
    )
  }
}