
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different marker types
const emergencyIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'emergency-marker'
});

const normalIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'normal-marker'
});

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
  return (
    <>
      <style>
        {`
          .emergency-marker {
            filter: hue-rotate(0deg) saturate(2) brightness(1.2);
          }
          .normal-marker {
            filter: hue-rotate(200deg) saturate(1.5);
          }
        `}
      </style>
      <div style={{ height, width }} className="relative">
        <MapContainer
          center={[latitude, longitude]}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          className="rounded-md"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={[marker.latitude, marker.longitude]}
              icon={marker.type === 'emergency' ? emergencyIcon : normalIcon}
            >
              <Popup>
                <div className="text-sm">
                  <h3 className="font-medium">{marker.title || 'Incident'}</h3>
                  <p className="text-gray-600">
                    {marker.type === 'emergency' ? '🚨 Emergency Report' : '📍 Regular Report'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {marker.latitude.toFixed(6)}, {marker.longitude.toFixed(6)}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </>
  );
};

export default LocationMap;
