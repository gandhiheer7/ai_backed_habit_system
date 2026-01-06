"use client"

import { useState } from 'react'
import { useAuth } from "@/contexts/auth-context"
import { Brain, RefreshCw, AlertCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function AICoach() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [suggestion, setSuggestion] = useState<any | null>(null)

  const askAI = async () => {
    if (!user) return
    
    setIsLoading(true)
    setError(null)
    setAnalysis(null)
    setSuggestion(null)

    try {
      const response = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })

      if (!response.ok) {
        throw new Error('Failed to get AI analysis')
      }

      const data = await response.json()
      
      setAnalysis(data.analysis || 'No analysis available')
      setSuggestion(data.suggestedAdjustment || null)
    } catch (err: any) {
      setError(err.message || 'Failed to generate analysis')
      console.error('AI Coach error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const applyAdjustment = () => {
    if (suggestion) {
      console.log("Applying adjustment:", suggestion)
      alert(`Suggestion: ${suggestion.action} - ${suggestion.habitName}\n\nDetails: ${suggestion.details}`)
      // Here you could trigger a real action (like opening add-habit dialog)
    }
  }

  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000" />
      
      <div className="relative glass-card p-6 rounded-2xl border-white/10 min-h-[180px] flex flex-col">
        <div className="flex items-start gap-4 flex-1">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <Brain className="w-6 h-6" />
          </div>
          
          <div className="flex-1 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                Neural Coach
                {isLoading && <span className="text-xs text-indigo-400 animate-pulse">Analyzing...</span>}
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 rounded-full hover:bg-white/5"
                onClick={askAI}
                disabled={isLoading}
              >
                <RefreshCw className={cn("w-4 h-4 text-muted-foreground", isLoading && "animate-spin")} />
              </Button>
            </div>

            {/* ERROR STATE */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                <AlertCircle className="w-4 h-4" />
                <p>{error}</p>
              </div>
            )}

            {/* ANALYSIS TEXT */}
            <div className="text-sm text-muted-foreground leading-relaxed">
              {analysis ? (
                <span className="animate-in fade-in">{analysis}</span>
              ) : (
                !isLoading && "System idle. Tap refresh to initialize neural handshake."
              )}
            </div>

            {/* SUGGESTION BUTTON */}
            {suggestion && (
              <div className="mt-4 pt-4 border-t border-white/5 animate-in slide-in-from-bottom-2 fade-in">
                <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-indigo-300">
                      {suggestion.action}: {suggestion.habitName}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {suggestion.details}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={applyAdjustment}
                    className="h-8 text-xs bg-indigo-600 hover:bg-indigo-500 text-white border-0"
                  >
                    Apply <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}