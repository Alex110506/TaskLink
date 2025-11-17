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
import { Mail, MapPin, Edit, Phone, LogOut, CheckCircle } from "lucide-react";
import { useAuthStore } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const BusinessProfile = () => {
  const { businessUser, setBusinessUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [editedBusinessUser, setEditedBusinessUser] = useState(businessUser);
  const [edit, setEdit] = useState(false);
  const { toast } = useToast();


  async function updateBusinessProfile() {
    setIsLoading(true); // start loading immediately

    try {
      const res = await fetch("/api/register/business/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedBusinessUser),
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
        name,
        email,
        phone,
        about,
        field,
        location,
      } = data.business;

      // Update local state
      const updatedUser = { name, email, phone, about, field, location };
      setEditedBusinessUser(updatedUser);
      setBusinessUser(updatedUser);

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

  function getInitials(name) {
    return name
      .trim()                     // remove surrounding spaces
      .split(/\s+/)               // split by one or more spaces
      .filter(part => part.length > 0)  // remove empty parts
      .slice(0, 2)                // take only the first 2 name parts
      .map(part => part[0].toUpperCase()) // take first letter & uppercase
      .join("");                  // join initials together
  }

  const handleLogout = async () => {
    try {
      const res = await fetch(
        "/api/register/business/logout",
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
                {getInitials(editedBusinessUser.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  {!edit ? (
                    <h2 className="text-3xl font-bold text-foreground">
                    {editedBusinessUser.name}
                  </h2>
                  ):(
                    <Input
                      value={editedBusinessUser.name}
                      onChange={(e) => setEditedBusinessUser({ ...editedBusinessUser, name: e.target.value })}
                      className="text-2xl font-bold text-foreground"
                    />
                  )}
                  {!edit ? (
                  <p className="text-muted-foreground">{editedBusinessUser.field}</p>

                  ):(
                    <Input
                      value={editedBusinessUser.field}
                      onChange={(e) => setEditedBusinessUser({ ...editedBusinessUser, field: e.target.value })}
                      className="text-sm mt-2"
                    />
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  {!edit ? (
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 flex items-center"
                    onClick={()=>setEdit(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  ):(
                    <Button onClick={() => {
                        setEdit(false)
                        updateBusinessProfile()
                      }} size="sm">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Save changes
                      </Button>
                  )}
                  

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
            <Phone className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              {!edit ? (
              <p className="font-medium">{editedBusinessUser.phone}</p>

              ):(
                <Input value={editedBusinessUser.phone} onChange={(e) => setEditedBusinessUser({ ...editedBusinessUser, phone: e.target.value })} className="font-medium" />
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Office Address</p>
              {!edit ? (
              <p className="font-medium">{editedBusinessUser.location}</p>

              ):(
                <Input value={editedBusinessUser.location} onChange={(e) => setEditedBusinessUser({ ...editedBusinessUser, location: e.target.value })} className="font-medium" />
              )}
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
          {!edit ? (
            <p className="text-muted-foreground leading-relaxed">
            {editedBusinessUser.about}
          </p>
          ):(
            <Input value={editedBusinessUser.about} onChange={(e) => setEditedBusinessUser({ ...editedBusinessUser, about: e.target.value })} className="text-muted-foreground leading-relaxed" />
          )}
          
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessProfile;
