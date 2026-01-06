"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function LoginPage() {
  const { loginWithEmail, signupWithEmail, user, loading } = useAuth();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("login");
  
  const isSigningUp = useRef(false);

  // If user is already logged in, stay on login page (don't redirect)
  useEffect(() => {
    if (loading) return
    // Don't redirect - just show login page
  }, [user, loading]);

  const handleSubmit = async (e: React.FormEvent, type: "login" | "signup") => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    try {
      if (type === "login") {
        await loginWithEmail(email, password);
      } else {
        isSigningUp.current = true; 
        await signupWithEmail(email, password, name);
        
        setSuccess("Account created successfully! Please log in.");
        setActiveTab("login");
        isSigningUp.current = false;
      }
    } catch (err: any) {
      isSigningUp.current = false;
      if (err.code === "invalid_grant") setError("Invalid email or password.");
      else if (err.message?.includes("already registered")) setError("Email already exists.");
      else if (err.message?.includes("password")) setError("Password should be at least 6 characters.");
      else setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">AXON</h1>
          <p className="text-muted-foreground">Executive Habit Protocol</p>
        </div>

        {/* Success Message */}
        {success && (
          <Alert className="border-green-500/50 text-green-600 dark:text-green-400 bg-green-500/10">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* LOGIN TAB */}
          <TabsContent value="login">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>Enter your credentials to access your stack.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form id="login-form" onSubmit={(e) => handleSubmit(e, "login")} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" required />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </form>
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit" form="login-form" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* SIGNUP TAB */}
          <TabsContent value="signup">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>Initialize your protocol today.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form id="signup-form" onSubmit={(e) => handleSubmit(e, "signup")} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" placeholder="John Doe" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" minLength={6} required />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </form>
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit" form="signup-form" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}