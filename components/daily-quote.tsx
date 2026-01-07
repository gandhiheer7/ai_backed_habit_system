"use client"

import { useEffect, useState } from "react"
import { Quote } from "lucide-react"

export function DailyQuote() {
  const [quote, setQuote] = useState("Initializing daily motive...")
  
  useEffect(() => {
    const fetchDailyQuote = async () => {
      // 1. Check Local Storage
      const today = new Date().toISOString().split('T')[0]
      const cached = localStorage.getItem('axon_daily_quote')
      
      if (cached) {
        try {
          const parsed = JSON.parse(cached)
          // If quote is from today, use it and return (Save API call)
          if (parsed.date === today && parsed.text) {
            setQuote(parsed.text)
            return
          }
        } catch (e) {
          localStorage.removeItem('axon_daily_quote')
        }
      }

      // 2. Fetch from API if no cache or old date
      try {
        const res = await fetch('/api/quote')
        if (!res.ok) throw new Error("Failed to fetch")
        
        const data = await res.json()
        
        // 3. Save to Local Storage
        localStorage.setItem('axon_daily_quote', JSON.stringify({
          date: today,
          text: data.quote
        }))
        
        setQuote(data.quote)
      } catch (error) {
        // Fallback if API fails
        setQuote("The secret of getting ahead is getting started.")
      }
    }

    fetchDailyQuote()
  }, [])

  return (
    <div className="flex items-start gap-2 text-lg text-muted-foreground italic max-w-2xl">
      <Quote className="w-5 h-5 text-primary mt-1 shrink-0 opacity-50" />
      <p>{quote}</p>
    </div>
  )
}