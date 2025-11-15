// Map.tsx
import { GoogleMapView } from "@/components/MapView";
import { useEffect, useState } from "react";

const Map = () => {
  const [jobs, setJobs] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 1. Fetch Jobs
  useEffect(() => {
    const getJobs = async () => {
      try {
        const res = await fetch(
          "http://localhost:5001/api/jobs/user/getJobs",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error("Failed to fetch jobs");

        const data = await res.json();
        setJobs(data.jobs || []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      }
    };

    getJobs();
  }, []);

  // 2. Convert job.location → coordinates
  useEffect(() => {
    if (jobs.length === 0) return;

    const fetchCoordinates = async () => {
      try {
        const apiKey = import.meta.env.VITE_GEOCODE_API_KEY;

        const promises = jobs.map(async (job) => {
          if (!job.location) return null;

          const res = await fetch(
            `https://geocode.maps.co/search?q=${encodeURIComponent(
              job.location
            )}&api_key=${apiKey}`
          );

          const data = await res.json();

          if (!Array.isArray(data) || data.length === 0) return null;

          return { 
            coords: { lat: parseFloat(data[0].lat), 
              lng: parseFloat(data[0].lon), }, 
              name: job.name || "Unknown Job", 
              description: job.description || "", 
              company: job.company.name || "",
              location: job.location || "",
              skills:job.skills || "",
              employmentType:job.employmentType || "",
              numberOfPositions:job.numberOfPositions || 0
          };
              
        });

        const results = await Promise.all(promises);

        // Remove empty results
        setLocations(results.filter((x) => x !== null));
      } catch (err) {
        console.error("error in geo", err);
        setError("Failed to fetch coordinates");
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinates();
  }, [jobs]);

  // UI feedback
  if (loading) return <p>Loading map...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Locations</h2>
        <p className="text-muted-foreground">
          View team locations and project sites
        </p>
      </div>

      <GoogleMapView
        apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        locations={locations}
      />
    </div>
  );
};

export default Map;
