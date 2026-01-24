"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { API_BASE_URL } from "@/lib/config";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Dynamic import for Leaflet components to avoid SSR issues
const MapContainer = dynamic(
    () => import("react-leaflet").then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import("react-leaflet").then((mod) => mod.TileLayer),
    { ssr: false }
);
const Circle = dynamic(
    () => import("react-leaflet").then((mod) => mod.Circle),
    { ssr: false }
);
const Popup = dynamic(
    () => import("react-leaflet").then((mod) => mod.Popup),
    { ssr: false }
);

interface HeatmapZone {
    lat: number;
    lon: number;
    risk: number;
}

export function RiskMap() {
    const [zones, setZones] = useState<HeatmapZone[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHeatmap = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/heatmap`);
                if (res.ok) {
                    const json = await res.json();
                    setZones(json.zones);
                }
            } catch (error) {
                console.error("Failed to fetch heatmap data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHeatmap();
    }, []);

    const getColor = (risk: number) => {
        if (risk > 75) return "#EF4444"; // Red
        if (risk > 50) return "#F59E0B"; // Orange
        return "#10B981"; // Green
    };

    if (loading) {
        return <div className="h-[400px] w-full bg-muted animate-pulse rounded-lg"></div>;
    }

    return (
        <Card className="h-full border-none shadow-lg bg-white dark:bg-gray-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold">Risk Heatmap</CardTitle>
                <CardDescription>Regional risk zones in Mekong Delta</CardDescription>
            </CardHeader>
            <CardContent className="p-0 h-[400px] relative z-0">
                <MapContainer
                    center={[10.03, 105.78] as any}
                    zoom={10}
                    style={{ height: "100%", width: "100%", borderRadius: "0 0 0.5rem 0.5rem" }}
                    scrollWheelZoom={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {zones.map((zone, idx) => (
                        <Circle
                            key={idx}
                            center={[zone.lat, zone.lon]}
                            pathOptions={{
                                fillColor: getColor(zone.risk),
                                color: getColor(zone.risk),
                                fillOpacity: 0.5,
                                weight: 0
                            }}
                            radius={5000}
                        >
                            <Popup>
                                <div className="font-sans">
                                    <p className="font-bold text-sm mb-1">Risk Level: {zone.risk}%</p>
                                    <p className="text-xs text-muted-foreground">Lat: {zone.lat}, Lon: {zone.lon}</p>
                                </div>
                            </Popup>
                        </Circle>
                    ))}
                </MapContainer>
            </CardContent>
        </Card>
    );
}
