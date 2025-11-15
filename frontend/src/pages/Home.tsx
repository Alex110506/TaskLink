import { TaskCard } from "@/components/TaskCard";
import { JobCard } from "@/components/JobCard";
import { useEffect } from "react";
import { useState } from "react";

const Home = () => {
  const [jobs, setJobs] = useState([{
    _id:"",
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
  const tasks = [
    {
      title: "Update client presentation",
      description: "Revise slides for Q4 review meeting",
      status: "in-progress" as const,
      dueDate: "Today",
      priority: "high" as const,
    },
    {
      title: "Code review for API endpoints",
      description: "Review authentication and user management endpoints",
      status: "pending" as const,
      dueDate: "Tomorrow",
      priority: "medium" as const,
    },
    {
      title: "Team retrospective notes",
      description: "Compile feedback from sprint retrospective",
      status: "completed" as const,
      dueDate: "Yesterday",
      priority: "low" as const,
    },
  ];

  // const jobs = [
  //   {
  //     company: "TechCorp Inc.",
  //     position: "Senior Frontend Developer",
  //     description: "Join our team to build next-generation web applications using React and TypeScript.",
  //     location: "Remote",
  //     type: "Full-time",
  //   },
  //   {
  //     company: "DataFlow Solutions",
  //     position: "Product Manager",
  //     description: "Lead product strategy for our data analytics platform serving enterprise clients.",
  //     location: "San Francisco, CA",
  //     type: "Full-time",
  //   },
  //   {
  //     company: "CloudBridge Systems",
  //     position: "DevOps Engineer",
  //     description: "Help build and maintain our cloud infrastructure with AWS and Kubernetes.",
  //     location: "Remote",
  //     type: "Contract",
  //   },
  // ];

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
          {tasks.map((task, index) => (
            <TaskCard key={index} {...task} />
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
