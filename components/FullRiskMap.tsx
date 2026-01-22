"use client";

import { useEffect, useState } from "react";
import { Loader2, Navigation, Map as MapIcon, ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapContainer, TileLayer, Circle, Popup, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

// Component to handle map centering
function MapController({ center }: { center: [number, number] | null }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 12, { duration: 2 });
        }
    }, [center, map]);
    return null;
}

interface HeatmapZone {
    lat: number;
    lon: number;
    risk: number;
}

export default function FullRiskMap() {
    const [zones, setZones] = useState<HeatmapZone[]>([]);
    const [loading, setLoading] = useState(true);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [showForecast, setShowForecast] = useState(false); // false = Today, true = +2 Days

    // Fetch user location on mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation([position.coords.latitude, position.coords.longitude]);
                },
                (error) => {
                    console.error("Error getting location", error);
                    setPermissionDenied(true);
                    // Default to Can Tho if location denied
                    setUserLocation([10.03, 105.78]);
                }
            );
        } else {
            setUserLocation([10.03, 105.78]);
        }
    }, []);

    // Fetch heatmap data when mode changes
    useEffect(() => {
        fetchHeatmapData();
    }, [showForecast]);

    const fetchHeatmapData = async () => {
        setLoading(true);
        try {
            const offset = showForecast ? 2 : 0;
            const res = await fetch(`http://localhost:5328/api/heatmap?date_offset=${offset}`);
            if (res.ok) {
                const data = await res.json();
                setZones(data.zones);
            }
        } catch (error) {
            console.error("Failed to fetch heatmap", error);
        } finally {
            setLoading(false);
        }
    };

    const getColor = (risk: number) => {
        // More subtle/heatmap-like colors (with alpha handled in execution)
        if (risk >= 75) return "#ef4444"; // Red
        if (risk >= 50) return "#f97316"; // Orange
        return "#22c55e"; // Green
    };

    if (!userLocation) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-50 text-charcoal">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                <h2 className="text-xl font-bold">Locating you...</h2>
                <p className="text-slate-500">Please allow location access for the best experience.</p>
            </div>
        );
    }

    return (
        <div className="relative w-full h-screen bg-slate-100">
            {/* Map */}
            <MapContainer
                center={userLocation}
                zoom={12}
                style={{ height: "100%", width: "100%", zIndex: 0 }}
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                <MapController center={userLocation} />

                {/* User Marker */}
                <Marker position={userLocation}>
                    <Popup>
                        <div className="text-center">
                            <p className="font-bold text-charcoal">You are here</p>
                            <p className="text-xs text-slate-500">Monitoring local risk...</p>
                        </div>
                    </Popup>
                </Marker>

                {/* Heatmap Circles */}
                {zones.map((zone, idx) => (
                    <Circle
                        key={idx}
                        center={[zone.lat, zone.lon]}
                        pathOptions={{
                            fillColor: getColor(zone.risk),
                            color: getColor(zone.risk),
                            fillOpacity: zone.risk > 50 ? 0.4 : 0.2, // Higher opacity for high risk
                            weight: 0,
                            // SVG filter effect could be added here if supported, but standard Circle is safer
                        }}
                        radius={5000} // Large radius for overlap/heatmap effect
                    >
                    </Circle>
                ))}
            </MapContainer>

            {/* Overlays */}

            {/* Top Bar: Controls */}
            <div className="absolute top-0 left-0 right-0 p-4 pt-12 sm:pt-4 z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pointer-events-none">
                <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20 pointer-events-auto">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                            <MapIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="font-bold text-charcoal text-lg leading-none">Dengue Radar</h1>
                            <p className="text-xs text-slate-500 font-medium">Live Risk Monitoring</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-xl border border-white/20 pointer-events-auto flex items-center gap-1">
                    <button
                        onClick={() => setShowForecast(false)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${!showForecast
                            ? "bg-primary text-white shadow-lg shadow-primary/30"
                            : "text-slate-500 hover:bg-slate-100"
                            }`}
                    >
                        Today
                    </button>
                    <button
                        onClick={() => setShowForecast(true)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${showForecast
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                            : "text-slate-500 hover:bg-slate-100"
                            }`}
                    >
                        Forecast <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">+2 Days</span>
                    </button>
                </div>
            </div>

            {/* Bottom Bar: Legend & Info */}
            <div className="absolute bottom-8 left-4 right-4 sm:left-auto sm:right-8 sm:w-80 z-10 bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-2xl border border-white/20">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-charcoal">Risk Levels</h3>
                    {loading && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-1.5 rounded-full bg-gradient-to-r from-green-500 to-green-500/0"></div>
                        <span className="text-xs font-bold text-slate-600">Low</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-500/0"></div>
                        <span className="text-xs font-bold text-slate-600">Medium</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-1.5 rounded-full bg-gradient-to-r from-red-500 to-red-500/0"></div>
                        <span className="text-xs font-bold text-slate-600">High</span>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200">
                    <div className="flex items-start gap-3">
                        <Navigation className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-charcoal">Current Location</p>
                            <p className="text-[10px] text-slate-500 leading-relaxed">
                                {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
                            </p>
                            {permissionDenied && <p className="text-[10px] text-red-500 mt-1">Location access denied. Showing default view.</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Back to Home Button - Bottom Left */}
            <Link 
                href="/" 
                className="absolute bottom-8 left-4 z-20 bg-white/90 backdrop-blur-md px-4 py-3 rounded-full shadow-lg border border-white/20 text-slate-600 hover:bg-white hover:text-primary transition-all flex items-center gap-2 font-medium sm:bottom-8 sm:left-8"
            >
                <Home className="w-5 h-5" />
                <span>Home</span>
            </Link>
        </div>
    );
}
