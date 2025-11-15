import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero-image.jpg";
import { useState } from "react";

const Index = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: "🌍",
      title: "Location-Based Matching",
      description: "Find talented freelancers in your area or anywhere in the world. Filter by location, timezone, and availability.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: "⚡",
      title: "Skill-Based Search",
      description: "Search for professionals with specific skills and expertise. Filter by experience level, ratings, and past work.",
      color: "from-primary to-accent"
    },
    {
      icon: "👥",
      title: "Team Management",
      description: "Build and manage your teams with ease. Assign roles, track progress, and collaborate in real-time.",
      color: "from-accent to-primary-light"
    },
    {
      icon: "✅",
      title: "Task Management",
      description: "Create, assign, and track tasks effortlessly. Set deadlines, priorities, and monitor project progress.",
      color: "from-blue-600 to-primary"
    },
    {
      icon: "🤝",
      title: "Social Networking",
      description: "Connect with professionals, share updates, and build your network. Engage with the community.",
      color: "from-primary-light to-accent-light"
    },
    {
      icon: "💼",
      title: "Job Marketplace",
      description: "Post jobs or find opportunities. Streamlined hiring process with built-in communication tools.",
      color: "from-accent-light to-blue-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager",
      company: "TechCorp",
      image: "👩‍💼",
      quote: "TaskLink transformed how we manage our distributed team. The location-based features are a game-changer!"
    },
    {
      name: "Marcus Johnson",
      role: "Freelance Designer",
      company: "Independent",
      image: "👨‍🎨",
      quote: "I've found amazing projects and clients through TaskLink. The platform is intuitive and professional."
    },
    {
      name: "Aisha Patel",
      role: "Engineering Lead",
      company: "StartupX",
      image: "👩‍💻",
      quote: "Best platform for hiring tech talent. The skill matching is incredibly accurate and saves us time."
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Professionals", icon: "👤" },
    { number: "10K+", label: "Companies", icon: "🏢" },
    { number: "100K+", label: "Projects Completed", icon: "✨" },
    { number: "95%", label: "Success Rate", icon: "📈" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-blue-900/10">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-md bg-background/90 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary via-blue-600 to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                <img src="/android-chrome-192x192.png" alt="logo" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary via-blue-500 to-accent bg-clip-text text-transparent">
                taskLink
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/auth">
                <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-primary via-blue-600 to-accent hover:opacity-90 shadow-lg shadow-primary/30 transition-all hover:shadow-primary/50">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-blue-500/5 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(220_90%_56%/0.15),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Connect with{" "}
                <span className="bg-gradient-to-r from-primary via-blue-500 to-accent bg-clip-text text-transparent">
                  Top Talent
                </span>
                {" "}Worldwide
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                TaskLink brings businesses and freelancers together on a unified platform. 
                Find talent based on location and skills, manage your teams, and track projects-all in one place.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth">
                  <Button size="lg" className="bg-gradient-to-r from-primary via-blue-600 to-accent hover:opacity-90 shadow-lg shadow-primary/40 text-lg h-14 px-8 transition-all hover:shadow-xl hover:shadow-primary/50">
                    Start for Free
                    <span className="ml-2">→</span>
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-2 border-primary/30 hover:bg-primary/10 hover:border-primary text-lg h-14 px-8 transition-all">
                  Sign In
                  <span className="ml-2">▶</span>
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6 pt-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl mb-1">{stat.icon}</div>
                    <div className="text-2xl font-bold text-primary">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative animate-in fade-in slide-in-from-right duration-700">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-blue-600/20 to-accent/20 rounded-3xl blur-3xl animate-pulse" />
              <img 
                src={heroImage} 
                alt="Professionals collaborating" 
                className="relative rounded-2xl shadow-2xl border border-border/50 hover:scale-105 transition-transform duration-500"
              />
              {/* Floating Cards */}
              <div className="absolute -top-6 -left-6 bg-card/90 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-border/50 animate-in fade-in slide-in-from-left duration-1000 delay-300">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-2xl">
                    ✨
                  </div>
                  <div>
                    <div className="font-semibold">1,234</div>
                    <div className="text-xs text-muted-foreground">Projects This Month</div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-card/90 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-border/50 animate-in fade-in slide-in-from-right duration-1000 delay-500">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary-light flex items-center justify-center text-2xl">
                    🎯
                  </div>
                  <div>
                    <div className="font-semibold">98% Match</div>
                    <div className="text-xs text-muted-foreground">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom duration-700">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything you need in{" "}
              <span className="bg-gradient-to-r from-primary via-blue-500 to-accent bg-clip-text text-transparent">
                one platform
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Powerful features designed to help businesses and freelancers work together seamlessly
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`group hover:shadow-2xl transition-all duration-500 border-border/50 hover:border-primary/50 bg-gradient-to-br from-card/80 to-card backdrop-blur-sm cursor-pointer ${
                  hoveredFeature === index ? 'scale-105 shadow-2xl' : ''
                }`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <CardContent className="p-6 space-y-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-blue-900/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-primary/20 to-blue-600/20 border-primary/30 text-primary">
              Testimonials
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Loved by{" "}
              <span className="bg-gradient-to-r from-primary via-blue-500 to-accent bg-clip-text text-transparent">
                thousands
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gradient-to-br from-card/80 to-card backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-2xl">
                      {testimonial.image}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.company}</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-500">⭐</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 bg-blue-900/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary via-blue-600 to-accent flex items-center justify-center shadow-lg">
                  <span className="text-2xl">💼</span>
                </div>
                <span className="text-xl font-bold">taskLink</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Connecting talent with opportunity, worldwide.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2025 taskLink. All rights reserved.
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Twitter</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">LinkedIn</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
