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
import { Mail, MapPin, Phone, Edit, LogOut, CheckCircle } from "lucide-react";
import { useAuthStore } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const Profile = () => {
  const { user, setPersonal } = useAuthStore();

  const [edit, setEdit] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [isLoading, setIsLoading] = useState(false);


  async function updateUserProfile() {
    setIsLoading(true); // start loading immediately

    try {
      const res = await fetch("http://localhost:5001/api/register/user/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedUser),
        credentials: "include",
      });

      if (!res.ok) {
        // Handle non-200 responses
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

      const {
        fullName,
        email,
        phoneNumber,
        bio,
        job,
        yearsExperience,
        skills,
        location,
      } = data.user;

      // Update local state
      const updatedUser = { fullName, email, phoneNumber, bio, job, yearsExperience, skills, location };
      setEditedUser(updatedUser);
      setPersonal(updatedUser);

      // Show success toast
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

  const skillsArr = splitSmart(user.skills)
  const skillElems = skillsArr.map((item, idx) => {
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
                {getInitials(editedUser.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  {!edit ? (
                    <h2 className="text-2xl font-bold text-foreground">
                      {editedUser.fullName}
                    </h2>
                  ) : (
                    <Input value={editedUser.fullName} onChange={(e) => setEditedUser({ ...editedUser, fullName: e.target.value })} className="text-2xl font-bold text-foreground" />
                  )}

                  {!edit ? (
                    <p className="text-sm mt-2">{editedUser.job}</p>
                  ) : (
                    <Input value={editedUser.job} onChange={(e) => setEditedUser({ ...editedUser, job: e.target.value })} className="text-sm mt-2" />
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  {
                    !edit ? (
                      <Button onClick={() => setEdit(true)} size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <Button onClick={() => {
                        setEdit(false)
                        updateUserProfile()
                      }} size="sm">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Save changes
                      </Button>
                    )
                  }


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
            <Phone className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              {!edit ? (
                <p className="font-medium">{editedUser.phoneNumber}</p>
              ) : (
                <Input value={editedUser.phoneNumber} onChange={(e) => setEditedUser({ ...editedUser, phoneNumber: e.target.value })} className="font-medium" />
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              {!edit ? (
                <p className="font-medium">{editedUser.location}</p>
              ) : (
                <Input value={editedUser.location} onChange={(e) => setEditedUser({ ...editedUser, location: e.target.value })} className="font-medium" />
              )}
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
          {!edit ? (
            <p className="text-muted-foreground">{editedUser.bio}</p>
          ) : (
            <Input value={editedUser.bio} onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })} className="text-muted-foreground" />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;