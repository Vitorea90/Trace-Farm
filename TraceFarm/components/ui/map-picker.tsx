'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons in Next.js
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/leaflet-marker-icon-2x.png', // We will need to ensure these exist or use CDN
    iconUrl: '/leaflet-marker-icon.png',
    shadowUrl: '/leaflet-marker-shadow.png',
});

// Since we can't easily add assets to public folder programmatically without download, 
// let's override with CDN links for the icon
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

function LocationMarker({ position, setPosition }: { position: [number, number] | null, setPosition: (pos: [number, number]) => void }) {
    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
        },
    });

    return position === null ? null : (
        <Marker position={position} icon={icon}></Marker>
    );
}

interface MapPickerProps {
    lat?: number;
    lng?: number;
    onChange: (lat: number, lng: number) => void;
}

export default function MapPicker({ lat, lng, onChange }: MapPickerProps) {
    // Default to Brazil center if no location
    const defaultCenter: [number, number] = lat && lng ? [lat, lng] : [-14.2350, -51.9253];
    const [position, setPosition] = useState<[number, number] | null>(lat && lng ? [lat, lng] : null);

    useEffect(() => {
        if (lat && lng) setPosition([lat, lng]);
    }, [lat, lng]);

    const handleSetPosition = (pos: [number, number]) => {
        setPosition(pos);
        onChange(pos[0], pos[1]);
    };

    return (
        <div className="h-[300px] w-full rounded-lg overflow-hidden border border-zinc-200 z-0 relative">
            <MapContainer center={defaultCenter} zoom={4} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={position} setPosition={handleSetPosition} />
            </MapContainer>
            {position && (
                <div className="absolute bottom-2 left-2 bg-white/90 p-2 rounded text-xs font-mono z-[1000] border border-zinc-200 shadow-sm pointer-events-none">
                    Lat: {position[0].toFixed(5)}, Lng: {position[1].toFixed(5)}
                </div>
            )}
        </div>
    );
}
