import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  const habits = db.habits.getAll(user.id);
  const checkins = db.checkins.getAll(user.id);

  // 1. Calculate Completion Rate
  const total = checkins.length;
  const completed = checkins.filter(c => c.status === 'completed').length;
  const rate = total === 0 ? 0 : Math.round((completed / total) * 100);

  // 2. Generate Mock Chart Data (45 Days)
  // In a real app, you'd aggregate real check-in weights per day
  const intensityData = Array.from({ length: 45 }, (_, i) => ({
    day: `D${i + 1}`,
    intensity: 40 + Math.random() * 60,
    focus: 30 + Math.random() * 50,
  }));

  // 3. Cognitive Load (Simple Mock Calculation)
  // Sum of weights of today's pending habits
  const pendingHabits = habits.filter(h => h.status === 'pending');
  const loadScore = pendingHabits.reduce((acc, h) => acc + (h.weight || 5), 0);

  return NextResponse.json({
    intensityData,
    completionRate: rate,
    totalFocusMinutes: completed * 30, // Approx 30 mins per habit
    currentStreak: 14, // Mock for now
    cognitiveLoadScore: loadScore
  });
}