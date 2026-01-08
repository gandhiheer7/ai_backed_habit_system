"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FocusTimerProps {
  onSessionComplete?: (minutes: number) => void
}

export function FocusTimer({ onSessionComplete }: FocusTimerProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Main timer logic
  useEffect(() => {
    if (!isRunning) return

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false)
          if (isSoundEnabled && audioRef.current) {
            audioRef.current.play().catch(() => {}) // Silent fail if audio unavailable
          }
          setSessionsCompleted((s) => s + 1)
          onSessionComplete?.(25)
          return 25 * 60 // Reset for next session
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, isSoundEnabled, onSessionComplete])

  const handleToggle = () => setIsRunning(!isRunning)
  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(25 * 60)
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const displayTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`

  // Calculate progress (0 = full time, 100 = completed)
  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100

  return (
    <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Deep Work Timer</h3>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsSoundEnabled(!isSoundEnabled)}
          className="h-8 w-8 p-0"
        >
          {isSoundEnabled ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Timer Display */}
      <div className="relative flex flex-col items-center justify-center space-y-4">
        <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
          {/* Progress Ring */}
          <svg
            className="absolute inset-0 transform -rotate-90"
            width="160"
            height="160"
            viewBox="0 0 160 160"
          >
            <circle
              cx="80"
              cy="80"
              r="75"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-white/10"
            />
            <circle
              cx="80"
              cy="80"
              r="75"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary transition-all duration-500"
              strokeDasharray={`${(progress / 100) * 471.24} 471.24`}
              strokeLinecap="round"
            />
          </svg>

          <div className="text-center">
            <div className="text-4xl font-mono font-bold tracking-tight">
              {displayTime}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {isRunning ? "In Progress" : "Ready"}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        <Button
          onClick={handleToggle}
          className="rounded-xl h-10 px-6"
          variant={isRunning ? "secondary" : "default"}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Start
            </>
          )}
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          className="rounded-xl h-10 px-6"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Stats */}
      <div className="pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Sessions Today</span>
          <span className="font-semibold">{sessionsCompleted}</span>
        </div>
      </div>

      {/* Hidden audio element for notification */}
      <audio
        ref={audioRef}
        src="data:audio/wav;base64,UklGRmYCAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIBAAAAAA=="
      />
    </div>
  )
}