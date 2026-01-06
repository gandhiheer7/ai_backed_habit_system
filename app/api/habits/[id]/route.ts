import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// DELETE: Delete a habit
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: habitId } = await params

    const supabase = await createServerSupabaseClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify the habit belongs to the user
    const { data: habit, error: habitError } = await supabase
      .from('habits')
      .select('id')
      .eq('id', habitId)
      .eq('user_id', user.id)
      .single()

    if (habitError || !habit) {
      return NextResponse.json(
        { error: 'Habit not found' },
        { status: 404 }
      )
    }

    // Delete the habit (checkins will cascade delete due to foreign key)
    const { error: deleteError } = await supabase
      .from('habits')
      .delete()
      .eq('id', habitId)

    if (deleteError) {
      throw deleteError
    }

    return NextResponse.json({ success: true, message: 'Habit deleted' })
  } catch (error: any) {
    console.error('Delete habit error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete habit' },
      { status: 500 }
    )
  }
}

// PUT: Update a habit
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: habitId } = await params

    const supabase = await createServerSupabaseClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, duration, category, weight } = body

    if (!name) {
      return NextResponse.json(
        { error: 'name is required' },
        { status: 400 }
      )
    }

    // Verify the habit belongs to the user
    const { data: habit, error: habitError } = await supabase
      .from('habits')
      .select('id')
      .eq('id', habitId)
      .eq('user_id', user.id)
      .single()

    if (habitError || !habit) {
      return NextResponse.json(
        { error: 'Habit not found' },
        { status: 404 }
      )
    }

    // Update the habit
    const { data: updatedHabit, error: updateError } = await supabase
      .from('habits')
      .update({
        name,
        description: description || '',
        duration: duration || '15 min',
        category: category || '',
        weight: weight || 5,
        updated_at: new Date().toISOString(),
      })
      .eq('id', habitId)
      .select()
      .single()

    if (updateError) {
      throw updateError
    }

    return NextResponse.json(updatedHabit)
  } catch (error: any) {
    console.error('Update habit error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update habit' },
      { status: 500 }
    )
  }
}