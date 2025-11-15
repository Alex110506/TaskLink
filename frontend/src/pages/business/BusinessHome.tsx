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
import { useEffect } from "react";

const BusinessHome = () => {
  const [selectedJob, setSelectedJob] = useState<number | null>(null);

  const [jobPostings, setJobPostings] = useState([{
    _id: "",
    name: "",
    description: "",
    skills: "",
    company: null,            // store Business _id
    location: "",
    employmentType: "",     // "remote", "on-site", "hybrid"
    numberOfPositions: 1,
    assignedTo: [],         // array of user IDs
    jobApplicants: [],      // array of user IDs
  }]);


  function splitSmart(str?: string) {
    if (!str) return []; // return empty array if str is undefined or empty
    return str
      .split(/[,\/\s]+/)   // split by comma, slash, or any amount of whitespace
      .map(s => s.trim())  // remove leftover spaces
      .filter(s => s.length > 0); // remove empty entries
  }


  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/jobs/business/getJobs", {
          credentials: "include",
          method: "GET",
        });

        const data = await res.json();
        console.log(data);

        setJobPostings(data.jobs); // ← set your state here
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  const handleAccept = async (userId: string, jobId: string) => {
    try {
      const res = await fetch(`http://localhost:5001/api/jobs/business/acceptCandidate/${jobId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Failed to accept candidate:", data.message);
        return;
      }

      console.log("Candidate accepted successfully:", data);
      // Optional: show toast or update UI here

    } catch (error) {
      console.error("Error accepting candidate:", error);
      // Optional: show error toast
    }
  };

  const handleReject = async (userId: string, jobId: string) => {
    try {
      const res = await fetch(`http://localhost:5001/api/jobs/business/rejectCandidate/${jobId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Failed to reject candidate:", data.message);
        return;
      }

      console.log("Candidate rejected successfully:", data);
      // Optional: show toast or update UI here

    } catch (error) {
      console.error("Error rejecting candidate:", error);
      // Optional: show error toast
    }
  };



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
          { label: "Active Jobs", value: jobPostings.length, icon: "💼", color: "from-primary to-blue-600" },
          {
            label: "Total Applicants", value: jobPostings.reduce((total, job) => {
              return total + (job.jobApplicants?.length || 0);
            }, 0),
            icon: "👥", color: "from-accent to-primary-light"
          },
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
          {jobPostings.map((job, index) => (
            <Card key={index} className="border-border/50 hover:border-primary/50 transition-all bg-gradient-to-r from-blue-900/5 to-transparent">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{job.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        {job.company?.field}
                      </Badge>
                      <Badge variant="outline" className="border-border/50">
                        {job.numberOfPositions} {job.numberOfPositions === 1 ? 'position' : 'positions'}
                      </Badge>
                    </div>
                  </div>
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                    {"Active"}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {splitSmart(job.skills).map((item, idx) => {
                    return <Badge variant="secondary" key={idx}>{item}</Badge>
                  })}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {job.jobApplicants.length} applicants
                    </span>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-primary/30 hover:bg-primary/10"
                        onClick={() => setSelectedJob(index)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Candidates
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Candidates for {job.name}</DialogTitle>
                        <DialogDescription>
                          {job.jobApplicants.length} candidates have applied for this position
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        {job.jobApplicants.map((candidate, index) => (
                          <Card key={index} className="border-border/50 hover:border-primary/50 transition-all">
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4">
                                <Avatar className="h-16 w-16">
                                  <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-primary-foreground text-lg">
                                    {candidate.fullName.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-3">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h3 className="text-lg font-semibold">{candidate.fullName}</h3>
                                    </div>

                                  </div>

                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    {candidate.location}
                                    <span className="mx-2">•</span>
                                    {candidate.yearsExperience} experience
                                  </div>

                                  <p className="text-sm text-muted-foreground">
                                    {candidate.description}
                                  </p>

                                  <div className="flex flex-wrap gap-2">
                                    {splitSmart(candidate.skills).map((skill, skillIndex) => (
                                      <Badge key={skillIndex} variant="secondary" className="bg-secondary/50">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>

                                  <div className="flex gap-2 pt-2">
                                    <Button onClick={() => handleAccept(candidate._id,job._id)} size="sm" className="bg-gradient-to-r from-primary to-blue-600 hover:opacity-90">
                                      Accept Candidate
                                    </Button>
                                    <Button size="sm" variant="outline" className="border-border/50">
                                      View Full Profile
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => handleReject( candidate._id,job._id)}>
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
