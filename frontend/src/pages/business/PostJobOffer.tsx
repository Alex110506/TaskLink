import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Plus, X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const PostJobOffer = () => {
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const { toast } = useToast();

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Job Posted Successfully!",
      description: "Your job offer has been published and is now visible to candidates.",
    });
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
                required
                className="bg-background/50 border-border/50 focus:border-primary"
              />
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                placeholder="e.g., Engineering"
                className="bg-background/50 border-border/50 focus:border-primary"
              />
            </div>

            {/* Job Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                required
                className="min-h-[200px] bg-background/50 border-border/50 focus:border-primary resize-none"
              />
            </div>

            {/* Required Skills */}
            <div className="space-y-2">
              <Label htmlFor="skills">Required Skills *</Label>
              <div className="flex gap-2">
                <Input
                  id="skills"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="Add a skill and press Enter"
                  className="bg-background/50 border-border/50 focus:border-primary"
                />
                <Button type="button" onClick={addSkill} variant="outline" className="border-primary/30">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {skills.map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="bg-primary/10 text-primary border-primary/20 pr-1"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Number of Positions */}
            <div className="space-y-2">
              <Label htmlFor="positions">Number of Positions *</Label>
              <Input
                id="positions"
                type="number"
                min="1"
                defaultValue="1"
                required
                className="bg-background/50 border-border/50 focus:border-primary"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., San Francisco, CA or Remote"
                className="bg-background/50 border-border/50 focus:border-primary"
              />
            </div>

            {/* Employment Type */}
            <div className="space-y-2">
              <Label htmlFor="employment-type">Employment Type</Label>
              <select
                id="employment-type"
                className="w-full h-10 px-3 rounded-md border border-border/50 bg-background/50 focus:border-primary focus:outline-none"
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Freelance</option>
              </select>
            </div>

            {/* Salary Range */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salary-min">Salary Range (Min)</Label>
                <Input
                  id="salary-min"
                  type="number"
                  placeholder="e.g., 80000"
                  className="bg-background/50 border-border/50 focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary-max">Salary Range (Max)</Label>
                <Input
                  id="salary-max"
                  type="number"
                  placeholder="e.g., 120000"
                  className="bg-background/50 border-border/50 focus:border-primary"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button 
                type="submit"
                className="flex-1 bg-gradient-to-r from-primary via-blue-600 to-accent hover:opacity-90 shadow-lg shadow-primary/30"
                size="lg"
              >
                <Briefcase className="h-5 w-5 mr-2" />
                Post Job Offer
              </Button>
              <Button 
                type="button"
                variant="outline"
                size="lg"
                className="border-border/50"
              >
                Save as Draft
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default PostJobOffer;
