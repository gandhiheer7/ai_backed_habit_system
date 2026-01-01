"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { IntensityChart, CompletionBarChart } from "@/components/analytics-charts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, Zap, Target, Brain } from "lucide-react"

// Define the shape of the API response
interface AnalyticsData {
  intensityData: any[]
  completionRate: number
  totalFocusMinutes: number
  currentStreak: number
  cognitiveLoadScore: number
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(json => {
        setData(json)
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch analytics:", err)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Calibrating Metrics...</div>

  // Mock weekly data (in a real app, this would also come from the API)
  const weeklyMock = [
    { name: 'Week 1', completed: 65 },
    { name: 'Week 2', completed: data?.completionRate || 0 }, // Use real rate for current week
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

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Cognitive Load", value: data?.cognitiveLoadScore || 0, icon: Brain, trend: "Real-time" },
          { title: "Completion Rate", value: `${data?.completionRate}%`, icon: Target, trend: "This Week" },
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
        {/* Main Chart: Intensity */}
        <Card className="col-span-1 lg:col-span-2 glass-card border-white/5 bg-transparent">
          <CardHeader>
            <CardTitle>Peak Performance Zones (45 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Pass the real fetched data here */}
            <IntensityChart data={data?.intensityData || []} />
          </CardContent>
        </Card>

        {/* Secondary Chart: Weekly Breakdown */}
        <Card className="glass-card border-white/5 bg-transparent">
          <CardHeader>
            <CardTitle>Weekly Consistency</CardTitle>
          </CardHeader>
          <CardContent>
            <CompletionBarChart data={weeklyMock} />
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Deep Work</span>
                <span className="font-medium">18 hrs</span>
              </div>
              <div className="w-full bg-muted/20 h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[75%]" />
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Learning</span>
                <span className="font-medium">5 hrs</span>
              </div>
              <div className="w-full bg-muted/20 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[40%]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}