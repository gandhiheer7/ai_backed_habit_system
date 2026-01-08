"use client"

import { useState } from "react"
import { Zap, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

interface Protocol {
  id: string
  name: string
  description: string
  emoji: string
  habits: {
    name: string
    description: string
    duration: string
    category: string
    weight: number
  }[]
}

const PRESET_PROTOCOLS: Protocol[] = [
  {
    id: "morning-stack",
    name: "Morning Stack",
    description: "Executive preparation protocol",
    emoji: "🌅",
    habits: [
      {
        name: "Cold Exposure",
        description: "Cold shower or ice plunge for activation",
        duration: "10 min",
        category: "Physical",
        weight: 8,
      },
      {
        name: "Strategic Planning",
        description: "Review daily objectives and priorities",
        duration: "15 min",
        category: "Mental",
        weight: 9,
      },
      {
        name: "Deep Work Block",
        description: "Uninterrupted focus on high-impact tasks",
        duration: "90 min",
        category: "Productivity",
        weight: 10,
      },
    ],
  },
  {
    id: "evening-wind-down",
    name: "Evening Wind-Down",
    description: "Recovery and reflection protocol",
    emoji: "🌙",
    habits: [
      {
        name: "Digital Detox",
        description: "No screens or notifications",
        duration: "30 min",
        category: "Recovery",
        weight: 7,
      },
      {
        name: "Journaling",
        description: "Reflect on wins and lessons learned",
        duration: "15 min",
        category: "Mental",
        weight: 6,
      },
      {
        name: "Sleep Hygiene",
        description: "Prepare environment for rest",
        duration: "20 min",
        category: "Sleep",
        weight: 8,
      },
    ],
  },
  {
    id: "performance-boost",
    name: "Performance Boost",
    description: "Cognitive optimization protocol",
    emoji: "⚡",
    habits: [
      {
        name: "Meditation",
        description: "Focus and clarity enhancement",
        duration: "20 min",
        category: "Mental",
        weight: 7,
      },
      {
        name: "Exercise",
        description: "Cardiovascular and strength work",
        duration: "45 min",
        category: "Physical",
        weight: 9,
      },
      {
        name: "Nutrition Optimization",
        description: "Balanced meal with optimal macros",
        duration: "30 min",
        category: "Health",
        weight: 7,
      },
      {
        name: "Learning Session",
        description: "Skill development and knowledge acquisition",
        duration: "60 min",
        category: "Growth",
        weight: 8,
      },
    ],
  },
]

interface QuickProtocolsProps {
  onProtocolInstalled?: (habitCount: number) => void
}

export function QuickProtocols({ onProtocolInstalled }: QuickProtocolsProps) {
  const [installingId, setInstallingId] = useState<string | null>(null)
  const [installedProtocols, setInstalledProtocols] = useState<Set<string>>(
    new Set()
  )

  const handleInstallProtocol = async (protocol: Protocol) => {
    setInstallingId(protocol.id)

    try {
      const habitPromises = protocol.habits.map((habit) =>
        fetch("/api/habits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(habit),
        }).then((res) => {
          if (!res.ok) throw new Error("Failed to create habit")
          return res.json()
        })
      )

      await Promise.all(habitPromises)

      setInstalledProtocols((prev) => new Set([...prev, protocol.id]))
      onProtocolInstalled?.(protocol.habits.length)
      toast({
        title: "Protocol Installed",
        description: `${protocol.habits.length} habits added to your stack.`,
      })
    } catch (error) {
      console.error("Protocol installation error:", error)
      toast({
        variant: "destructive",
        title: "Installation Failed",
        description: "Could not install protocol. Please try again.",
      })
    } finally {
      setInstallingId(null)
    }
  }

  return (
    <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-6">
      <div className="flex items-center gap-2">
        <Zap className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Protocol Library</h3>
      </div>

      <div className="space-y-3">
        {PRESET_PROTOCOLS.map((protocol) => (
          <div
            key={protocol.id}
            className="group p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{protocol.emoji}</span>
                  <div>
                    <h4 className="font-semibold text-sm">{protocol.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {protocol.description}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {protocol.habits.map((habit, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-primary/10 text-primary rounded-md"
                    >
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {habit.name}
                    </span>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => handleInstallProtocol(protocol)}
                disabled={installingId === protocol.id || installedProtocols.has(protocol.id)}
                className="rounded-lg h-9 px-3 flex-shrink-0 whitespace-nowrap"
                size="sm"
                variant={installedProtocols.has(protocol.id) ? "secondary" : "default"}
              >
                {installingId === protocol.id ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Installing...
                  </>
                ) : installedProtocols.has(protocol.id) ? (
                  <>
                    <Plus className="w-3.5 h-3.5 mr-1 line-through" />
                    Installed
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 mr-1.5" />
                    Install
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-white/10">
        <p className="text-xs text-muted-foreground">
          ✨ Install preset habit stacks and customize them on the fly.
        </p>
      </div>
    </div>
  )
}