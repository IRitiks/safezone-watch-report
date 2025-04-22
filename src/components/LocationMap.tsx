
import React, { useEffect, useState } from 'react';

interface LocationMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  markers?: Array<{
    latitude: number;
    longitude: number;
    title?: string;
    type?: 'normal' | 'emergency';
  }>;
  height?: string;
  width?: string;
}

const LocationMap: React.FC<LocationMapProps> = ({ 
  latitude, 
  longitude, 
  zoom = 13, 
  markers = [],
  height = '400px',
  width = '100%'
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  
  useEffect(() => {
    // In a real app, this would initialize Leaflet or Google Maps
    // For this demo, we'll just display a placeholder with the coordinates
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div 
      style={{ height, width }}
      className="bg-gray-100 rounded-md flex flex-col items-center justify-center relative overflow-hidden"
    >
      {!mapLoaded ? (
        <div className="text-gray-500">Loading map...</div>
      ) : (
        <>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full bg-gray-200 border border-gray-300" style={{ background: `url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${longitude},${latitude},${zoom},0/500x300?access_token=pk.mock')` }}>
              {/* This would be a real map in the actual implementation */}
            </div>
          </div>
          
          <div className="absolute bottom-2 left-2 bg-white p-2 rounded shadow-md text-xs">
            <div>Latitude: {latitude.toFixed(6)}</div>
            <div>Longitude: {longitude.toFixed(6)}</div>
            <div>Markers: {markers.length}</div>
          </div>
          
          <div className="absolute top-2 right-2 bg-white/80 py-1 px-2 rounded text-xs">
            (Map Placeholder)
          </div>
        </>
      )}
    </div>
  );
};

export default LocationMap;
