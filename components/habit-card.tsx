"use client"
import { Button } from "@/components/ui/button"
import { Check, X, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface HabitCardProps {
  id: string
  name: string
  description: string
  duration: string
  status: "pending" | "completed" | "missed"
  onStatusChange: (id: string, status: "completed" | "missed") => void
}

export function HabitCard({ id, name, description, duration, status, onStatusChange }: HabitCardProps) {
  return (
    <div className="glass-card p-6 rounded-2xl flex flex-col justify-between h-full transition-all hover:translate-y-[-2px]">
      <div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-medium tracking-tight text-foreground/90">{name}</h3>
          <span
            className={cn(
              "px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider",
              status === "completed" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
              status === "missed" && "bg-rose-500/10 text-rose-600 dark:text-rose-400",
              status === "pending" && "bg-blue-500/10 text-blue-600 dark:text-blue-400",
            )}
          >
            {status}
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{description}</p>
        <div className="flex items-center text-xs text-muted-foreground mb-6">
          <Clock className="w-3 h-3 mr-1.5" />
          {duration}
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant={status === "completed" ? "default" : "outline"}
          className="flex-1 rounded-xl h-10 text-sm font-medium"
          onClick={() => onStatusChange(id, "completed")}
          disabled={status === "completed"}
        >
          <Check className="w-4 h-4 mr-2" />
          Complete
        </Button>
        <Button
          variant="ghost"
          className="rounded-xl h-10 w-10 p-0 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
          onClick={() => onStatusChange(id, "missed")}
          disabled={status === "missed"}
        >
          <X className="w-4 h-4" />
          <span className="sr-only">Missed</span>
        </Button>
      </div>
    </div>
  )
}
