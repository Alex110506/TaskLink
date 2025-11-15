import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TeamMember {
  _id: string;
  fullName: string;
  email: string;
}

interface TeamCardProps {
  jobName: string;
  memberCount: number;
  members: TeamMember[];
}

export function TeamCard({ jobName, memberCount, members }: TeamCardProps) {
  const teamName = `${jobName} Team`;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
            <Users className="h-6 w-6 text-accent" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">{teamName}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {memberCount} members
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">View Team</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>{teamName}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {members.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  <Avatar>
                    <AvatarFallback>
                      {member.fullName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col">
                    <span className="font-medium">{member.fullName}</span>
                    <span className="text-xs text-muted-foreground">
                      {member.email}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
