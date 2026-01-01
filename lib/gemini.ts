import { Habit, CheckIn, UserProfile } from "./types"

const MOCK_SUGGESTIONS = [
  "Your 'Deep Work' sessions are consistently missed on Tuesdays. Consider moving them to Wednesday mornings when your calendar is clearer.",
  "Great streak on 'Morning Run'! To prevent burnout, ensure you're getting 7+ hours of sleep, as your intensity score is high.",
  "You've missed 'Strategic Reflection' 3 times. Is the 10-minute duration too long? Try shrinking it to 2 minutes to re-establish the habit.",
]

export const generateGeminiPrompt = (
  user: UserProfile,
  habits: Habit[],
  recentCheckins: CheckIn[]
) => {
  // This constructs the actual prompt we would send to Gemini
  const habitSummary = habits
    .map((h) => `- ${h.name} (${h.duration}, Status: ${h.status}, Streak: ${h.streak})`)
    .join("\n")

  return `
    You are an executive productivity coach for ${user.name}, a ${user.role}.
    Current Focus: ${user.focus}.
    
    Habit Data:
    ${habitSummary}
    
    Recent Activity:
    ${recentCheckins.length} check-ins in the last 7 days.
    
    Task: Identify one optimization for their schedule. Be concise and directive.
  `
}

export async function getAiCoachResponse(user: UserProfile, habits: Habit[], checkins: CheckIn[]) {
  // LOCAL DEV: Return a random mock response to save API credits/latency
  // IN PRODUCTION: You would uncomment the fetch call to Gemini API here
  
  console.log("Generated Prompt for Gemini:", generateGeminiPrompt(user, habits, checkins))
  
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500))
  
  return MOCK_SUGGESTIONS[Math.floor(Math.random() * MOCK_SUGGESTIONS.length)]
}