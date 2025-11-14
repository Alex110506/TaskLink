import { GoogleMapView } from "@/components/MapView";

const Map = () => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Locations</h2>
        <p className="text-muted-foreground">
          View team locations and project sites
        </p>
      </div>
      <GoogleMapView apiKey={import.meta.env.VITE_GEMINI_API_KEY} />
    </div>
  );
};

export default Map;
