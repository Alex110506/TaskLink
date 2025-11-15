import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TeamCardProps {
  jobName: string;
  memberCount: number;
  members: string[];
}

export function TeamCard({ jobName, memberCount, members }: TeamCardProps) {
  const navigate = useNavigate();

  const handleViewTeam = () => {
    const teamId = jobName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/chat/team/${teamId}`);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
            <Users className="h-6 w-6 text-accent" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">{jobName} Team</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          
          <span className="text-sm text-muted-foreground">{memberCount} members</span>
        </div>
        <Button variant="outline" className="w-full" onClick={handleViewTeam}>
          View Team
        </Button>
      </CardContent>
    </Card>
  );
}
