import { TaskCard } from "@/components/TaskCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Task } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Tasks = () => {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(
          "/api/tasks/user/getTasks",
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await res.json();

        if (!res.ok) {
          toast({
            title: "Error",
            description: data.message || "Failed to fetch user's task",
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

    fetchTasks();
  }, []);

  const pendingTasks = allTasks.filter((task) => task.status === "pending");
  const inProgressTasks = allTasks.filter(
    (task) => task.status === "not completed"
  );
  const completedTasks = allTasks.filter((task) => task.status === "completed");

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Tasks</h2>
        <p className="text-muted-foreground">Manage and track all your tasks</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allTasks.map((task, index) => (
              <TaskCard key={index} task={task} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingTasks.map((task, index) => (
              <TaskCard key={index} task={task} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProgressTasks.map((task, index) => (
              <TaskCard key={index} task={task} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedTasks.map((task, index) => (
              <TaskCard key={index} task={task} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tasks;
