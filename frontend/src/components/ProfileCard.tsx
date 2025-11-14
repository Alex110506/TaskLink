import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProfileCardProps {
  name: string;
}

export function ProfileCard({ name }: ProfileCardProps) {
  const navigate = useNavigate();
  const statusConfig = {
    online: "bg-success",
    offline: "bg-muted-foreground",
    away: "bg-warning",
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleChatClick = () => {
    const userId = name.toLowerCase().replace(/\s+/g, "-");
    navigate(`/chat/user/${userId}`);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
           
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{name}</h3>
          </div>
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleChatClick}>
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
