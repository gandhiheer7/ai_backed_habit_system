"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2, Zap } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const PROFESSIONAL_ROLES = [
  "Software Engineer",
  "Product Manager",
  "Data Scientist",
  "UI/UX Designer",
  "DevOps Engineer",
  "Engineering Manager",
  "CTO",
  "CEO",
  "Founder",
  "Student",
  "Researcher",
  "Consultant",
  "Marketing Manager",
  "Sales Executive",
  "HR Manager",
  "Financial Analyst",
  "Operations Manager",
  "Project Manager",
  "Content Creator",
  "Other"
]

export default function LoginPage() {
  const { loginWithEmail, signupWithEmail } = useAuth()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("login")
  
  // Login States
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  
  // Signup States
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [signupName, setSignupName] = useState("")
  const [signupRole, setSignupRole] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[LoginPage] Login submitted")
    setError("")
    setLoading(true)
    
    try {
      await loginWithEmail(loginEmail, loginPassword)
      console.log("[LoginPage] loginWithEmail promise resolved")
    } catch (err: any) {
      console.error("[LoginPage] Login caught error:", err)
      setError(err.message || "Failed to login")
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[LoginPage] Signup submitted")
    setError("")
    
    if (!signupRole) {
      setError("Please select a professional role.")
      return
    }

    setLoading(true)
    
    try {
      await signupWithEmail(signupEmail, signupPassword, signupName, signupRole)
      console.log("[LoginPage] Signup success")
      
      setLoading(false)
      toast({
        title: "Account Created",
        description: "Please sign in with your new credentials.",
        variant: "default",
      })
      
      setSignupEmail("")
      setSignupPassword("")
      setSignupName("")
      setSignupRole("")
      setActiveTab("login")
      
    } catch (err: any) {
      console.error("[LoginPage] Signup caught error:", err)
      setError(err.message || "Failed to create account")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="mb-8 flex items-center gap-2 text-2xl font-bold tracking-tighter">
        <div className="p-1.5 rounded bg-primary text-primary-foreground">
          <Zap className="w-5 h-5" fill="currentColor" />
        </div>
        <span>AXON</span>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="login">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Register</TabsTrigger>
        </TabsList>

        {error && (
          <Alert variant="destructive" className="mb-4 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <TabsContent value="login">
          <Card className="border-border/40 shadow-xl">
            <CardHeader>
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription>Enter your credentials to access the protocol.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="executive@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signup">
          <Card className="border-border/40 shadow-xl">
            <CardHeader>
              <CardTitle>Initialize Profile</CardTitle>
              <CardDescription>Create a new executive account.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input 
                    id="signup-name" 
                    placeholder="John Doe"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-role">Professional Role</Label>
                  <Select value={signupRole} onValueChange={setSignupRole}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROFESSIONAL_ROLES.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input 
                    id="signup-email" 
                    type="email" 
                    placeholder="executive@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input 
                    id="signup-password" 
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}