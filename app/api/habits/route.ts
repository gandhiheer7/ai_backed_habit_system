import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { habitSchema } from '@/lib/validators'

// GET: Fetch all habits for a user
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

    const { data: habits, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Fetch error:', error)
      throw error
    }

    return NextResponse.json(habits || [])
  } catch (error: any) {
    console.error('Habits fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch habits' },
      { status: 500 }
    )
  }
}

// POST: Create a new habit
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
    const validationResult = habitSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.format() },
        { status: 400 }
      )
    }

    const { name, description, duration, category, weight } = validationResult.data

    const { data: habit, error } = await supabase
      .from('habits')
      .insert({
        user_id: user.id,
        name,
        description: description || '',
        duration: duration,
        category: category || '',
        weight: weight || 5,
        status: 'pending',
        streak: 0,
      })
      .select()
      .single()

    if (error) {
      console.error('Insert error:', error)
      throw error
    }

    return NextResponse.json(habit, { status: 201 })
  } catch (error: any) {
    console.error('Habit creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create habit' },
      { status: 500 }
    )
  }
}