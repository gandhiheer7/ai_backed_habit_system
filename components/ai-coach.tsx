"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Sparkles, Loader2, Zap } from "lucide-react"

interface Suggestion {
  habitName: string
  action: string
  details: string
  reason: string
}

interface AIResponse {
  analysis: string
  suggestedAdjustment: Suggestion | null
}

export function AICoach() {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<AIResponse | null>(null)

  const handleAnalyze = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ai-coach', { method: 'POST' })
      if (!res.ok) throw new Error('Analysis failed')
      const data = await res.json()
      setResponse(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="glass-card border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg font-semibold text-foreground">Neural Coach</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {response ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-sm leading-relaxed text-foreground">{response.analysis}</p>
            </div>
            
            {response.suggestedAdjustment && (
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-2">
                <div className="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wide">
                  <Sparkles className="w-4 h-4" />
                  <span>Strategic Adjustment</span>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-lg">
                    {response.suggestedAdjustment.action}: {response.suggestedAdjustment.habitName}
                  </p>
                  <p className="text-sm text-muted-foreground">{response.suggestedAdjustment.details}</p>
                </div>
                <p className="text-xs text-primary/80 italic border-t border-primary/10 pt-2 mt-2">
                  "{response.suggestedAdjustment.reason}"
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-3 opacity-80">
            <Zap className="w-10 h-10 text-primary animate-pulse" />
            <div className="space-y-1">
              <p className="font-medium text-primary">Neural Link Established</p>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Ready to optimize your performance protocol ? Initialize analysis to identify friction points.
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleAnalyze} 
          disabled={loading} 
          className="w-full rounded-xl gap-2 shadow-lg shadow-primary/20"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing Neural Patterns...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4" />
              Analyze Protocol
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}