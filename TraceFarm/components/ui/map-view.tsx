'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom icons for different marker types
const createIcon = (color: string) => {
    return L.divIcon({
        className: 'custom-marker',
        html: `
            <div style="
                background-color: ${color};
                width: 30px;
                height: 30px;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ">
                <div style="
                    width: 10px;
                    height: 10px;
                    background-color: white;
                    border-radius: 50%;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                "></div>
            </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });
};

const farmIcon = createIcon('#10b981'); // Green for farm
const lotIcon = createIcon('#3b82f6'); // Blue for lot

interface Location {
    lat: number;
    lng: number;
    label: string;
    description?: string;
    type: 'farm' | 'lot';
}

interface MapViewProps {
    locations: Location[];
    height?: string;
    zoom?: number;
}

export default function MapView({ locations, height = '400px', zoom }: MapViewProps) {
    if (locations.length === 0) {
        return (
            <div
                className="w-full rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50 flex items-center justify-center"
                style={{ height }}
            >
                <p className="text-zinc-500 text-sm">Nenhuma localização disponível</p>
            </div>
        );
    }

    // Calculate center point
    const centerLat = locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length;
    const centerLng = locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length;
    const center: [number, number] = [centerLat, centerLng];

    // Auto-calculate zoom based on number of locations
    const defaultZoom = locations.length === 1 ? 13 : 10;

    return (
        <div className="space-y-3">
            <div
                className="w-full rounded-lg overflow-hidden border border-zinc-200 shadow-sm"
                style={{ height }}
            >
                <MapContainer
                    center={center}
                    zoom={zoom || defaultZoom}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {locations.map((location, index) => (
                        <Marker
                            key={index}
                            position={[location.lat, location.lng]}
                            icon={location.type === 'farm' ? farmIcon : lotIcon}
                        >
                            <Popup>
                                <div className="p-2">
                                    <h3 className="font-bold text-sm mb-1">{location.label}</h3>
                                    {location.description && (
                                        <p className="text-xs text-zinc-600">{location.description}</p>
                                    )}
                                    <p className="text-xs text-zinc-400 mt-2 font-mono">
                                        {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                                    </p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-sm">
                {locations.map((location, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                            style={{
                                backgroundColor: location.type === 'farm' ? '#10b981' : '#3b82f6'
                            }}
                        />
                        <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                            {location.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
