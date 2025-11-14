import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Eye, MessageSquare } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const BusinessChat = () => {
  const employees = [
    { name: "Alice Johnson", role: "Frontend Developer", status: "online", unread: 2 },
    { name: "Bob Smith", role: "Backend Developer", status: "away", unread: 0 },
    { name: "Carol Williams", role: "Product Manager", status: "online", unread: 1 },
    { name: "David Brown", role: "UI/UX Designer", status: "offline", unread: 0 },
  ];

  const teams = [
    {
      name: "Backend Engineers",
      members: 8,
      lead: "Bob Smith",
      description: "Server-side development and API design",
      membersList: [
        { name: "Bob Smith", role: "Senior Backend Engineer", experience: "7 years" },
        { name: "Emma Davis", role: "Backend Engineer", experience: "4 years" },
        { name: "Frank Wilson", role: "Backend Engineer", experience: "3 years" },
        { name: "Grace Lee", role: "Junior Backend Engineer", experience: "1 year" },
      ]
    },
    {
      name: "Frontend Engineers",
      members: 6,
      lead: "Alice Johnson",
      description: "User interface and client-side development",
      membersList: [
        { name: "Alice Johnson", role: "Senior Frontend Engineer", experience: "5 years" },
        { name: "Henry Martinez", role: "Frontend Engineer", experience: "3 years" },
        { name: "Iris Taylor", role: "Frontend Engineer", experience: "2 years" },
      ]
    },
    {
      name: "Product Team",
      members: 5,
      lead: "Carol Williams",
      description: "Product strategy and management",
      membersList: [
        { name: "Carol Williams", role: "Product Manager", experience: "6 years" },
        { name: "Jack Anderson", role: "Product Designer", experience: "4 years" },
        { name: "Kate Thompson", role: "Product Analyst", experience: "2 years" },
      ]
    },
    {
      name: "Design Team",
      members: 4,
      lead: "David Brown",
      description: "Visual design and user experience",
      membersList: [
        { name: "David Brown", role: "Lead Designer", experience: "8 years" },
        { name: "Laura Garcia", role: "UI Designer", experience: "3 years" },
        { name: "Mike Robinson", role: "UX Researcher", experience: "4 years" },
      ]
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-blue-500 to-accent bg-clip-text text-transparent">
          Business Chat
        </h1>
        <p className="text-muted-foreground mt-1">Connect with employees and manage teams</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Employees Chat */}
        <Card className="border-border/50 bg-gradient-to-br from-card/80 to-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Employee Chats
            </CardTitle>
            <CardDescription>Direct messages with your team members</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {employees.map((employee, index) => (
              <Card key={index} className="border-border/50 hover:border-primary/50 transition-all cursor-pointer bg-gradient-to-r from-blue-900/5 to-transparent">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-primary-foreground">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${
                        employee.status === 'online' ? 'bg-green-500' :
                        employee.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{employee.name}</div>
                      <div className="text-sm text-muted-foreground">{employee.role}</div>
                    </div>
                    {employee.unread > 0 && (
                      <Badge className="bg-primary text-primary-foreground">
                        {employee.unread}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Teams */}
        <Card className="border-border/50 bg-gradient-to-br from-card/80 to-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              Teams
            </CardTitle>
            <CardDescription>Organized by department and function</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {teams.map((team, index) => (
              <Card key={index} className="border-border/50 hover:border-accent/50 transition-all bg-gradient-to-r from-accent/5 to-transparent">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-lg">{team.name}</div>
                        <div className="text-sm text-muted-foreground">{team.description}</div>
                      </div>
                      <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                        {team.members} members
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Lead: <span className="text-foreground font-medium">{team.lead}</span>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full border-accent/30 hover:bg-accent/10"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Team Members
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{team.name}</DialogTitle>
                          <DialogDescription>
                            {team.description} • {team.members} members
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          {team.membersList.map((member, memberIndex) => (
                            <Card key={memberIndex} className="border-border/50 hover:border-primary/50 transition-all">
                              <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                  <Avatar className="h-14 w-14">
                                    <AvatarFallback className="bg-gradient-to-br from-accent to-primary-light text-primary-foreground">
                                      {member.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="font-semibold text-lg">{member.name}</div>
                                    <div className="text-sm text-muted-foreground">{member.role}</div>
                                    <div className="text-xs text-muted-foreground mt-1">{member.experience} experience</div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="border-primary/30">
                                      Message
                                    </Button>
                                    <Button size="sm" variant="ghost">
                                      Profile
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessChat;
