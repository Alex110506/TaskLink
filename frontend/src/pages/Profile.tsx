import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, Briefcase, Calendar, Phone, Edit } from "lucide-react";

const Profile = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">John Doe</h2>
                  <p className="text-muted-foreground">Senior Product Manager</p>
                </div>
                <Button size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Product Management</Badge>
                <Badge variant="secondary">Agile</Badge>
                <Badge variant="secondary">Leadership</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <p className="font-medium">john.doe@tasklink.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">San Francisco, CA</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Work Information</CardTitle>
            <CardDescription>Your role and department</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">Product Development</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Joined</p>
                <p className="font-medium">January 2022</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Employee ID</p>
                <p className="font-medium">TL-2022-1045</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
          <CardDescription>Professional summary</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Experienced product manager with over 8 years in the tech industry. Specializing in building
            user-centric products and leading cross-functional teams. Passionate about leveraging data-driven
            insights to drive product strategy and deliver exceptional user experiences.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
