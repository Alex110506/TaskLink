import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2 } from "lucide-react";

interface TaskCardProps {
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  dueDate: string;
  priority?: "low" | "medium" | "high";
}

export function TaskCard({ title, description, status, dueDate, priority = "medium" }: TaskCardProps) {
  const statusConfig = {
    pending: { color: "bg-muted", label: "Pending" },
    "in-progress": { color: "bg-warning", label: "In Progress" },
    completed: { color: "bg-success", label: "Completed" },
  };

  const priorityConfig = {
    low: "border-l-success",
    medium: "border-l-warning",
    high: "border-l-destructive",
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow border-l-4 ${priorityConfig[priority]}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
          {status === "completed" && <CheckCircle2 className="h-5 w-5 text-success mt-1" />}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className={statusConfig[status].color}>
            {statusConfig[status].label}
          </Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            {dueDate}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
