import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Clock, Users, MoreVertical } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { Task } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

const BusinessTasks = () => {
  const navigate = useNavigate();

  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  const fetchTasks = async () => {
    try {
      const res = await fetch(
        "/api/tasks/business/getTasks",
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch business's tasks",
          variant: "destructive",
        });
        console.error("Failed to fetch tasks:", data.message);
        return;
      }

      setAllTasks(data.tasks); // data.tasks must match your Task[] structure
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const res = await fetch(
        `/api/tasks/business/updateTask/${taskId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Error",
          description: data.message || "Failed to update task status",
          variant: "destructive",
        });
        console.error("Update error:", data.message);
        return;
      }

      toast({
        title: "Status Updated",
        description: "The task status has been updated successfully.",
      });

      // refresh tasks after update
      fetchTasks();
    } catch (err) {
      console.error("Error updating task:", err);
      toast({
        title: "Error",
        description: "Something went wrong while updating the task.",
        variant: "destructive",
      });
    }
  };

  const getImportanceBadge = (importance: string) => {
    const colors = {
      low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      critical: "bg-red-500/10 text-red-500 border-red-500/20",
    };
    return colors[importance as keyof typeof colors] || colors.medium;
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: "bg-muted text-muted-foreground border-border",
      "in-progress": "bg-primary/10 text-primary border-primary/20",
      completed: "bg-green-500/10 text-green-500 border-green-500/20",
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const filterTasks = (status?: string) => {
    if (!status) return allTasks;
    return allTasks.filter((task) => task.status === status);
  };

  const TaskCard = ({ task }: { task: (typeof allTasks)[0] }) => (
    <Card className="border-border/50 hover:border-primary/50 transition-all bg-gradient-to-r from-card/80 to-card">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <h3 className="text-lg font-semibold">{task.name}</h3>
              <div className="flex flex-wrap gap-2">
                <Badge className={getImportanceBadge(task.importance)}>
                  {task.importance}
                </Badge>
                <Badge className={getStatusBadge(task.status)}>
                  {task.status.replace("-", " ")}
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground">{task.description}</p>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border/50">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                Due date
              </div>
              <div className="text-sm font-medium">
                {new Date(task.dueDate).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-border/50"
                >
                  Update Status
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-40">
                <DropdownMenuItem
                  onClick={() => updateTaskStatus(task._id, "pending")}
                >
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => updateTaskStatus(task._id, "not completed")}
                >
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => updateTaskStatus(task._id, "completed")}
                >
                  Completed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-blue-500 to-accent bg-clip-text text-transparent">
            Task Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage all team tasks
          </p>
        </div>
        <Button
          onClick={() => navigate("/business/create-task")}
          className="bg-gradient-to-r from-primary via-blue-600 to-accent hover:opacity-90 shadow-lg shadow-primary/30"
        >
          <CheckSquare className="h-5 w-5 mr-2" />
          Create New Task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Tasks",
            value: allTasks.length,
            icon: "📋",
            color: "from-primary to-blue-600",
          },
          {
            label: "In Progress",
            value: filterTasks("not completed").length,
            icon: "🔄",
            color: "from-accent to-primary-light",
          },
          {
            label: "Completed",
            value: filterTasks("completed").length,
            icon: "✅",
            color: "from-blue-600 to-primary",
          },
          {
            label: "Pending",
            value: filterTasks("pending").length,
            icon: "⏳",
            color: "from-primary-light to-accent",
          },
        ].map((stat, index) => (
          <Card
            key={index}
            className="border-border/50 bg-gradient-to-br from-card/80 to-card hover:border-primary/30 transition-all"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl shadow-lg`}
                >
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tasks Tabs */}
      <Card className="border-border/50 bg-gradient-to-br from-card/80 to-card">
        <CardHeader>
          <CardTitle>Tasks Overview</CardTitle>
          <CardDescription>View tasks by status</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="not completed">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {allTasks.map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {filterTasks("pending").map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </TabsContent>

            <TabsContent value="not completed" className="space-y-4">
              {filterTasks("not completed").map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {filterTasks("completed").map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessTasks;
