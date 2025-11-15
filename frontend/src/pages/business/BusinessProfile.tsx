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
import { Mail, MapPin, Edit, Phone, LogOut } from "lucide-react";
import { useAuthStore } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const BusinessProfile = () => {
  const { businessUser } = useAuthStore();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const res = await fetch(
        "http://localhost:5001/api/register/business/logout",
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
      <Card className="border-border/50 bg-gradient-to-br from-card/80 to-card">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-gradient-to-br from-primary via-blue-600 to-accent text-primary-foreground text-2xl font-bold">
                TC
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {businessUser.name}
                  </h2>
                  <p className="text-muted-foreground">{businessUser.field}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>

                  {/* Logout button (design only) */}
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
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  Software Development
                </Badge>
                <Badge className="bg-accent/10 text-accent border-accent/20">
                  Cloud Services
                </Badge>
                <Badge className="bg-blue-600/10 text-blue-500 border-blue-500/20">
                  AI/ML
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="border-border/50 bg-gradient-to-br from-card/80 to-card hover:border-primary/30 transition-all">
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>How to reach us</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{businessUser.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{businessUser.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Office Address</p>
              <p className="font-medium">{businessUser.location}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About Section */}
      <Card className="border-border/50 bg-gradient-to-br from-card/80 to-card">
        <CardHeader>
          <CardTitle>About</CardTitle>
          <CardDescription>Company overview</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {businessUser.about}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessProfile;
