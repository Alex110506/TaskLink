import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface JobCardProps {
  company: string;
  position: string;
  description: string;
  location?: string;
  type?: string;
}

export function JobCard({ company, position, description, location, type }: JobCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">{position}</CardTitle>
            <CardDescription className="mt-1 font-medium">{company}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>

        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="secondary">Product Management</Badge>
          <Badge variant="secondary">Agile</Badge>
          <Badge variant="secondary">Leadership</Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          {location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {location}
            </div>
          )}
          {type && (
            <div className="flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              {type}
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
