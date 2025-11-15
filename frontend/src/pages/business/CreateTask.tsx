import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Task } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const CreateTask = () => {
  const navigate = useNavigate();

  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [newTask, setNewTask] = useState<Task>({
    name: "",
    importance: "high",
    description: "",
    assignedTo: [],
    dueDate: "",
    status: "not completed",
    business: "",
  });

  const [users, setUsers] = useState([]); // state to store users

  useEffect(() => {
    const getUsers = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          "http://localhost:5001/api/tasks/business/getUsers",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!res.ok) {
          console.error("Failed to fetch users");
          setIsLoading(false);
          return;
        }

        const data = await res.json();
        setUsers(data.users || []);
        console.log(data.users);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setIsLoading(false);
      }
    };

    getUsers(); // don't forget to call the async function
  }, []);

  // Example team options
  const teams = ["Alice", "Bob", "Charlie", "David", "Eve"];

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value, options } = e.target as HTMLSelectElement;

    if (id === "assignedTo") {
      const selected = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);
      setNewTask((prev) => ({ ...prev, assignedTo: selected }));
    } else {
      setNewTask((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleCreate = async () => {
    if (
      !newTask.name ||
      !newTask.importance ||
      !newTask.description ||
      !newTask.assignedTo
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5001/api/tasks/business/createTask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(newTask),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Error",
          description: data.message || "Failed to create task",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: "Task Created",
        description: `Task "${data.task.name}" created successfully.`,
      });

      navigate("/");

      // Reset form
      setNewTask({
        name: "",
        importance: "high",
        description: "",
        assignedTo: [],
        dueDate: "",
        status: "not completed",
        business: "",
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Error",
        description: "Network or server error occurred. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   handleCreate();
  // };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-blue-500 to-accent bg-clip-text text-transparent">
          Create Task
        </h1>
        <p className="text-muted-foreground mt-1">
          Assign a new task to your team
        </p>
      </div>

      <form>
        <Card className="border-border/50 bg-gradient-to-br from-card/80 to-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusSquare className="h-5 w-5 text-primary" />
              Task Details
            </CardTitle>
            <CardDescription>
              Provide information about the task
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Task Name */}
            <div className="space-y-2">
              <Label htmlFor="title">Task Name *</Label>
              <Input
                id="title"
                value={newTask.name}
                onChange={(e) =>
                  setNewTask((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Implement User Authentication"
                required
                className="bg-background/50 border-border/50 focus:border-primary"
              />
            </div>

            {/* Importance */}
            <div className="space-y-2">
              <Label htmlFor="importance">Importance *</Label>
              <select
                id="importance"
                value={newTask.importance}
                onChange={handleChange}
                required
                className="w-full h-10 px-3 rounded-md border border-border/50 bg-background/50 focus:border-primary focus:outline-none"
              >
                <option value="">Select importance level</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={newTask.description}
                onChange={handleChange}
                placeholder="Describe the task, requirements, and expected outcome..."
                required
                className="min-h-[200px] bg-background/50 border-border/50 focus:border-primary resize-none"
              />
            </div>

            {/* User Assignment */}
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assign to Employee *</Label>
              <select
                id="assignedTo"
                value={newTask.assignedTo[0] || ""}
                onChange={(e) =>
                  setNewTask((prev) => ({
                    ...prev,
                    assignedTo: [e.target.value],
                  }))
                }
                required
                className="w-full h-10 px-3 rounded-md border border-border/50 bg-background/50 focus:border-primary focus:outline-none"
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.fullName}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={
                  newTask.dueDate
                    ? new Date(newTask.dueDate).toISOString().split("T")[0]
                    : ""
                }
                onChange={handleChange}
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-primary via-blue-600 to-accent hover:opacity-90 shadow-lg shadow-primary/30"
                size="lg"
                onClick={() => handleCreate()}
              >
                <PlusSquare className="h-5 w-5 mr-2" />
                {isLoading ? "Creating..." : "Create Task"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default CreateTask;
