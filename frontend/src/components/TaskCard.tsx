import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock } from "lucide-react";
import { Task } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const statusConfig = {
    pending: { color: "bg-muted", label: "Pending" },
    "not completed": { color: "bg-warning", label: "In Progress" },
    completed: { color: "bg-success", label: "Completed" },
  };

  const priorityConfig = {
    low: "border-l-success",
    medium: "border-l-warning",
    high: "border-l-destructive",
  };

  return (
    <Card
      className={`hover:shadow-lg transition-shadow border-l-4 ${
        priorityConfig[task.importance]
      }`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{task.name}</CardTitle>
            <CardDescription className="mt-1">
              {task.description}
            </CardDescription>
          </div>
          {task.status === "completed" && (
            <CheckCircle2 className="h-5 w-5 text-success mt-1" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Badge
            variant="secondary"
            className={statusConfig[task.status].color}
          >
            {statusConfig[task.status].label}
          </Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
