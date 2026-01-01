import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { getAiCoachResponse } from '@/lib/gemini';

export async function POST() {
  try {
    // 1. Get Context
    const userAuth = await getCurrentUser();
    
    // In a real app, we'd fetch the full profile from db.users
    const fullProfile = { 
      ...userAuth, 
      focus: "High-Leverage Output", 
      coachingIntensity: 8,
      theme: "system" as const 
    };

    const habits = db.habits.getAll(userAuth.id);
    const checkins = db.checkins.getAll(userAuth.id);

    // 2. Get Insight
    const suggestion = await getAiCoachResponse(fullProfile, habits, checkins);

    return NextResponse.json({ suggestion });
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json(
      { suggestion: "System offline. Focus on your core objectives today." }, 
      { status: 500 }
    );
  }
}