import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger' // IMPORT LOGGER

// GET: Fetch all habits for a user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      logger.warn('Unauthorized access attempt to GET /api/habits') // CHANGED
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: habits, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      logger.error('Habits database fetch error', error) // CHANGED
      throw error
    }

    return NextResponse.json(habits || [])
  } catch (error: any) {
    logger.error('Habits API fatal error', error) // CHANGED
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
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, duration, category, weight } = body

    if (!name) {
      logger.warn('Habit creation failed: Missing name', { userId: user.id }) // CHANGED
      return NextResponse.json({ error: 'name is required' }, { status: 400 })
    }

    logger.info('Creating habit', { userId: user.id, habitName: name }) // CHANGED

    const { data: habit, error } = await supabase
      .from('habits')
      .insert({
        user_id: user.id,
        name,
        description: description || '',
        duration: duration || '15 min',
        category: category || '',
        weight: weight || 5,
        status: 'pending',
        streak: 0,
      })
      .select()
      .single()

    if (error) {
      logger.error('Habit insert error', error) // CHANGED
      throw error
    }

    return NextResponse.json(habit, { status: 201 })
  } catch (error: any) {
    logger.error('Habit creation fatal error', error) // CHANGED
    return NextResponse.json(
      { error: error.message || 'Failed to create habit' },
      { status: 500 }
    )
  }
}