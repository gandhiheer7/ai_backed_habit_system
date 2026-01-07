// lib/rate-limit.ts

type RateLimitStore = {
  [key: string]: {
    tokens: number
    lastRefill: number
  }
}

// Simple in-memory store (Note: This resets if server restarts, but it's free and simple)
const store: RateLimitStore = {}

export function rateLimit(identifier: string, limit: number, windowMs: number) {
  const now = Date.now()
  
  if (!store[identifier]) {
    store[identifier] = {
      tokens: limit,
      lastRefill: now
    }
  }

  const userBucket = store[identifier]
  
  // Refill bucket based on time passed
  const timePassed = now - userBucket.lastRefill
  const tokensToAdd = Math.floor(timePassed / windowMs * limit)
  
  if (tokensToAdd > 0) {
    userBucket.tokens = Math.min(limit, userBucket.tokens + tokensToAdd)
    userBucket.lastRefill = now
  }

  if (userBucket.tokens > 0) {
    userBucket.tokens -= 1
    return { success: true }
  } else {
    return { success: false }
  }
}