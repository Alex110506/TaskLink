import { TaskCard } from "@/components/TaskCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Tasks = () => {
  const allTasks = [
    {
      title: "Design system update",
      description: "Update design tokens and component library",
      status: "in-progress" as const,
      dueDate: "Mar 15",
      priority: "high" as const,
    },
    {
      title: "API integration testing",
      description: "Complete end-to-end testing for new API endpoints",
      status: "pending" as const,
      dueDate: "Mar 18",
      priority: "high" as const,
    },
    {
      title: "Documentation review",
      description: "Review and update technical documentation",
      status: "pending" as const,
      dueDate: "Mar 20",
      priority: "medium" as const,
    },
    {
      title: "Performance optimization",
      description: "Improve application load time and runtime performance",
      status: "in-progress" as const,
      dueDate: "Mar 22",
      priority: "medium" as const,
    },
    {
      title: "User feedback analysis",
      description: "Analyze user feedback from recent survey",
      status: "completed" as const,
      dueDate: "Mar 10",
      priority: "low" as const,
    },
    {
      title: "Security audit",
      description: "Conduct security audit of authentication flow",
      status: "completed" as const,
      dueDate: "Mar 8",
      priority: "high" as const,
    },
  ];

  const pendingTasks = allTasks.filter((task) => task.status === "pending");
  const inProgressTasks = allTasks.filter((task) => task.status === "in-progress");
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
              <TaskCard key={index} {...task} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingTasks.map((task, index) => (
              <TaskCard key={index} {...task} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProgressTasks.map((task, index) => (
              <TaskCard key={index} {...task} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedTasks.map((task, index) => (
              <TaskCard key={index} {...task} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tasks;
