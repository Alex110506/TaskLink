import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CreateTask = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Task Created!",
      description: "The task has been assigned to the team.",
    });
  };

  const teams = [
    "Backend Engineers",
    "Frontend Engineers",
    "Product Team",
    "Design Team",
    "QA Team",
    "DevOps Team",
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-blue-500 to-accent bg-clip-text text-transparent">
          Create Task
        </h1>
        <p className="text-muted-foreground mt-1">Assign a new task to your team</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-border/50 bg-gradient-to-br from-card/80 to-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusSquare className="h-5 w-5 text-primary" />
              Task Details
            </CardTitle>
            <CardDescription>Provide information about the task</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Task Name */}
            <div className="space-y-2">
              <Label htmlFor="task-name">Task Name *</Label>
              <Input
                id="task-name"
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
                placeholder="Describe the task, requirements, and expected outcome..."
                required
                className="min-h-[200px] bg-background/50 border-border/50 focus:border-primary resize-none"
              />
            </div>

            {/* Team Assignment */}
            <div className="space-y-2">
              <Label htmlFor="team">Assign to Employee *</Label>
              <select
                id="team"
                required
                className="w-full h-10 px-3 rounded-md border border-border/50 bg-background/50 focus:border-primary focus:outline-none"
              >
                <option value="">Select a user</option>
                {teams.map((team, index) => (
                  <option key={index} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label htmlFor="due-date">Due Date</Label>
              <Input
                id="due-date"
                type="date"
                className="bg-background/50 border-border/50 focus:border-primary"
              />
            </div>

            

            

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Button 
                type="submit"
                className="flex-1 bg-gradient-to-r from-primary via-blue-600 to-accent hover:opacity-90 shadow-lg shadow-primary/30"
                size="lg"
              >
                <PlusSquare className="h-5 w-5 mr-2" />
                Create Task
              </Button>
             
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default CreateTask;
