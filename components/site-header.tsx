"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Menu, LayoutGrid, BarChart3, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

export function SiteHeader() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutGrid },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/settings", label: "Settings", icon: Settings },
  ]

  const initials = user?.email
    ? user.email.substring(0, 1).toUpperCase()
    : "U"

  return (
    <header className="flex justify-between items-center mb-10 sticky top-0 z-50 bg-background/80 backdrop-blur-md py-4 border-b border-white/5">
      {/* MOBILE MENU */}
      <div className="md:hidden flex items-center">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] glass-card border-r-white/10">
            <SheetHeader>
              <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-6 mt-8">
              <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 relative flex items-center justify-center">
                  <Image src="/logo.svg" alt="Logo" width={32} height={32} />
                </div>
                <span className="text-xl font-bold">AXON</span>
              </div>
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-white/5"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
                <Separator className="my-2 bg-white/10" />
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsOpen(false)
                    logout()
                  }}
                  className="justify-start gap-3 px-3 text-rose-500 hover:bg-rose-500/10"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </Button>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* DESKTOP LOGO */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 relative hidden sm:flex items-center justify-center">
            <Image
              src="/logo.svg"
              alt="Axon Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold tracking-tight">AXON</span>
        </Link>
      </div>

      {/* DESKTOP NAVIGATION */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "transition-colors hover:text-foreground relative py-1",
              pathname === item.href ? "text-foreground font-semibold" : ""
            )}
          >
            {item.label}
            {pathname === item.href && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
            )}
          </Link>
        ))}
      </nav>

      {/* USER & SETTINGS */}
      <div className="flex items-center gap-2 sm:gap-4">
        <ModeToggle />

        <Avatar className="h-9 w-9 sm:h-10 sm:w-10 border-2 border-background ring-2 ring-primary/10">
          <AvatarImage src="" />
          <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
        </Avatar>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => logout()}
          className="hidden md:flex text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}