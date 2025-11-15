import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, Phone, Edit, LogOut } from "lucide-react";
import { useAuthStore } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user } = useAuthStore();
  
  function splitSmart(str) {
    return str
      .split(/[,\/\s]+/)   // split by comma, slash, or any amount of whitespace
      .map(s => s.trim())  // remove leftover spaces
      .filter(s => s.length > 0); // remove empty entries
  }

  function getInitials(name) {
    return name
      .trim()                     // remove surrounding spaces
      .split(/\s+/)               // split by one or more spaces
      .filter(part => part.length > 0)  // remove empty parts
      .slice(0, 2)                // take only the first 2 name parts
      .map(part => part[0].toUpperCase()) // take first letter & uppercase
      .join("");                  // join initials together
  }

  const skillsArr=splitSmart(user.skills)
  const skillElems=skillsArr.map((item,idx)=>{
    return <Badge variant="secondary" key={idx}>{item}</Badge>
  })

  

  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const res = await fetch(
        "http://localhost:5001/api/register/user/logout",
        {
          method: "GET",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        return toast({
          title: "Logout failed",
          description: data.message || "Something went wrong.",
          variant: "destructive",
        });
      }

      // Clear store
      localStorage.clear();

      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });

      window.location.replace("/auth");
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Could not log out. Try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {user.fullName}
                  </h2>
                  <p className="text-muted-foreground">{user.job}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Button size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center text-destructive border-destructive/20 hover:bg-destructive/5"
                    onClick={() => handleLogout()}
                    aria-label="Log out"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {/* TO DO */}
                {skillElems}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>How to reach you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{user.phoneNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{user.location}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
          <CardDescription>Professional summary</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{user.bio}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
