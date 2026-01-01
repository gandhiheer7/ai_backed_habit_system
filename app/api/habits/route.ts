import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { Habit } from '@/lib/types';

export async function GET() {
  const user = await getCurrentUser();
  const habits = db.habits.getAll(user.id);
  
  // Seed initial data if empty (First Run Experience)
  if (habits.length === 0) {
    const initial: Habit[] = [
      { 
        id: "1", userId: user.id, name: "Strategic Reflection", 
        description: "Review top 3 objectives.", duration: "10 min", 
        status: "pending", streak: 5, createdAt: new Date().toISOString(), weight: 8 
      },
      { 
        id: "2", userId: user.id, name: "Deep Work Block", 
        description: "Distraction-free focus.", duration: "90 min", 
        status: "pending", streak: 12, createdAt: new Date().toISOString(), weight: 10 
      },
    ];
    initial.forEach(h => db.habits.create(h));
    return NextResponse.json(initial);
  }

  return NextResponse.json(habits);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  const body = await req.json();
  
  const newHabit: Habit = {
    id: Math.random().toString(36).substr(2, 9),
    userId: user.id,
    createdAt: new Date().toISOString(),
    streak: 0,
    status: "pending",
    weight: 5, // Default cognitive weight
    ...body
  };

  db.habits.create(newHabit);
  return NextResponse.json(newHabit);
}