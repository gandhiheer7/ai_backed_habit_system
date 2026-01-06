import { getServerUser } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const user = await getServerUser()
    return NextResponse.json({ 
      success: true, 
      message: 'Supabase connected!',
      user: user ? { id: user.id, email: user.email } : null
    })
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: error.message 
      },
      { status: 500 }
    )
  }
}