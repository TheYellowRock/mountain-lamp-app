'use client';

import React, { useRef, useState } from 'react';
import {
  GoogleMap,
  LoadScript,
  Marker,
  StandaloneSearchBox
} from '@react-google-maps/api';

const libraries: ("places")[] = ['places'];

const mapContainerStyle = {
  width: '100%',
  height: '100vh',
};

const defaultCenter = { lat: 40.7128, lng: -74.0060 }; // NYC

type LocationData = {
  name: string;
  address: string;
  lat: number;
  lng: number;
};

export default function MapSearch() {
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onPlacesChanged = () => {
    const places = searchBoxRef.current?.getPlaces();
    if (!places || places.length === 0) return;

    const place = places[0];
    const location = place.geometry?.location;
    if (!location) return;

    const lat = location.lat();
    const lng = location.lng();

    setMarkerPosition({ lat, lng });

    setSelectedLocation({
      name: place.name || 'Unnamed location',
      address: place.formatted_address || place.vicinity || 'Unknown address',
      lat,
      lng
    });

    mapRef?.panTo({ lat, lng });
  };

  const handleSelect = async () => {
    if (!selectedLocation) return;
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('https://your-api.com/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedLocation),
      });

      if (!res.ok) throw new Error(`Server error: ${res.statusText}`);
      setMessage('Location submitted successfully!');
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
      libraries={libraries}
    >
      <div className="relative w-full h-screen">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={markerPosition || defaultCenter}
          zoom={12}
          onLoad={(map) => setMapRef(map)}
        >
          {markerPosition && <Marker position={markerPosition} />}
        </GoogleMap>

        <div className="absolute top-6 left-6 z-10 w-96 space-y-2">
          <StandaloneSearchBox
            onLoad={(ref) => (searchBoxRef.current = ref)}
            onPlacesChanged={onPlacesChanged}
          >
            <input
              type="text"
              placeholder="Search for a place"
              className="w-full p-3 rounded-md shadow-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </StandaloneSearchBox>

          {selectedLocation && (
            <button
              onClick={handleSelect}
              disabled={loading}
              className="w-full p-3 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Select & Submit'}
            </button>
          )}

          {message && (
            <div
              className={`p-2 text-sm rounded-md ${
                message.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </LoadScript>
  );
}
