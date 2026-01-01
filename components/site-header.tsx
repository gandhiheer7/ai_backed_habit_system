"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="flex justify-between items-center mb-10">
      {/* LOGO */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="text-white font-bold text-xl">A</span>
        </div>
        <span className="text-xl font-bold tracking-tight">AXON</span>
      </div>

      {/* NAVIGATION */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
        <Link 
          href="/" 
          className={cn(
            "transition-colors hover:text-foreground", 
            pathname === "/" ? "text-foreground border-b-2 border-primary pb-1" : ""
          )}
        >
          Dashboard
        </Link>
        <Link 
          href="/analytics" 
          className={cn(
            "transition-colors hover:text-foreground", 
            pathname === "/analytics" ? "text-foreground border-b-2 border-primary pb-1" : ""
          )}
        >
          Analytics
        </Link>
        <Link 
          href="/settings" 
          className={cn(
            "transition-colors hover:text-foreground", 
            pathname.startsWith("/settings") ? "text-foreground border-b-2 border-primary pb-1" : ""
          )}
        >
          Settings
        </Link>
      </nav>

      {/* USER & TOGGLE */}
      <div className="flex items-center gap-4">
        <ModeToggle />
        
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium">Marcus Chen</p>
          <p className="text-xs text-muted-foreground">Managing Director</p>
        </div>
        <Avatar className="h-10 w-10 border-2 border-background ring-2 ring-primary/10">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>MC</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}