import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Zap, Shield } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Navigation */}
      <header className="px-6 h-16 flex items-center justify-between border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
          <div className="p-1 rounded bg-primary text-primary-foreground">
            <Zap className="w-4 h-4" fill="currentColor" />
          </div>
          <span>AXON</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              Sign In
            </Button>
          </Link>
          <Link href="/login">
            <Button className="rounded-full px-6 shadow-lg shadow-primary/20">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 space-y-8 relative overflow-hidden">
          {/* Background Gradients (using primary color for subtle glow) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10" />
          
          <div className="space-y-6 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-sm text-muted-foreground backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              System Operational v1.0
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
              Master Your <br />
              <span className="text-muted-foreground">Executive Protocol</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
              The high-performance habit tracking system for elite operators. 
              Optimize your cognitive load, track deep work, and receive neural coaching.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <Link href="/login">
              <Button size="lg" className="h-12 px-8 text-lg rounded-full shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all">
                Initialize System
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-5xl text-left w-full px-4">
            {[
              {
                icon: CheckCircle2,
                title: "Protocol Tracking",
                desc: "Monitor daily execution with precision. Zero-friction logging for high-value habits."
              },
              {
                icon: Zap,
                title: "Neural Coaching",
                desc: "AI-driven analysis of your performance consistency and friction points."
              },
              {
                icon: Shield,
                title: "Cognitive Load",
                desc: "Quantify your mental output. Optimize your schedule for peak flow states."
              }
            ].map((feature, i) => (
              <div 
                key={i} 
                className="group p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors duration-300"
              >
                <div className="mb-4 inline-flex p-3 rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border/40 bg-muted/20">
        <p>© 2026 AXON Protocol. All systems nominal.</p>
      </footer>
    </div>
  )
}