import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [-98.5795, 39.8283],
        zoom: 3.5,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Add some example markers
      const locations = [
        { coords: [-74.006, 40.7128], title: "New York" },
        { coords: [-118.2437, 34.0522], title: "Los Angeles" },
        { coords: [-87.6298, 41.8781], title: "Chicago" },
      ];

      locations.forEach((location) => {
        new mapboxgl.Marker({ color: "hsl(220, 90%, 56%)" })
          .setLngLat(location.coords as [number, number])
          .setPopup(new mapboxgl.Popup().setHTML(`<h3 class="font-semibold">${location.title}</h3>`))
          .addTo(map.current!);
      });

      setError(false);
    } catch (err) {
      console.error("Map initialization error:", err);
      setError(true);
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  if (!mapboxToken) {
    return (
      <Card className="p-6">
        <div className="max-w-md mx-auto space-y-4">
          <h3 className="text-lg font-semibold">Enter Mapbox Token</h3>
          <p className="text-sm text-muted-foreground">
            To display the map, please enter your Mapbox public token. You can get one at{" "}
            <a
              href="https://mapbox.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
          <Input
            type="text"
            placeholder="pk.eyJ1Ijoi..."
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            className="font-mono text-sm"
          />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load map. Please check your Mapbox token and try again.
          </AlertDescription>
        </Alert>
      )}
      <div ref={mapContainer} className="h-[calc(100vh-12rem)] rounded-lg shadow-lg" />
    </div>
  );
}
