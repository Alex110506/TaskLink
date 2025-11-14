import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import authBg from "@/assets/auth-bg.jpg";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Signup fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [workTitle, setWorkTitle] = useState("");
  const [workExperience, setWorkExperience] = useState("");
  const [skills, setSkills] = useState("");

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setDescription("");
    setPhone("");
    setLocation("");
    setWorkTitle("");
    setWorkExperience("");
    setSkills("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Email and password are required",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!isLogin && (!name || !description || !location)) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Password validation
    if (password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simulate auth action
    setTimeout(() => {
      toast({
        title: isLogin ? "Welcome back!" : "Account created!",
        description: isLogin 
          ? "You have successfully logged in." 
          : "Your profile has been created successfully.",
      });
      setIsLoading(false);
      resetForm();
    }, 1500);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        background: `url(${authBg}) center/cover, var(--gradient-bg)`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
      
      <Card className="w-full max-w-2xl relative z-10 shadow-[var(--shadow-glow)] border-border/50 my-8">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-2">
            <svg
              className="w-8 h-8 text-primary-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {isLogin ? "Welcome back" : "Join taskLink"}
          </CardTitle>
          <CardDescription className="text-base">
            {isLogin 
              ? "Sign in to connect with freelancers and manage your projects" 
              : "Create your professional profile and start connecting"}
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            {!isLogin && (
              <>
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">Personal Information</h3>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required={!isLogin}
                        className="transition-all duration-300 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Professional Bio *</Label>
                      <Textarea
                        id="description"
                        placeholder="Tell us about yourself, your expertise, and what you're looking for..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required={!isLogin}
                        rows={3}
                        className="transition-all duration-300 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)] resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">Contact Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="transition-all duration-300 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        type="text"
                        placeholder="New York, USA"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required={!isLogin}
                        className="transition-all duration-300 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]"
                      />
                    </div>
                  </div>
                </div>

                {/* Work Information */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">Work Information</h3>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="workTitle">Current Role / Title</Label>
                      <Input
                        id="workTitle"
                        type="text"
                        placeholder="e.g., Senior Full-Stack Developer"
                        value={workTitle}
                        onChange={(e) => setWorkTitle(e.target.value)}
                        className="transition-all duration-300 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="workExperience">Years of Experience</Label>
                      <Select value={workExperience} onValueChange={setWorkExperience}>
                        <SelectTrigger className="transition-all duration-300 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]">
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-1">0-1 years</SelectItem>
                          <SelectItem value="1-3">1-3 years</SelectItem>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="5-10">5-10 years</SelectItem>
                          <SelectItem value="10+">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="skills">Skills & Expertise</Label>
                      <Textarea
                        id="skills"
                        placeholder="e.g., React, Node.js, TypeScript, UI/UX Design, Project Management..."
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        rows={2}
                        className="transition-all duration-300 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)] resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4" />
              </>
            )}
            
            {/* Login/Signup Common Fields */}
            <div className="space-y-4">
              {!isLogin && <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">Account Credentials</h3>}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address {!isLogin && "*"}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="transition-all duration-300 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password {!isLogin && "*"}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="transition-all duration-300 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]"
                />
                {!isLogin && (
                  <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
                )}
              </div>
              
              {isLogin && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline transition-all"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all shadow-[var(--shadow-soft)] h-11 text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </div>
              ) : (
                isLogin ? "Sign in" : "Create account"
              )}
            </Button>
            
            <div className="text-center text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  resetForm();
                }}
                className="text-primary font-medium hover:underline transition-all"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Auth;
