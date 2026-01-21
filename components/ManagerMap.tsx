"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { MapContainer, TileLayer, Circle, Popup, Marker, useMap, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

// Component to handle map centering
function MapController({ center }: { center: [number, number] | null }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 11, { duration: 1.5 });
        }
    }, [center, map]);
    return null;
}

interface DistrictRisk {
    name: string;
    id: string;
    center: [number, number];
    risk: number;
    projected_risk: number;
    trend: string;
    pop: number;
    color: string;
}

export default function ManagerMap({ days = 14 }: { days?: number }) {
    const [districts, setDistricts] = useState<DistrictRisk[]>([]);
    const [loading, setLoading] = useState(true);
    const center: [number, number] = [10.03, 105.78]; // Can Tho

    // Fetch heatmap data when mode changes
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`http://localhost:5328/api/manager/heatmap?days=${days}`);
                if (res.ok) {
                    const data = await res.json();
                    setDistricts(data.districts);
                }
            } catch (error) {
                console.error("Failed to fetch manager map", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [days]);

    return (
        <div className="relative w-full h-full bg-slate-100 rounded-2xl overflow-hidden">
            <MapContainer
                center={center}
                zoom={11}
                style={{ height: "100%", width: "100%", zIndex: 0 }}
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                <MapController center={center} />

                {districts.map((d) => (
                    <Circle
                        key={d.id}
                        center={d.center}
                        pathOptions={{
                            fillColor: d.color,
                            color: d.color,
                            fillOpacity: 0.6,
                            weight: 2,
                        }}
                        radius={2500}
                    >
                        <Popup>
                            <div className="text-center p-2">
                                <h3 className="font-bold text-slate-800">{d.name}</h3>
                                <div className="grid grid-cols-2 gap-2 mt-2 text-left">
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase">Current Risk</p>
                                        <p className="font-bold text-slate-700">{d.risk}%</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase">Projected (+{days}d)</p>
                                        <p className={`font-bold ${d.projected_risk > d.risk ? 'text-red-500' : 'text-green-500'}`}>
                                            {d.projected_risk}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </Circle>
                ))}
            </MapContainer>

            {loading && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-[1000]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            )}

            {/* Legend Overlay */}
            <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-xl shadow-lg border border-slate-200 z-[999] text-xs">
                <div className="font-bold text-slate-700 mb-2">Predicted Risk Levels</div>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#ef4444]"></span> Critical ({">"}75%)
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#f97316]"></span> High (50-75%)
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#22c55e]"></span> Monitor ({'<'}50%)
                    </div>
                </div>
            </div>
        </div>
    );
}
