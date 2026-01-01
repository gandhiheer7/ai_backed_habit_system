"use client"

import { SiteHeader } from "@/components/site-header"
import { ProfileForm, AIConfigForm, NotificationsForm } from "@/components/settings-view"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, User, Bell, Activity, Zap, Coffee } from "lucide-react"

export default function SettingsPage() {
  return (
    <main className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto space-y-8">
      <SiteHeader />

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">System Configuration</h1>
        <p className="text-muted-foreground">Manage your identity and calibrate the AI neuro-link.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl">
          <TabsTrigger value="profile" className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <User className="w-4 h-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="ai" className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Brain className="w-4 h-4" /> AI Coach
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Bell className="w-4 h-4" /> Notifications
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* SIDEBAR: Info & Context */}
            <div className="lg:col-span-1 space-y-4">
                 <div className="glass-card p-6 rounded-2xl bg-primary/5 border-primary/20">
                    <h3 className="font-semibold text-primary mb-2">Calibration Tips</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        The AI works best when it knows your role. A "Manager" schedule differs drastically from a "Maker" schedule.
                    </p>
                 </div>

                 {/* NEW: Cognitive Load Explanation */}
                 <div className="glass-card p-6 rounded-2xl">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-500" />
                        Cognitive Load Model
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="text-xs text-muted-foreground leading-relaxed">
                            <strong className="text-foreground">Definition:</strong> A real-time metric tracking mental energy depletion based on task complexity and switching costs.
                        </div>

                        <div className="p-3 rounded-lg bg-white/5 border border-white/5 space-y-2">
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">The Formula</p>
                            <p className="text-xs font-mono text-primary">
                                Load = Σ(Time × Weight) + (Switching × 5)
                            </p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Task Weights</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="flex items-center gap-2">
                                    <Zap className="w-3 h-3 text-amber-500" />
                                    <span>Deep Work</span>
                                </div>
                                <span className="text-right font-mono opacity-50">10 pts</span>

                                <div className="flex items-center gap-2">
                                    <User className="w-3 h-3 text-blue-500" />
                                    <span>Meetings</span>
                                </div>
                                <span className="text-right font-mono opacity-50">5 pts</span>

                                <div className="flex items-center gap-2">
                                    <Coffee className="w-3 h-3 text-emerald-500" />
                                    <span>Recovery</span>
                                </div>
                                <span className="text-right font-mono opacity-50">-5 pts</span>
                            </div>
                        </div>
                    </div>
                 </div>

                 <div className="glass-card p-6 rounded-2xl">
                    <h3 className="font-semibold mb-2">System Status</h3>
                    <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Version</span>
                        <span>v0.2.1 (Beta)</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Sync</span>
                        <span className="text-emerald-500">Active</span>
                    </div>
                 </div>
            </div>

            {/* Main Form Area */}
            <div className="lg:col-span-2">
                <TabsContent value="profile" className="glass-card p-8 rounded-2xl mt-0">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold">User Identity</h2>
                        <p className="text-sm text-muted-foreground">Define how the system addresses you.</p>
                    </div>
                    <ProfileForm />
                </TabsContent>

                <TabsContent value="ai" className="glass-card p-8 rounded-2xl mt-0">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold">Neural Calibration</h2>
                        <p className="text-sm text-muted-foreground">Adjust the behavior of your AI assistant.</p>
                    </div>
                    <AIConfigForm />
                </TabsContent>

                <TabsContent value="notifications" className="glass-card p-8 rounded-2xl mt-0">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold">Alerts & Breaches</h2>
                        <p className="text-sm text-muted-foreground">Configure when and how the system interrupts you.</p>
                    </div>
                    <NotificationsForm />
                </TabsContent>
            </div>
        </div>
      </Tabs>
    </main>
  )
}