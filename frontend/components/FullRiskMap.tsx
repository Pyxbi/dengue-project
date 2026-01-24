"use client";

import { useEffect, useState } from "react";
import { Loader2, Navigation, Map as MapIcon, ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapContainer, TileLayer, Circle, Popup, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import L from "leaflet";
import { API_BASE_URL } from "@/lib/config";

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
        if (userLocation) {
            generateMockData();
        }
    }, [showForecast, userLocation]);

    const generateMockData = () => {
        setLoading(true);
        const points: HeatmapZone[] = [];

        // Define major centers in Mekong Delta (Mekong Delta specific targeting)
        const mekongCenters = [
            { lat: 10.0452, lon: 105.7469, name: "Can Tho" },
            { lat: 10.2540, lon: 105.9722, name: "Vinh Long" },
            { lat: 10.3759, lon: 105.4389, name: "Long Xuyen" },
            { lat: 9.6069, lon: 105.9749, name: "Soc Trang" },
            { lat: 9.1769, lon: 105.1501, name: "Ca Mau" },
            { lat: 10.0152, lon: 105.0809, name: "Rach Gia" },
            { lat: 9.2941, lon: 105.7278, name: "Bac Lieu" },
            { lat: 10.4524, lon: 105.6375, name: "Cao Lanh" },
            { lat: 10.3536, lon: 106.3636, name: "My Tho" },
            { lat: 9.7845, lon: 105.4701, name: "Vi Thanh" },
        ];

        // Generate clusters of risk points around these centers
        mekongCenters.forEach(center => {
            // Generate 3-7 points per city
            const count = Math.floor(Math.random() * 5) + 3;

            for (let i = 0; i < count; i++) {
                // Spread roughly 5-10km around center
                const latOffset = (Math.random() - 0.5) * 0.1;
                const lonOffset = (Math.random() - 0.5) * 0.1;

                points.push({
                    lat: center.lat + latOffset,
                    lon: center.lon + lonOffset,
                    // mostly high/med risk for the demo
                    risk: Math.random() > 0.4 ? 85 : 55
                });
            }
        });

        // Add user location to the set IF they are in the delta (approx check) or just add a few near them for UI feedback
        // But per user request "other just show nothing", we mostly stick to the delta.
        // We will skip adding user-specific points if they are far away to strictly follow "other just show nothing".

        setZones(points);
        setLoading(false);
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

                {/* Custom Pulsing Markers */}
                {/* Filter out low risk (<50) and map to Custom Markers */}
                {zones.filter(z => z.risk >= 50).map((zone, idx) => {
                    const isHigh = zone.risk >= 75;
                    const colorClass = isHigh ? 'risk-high' : 'risk-med';

                    return (
                        <Marker
                            key={idx}
                            position={[zone.lat, zone.lon]}
                            icon={L.divIcon({
                                className: `risk-point ${colorClass}`,
                                iconSize: [40, 40], // Size of the pulsing effect area
                                iconAnchor: [20, 20]
                            })}
                        >
                            <Popup>
                                <div className="text-center p-2">
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold mb-2 ${isHigh ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                                        {isHigh ? 'HIGH RISK' : 'MEDIUM RISK'}
                                    </span>
                                    <p className="text-sm font-semibold text-charcoal">Risk Score: {zone.risk}%</p>
                                    <p className="text-xs text-slate-500 mt-1">Mosquito activity detected.</p>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
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
