"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { IntensityChart, CompletionBarChart } from "@/components/analytics-charts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, Zap, Target, Brain } from "lucide-react"

interface AnalyticsData {
  intensityData: any[]
  completionRate: number
  totalFocusMinutes: number
  currentStreak: number
  cognitiveLoadScore: number
}

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) router.push("/login")
  }, [authLoading, user, router])

  // Fetch Data when user is ready
  useEffect(() => {
    if (user) {
      fetch(`/api/analytics`)
        .then(res => res.json())
        .then(json => {
          setData(json)
          setLoading(false)
        })
        .catch(err => {
          console.error("Failed to fetch analytics:", err)
          setLoading(false)
        })
    }
  }, [user])

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Calibrating Metrics...</div>
  }

  // Mock weekly breakdown for UI visualization
  const weeklyMock = [
    { name: 'Week 1', completed: 65 },
    { name: 'This Week', completed: data?.completionRate || 0 },
    { name: 'Week 3', completed: 0 },
    { name: 'Week 4', completed: 0 },
  ]

  return (
    <main className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto space-y-8">
      <SiteHeader />

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">System Analytics</h1>
        <p className="text-muted-foreground">Real-time Performance & Cognitive Load Analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Cognitive Load", value: data?.cognitiveLoadScore || 0, icon: Brain, trend: "Real-time" },
          { title: "Completion Rate", value: `${data?.completionRate || 0}%`, icon: Target, trend: "All Time" },
          { title: "Focus Minutes", value: data?.totalFocusMinutes || 0, icon: Zap, trend: "Total" },
          { title: "Current Streak", value: data?.currentStreak || 0, icon: ArrowUpRight, trend: "Days" },
        ].map((stat, i) => (
          <Card key={i} className="glass-card border-white/5 bg-white/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-emerald-500">{stat.trend}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="col-span-1 lg:col-span-2 glass-card border-white/5 bg-transparent">
          <CardHeader>
            <CardTitle>Peak Performance Zones</CardTitle>
          </CardHeader>
          <CardContent>
            <IntensityChart data={data?.intensityData || []} />
          </CardContent>
        </Card>

        <Card className="glass-card border-white/5 bg-transparent">
          <CardHeader>
            <CardTitle>Weekly Consistency</CardTitle>
          </CardHeader>
          <CardContent>
            <CompletionBarChart data={weeklyMock} />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}