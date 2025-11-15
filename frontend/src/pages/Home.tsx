import { TaskCard } from "@/components/TaskCard";
import { JobCard } from "@/components/JobCard";
import { useEffect } from "react";
import { useState } from "react";
import { Task } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const Home = () => {
  const [jobs, setJobs] = useState([{
    _id: "",
    name: "",
    description: "",
    skills: "",
    company: "",            // store Business _id
    location: "",
    employmentType: "",     // "remote", "on-site", "hybrid"
    numberOfPositions: 1,
    assignedTo: [],         // array of user IDs
    jobApplicants: [],      // array of user IDs
  }]);

  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const { toast } = useToast();


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(
          "http://localhost:5001/api/tasks/user/getTasks",
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await res.json();

        if (!res.ok) {
          toast({
            title: "Error",
            description: data.message || "Failed to update profile",
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

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/jobs/user/getJobs", {
          credentials: "include"
        });
        const data = await res.json();
        console.log(data);
        setJobs(data.jobs)
      } catch (error) {
        console.error(error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">My Tasks</h2>
          <p className="text-muted-foreground">Track your daily tasks and priorities</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allTasks.map((task, index) => (
            <TaskCard key={index} task={task} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Job Applications</h2>
          <p className="text-muted-foreground">Current opportunities and applications</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job, index) => (
            <JobCard
              key={index}
              id={job._id}
              name={job.name}
              description={job.description}
              skills={job.skills}
              //@ts-ignore
              company={job.company?.name}  // flatten the company
              location={job.location}
              employmentType={job.employmentType}
              numberOfPositions={job.numberOfPositions}
              assignedTo={job.assignedTo}
              jobApplicants={job.jobApplicants}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
