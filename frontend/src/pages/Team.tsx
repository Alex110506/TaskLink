import { ProfileCard } from "@/components/ProfileCard";
import { TeamCard } from "@/components/TeamCard";
import { useEffect, useState } from "react";

const Team = () => {
  const profiles = [
    { name: "Nokia" as const },
    { name: "Microsoft" as const },
    { name: "BitDefender" as const },
    { name: "Google" as const },
    { name: "Meta" as const },
    { name: "Netflix" as const },
  ];

  const [teams, setTeams] = useState([])

  // const teams = [
  //   {
  //     name: "Product Development",
  //     description: "Building the core platform features and functionality",
  //     memberCount: 8,
  //     members: ["Sarah Johnson", "Michael Chen", "Emily Rodriguez", "James Williams", "Lisa Anderson"],
  //   },
  //   {
  //     name: "Marketing Team",
  //     description: "Brand strategy, content creation, and user acquisition",
  //     memberCount: 5,
  //     members: ["David Park", "Sarah Johnson", "Emily Rodriguez"],
  //   },
  //   {
  //     name: "Customer Success",
  //     description: "Supporting users and ensuring product satisfaction",
  //     memberCount: 6,
  //     members: ["Lisa Anderson", "James Williams", "Michael Chen"],
  //   },
  // ];

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getTeams = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5001/api/tasks/user/getTeams", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch teams");
        }

        const data = await res.json();
        setTeams(data.teams || []);

      } catch (err: any) {
        console.error("Error fetching teams:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    getTeams();
  }, []);

  console.log(teams);

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Your Connections</h2>
          <p className="text-muted-foreground">Connect with your businesses</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map((profile, index) => (
            <ProfileCard key={index} {...profile} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">My Teams</h2>
          <p className="text-muted-foreground">Collaborate across different projects</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team, index) => (
            <TeamCard key={index} 
              jobName={team.jobName} 
              memberCount={team.users.length}
              members={team.users}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Team;
