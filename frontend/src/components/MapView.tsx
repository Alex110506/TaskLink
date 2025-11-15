// GoogleMapView.tsx 
import { Card } from "@/components/ui/card";
import { GoogleMap, LoadScriptNext, Marker, InfoWindow } from "@react-google-maps/api";
import { useState } from "react";

interface MapLocation {
  coords: { lat: number; lng: number };
  name: string;
  location: string;
  company: string;
  skills: string;
  description: string;
  employmentType: string;
  numberOfPositions: number;
}

interface GoogleMapViewProps {
  apiKey: string;
  locations: MapLocation[];
  zoom?: number;
}

export function GoogleMapView({
  apiKey,
  locations,
  zoom = 15,
}: GoogleMapViewProps) {

  const [selected, setSelected] = useState<MapLocation | null>(null);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Map View</h3>

      <LoadScriptNext googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={{ height: "calc(100vh - 12rem)", width: "100%" }}
          center={locations[0]?.coords}
          zoom={zoom}
        >
          {locations.map((loc, i) => (
            <Marker
              key={i}
              position={loc.coords}
              onClick={() => setSelected(loc)}
            />
          ))}

          {selected && (
            <InfoWindow
              position={selected.coords}
              onCloseClick={() => setSelected(null)}
            >
              <div className="w-64 p-3 rounded-xl shadow-md bg-white space-y-2 border border-gray-100">
                <h4 className="font-semibold text-base text-gray-900">
                  {selected.name}
                </h4>

                <div className="space-y-1 text-sm text-gray-700">
                  <p><span className="font-medium text-gray-900">Company:</span> {selected.company}</p>
                  <p><span className="font-medium text-gray-900">Location:</span> {selected.location}</p>
                  <p><span className="font-medium text-gray-900">Employment:</span> {selected.employmentType}</p>
                  <p><span className="font-medium text-gray-900">Positions:</span> {selected.numberOfPositions}</p>
                  <p><span className="font-medium text-gray-900">Skills:</span> {selected.skills}</p>
                </div>

                {selected.description && (
                  <p className="text-xs text-gray-500 leading-snug pt-1 border-t border-gray-200">
                    {selected.description}
                  </p>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScriptNext>
    </Card>
  );
}
