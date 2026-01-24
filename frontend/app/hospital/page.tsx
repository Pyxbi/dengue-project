import Link from "next/link";
import { cn } from "@/lib/utils";

export default function HospitalDashboard() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-slate-200 px-6 py-3 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-3 text-primary">
                        <div className="size-9 flex items-center justify-center bg-primary/10 rounded-xl">
                            <span className="material-symbols-outlined text-primary font-bold">health_metrics</span>
                        </div>
                        <h2 className="text-slate-900 text-lg font-extrabold leading-tight tracking-tight">Mekong Health AI</h2>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/hospital" className="text-primary text-sm font-bold border-b-2 border-primary pb-0.5">Dashboard</Link>
                        <a href="#" className="text-slate-500 text-sm font-semibold hover:text-primary transition-colors">Triage</a>
                        <a href="#" className="text-slate-500 text-sm font-semibold hover:text-primary transition-colors">Inventory</a>
                        <a href="#" className="text-slate-500 text-sm font-semibold hover:text-primary transition-colors">Network</a>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden lg:flex items-center bg-slate-50 rounded-xl px-3 py-1.5 border border-slate-200">
                        <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
                        <input className="bg-transparent border-none focus:ring-0 text-sm placeholder:text-slate-400 w-48 outline-none" placeholder="Search facilities..." />
                    </div>
                    <button className="flex items-center justify-center gap-2 rounded-xl h-10 px-4 bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">emergency</span>
                        <span>Emergency Protocol</span>
                    </button>
                    <div className="size-10 rounded-full border border-slate-200 bg-center bg-cover shadow-sm" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCiZ_d86yoHyM-02FuQb4DmLfvUIutguTue4qtTM5oBPA4j60ZxgmDe4DR1Q_zqzAQeyjcHD_fry6T-qT0YUCSH5nPEbysvDXss7aP-HeCs7D7LyBhon1RdOfgPSkbZzkxtYfKVq0HdFTzpSNyeDbBuQ0acJeXB6b9HOBdR3J7XjeD_AkPez778r2mVHdFkldyW45cCp3wfo-epUFOC0Bdtv4pAK7vt9CU_4Q6ALc_UbpoOXVL4ZESphbOIRXnBIXr6BhoAN7opW7E')" }}></div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-[1440px] mx-auto w-full p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-2">Hospital Overload Management</h1>
                        <p className="text-slate-500 text-lg font-medium">Predictive triage for Can Tho &amp; Mekong Regional Hubs.</p>
                    </div>
                    <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                        <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-sm">Real-time</button>
                        <button className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-lg text-sm font-bold transition-all">History</button>
                        <button className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-lg text-sm font-bold transition-all">Simulation</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* KPI Cards */}
                    <div className="md:col-span-3 bg-white border border-slate-200 shadow-sm p-6 rounded-xl hover:-translate-y-0.5 transition-transform duration-200 cursor-default">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Active Patients</p>
                            <div className="p-1.5 bg-green-100 rounded-lg">
                                <span className="material-symbols-outlined text-green-500 text-[20px] font-bold">trending_up</span>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-4xl font-extrabold text-slate-900">1,284</h3>
                            <span className="text-green-500 text-sm font-bold">+12%</span>
                        </div>
                        <p className="text-slate-500 text-xs mt-3 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">update</span> Updated 2m ago
                        </p>
                    </div>

                    <div className="md:col-span-3 bg-white border border-slate-200 shadow-sm p-6 rounded-xl border-l-4 border-l-amber-500 hover:-translate-y-0.5 transition-transform duration-200 cursor-default">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Bed Capacity</p>
                            <div className="p-1.5 bg-amber-100 rounded-lg">
                                <span className="material-symbols-outlined text-amber-500 text-[20px] font-bold">warning</span>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-4xl font-extrabold text-slate-900">88%</h3>
                            <span className="text-amber-500 text-sm font-bold uppercase tracking-tighter">Critical</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full mt-4 overflow-hidden">
                            <div className="bg-amber-500 h-full rounded-full" style={{ width: "88%" }}></div>
                        </div>
                    </div>

                    <div className="md:col-span-3 bg-white border border-slate-200 shadow-sm p-6 rounded-xl hover:-translate-y-0.5 transition-transform duration-200 cursor-default">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Wait Time</p>
                            <div className="p-1.5 bg-primary/10 rounded-lg">
                                <span className="material-symbols-outlined text-primary text-[20px] font-bold">schedule</span>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-4xl font-extrabold text-slate-900">14<span className="text-xl font-bold text-slate-400 ml-0.5">m</span></h3>
                            <span className="text-green-500 text-sm font-bold">-2m</span>
                        </div>
                        <p className="text-slate-500 text-xs mt-3">Avg. Triage completion</p>
                    </div>

                    <div className="md:col-span-3 bg-red-50/30 border border-slate-200 shadow-sm p-6 rounded-xl border-l-4 border-l-red-500 hover:-translate-y-0.5 transition-transform duration-200 cursor-default">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Risk Level</p>
                            <div className="p-1.5 bg-red-100 rounded-lg">
                                <span className="material-symbols-outlined text-red-500 text-[20px] font-bold">priority_high</span>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-4xl font-extrabold text-red-500">High</h3>
                        </div>
                        <p className="text-red-500/70 text-xs mt-3 font-semibold uppercase">Dengue Surge Warning Active</p>
                    </div>

                    {/* Forecast Chart Area */}
                    <div className="md:col-span-8 bg-white border border-slate-200 shadow-sm p-8 rounded-xl min-h-[400px]">
                        <div className="flex flex-wrap justify-between items-start mb-8 gap-4">
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">analytics</span>
                                    7-Day AI Surge Forecast
                                </h3>
                                <p className="text-slate-500 text-sm font-medium">Predictive model based on climate and case density</p>
                            </div>
                            <div className="text-right bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                                <p className="text-2xl font-black text-primary">1,450</p>
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Projected Peak Inflow</p>
                            </div>
                        </div>
                        <div className="relative h-[250px] w-full mt-4">
                            <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 800 250">
                                <line stroke="#e2e8f0" strokeDasharray="4 4" x1="0" x2="800" y1="50" y2="50"></line>
                                <line stroke="#e2e8f0" strokeDasharray="4 4" x1="0" x2="800" y1="150" y2="150"></line>
                                <line stroke="#e2e8f0" strokeDasharray="4 4" x1="0" x2="800" y1="250" y2="250"></line>
                                <path d="M0 180 Q 100 160, 200 120 T 400 60 T 600 140 T 800 100 V 250 H 0 Z" fill="url(#chartGradient)"></path>
                                <path d="M0 180 Q 100 160, 200 120 T 400 60 T 600 140 T 800 100" fill="none" stroke="#0ea5e9" strokeLinecap="round" strokeWidth="4"></path>
                                <circle cx="400" cy="60" fill="#0ea5e9" r="6"></circle>
                                <circle cx="400" cy="60" r="12" stroke="#0ea5e9" strokeOpacity="0.2" strokeWidth="6"></circle>
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.15"></stop>
                                        <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0"></stop>
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="flex justify-between mt-6 px-2">
                                <span className="text-slate-500 text-[11px] font-bold">MON</span>
                                <span className="text-slate-500 text-[11px] font-bold">TUE</span>
                                <span className="text-slate-500 text-[11px] font-bold">WED</span>
                                <span className="text-white text-[11px] font-bold bg-primary px-3 py-1 rounded-full shadow-sm">THU (PEAK)</span>
                                <span className="text-slate-500 text-[11px] font-bold">FRI</span>
                                <span className="text-slate-500 text-[11px] font-bold">SAT</span>
                                <span className="text-slate-500 text-[11px] font-bold">SUN</span>
                            </div>
                        </div>
                    </div>

                    {/* Nearby Facilities */}
                    <div className="md:col-span-4 bg-white border border-slate-200 shadow-sm rounded-xl flex flex-col">
                        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                            <h3 className="text-lg font-extrabold text-slate-900">Nearby Facilities</h3>
                            <span className="material-symbols-outlined text-slate-500 cursor-pointer hover:text-primary transition-colors">map</span>
                        </div>
                        <div className="p-4 flex-1 overflow-y-auto max-h-[360px]">
                            <div className="space-y-3">
                                <div className="group p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary/50 transition-all cursor-pointer">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">Can Tho General</h4>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-500 font-black uppercase tracking-widest">Stable</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 mt-3 text-xs font-semibold text-slate-500">
                                        <div className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[16px] text-primary">bed</span>
                                            <span>42 Beds</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[16px] text-primary">directions_boat</span>
                                            <span>12m River</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="group p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary/50 transition-all cursor-pointer">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">Vinh Long Medical</h4>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-500 font-black uppercase tracking-widest">Crowded</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 mt-3 text-xs font-semibold text-slate-500">
                                        <div className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[16px] text-primary">bed</span>
                                            <span>8 Beds</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[16px] text-primary">ambulance</span>
                                            <span>24m Road</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="group p-4 rounded-xl bg-red-50/50 border border-red-100 hover:border-red-500/50 transition-all cursor-pointer">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-slate-900">O Mon District Clinic</h4>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-500 font-black uppercase tracking-widest">At Capacity</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 mt-3 text-xs font-semibold text-slate-500">
                                        <div className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[16px] text-red-500">bed</span>
                                            <span className="text-red-500">0 Beds</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[16px] text-primary">directions_boat</span>
                                            <span>35m River</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-200 bg-slate-50/50">
                            <button className="w-full py-2.5 bg-white text-primary text-sm font-bold rounded-lg border border-primary/20 hover:border-primary/50 hover:bg-white transition-all shadow-sm">
                                View Network Map
                            </button>
                        </div>
                    </div>

                    {/* Resource Forecast */}
                    <div className="md:col-span-12 bg-white border border-slate-200 shadow-sm p-8 rounded-xl">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">inventory_2</span>
                                    Resource Forecast &amp; Inventory
                                </h3>
                                <p className="text-slate-500 text-sm font-medium">Estimated supply needs for projected surge based on AI analysis</p>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-wrap items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="size-2.5 rounded-full bg-red-500"></div>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Urgent Order</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="size-2.5 rounded-full bg-green-500"></div>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Well Stocked</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="size-2.5 rounded-full bg-amber-500"></div>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monitoring</span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl relative overflow-hidden">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Saline Solution (L)</span>
                                    <span className="material-symbols-outlined text-red-500">error</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-3xl font-black text-slate-900">420</p>
                                        <p className="text-[11px] text-slate-500 font-bold">Stock Left</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-red-500">-280</p>
                                        <p className="text-[10px] text-red-500 font-black uppercase">Shortfall 72h</p>
                                    </div>
                                </div>
                                <button className="w-full mt-6 py-2 bg-red-500 text-white text-xs font-bold rounded-lg shadow-sm hover:brightness-110 transition-all">Auto-Order Now</button>
                            </div>
                            <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Mosquito Nets</span>
                                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-3xl font-black text-slate-900">1,100</p>
                                        <p className="text-[11px] text-slate-500 font-bold">Stock Left</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-green-500">+200</p>
                                        <p className="text-[10px] text-green-500 font-black uppercase">Safe Margin</p>
                                    </div>
                                </div>
                                <button className="w-full mt-6 py-2 bg-slate-200 text-slate-500 text-xs font-bold rounded-lg cursor-not-allowed">Status: Sufficient</button>
                            </div>
                            <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Blood Packs (O+)</span>
                                    <span className="material-symbols-outlined text-amber-500">warning</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-3xl font-black text-slate-900">15</p>
                                        <p className="text-[11px] text-slate-500 font-bold">Stock Left</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-amber-500">4 Days</p>
                                        <p className="text-[10px] text-amber-500 font-black uppercase">Est. Coverage</p>
                                    </div>
                                </div>
                                <button className="w-full mt-6 py-2 bg-amber-500 text-white text-xs font-bold rounded-lg shadow-sm hover:brightness-110 transition-all">Request Transfer</button>
                            </div>
                            <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Oral Rehydration</span>
                                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-3xl font-black text-slate-900">3,500</p>
                                        <p className="text-[11px] text-slate-500 font-bold">Stock Left</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-green-500">14 Days</p>
                                        <p className="text-[10px] text-green-500 font-black uppercase">Est. Coverage</p>
                                    </div>
                                </div>
                                <button className="w-full mt-6 py-2 bg-slate-200 text-slate-500 text-xs font-bold rounded-lg cursor-not-allowed">Status: Sufficient</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating AI Recommendation */}
                <div className="fixed bottom-8 right-8 z-50 group">
                    <div className="flex items-center gap-4">
                        <div className="bg-white border border-primary/20 p-5 rounded-2xl shadow-xl max-w-xs hidden md:block border-l-4 border-l-primary">
                            <p className="text-[11px] font-black text-primary uppercase tracking-wider mb-1">AI Recommendation</p>
                            <p className="text-sm font-semibold text-slate-800 leading-relaxed">Predicted peak on Thursday. Recommend shifting 2 ICU staff from Ward B to Emergency tonight.</p>
                        </div>
                        <button className="size-16 rounded-2xl bg-slate-900 text-white shadow-2xl flex items-center justify-center hover:bg-primary transition-all group-hover:scale-110">
                            <span className="material-symbols-outlined text-[36px]">smart_toy</span>
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-12 py-10 px-6 border-t border-slate-200 bg-white text-center">
                    <p className="text-slate-500 text-sm font-medium tracking-tight">Mekong Delta Regional Health Management Information System • AI Forecasting Engine v4.2</p>
                    <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Clinical Dashboard | Data Confidentiality Active</p>
                </footer>
            </main>
        </div>
    );
}
