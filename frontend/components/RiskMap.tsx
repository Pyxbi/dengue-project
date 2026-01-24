"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { API_BASE_URL } from "@/lib/config";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import L from "leaflet";

// Dynamic import for Leaflet components to avoid SSR issues
const MapContainer = dynamic(
    () => import("react-leaflet").then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import("react-leaflet").then((mod) => mod.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import("react-leaflet").then((mod) => mod.Marker),
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
        generateMockData();
    }, []);

    const generateMockData = () => {
        setLoading(true);
        const points: HeatmapZone[] = [];

        // Define major centers in Mekong Delta
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
            const count = Math.floor(Math.random() * 5) + 3;

            for (let i = 0; i < count; i++) {
                const latOffset = (Math.random() - 0.5) * 0.1;
                const lonOffset = (Math.random() - 0.5) * 0.1;

                points.push({
                    lat: center.lat + latOffset,
                    lon: center.lon + lonOffset,
                    risk: Math.random() > 0.4 ? 85 : 55
                });
            }
        });

        setZones(points);
        setLoading(false);
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
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    />

                    {zones.filter(z => z.risk >= 50).map((zone, idx) => {
                        const isHigh = zone.risk >= 75;
                        const colorClass = isHigh ? 'risk-high' : 'risk-med';

                        return (
                            <Marker
                                key={idx}
                                position={[zone.lat, zone.lon]}
                                icon={L.divIcon({
                                    className: `risk-point ${colorClass}`,
                                    iconSize: [40, 40],
                                    iconAnchor: [20, 20]
                                })}
                            >
                                <Popup>
                                    <div className="text-center p-2">
                                        <span className={`inline-block px-2 py-1 rounded text-xs font-bold mb-2 ${isHigh ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                                            {isHigh ? 'HIGH RISK' : 'MEDIUM RISK'}
                                        </span>
                                        <p className="text-sm font-semibold text-charcoal">Risk Score: {zone.risk}%</p>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </CardContent>
        </Card>
    );
}
