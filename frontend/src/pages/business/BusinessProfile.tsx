import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Mail, MapPin, Calendar, Users, Edit, Globe, Phone } from "lucide-react";

const BusinessProfile = () => {
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
                  <h2 className="text-2xl font-bold text-foreground">TechCorp Solutions</h2>
                  <p className="text-muted-foreground">Technology & Innovation</p>
                </div>
                <Button size="sm" className="bg-gradient-to-r from-primary to-blue-600 hover:opacity-90">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-primary/10 text-primary border-primary/20">Software Development</Badge>
                <Badge className="bg-accent/10 text-accent border-accent/20">Cloud Services</Badge>
                <Badge className="bg-blue-600/10 text-blue-500 border-blue-500/20">AI/ML</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Company Information */}
        <Card className="border-border/50 bg-gradient-to-br from-card/80 to-card hover:border-primary/30 transition-all">
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Business details and contact</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Building className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Company Type</p>
                <p className="font-medium">Technology Corporation</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Headquarters</p>
                <p className="font-medium">San Francisco, CA</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Founded</p>
                <p className="font-medium">January 2018</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Company Size</p>
                <p className="font-medium">50-200 employees</p>
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
                <p className="font-medium">contact@techcorp.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">+1 (555) 987-6543</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Website</p>
                <p className="font-medium text-primary hover:underline cursor-pointer">www.techcorp.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Office Address</p>
                <p className="font-medium">123 Tech Street, San Francisco, CA 94102</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* About Section */}
      <Card className="border-border/50 bg-gradient-to-br from-card/80 to-card">
        <CardHeader>
          <CardTitle>About</CardTitle>
          <CardDescription>Company overview</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            TechCorp Solutions is a leading technology company specializing in innovative software development, 
            cloud computing, and artificial intelligence solutions. With over 6 years of experience, we've helped 
            hundreds of businesses transform their digital infrastructure and achieve their technological goals. 
            Our team of expert engineers and consultants work closely with clients to deliver cutting-edge solutions 
            that drive growth and efficiency.
          </p>
        </CardContent>
      </Card>

    </div>
  );
};

export default BusinessProfile;
