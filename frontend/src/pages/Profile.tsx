import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, Phone, Edit, LogOut, CheckCircle, Sparkles, Map } from "lucide-react";
import { useAuthStore } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, setPersonal } = useAuthStore();
  const { toast } = useToast();
  const navigate=useNavigate()

  const [edit, setEdit] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [isLoading, setIsLoading] = useState(false);

  // --- Profile Update Logic ---
  async function updateUserProfile() {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/register/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedUser),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to update profile",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      const { fullName, email, phoneNumber, bio, job, yearsExperience, skills, location } = data.user;

      const updatedUser = { fullName, email, phoneNumber, bio, job, yearsExperience, skills, location };
      setEditedUser(updatedUser);
      setPersonal(updatedUser);

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
        variant: "default",
      });

      setIsLoading(false);
    } catch (error) {
      console.error("Network or server error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }

  // --- Helper Functions ---
  function splitSmart(str) {
    if (!str) return [];
    return str.split(/[,\/\s]+/).map(s => s.trim()).filter(s => s.length > 0);
  }

  function getInitials(name) {
    if (!name) return "U";
    return name.trim().split(/\s+/).filter(part => part.length > 0).slice(0, 2).map(part => part[0].toUpperCase()).join("");
  }

  const skillsArr = splitSmart(user?.skills || "");
  const skillElems = skillsArr.map((item, idx) => (
    <Badge variant="secondary" key={idx}>{item}</Badge>
  ));

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/register/user/logout", { method: "GET" });
      const data = await res.json();

      if (!res.ok) {
        return toast({
          title: "Logout failed",
          description: data.message || "Something went wrong.",
          variant: "destructive",
        });
      }

      localStorage.clear();
      toast({ title: "Logged out", description: "You have been logged out successfully." });
      window.location.replace("/auth");
    } catch (error) {
      console.log(error);
      toast({ title: "Error", description: "Could not log out. Try again.", variant: "destructive" });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      
      {/* --- Main Profile Header Card --- */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* UPDATED: Removed border-2 border-white shadow-sm */}
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                {getInitials(editedUser.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="w-full max-w-md">
                  {!edit ? (
                    <h2 className="text-2xl font-bold text-foreground">{editedUser.fullName}</h2>
                  ) : (
                    <Input value={editedUser.fullName} onChange={(e) => setEditedUser({ ...editedUser, fullName: e.target.value })} className="text-2xl font-bold text-foreground mb-2" />
                  )}

                  {!edit ? (
                    <p className="text-sm mt-1 text-muted-foreground">{editedUser.job}</p>
                  ) : (
                    <Input value={editedUser.job} onChange={(e) => setEditedUser({ ...editedUser, job: e.target.value })} className="text-sm" placeholder="Job Title" />
                  )}
                </div>

                <div className="flex flex-col items-end gap-2 ml-4">
                  {!edit ? (
                    <Button onClick={() => setEdit(true)} size="sm" variant="secondary">
                      <Edit className="h-4 w-4 mr-2" /> Edit Profile
                    </Button>
                  ) : (
                    <Button onClick={() => { setEdit(false); updateUserProfile(); }} size="sm">
                      <CheckCircle className="h-4 w-4 mr-2" /> Save
                    </Button>
                  )}

                  <Button size="sm" variant="outline" className="text-destructive border-destructive/20 hover:bg-destructive/5" onClick={() => handleLogout()}>
                    <LogOut className="h-4 w-4 mr-2" /> Log out
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {skillElems}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* --- Contact Information Card --- */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>How recruiters can reach you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-muted rounded-full">
                <Phone className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Phone</p>
                {!edit ? (
                  <p className="font-medium">{editedUser.phoneNumber}</p>
                ) : (
                  <Input value={editedUser.phoneNumber} onChange={(e) => setEditedUser({ ...editedUser, phoneNumber: e.target.value })} />
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-muted rounded-full">
                <MapPin className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Location</p>
                {!edit ? (
                  <p className="font-medium">{editedUser.location}</p>
                ) : (
                  <Input value={editedUser.location} onChange={(e) => setEditedUser({ ...editedUser, location: e.target.value })} />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* --- SUBSCRIPTION CARD --- */}
        <Card className="h-full border-primary/50 bg-gradient-to-br from-background to-primary/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Sparkles className="h-32 w-32" />
          </div>
          
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-primary">Pro Subscription</CardTitle>
              <Badge className="bg-primary hover:bg-primary text-primary-foreground">
                Upgrade
              </Badge>
            </div>
            <CardDescription>Supercharge your job hunt</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 relative z-10">
            {/* Feature 1: AI */}
            <div className="flex items-start gap-3">
              <div className="mt-1 p-1.5 rounded-md bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">AI Career Assistant</p>
                <p className="text-xs text-muted-foreground">
                  Auto-optimize your resume and generate cover letters.
                </p>
              </div>
            </div>

            {/* Feature 2: Map */}
            <div className="flex items-start gap-3">
              <div className="mt-1 p-1.5 rounded-md bg-primary/10">
                <Map className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Job Radar Map</p>
                <p className="text-xs text-muted-foreground">
                  Visual map showing high-paying jobs near your location.
                </p>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button className="w-full shadow-lg shadow-primary/20" onClick={() => navigate("/pay")}>
              Upgrade Plan
            </Button>
          </CardFooter>
        </Card>

      </div>

      {/* --- About Card --- */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
          <CardDescription>Professional summary</CardDescription>
        </CardHeader>
        <CardContent>
          {!edit ? (
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{editedUser.bio}</p>
          ) : (
            <textarea 
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={editedUser.bio} 
              onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })} 
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;