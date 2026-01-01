import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { CheckIn } from '@/lib/types';

export async function POST(req: Request) {
  const user = await getCurrentUser();
  const { habitId, status, notes } = await req.json();

  const checkIn: CheckIn = {
    id: Math.random().toString(36).substr(2, 9),
    habitId,
    userId: user.id,
    status,
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    timestamp: new Date().toISOString(),
    notes: notes || ""
  };

  db.checkins.create(checkIn);

  // Update the habit's status in the "live" view
  // In a real app, you might calculate streaks here
  const habit = db.habits.getById(habitId);
  if (habit) {
    const newStreak = status === 'completed' ? (habit.streak || 0) + 1 : 0;
    db.habits.update(habitId, { status, streak: newStreak });
  }

  return NextResponse.json({ success: true, checkIn });
}