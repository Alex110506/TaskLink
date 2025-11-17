import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import authBg from "@/assets/auth-bg.jpg";
import { useAuthStore } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();

  const { accountType, setAccountType, setPersonal, setBusinessUser } =
    useAuthStore();

  const [isLogin, setIsLogin] = useState(true);

  // Common fields(login)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  //signup

  const [user, setUser] = useState({
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    bio: "",
    job: "",
    yearsExperience: 0,
    skills: "",
    location: "",
  });

  const [business, setBusiness] = useState({
    name: "",
    field: "",
    about: "",
    email: "",
    phone: "",
    password: "",
    location: "",
  });

  const resetForm = () => {
    setUser({
      email: "",
      password: "",
      fullName: "",
      phoneNumber: "",
      bio: "",
      job: "",
      yearsExperience: 0,
      skills: "",
      location: "",
    });
    setBusiness({
      name: "",
      field: "",
      about: "",
      email: "",
      phone: "",
      password: "",
      location: "",
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (accountType === "") {
      toast({
        title: "Error",
        description: "Select an account type",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    //user validation signup
    if (
      !isLogin &&
      accountType === "personal" &&
      (!user.email ||
        !user.password ||
        !user.fullName ||
        !user.phoneNumber ||
        !user.bio ||
        !user.job ||
        !user.yearsExperience ||
        !user.skills.length ||
        !user.location)
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    //business validation signup
    if (
      !isLogin &&
      accountType === "business" &&
      (!business.name ||
        !business.field ||
        !business.about ||
        !business.email ||
        !business.phone ||
        !business.password ||
        !business.location)
    ) {
      console.log(business);
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (accountType === "personal") {
      try {
        const res = await fetch(
          "/api/register/user/signup",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user), 
            credentials:"include"
          }
        );

        if (!res.ok) {
          // Handle non-200 responses
          const errorData = await res.json();
          toast({
            title: "Error",
            description: errorData.message,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        const data = await res.json();
        console.log("Signup successful:", data);

        const {
          fullName,
          email,
          phoneNumber,
          bio,
          job,
          yearsExperience,
          skills,
          location,
        } = data.user;
        setPersonal({
          fullName,
          email,
          phoneNumber,
          bio,
          job,
          yearsExperience,
          skills,
          location,
        });

        setIsLoading(false);
        navigate("/");
      } catch (error) {
        console.error("Network or server error:", error);
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } else {
      try {
        const res = await fetch(
          "/api/register/business/signup",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(business), 
            credentials:"include"
          }
        );

        if (!res.ok) {
          // Handle non-200 responses
          const errorData = await res.json();
          toast({
            title: "Error",
            description: errorData.message,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        const data = await res.json();

        console.log("Signup successful:", data);

        const { name, field, about, email, phone, password, location } =
          data.business;
        setBusinessUser({
          name,
          field,
          about,
          email,
          phone,
          location,
        });

        setIsLoading(false);
        navigate("/");
      } catch (error) {
        console.error("Network or server error:", error);
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
        setIsLoading(false);
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (accountType === "") {
      toast({
        title: "Error",
        description: "Select an account type",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    //validation login
    if (isLogin && (!password || !email)) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (accountType === "personal") {
      const newEmail = email;
      try {
        const res = await fetch(
          "/api/register/user/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: newEmail, password }),
            credentials:"include"
          }
        );

        if (!res.ok) {
          // Handle non-200 responses
          const errorData = await res.json();
          toast({
            title: "Error",
            description: errorData.message,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        const data = await res.json();
        console.log("Login successful:", data);

        const {
          fullName,
          email,
          phoneNumber,
          bio,
          job,
          yearsExperience,
          skills,
          location,
        } = data.user;
        setPersonal({
          fullName,
          email,
          phoneNumber,
          bio,
          job,
          yearsExperience,
          skills,
          location,
        });

        setIsLoading(false);
        navigate("/");
      } catch (error) {
        console.error("Network or server error:", error);
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } else {
      const newEmail = email;

      try {
        const res = await fetch(
          "/api/register/business/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: newEmail, password }),
            credentials:"include"
          }
        );

        if (!res.ok) {
          // Handle non-200 responses
          const errorData = await res.json();
          toast({
            title: "Error",
            description: errorData.message,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        const data = await res.json();

        console.log("Login successful:", data);

        const { name, field, about, email, phone, location } = data.business;
        setBusinessUser({
          name,
          field,
          about,
          email,
          phone,
          location,
        });

        setIsLoading(false);
        navigate("/");
      } catch (error) {
        console.error("Network or server error:", error);
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
        setIsLoading(false);
      }
    }
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
          {/* PERSONAL / BUSINESS TOGGLE */}
          <div className="flex justify-center mb-2">
            <div className="flex bg-muted rounded-xl p-1">
              <button
                type="button"
                onClick={() => setAccountType("personal")}
                className={`px-4 py-1 rounded-lg text-sm font-medium transition-all ${
                  accountType === "personal"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Personal
              </button>

              <button
                type="button"
                onClick={() => setAccountType("business")}
                className={`px-4 py-1 rounded-lg text-sm font-medium transition-all ${
                  accountType === "business"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Business
              </button>
            </div>
          </div>

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

          {/* Dynamic Title */}
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {isLogin
              ? "Welcome back"
              : accountType === "business"
              ? "Join taskLink Business"
              : "Join taskLink"}
          </CardTitle>

          {/* Dynamic Description */}
          <CardDescription className="text-base">
            {isLogin
              ? accountType === "business"
                ? "Sign in to manage business projects and collaborate with experts"
                : "Sign in to connect with freelancers and manage your projects"
              : accountType === "business"
              ? "Create your business profile and start hiring talent"
              : "Create your professional profile and start connecting"}
          </CardDescription>
        </CardHeader>

        <form onSubmit={!isLogin ? handleSignup : handleLogin}>
          <CardContent className="space-y-5">
            {/* SIGNUP FIELDS */}
            {!isLogin && (
              <>
                {/* Personal / Business Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">
                    {accountType === "business"
                      ? "Business Information"
                      : "Personal Information"}
                  </h3>

                  <div className="grid gap-4">
                    {/* NAME FIELD */}
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        {accountType === "business"
                          ? "Business Name *"
                          : "Full Name *"}
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder={
                          accountType === "business"
                            ? "Acme Corporation"
                            : "John Doe"
                        }
                        value={
                          accountType === "personal"
                            ? user.fullName
                            : business.name
                        }
                        onChange={(e) => {
                          const value = e.target.value;
                          if (accountType === "personal") {
                            setUser((prev) => ({ ...prev, fullName: value }));
                          } else {
                            setBusiness((prev) => ({ ...prev, name: value }));
                          }
                        }}
                        required={!isLogin}
                        className="transition-all duration-300 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]"
                      />
                    </div>

                    {/* DESCRIPTION */}
                    <div className="space-y-2">
                      <Label htmlFor="description">
                        {accountType === "business"
                          ? "Business Description *"
                          : "Professional Bio *"}
                      </Label>
                      <Textarea
                        id="description"
                        placeholder={
                          accountType === "business"
                            ? "Tell us about your business, your services, and your goals..."
                            : "Tell us about yourself, your expertise, and what you're looking for..."
                        }
                        value={
                          accountType === "personal" ? user.bio : business.about
                        }
                        onChange={(e) => {
                          const value = e.target.value;
                          if (accountType === "personal") {
                            setUser((prev) => ({ ...prev, bio: value }));
                          } else {
                            setBusiness((prev) => ({ ...prev, about: value }));
                          }
                        }}
                        required={!isLogin}
                        rows={3}
                        className="transition-all duration-300 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)] resize-none"
                      />
                    </div>

                    {/* BUSINESS FIELD */}
                    {accountType === "business" && (
                      <div className="space-y-2">
                        <Label htmlFor="field">Field</Label>
                        <Input
                          id="field"
                          type="text"
                          placeholder="Artificial Intelligence"
                          value={business.field}
                          onChange={(e) => {
                            const value = e.target.value;
                            setBusiness((prev) => ({ ...prev, field: value }));
                          }}
                          required={!isLogin}
                          className="transition-all duration-300 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">
                    Contact Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={
                          accountType === "personal"
                            ? user.phoneNumber
                            : business.phone
                        }
                        onChange={(e) => {
                          const value = e.target.value;
                          if (accountType === "personal") {
                            setUser((prev) => ({
                              ...prev,
                              phoneNumber: value,
                            }));
                          } else {
                            setBusiness((prev) => ({ ...prev, phone: value }));
                          }
                        }}
                        className="transition-all duration-300 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        type="text"
                        placeholder={
                          accountType === "business"
                            ? "New York, USA"
                            : "New York, USA"
                        }
                        value={
                          accountType === "personal"
                            ? user.location
                            : business.location
                        }
                        onChange={(e) => {
                          const value = e.target.value;
                          if (accountType === "personal") {
                            setUser((prev) => ({ ...prev, location: value }));
                          } else {
                            setBusiness((prev) => ({
                              ...prev,
                              location: value,
                            }));
                          }
                        }}
                        required={!isLogin}
                        className="transition-all duration-300 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]"
                      />
                    </div>
                  </div>
                </div>

                {/* Work Information (PERSONAL ONLY) */}
                {accountType === "personal" && (
                  <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">
                      Work Information
                    </h3>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="workTitle">Current Role / Title</Label>
                        <Input
                          id="workTitle"
                          type="text"
                          placeholder="e.g., Senior Full-Stack Developer"
                          value={user.job}
                          onChange={(e) =>
                            setUser((prev) => ({
                              ...prev,
                              job: e.target.value,
                            }))
                          }
                          className="transition-all duration-300 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="workExperience">
                          Years of Experience
                        </Label>
                        <Input
                          id="workTitle"
                          type="number"
                          placeholder="1 years"
                          value={user.yearsExperience}
                          onChange={(e) =>
                            setUser((prev) => ({
                              ...prev,
                              yearsExperience: Number(e.target.value),
                            }))
                          }
                          className="transition-all duration-300 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="skills">Skills & Expertise</Label>
                        <Textarea
                          id="skills"
                          placeholder="e.g., React, Node.js, TypeScript, Project Management..."
                          value={user.skills}
                          onChange={(e) =>
                            setUser((prev) => ({
                              ...prev,
                              skills: e.target.value,
                            }))
                          }
                          rows={2}
                          className="transition-all duration-300 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)] resize-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-t border-border pt-4" />
              </>
            )}

            {/* COMMON FIELDS */}
            <div className="space-y-4">
              {!isLogin && (
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">
                  {accountType === "personal"
                    ? "Account Credentials"
                    : "Business Credentials"}
                </h3>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={
                    accountType === "personal"
                      ? "you@example.com"
                      : "business@example.com"
                  }
                  value={
                    !isLogin
                      ? accountType === "personal"
                        ? user.email
                        : business.email
                      : email
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!isLogin) {
                      if (accountType === "personal") {
                        setUser((prev) => ({ ...prev, email: value }));
                      } else {
                        setBusiness((prev) => ({ ...prev, email: value }));
                      }
                    } else {
                      setEmail(value);
                    }
                  }}
                  required
                  className="transition-all duration-300 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={
                    !isLogin
                      ? accountType === "personal"
                        ? user.password
                        : business.password
                      : password
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!isLogin) {
                      if (accountType === "personal") {
                        setUser((prev) => ({ ...prev, password: value }));
                      } else {
                        setBusiness((prev) => ({ ...prev, password: value }));
                      }
                    } else {
                      setPassword(value);
                    }
                  }}
                  required
                  className="transition-all duration-300 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]"
                />
                {!isLogin && (
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters
                  </p>
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
                  {isLogin
                    ? "Signing in..."
                    : accountType === "business"
                    ? "Creating business account..."
                    : "Creating account..."}
                </div>
              ) : isLogin ? (
                "Sign in"
              ) : accountType === "business" ? (
                "Create business account"
              ) : (
                "Create account"
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
