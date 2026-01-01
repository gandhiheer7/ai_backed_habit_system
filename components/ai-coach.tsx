"use client"

import { useState } from "react"
import { Brain, Sparkles, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function AICoach() {
  const [suggestion, setSuggestion] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const askAI = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/gemini/suggest', { method: 'POST' })
      const data = await res.json()
      setSuggestion(data.suggestion)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch if empty (optional, or wait for user interaction)
  // useEffect(() => { askAI() }, []) 

  return (
    <div className="relative group">
      {/* Abstract Background Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000" />
      
      <div className="relative glass-card p-6 rounded-2xl border-white/10">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <Brain className="w-6 h-6" />
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                Neural Coach
                {loading && <span className="text-xs text-muted-foreground animate-pulse">Analyzing...</span>}
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 rounded-full hover:bg-white/5"
                onClick={askAI}
                disabled={loading}
              >
                <RefreshCw className={cn("w-4 h-4 text-muted-foreground", loading && "animate-spin")} />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {suggestion || "Ready to analyze your protocol. Tap the button to generate optimization insights based on your recent performance."}
            </p>

            {suggestion && (
              <div className="pt-2 flex gap-2 animate-in fade-in slide-in-from-top-2">
                <Button variant="outline" size="sm" className="h-8 text-xs rounded-lg border-white/10 hover:bg-white/5">
                  <Sparkles className="w-3 h-3 mr-2 text-indigo-400" />
                  Apply Adjustment
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}