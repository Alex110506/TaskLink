import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Briefcase, MapPin, Users, Eye } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NavLink } from "react-router-dom";

const BusinessHome = () => {
  const [selectedJob, setSelectedJob] = useState<number | null>(null);

  const jobPostings = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      posted: "2 days ago",
      applicants: 24,
      status: "Active",
      skills: ["React", "TypeScript", "Tailwind CSS"],
      positions: 2,
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      posted: "1 week ago",
      applicants: 18,
      status: "Active",
      skills: ["Agile", "User Research", "Analytics"],
      positions: 1,
    },
    {
      id: 3,
      title: "UX Designer",
      department: "Design",
      posted: "3 days ago",
      applicants: 31,
      status: "Active",
      skills: ["Figma", "User Testing", "Prototyping"],
      positions: 1,
    },
  ];

  const candidates = [
    {
      name: "Alice Johnson",
      role: "Frontend Developer",
      location: "San Francisco, CA",
      skills: ["React", "TypeScript", "Node.js", "GraphQL"],
      experience: "5 years",
      matchScore: 95,
      description: "Passionate frontend developer with extensive experience in building scalable React applications. Led multiple projects from conception to deployment.",
    },
    {
      name: "Bob Smith",
      role: "Full Stack Developer",
      location: "New York, NY",
      skills: ["React", "Python", "PostgreSQL", "AWS"],
      experience: "7 years",
      matchScore: 88,
      description: "Full stack engineer specializing in web technologies. Strong background in both frontend and backend development with cloud infrastructure expertise.",
    },
    {
      name: "Carol Williams",
      role: "Senior Frontend Engineer",
      location: "Austin, TX",
      skills: ["React", "TypeScript", "Redux", "Testing"],
      experience: "6 years",
      matchScore: 92,
      description: "Senior engineer with a focus on creating performant and accessible user interfaces. Advocate for best practices and clean code.",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-blue-500 to-accent bg-clip-text text-transparent">
            Business Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Manage your job postings and candidates</p>
        </div>
        <Button className="bg-gradient-to-r from-primary via-blue-600 to-accent hover:opacity-90 shadow-lg shadow-primary/30">
          <Briefcase className="h-5 w-5 mr-2" />
          <NavLink to={"/business/post-job"} >New Job Posting</NavLink>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { label: "Active Jobs", value: "12", icon: "💼", color: "from-primary to-blue-600" },
          { label: "Total Applicants", value: "156", icon: "👥", color: "from-accent to-primary-light" },
        ].map((stat, index) => (
          <Card key={index} className="border-border/50 bg-gradient-to-br from-card/80 to-card hover:border-primary/30 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl shadow-lg`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Job Postings */}
      <Card className="border-border/50 bg-gradient-to-br from-card/80 to-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Active Job Postings
          </CardTitle>
          <CardDescription>View and manage your current job openings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {jobPostings.map((job) => (
            <Card key={job.id} className="border-border/50 hover:border-primary/50 transition-all bg-gradient-to-r from-blue-900/5 to-transparent">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{job.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        {job.department}
                      </Badge>
                      <Badge variant="outline" className="border-border/50">
                        {job.positions} {job.positions === 1 ? 'position' : 'positions'}
                      </Badge>
                    </div>
                  </div>
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                    {job.status}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="border-accent/30 text-accent">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Posted {job.posted}</span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {job.applicants} applicants
                    </span>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="border-primary/30 hover:bg-primary/10"
                        onClick={() => setSelectedJob(job.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Candidates
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Candidates for {job.title}</DialogTitle>
                        <DialogDescription>
                          {job.applicants} candidates have applied for this position
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        {candidates.map((candidate, index) => (
                          <Card key={index} className="border-border/50 hover:border-primary/50 transition-all">
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4">
                                <Avatar className="h-16 w-16">
                                  <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-primary-foreground text-lg">
                                    {candidate.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-3">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h3 className="text-lg font-semibold">{candidate.name}</h3>
                                      <p className="text-muted-foreground">{candidate.role}</p>
                                    </div>
                                    <Badge className="bg-gradient-to-r from-primary/20 to-blue-600/20 border-primary/30 text-primary">
                                      {candidate.matchScore}% Match
                                    </Badge>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    {candidate.location}
                                    <span className="mx-2">•</span>
                                    {candidate.experience} experience
                                  </div>

                                  <p className="text-sm text-muted-foreground">
                                    {candidate.description}
                                  </p>

                                  <div className="flex flex-wrap gap-2">
                                    {candidate.skills.map((skill, skillIndex) => (
                                      <Badge key={skillIndex} variant="secondary" className="bg-secondary/50">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>

                                  <div className="flex gap-2 pt-2">
                                    <Button size="sm" className="bg-gradient-to-r from-primary to-blue-600 hover:opacity-90">
                                      Accept Candidate
                                    </Button>
                                    <Button size="sm" variant="outline" className="border-border/50">
                                      View Full Profile
                                    </Button>
                                    <Button size="sm" variant="ghost">
                                      Reject
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessHome;
