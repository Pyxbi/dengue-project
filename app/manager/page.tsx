"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Loader2, TrendingUp, TrendingDown, Users, Shield, Map as MapIcon, Activity, AlertTriangle } from "lucide-react";

const ManagerMap = dynamic(() => import("@/components/ManagerMap"), { ssr: false });

export default function CDCManagerDashboard() {
    const [sensors, setSensors] = useState<any>(null);
    const [zones, setZones] = useState<any[]>([]);
    const [roi, setRoi] = useState<any>(null);
    const [broadcasting, setBroadcasting] = useState<string | null>(null);
    const [broadcastSuccess, setBroadcastSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [sensorsRes, zonesRes, roiRes] = await Promise.all([
                    fetch("http://localhost:5328/api/manager/sensors"),
                    fetch("http://localhost:5328/api/manager/priority-zones"),
                    fetch("http://localhost:5328/api/manager/roi-stats")
                ]);

                if (sensorsRes.ok) setSensors(await sensorsRes.json());
                if (zonesRes.ok) setZones(await zonesRes.json());
                if (roiRes.ok) setRoi(await roiRes.json());
            } catch (error) {
                console.error("Error loading dashboard", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();

        // Poll for sensor updates every 30s
        const interval = setInterval(fetchDashboardData, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleBroadcast = async (zoneId: string, zoneName: string) => {
        setBroadcasting(zoneId);
        try {
            const res = await fetch("http://localhost:5328/api/manager/broadcast", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ zone_id: zoneId, message: "Urgent prevention required." })
            });
            if (res.ok) {
                setBroadcastSuccess(`Alert sent to residents in ${zoneName}`);
                setTimeout(() => setBroadcastSuccess(null), 5000);
            }
        } catch (error) {
            console.error("Broadcast failed", error);
        } finally {
            setBroadcasting(null);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-200 bg-white flex flex-col z-30">
                <div className="p-6">
                    <div className="flex items-center gap-2.5 text-primary">
                        <Shield className="w-8 h-8 fill-primary text-white" />
                        <span className="text-xl font-extrabold tracking-tight text-slate-800">Mekong<span className="text-primary">Sentinel</span></span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 ml-1">CDC Management Portal</p>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1">
                    <Link href="/manager" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-sky-50 text-primary font-semibold group">
                        <MapIcon className="w-5 h-5" />
                        <span className="text-sm">Command Center</span>
                    </Link>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-all group">
                        <Activity className="w-5 h-5 group-hover:text-primary transition-colors" />
                        <span className="text-sm group-hover:text-slate-900">Outbreak Prediction</span>
                    </a>

                    <div className="pt-4 pb-2">
                        <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin</p>
                    </div>
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-all group">
                        <TrendingUp className="w-5 h-5 rotate-180 group-hover:text-primary transition-colors" />
                        <span className="text-sm group-hover:text-slate-900">Back to Citizen View</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-200">
                    <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100/50">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase">AI Core Engine</span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium">Predicting 14-day risk models.</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50/50">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
                    <div className="flex-1">
                        <h1 className="text-xl font-bold text-slate-800">Regional Overview</h1>
                    </div>

                    {broadcastSuccess && (
                        <div className="bg-emerald-100 text-emerald-800 text-sm font-bold px-4 py-2 rounded-lg animate-in slide-in-from-top-2 mr-4">
                            {broadcastSuccess}
                        </div>
                    )}

                    <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-slate-800">Dr. Nguyen Minh</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Regional CDC Director</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden">
                            <img src="https://ui-avatars.com/api/?name=Nguyen+Minh&background=0D8ABC&color=fff" alt="User" />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Cases Avoided (Proj.)</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-3xl font-extrabold text-slate-800">{roi?.cases_avoided || 0}</h3>
                                <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg text-xs font-bold">
                                    <TrendingDown className="w-3 h-3" />
                                    {roi?.prevention_rate_improvement || "0%"}
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Budget Saved</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-3xl font-extrabold text-slate-800">${(roi?.money_saved_usd || 0).toLocaleString()}</h3>
                                <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg text-xs font-bold">
                                    <span className="material-symbols-outlined text-sm">attach_money</span>
                                    Est.
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Citizen Actions</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-3xl font-extrabold text-slate-800">{roi?.citizen_actions.toLocaleString() || 0}</h3>
                                <div className="flex items-center gap-1 text-primary bg-sky-50 px-2 py-0.5 rounded-lg text-xs font-bold">
                                    <Users className="w-3 h-3" />
                                    Active
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Salinity Alert</p>
                            <div className="flex items-end justify-between">
                                <h3 className={`text-3xl font-extrabold ${sensors?.salinity.value > 1.0 ? 'text-red-600' : 'text-slate-800'}`}>
                                    {sensors?.salinity.value || 0} <span className="text-lg">{sensors?.salinity.unit}</span>
                                </h3>
                                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold ${sensors?.salinity.value > 1.0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                    {sensors?.salinity.status}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-6 h-[600px]">
                        {/* Map Section */}
                        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 h-full">
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full relative">
                                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white z-10 relative">
                                    <div>
                                        <h4 className="font-bold text-slate-800">14-Day Risk Forecast</h4>
                                        <p className="text-xs text-slate-400 font-medium">AI Projection based on Weather & Salinity trends</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold bg-primary px-2 py-1 rounded text-white">Live Model</span>
                                    </div>
                                </div>
                                <div className="flex-1 bg-slate-100 relative">
                                    <ManagerMap />
                                </div>
                            </div>
                        </div>

                        {/* Right Panel: Priority Zones */}
                        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 h-full overflow-hidden">
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
                                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="text-red-500 w-5 h-5" />
                                        <h4 className="font-bold text-slate-800">Priority Interventions</h4>
                                    </div>
                                </div>
                                <div className="p-0 overflow-y-auto flex-1 divide-y divide-slate-100">
                                    {zones.map((zone) => (
                                        <div key={zone.id} className="p-4 hover:bg-slate-50 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h5 className="font-bold text-slate-800 text-sm">{zone.name}</h5>
                                                    <p className="text-xs text-slate-500">{zone.action_needed}</p>
                                                </div>
                                                <span className={`text-[10px] font-extrabold px-2 py-1 rounded border ${zone.risk_label === 'CRITICAL' ? 'bg-red-50 text-red-600 border-red-100' :
                                                        zone.risk_label === 'HIGH' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                            'bg-yellow-50 text-yellow-600 border-yellow-100'
                                                    }`}>
                                                    {zone.risk_label}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-4 mb-3">
                                                <div className="flex-1">
                                                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                                                        <span>MOSQUITO INDEX</span>
                                                        <span>{zone.mosquito_index}/10</span>
                                                    </div>
                                                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${zone.risk_label === 'CRITICAL' ? 'bg-red-500' : 'bg-orange-500'}`}
                                                            style={{ width: `${zone.mosquito_index * 10}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleBroadcast(zone.id, zone.name)}
                                                disabled={broadcasting === zone.id}
                                                className="w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all active:scale-95"
                                            >
                                                {broadcasting === zone.id ? (
                                                    <>
                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                        Broadcasting...
                                                    </>
                                                ) : (
                                                    "Broadcast Alert"
                                                )}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
