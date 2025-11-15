import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface JobCardProps {
  name: string;
  description: string;
  skills: string;
  company: any;                // Business ID or name depending on usage
  location: string;
  employmentType: string;
  numberOfPositions: number;
  assignedTo: string[];           // array of User IDs
  jobApplicants: string[];        // array of User IDs
}

export function JobCard({name, company, description, skills, location,employmentType,numberOfPositions,assignedTo,jobApplicants }: JobCardProps) {
  
  
  function splitSmart(str) {
    return str
      .split(/[,\/\s]+/)   // split by comma, slash, or any amount of whitespace
      .map(s => s.trim())  // remove leftover spaces
      .filter(s => s.length > 0); // remove empty entries
  }

  const skillsArr=splitSmart(skills)
  const skillElems=skillsArr.map((item,idx)=>{
    return <Badge variant="secondary" key={idx}>{item}</Badge>
  })

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">{name}</CardTitle>
            <CardDescription className="mt-1 font-medium">{company}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>

        <div className="flex flex-wrap gap-2 mb-2">
          {skillElems}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          {location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {location}
            </div>
          )}
          {employmentType && (
            <div className="flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              {employmentType}
            </div>
          )}
          {numberOfPositions && (
            <div className="flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              {numberOfPositions} positions
            </div>
          )}
        </div>
        <Button variant="default" className="w-full">
          Send Application
        </Button>
      </CardContent>
    </Card>
  );
}
