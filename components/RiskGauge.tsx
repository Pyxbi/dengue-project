"use client";

import { useEffect, useState } from "react";
import { Droplet, Thermometer, CloudRain, ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface RiskData {
    risk_percentage: number;
    risk_level: string;
    confidence: number;
    factors: {
        temperature: string;
        rainfall: string;
        humidity: string;
    };
    last_update: string;
    color: string;
}

export function RiskGauge() {
    const [data, setData] = useState<RiskData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRisk = async () => {
            try {
                const res = await fetch("http://localhost:5328/api/risk");
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (error) {
                console.error("Failed to fetch risk data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRisk();
    }, []);

    if (loading) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-32 bg-muted rounded"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!data) return null;

    const getIcon = (level: string) => {
        switch (level) {
            case "LOW": return <ShieldCheck className="w-8 h-8 text-green-500" />;
            case "MEDIUM": return <ShieldAlert className="w-8 h-8 text-yellow-500" />;
            case "HIGH": return <AlertTriangle className="w-8 h-8 text-red-500" />;
            default: return <ShieldCheck className="w-8 h-8" />;
        }
    };

    return (
        <Card className="overflow-hidden border-none shadow-lg">
            <CardHeader className="items-center pb-2 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                <CardTitle className="flex items-center gap-2 text-xl font-bold">
                    Dengue Risk Assessment
                </CardTitle>
                <CardDescription>Real-time analysis based on local climate</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                    <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                        {/* Gauge Circle Background */}
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle
                                className="text-muted stroke-current"
                                strokeWidth="10"
                                cx="50"
                                cy="50"
                                r="40"
                                fill="transparent"
                            ></circle>
                            {/* Gauge Progress */}
                            <circle
                                style={{ color: data.color }}
                                className="stroke-current transition-all duration-1000 ease-out"
                                strokeWidth="10"
                                strokeLinecap="round"
                                cx="50"
                                cy="50"
                                r="40"
                                fill="transparent"
                                strokeDasharray={`${2 * Math.PI * 40}`}
                                strokeDashoffset={`${2 * Math.PI * 40 * (1 - data.risk_percentage / 100)}`}
                                transform="rotate(-90 50 50)"
                            ></circle>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold" style={{ color: data.color }}>
                                {data.risk_percentage}%
                            </span>
                            <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mt-1">
                                {data.risk_level} RISK
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 w-full text-center">
                        <div className="flex flex-col items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                            <Thermometer className="w-5 h-5 text-blue-500 mb-1" />
                            <span className="text-xs text-muted-foreground font-medium">Temp</span>
                            <span className="font-bold text-sm text-foreground">{data.factors.temperature}</span>
                        </div>
                        <div className="flex flex-col items-center p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl">
                            <Droplet className="w-5 h-5 text-cyan-500 mb-1" />
                            <span className="text-xs text-muted-foreground font-medium">Rainfall</span>
                            <span className="font-bold text-sm text-foreground">{data.factors.rainfall}</span>
                        </div>
                        <div className="flex flex-col items-center p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                            <CloudRain className="w-5 h-5 text-indigo-500 mb-1" />
                            <span className="text-xs text-muted-foreground font-medium">Humidity</span>
                            <span className="font-bold text-sm text-foreground">{data.factors.humidity}</span>
                        </div>
                    </div>

                    <div className="mt-6 w-full text-center text-xs text-muted-foreground">
                        Confidence Score: {data.confidence}% • Updated {data.last_update}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
