// GoogleMapView.tsx
import { Card } from "@/components/ui/card";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { useState } from "react";

interface MapLocation {
  coords: { lat: number; lng: number };
  title: string;
}

interface GoogleMapViewProps {
  apiKey: string; // Your Google Maps API key
  location?: MapLocation; // Single location to pin
  zoom?: number;
}

export function GoogleMapView({
  apiKey,
  location = { coords: { lat: 45.76298, lng: 21.2460 }, title: "Muzeul Corneliu Mikloși" },
  zoom = 18,
}: GoogleMapViewProps) {
  const [selected, setSelected] = useState<MapLocation | null>(null);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Map View</h3>

      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={{ height: "calc(100vh - 12rem)", width: "100%" }}
          center={location.coords}
          zoom={zoom}
        >
          {/* Marker */}
          <Marker
            position={location.coords}
            onClick={() => setSelected(location)}
          />

          {/* Info window */}
          {selected && (
            <InfoWindow
              position={selected.coords}
              onCloseClick={() => setSelected(null)}
            >
              <div>
                <h4 className="font-semibold">{selected.title}</h4>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </Card>
  );
}
