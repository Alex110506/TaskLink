import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Eye, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/lib/utils";

interface Member {
  _id: string;
  fullName: string;
  email: string;
  role?: string;
}

interface Team {
  jobId: string;
  jobName: string;
  users: Member[];
}

const BusinessChat = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const {businessUser}=useAuthStore()

  const [employees,setEmployees]=useState([])

  const navigate=useNavigate()

  // const employees = [
  //   { name: "Alice Johnson", role: "Frontend Developer", status: "online", unread: 2 },
  //   { name: "Bob Smith", role: "Backend Developer", status: "away", unread: 0 },
  //   { name: "Carol Williams", role: "Product Manager", status: "online", unread: 1 },
  //   { name: "David Brown", role: "UI/UX Designer", status: "offline", unread: 0 },
  // ];

  useEffect(() => {
    const getTeams = async () => {
      try {
        const res = await fetch("/api/tasks/business/getTeams", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch teams");

        const data = await res.json();
        setTeams(data.teams || []);
      } catch (err: any) {
        console.error("Error fetching teams:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch("/api/jobs/business/getUsers", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await res.json();
        console.log(data);

        if (data.success) {
          setEmployees(data.users || []);
        } else {
          setError("No users found");
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers()
    getTeams();
  }, []);

  if (loading) return <p>Loading teams...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleChatClick = (userEmail,businessEmail) => {
    //const userId = name.toLowerCase().replace(/\s+/g, "-");
    navigate(`/chat/business/${encodeURIComponent(userEmail)}|${encodeURIComponent(businessEmail)}`);

  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-blue-500 to-accent bg-clip-text text-transparent">
          Business Chat
        </h1>
        <p className="text-muted-foreground mt-1">Connect with employees and manage teams</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

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
              <Card
                key={index}
                onClick={()=>handleChatClick(employee.email,businessUser.email)}
                className="border-border/50 hover:border-primary/50 transition-all cursor-pointer bg-gradient-to-r from-blue-900/5 to-transparent"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-primary-foreground">
                          {employee.fullName.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{employee.fullName}</div>
                      <div className="text-sm text-muted-foreground">{employee.email}</div>
                    </div>
                    
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
            <CardDescription>Organized by job teams</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {teams.map((team, index) => (
              <Card
                key={index}
                className="border-border/50 hover:border-accent/50 transition-all bg-gradient-to-r from-accent/5 to-transparent"
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-lg">{team.jobName} Team</div>
                        <div className="text-sm text-muted-foreground">
                          {team.users.length} members
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-accent/10 text-accent border-accent/20"
                      >
                        {team.users.length} members
                      </Badge>
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
                          <DialogTitle>{team.jobName}</DialogTitle>
                          <DialogDescription>
                            {team.users.length} members
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          {team.users.map((member, memberIndex) => (
                            <Card
                              key={memberIndex}
                              className="border-border/50 hover:border-primary/50 transition-all"
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                  <Avatar className="h-14 w-14">
                                    <AvatarFallback className="bg-gradient-to-br from-accent to-primary-light text-primary-foreground">
                                      {member.fullName
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="font-semibold text-lg">{member.fullName}</div>
                                    <div className="text-sm text-muted-foreground">{member.role || "Employee"}</div>
                                    <div className="text-xs text-muted-foreground mt-1">{member.email}</div>
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
