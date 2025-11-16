import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const PostJobOffer = () => {
  const { toast } = useToast();

  const { businessUser } = useAuthStore();
  console.log(businessUser);

  // --- FULL FORM STATE ---
  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skillInput, setSkillInput] = useState("");   // comma-separated string
  const [positions, setPositions] = useState(1);
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("Remote");

    const navigate = useNavigate();
  

  // --- SIMPLE FETCH POST ---
  const handlePost = async () => {
    try {
      const res = await fetch("/api/jobs/business/createJob", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name:jobTitle,
          description,
          skills: skillInput,
          numberOfPositions:positions,
          location,
          employmentType:employmentType.toLowerCase(),
          assignedTo:[],
          jobApplicants:[]
        }),
        credentials:'include'
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Error posting job",
          description: data.error || "Unknown error.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Job Posted Successfully!",
        description: "Your job offer is now live.",
      });
      navigate("/")

    } catch (err) {
      toast({
        title: "Network Error",
        description: "Could not reach server.",
        variant: "destructive",
      });
    }
  };

  // --- MAIN SUBMIT ---
  const handleSubmit = (e) => {
    e.preventDefault();
    handlePost();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-blue-500 to-accent bg-clip-text text-transparent">
          Post Job Offer
        </h1>
        <p className="text-muted-foreground mt-1">Create a new job posting to attract top talent</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-border/50 bg-gradient-to-br from-card/80 to-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Job Details
            </CardTitle>
            <CardDescription>Fill in the information about the position</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Job Title */}
            <div className="space-y-2">
              <Label htmlFor="job-title">Job Title *</Label>
              <Input
                id="job-title"
                placeholder="e.g., Senior Frontend Developer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
              />
            </div>

            {/* Job Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the role..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="min-h-[200px]"
              />
            </div>

            {/* Required Skills */}
            <div className="space-y-2">
              <Label htmlFor="skills">Required Skills *</Label>
              <Input
                id="skills"
                placeholder="Separate by comma"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
              />
            </div>

            {/* Number of Positions */}
            <div className="space-y-2">
              <Label htmlFor="positions">Number of Positions *</Label>
              <Input
                id="positions"
                type="number"
                min="1"
                value={positions}
                onChange={(e) => setPositions(Number(e.target.value))}
                required
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Remote or San Francisco"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* Employment Type */}
            <div className="space-y-2">
              <Label htmlFor="employment-type">Employment Type</Label>
              {/* <select
                id="employment-type"
                
                className="w-full h-10 px-3 rounded-md border"
              >
                <option>Remote</option>
                <option>On-site</option>
                <option>Hybrid</option>
              </select> */}
              <select id="employment-type" value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)} 
                className="w-full h-10 px-3 rounded-md border border-border/50 bg-background/50 focus:border-primary focus:outline-none" 
              > 
                <option>Remote</option> 
                <option>On-site</option> 
                <option>Hybrid</option> 
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-primary via-blue-600 to-accent"
                size="lg"
              >
                <Briefcase className="h-5 w-5 mr-2" />
                Post Job Offer
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default PostJobOffer;
