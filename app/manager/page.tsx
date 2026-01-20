import Link from "next/link";

export default function CDCManagerDashboard() {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-200 bg-white flex flex-col z-30">
                <div className="p-6">
                    <div className="flex items-center gap-2.5 text-primary">
                        <span className="material-symbols-outlined text-3xl font-bold">shield_with_heart</span>
                        <span className="text-xl font-extrabold tracking-tight text-slate-800">Mekong<span className="text-primary">Sentinel</span></span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 ml-1">CDC Management Portal</p>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1">
                    <Link href="/manager" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-sky-50 text-primary font-semibold group">
                        <span className="material-symbols-outlined text-[22px]">dashboard</span>
                        <span className="text-sm">Overview</span>
                    </Link>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-all group">
                        <span className="material-symbols-outlined text-[22px] group-hover:text-primary transition-colors">analytics</span>
                        <span className="text-sm group-hover:text-slate-900">Outbreak Prediction</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-all group">
                        <span className="material-symbols-outlined text-[22px] group-hover:text-primary transition-colors">location_on</span>
                        <span className="text-sm group-hover:text-slate-900">Resource Mapping</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-all group">
                        <span className="material-symbols-outlined text-[22px] group-hover:text-primary transition-colors">calendar_today</span>
                        <span className="text-sm group-hover:text-slate-900">Spraying Schedule</span>
                    </a>

                    <div className="pt-4 pb-2">
                        <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin</p>
                    </div>
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-all group">
                        <span className="material-symbols-outlined text-[22px] group-hover:text-primary transition-colors">arrow_back</span>
                        <span className="text-sm group-hover:text-slate-900">Back to Home</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-200">
                    <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100/50">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase">AI Core Engine</span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium">Predictive analysis active for 13 provinces.</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50/50">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
                    <div className="flex-1 max-w-lg">
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-primary transition-colors">search</span>
                            <input className="w-full bg-slate-100/80 border-transparent rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary transition-all text-slate-700 outline-none" placeholder="Search districts, resources, or surveillance data..." type="text" />
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <button className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 relative">
                                <span className="material-symbols-outlined">notifications</span>
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
                            </button>
                        </div>
                        <div className="h-8 w-px bg-slate-200"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-800">Dr. Nguyen Minh</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Regional CDC Director</p>
                            </div>
                            <div className="h-10 w-10 rounded-full border-2 border-primary/20 p-0.5">
                                <img alt="User profile" className="w-full h-full rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdFyD3wZUHXcS-rMBrAhgxU5pU4jsGpvnBXCWfCTXkIYgPjefSJdqco0JnOLghnYp2O4VCyt9QW28NpHaI6nKkWD3g4i0ebNKIpQL6rwuJxd97LCGWwqcIASCJUN8tUTBInWwpxxs493Q8ihO9mbuow2b0PG2xvBwv9W8o57aCsunI2hPE-jybi4X50NmPWzv_d8vUOwH1GyC0plfK7dFoMrMwIIVEPBwZwnp_ADQ8iYbl6561B00EAEzTlshk83YwRbrJpzdvazo" />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Total Active Outbreaks</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-3xl font-extrabold text-slate-800">124</h3>
                                <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-0.5 rounded-lg text-xs font-bold">
                                    <span className="material-symbols-outlined text-sm">trending_up</span>
                                    12%
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">AI Confidence Score</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-3xl font-extrabold text-slate-800">94.2%</h3>
                                <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg text-xs font-bold">
                                    <span className="material-symbols-outlined text-sm">verified</span>
                                    Stable
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Avg. Response Time</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-3xl font-extrabold text-slate-800">4.2 <span className="text-sm font-bold text-slate-400">hrs</span></h3>
                                <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg text-xs font-bold">
                                    <span className="material-symbols-outlined text-sm">trending_down</span>
                                    15%
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Personnel on Field</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-3xl font-extrabold text-slate-800">1,840</h3>
                                <div className="flex items-center gap-1 text-primary bg-sky-50 px-2 py-0.5 rounded-lg text-xs font-bold">
                                    <span className="material-symbols-outlined text-sm">groups</span>
                                    Optimal
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12 lg:col-span-8 space-y-6">
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                                    <div>
                                        <h4 className="font-bold text-slate-800">Regional Risk Heatmap</h4>
                                        <p className="text-xs text-slate-400 font-medium">Predictive modeling based on weather and mosquito data</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
                                            <span className="material-symbols-outlined text-xl">layers</span>
                                        </button>
                                        <button className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
                                            <span className="material-symbols-outlined text-xl">download</span>
                                        </button>
                                        <div className="flex bg-slate-50 border border-slate-200 rounded-lg overflow-hidden ml-1">
                                            <button className="p-2 hover:bg-slate-100 border-r border-slate-200 text-slate-600"><span className="material-symbols-outlined text-xl">add</span></button>
                                            <button className="p-2 hover:bg-slate-100 text-slate-600"><span className="material-symbols-outlined text-xl">remove</span></button>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-[450px] relative bg-slate-100">
                                    <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC4dYjtAdNnqWz_HVwo5QxDfltJDCvTY2JYyy9yb4R6VtT4z4yecWNiNOCkthEPQbRRX2KuAXFVPvG98N3sRLjk05RScvSsHfZPr-ia_To9SY2gZjfABVerThrqi_wnwCfzN2S911zzZQfQhNfrTWq1a0hcC0dLk_IEBd2uh88AwqM8XB7BhvJ1ggxc7x0twVTLBeiVyu1HFHTaK9J5zpq0U9Kx2I65JSDmdwlftPpU1TNow0t3kD8T0QGT2U94FNqZ9R5e00_QbW8')" }}></div>
                                    <div className="absolute inset-0 bg-sky-500/10 mix-blend-multiply"></div>
                                    <div className="absolute top-[20%] left-[30%] w-48 h-48 bg-red-500/30 rounded-full blur-3xl animate-pulse"></div>
                                    <div className="absolute bottom-[30%] right-[25%] w-64 h-64 bg-orange-400/20 rounded-full blur-[80px]"></div>
                                    <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl border border-white/50 bg-white/70 backdrop-blur-md shadow-lg">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">14-Day Risk Projection Timeline</span>
                                            <span className="text-xs font-bold text-primary flex items-center gap-1.5 bg-sky-50 px-2 py-0.5 rounded-full">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                                Projecting: Oct 28 - Nov 10
                                            </span>
                                        </div>
                                        <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
                                            <div className="absolute left-0 top-0 h-full w-[45%] bg-primary rounded-full"></div>
                                        </div>
                                        <div className="flex justify-between mt-3 px-1">
                                            <div className="flex flex-col items-center">
                                                <span className="text-[10px] font-bold text-slate-400">TODAY</span>
                                                <span className="w-1 h-2 bg-slate-300 rounded-full mt-1"></span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span className="text-[10px] font-bold text-slate-400">NOV 01</span>
                                                <span className="w-1 h-2 bg-slate-300 rounded-full mt-1"></span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span className="text-[10px] font-bold text-slate-400">NOV 04</span>
                                                <span className="w-1 h-2 bg-slate-300 rounded-full mt-1"></span>
                                            </div>
                                            <div className="flex flex-col items-center relative">
                                                <div className="absolute -top-12 px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-lg shadow-lg">Predicted Peak</div>
                                                <span className="text-[10px] font-bold text-primary">NOV 07</span>
                                                <span className="w-1 h-2 bg-primary rounded-full mt-1"></span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span className="text-[10px] font-bold text-slate-400">NOV 10</span>
                                                <span className="w-1 h-2 bg-slate-300 rounded-full mt-1"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                    <h4 className="font-bold text-slate-800">Priority Spraying List</h4>
                                    <button className="text-xs font-bold text-primary hover:underline">View All Schedule</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                <th className="px-6 py-4">District / Neighborhood</th>
                                                <th className="px-6 py-4">Mosquito Index</th>
                                                <th className="px-6 py-4 text-center">Predicted Risk</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            <tr className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-800">Ninh Kieu, Can Tho</span>
                                                        <span className="text-[10px] text-slate-400 font-medium">Ward 5, 7 &amp; 8</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 max-w-[80px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <div className="h-full w-[88%] bg-red-500"></div>
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-700">8.8</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="px-2.5 py-1 rounded-lg bg-red-50 text-red-600 text-[10px] font-extrabold border border-red-100">CRITICAL</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1.5 text-xs text-amber-600 font-bold">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                                        Pending
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <button className="px-3 py-1.5 bg-primary text-white text-[11px] font-bold rounded-lg hover:bg-sky-700 shadow-sm transition-all">Dispatch</button>
                                                    <button className="px-3 py-1.5 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-lg hover:bg-slate-200 transition-all">Details</button>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-800">Cai Be, Tien Giang</span>
                                                        <span className="text-[10px] text-slate-400 font-medium">Rural Clusters B2</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 max-w-[80px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <div className="h-full w-[62%] bg-orange-400"></div>
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-700">6.2</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="px-2.5 py-1 rounded-lg bg-orange-50 text-orange-600 text-[10px] font-extrabold border border-orange-100">ELEVATED</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1.5 text-xs text-sky-600 font-bold">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                                                        Scheduled
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-[11px] font-bold rounded-lg hover:bg-slate-50 transition-all">Modify</button>
                                                    <button className="px-3 py-1.5 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-lg hover:bg-slate-200 transition-all">Details</button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-12 lg:col-span-4 space-y-6">
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full max-h-[1000px]">
                                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">inventory_2</span>
                                        <h4 className="font-bold text-slate-800">Resource Allocation</h4>
                                    </div>
                                    <span className="text-[10px] font-extrabold bg-primary/10 text-primary px-2 py-1 rounded-full uppercase">AI Suggested</span>
                                </div>
                                <div className="p-6 space-y-5 overflow-y-auto flex-1">
                                    <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/20 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h5 className="text-sm font-bold text-slate-800 mb-0.5">Stock Optimization</h5>
                                                <p className="text-xs text-slate-500">Can Tho General Hospital</p>
                                            </div>
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-white">HIGH IMPACT</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100/50">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">IV Fluids</span>
                                                <span className="text-xs font-bold text-slate-700">+500 Units</span>
                                            </div>
                                            <span className="material-symbols-outlined text-primary">trending_flat</span>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">Transfer From</span>
                                                <span className="text-xs font-bold text-slate-700">Vinh Long Hub</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="flex-1 py-2 bg-primary text-white text-[11px] font-bold rounded-lg hover:bg-sky-700">Approve</button>
                                            <button className="flex-1 py-2 bg-white border border-slate-200 text-slate-600 text-[11px] font-bold rounded-lg hover:bg-slate-50">Modify</button>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl border border-slate-100 bg-white space-y-4 shadow-sm">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h5 className="text-sm font-bold text-slate-800 mb-0.5">Personnel Redistribution</h5>
                                                <p className="text-xs text-slate-500">Shift to Zone A4 (Tra Vinh)</p>
                                            </div>
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-600">MEDIUM</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-200">
                                                <span className="material-symbols-outlined text-slate-400">group_work</span>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-700">3 Mobile Field Teams</p>
                                                <p className="text-[10px] text-slate-500 font-medium">Re-route for door-to-door screening</p>
                                            </div>
                                        </div>
                                        <button className="w-full py-2 bg-slate-900 text-white text-[11px] font-bold rounded-lg hover:bg-slate-800">Dispatch Teams</button>
                                    </div>
                                    <div className="p-4 rounded-xl border border-red-100 bg-red-50/10 space-y-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="material-symbols-outlined text-red-500 text-sm">warning</span>
                                            <h5 className="text-sm font-bold text-red-600">Low Stock Alert</h5>
                                        </div>
                                        <p className="text-xs text-slate-600 leading-relaxed font-medium">Dengue NS1 Antigen Kits in Soc Trang are below 15% threshold. Recommend immediate replenishment of 2,000 kits.</p>
                                        <button className="w-full py-2 border border-red-200 text-red-600 text-[11px] font-bold rounded-lg hover:bg-red-50">Request Stock</button>
                                    </div>
                                </div>
                                <div className="p-6 border-t border-slate-100 bg-slate-50/30">
                                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Case Trajectory Prediction</h5>
                                    <div className="h-40 flex items-end justify-between gap-1 px-1">
                                        <div className="flex-1 bg-sky-200/50 h-[30%] rounded-t-sm"></div>
                                        <div className="flex-1 bg-sky-200/50 h-[45%] rounded-t-sm"></div>
                                        <div className="flex-1 bg-sky-200/50 h-[60%] rounded-t-sm"></div>
                                        <div className="flex-1 bg-sky-400/80 h-[85%] rounded-t-sm relative group cursor-pointer">
                                            <div className="absolute -top-1 px-1.5 py-0.5 bg-primary text-white text-[8px] font-bold rounded -translate-y-full left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">Peak Proj.</div>
                                        </div>
                                        <div className="flex-1 bg-sky-400/80 h-[92%] rounded-t-sm border-x border-t border-sky-600/20"></div>
                                        <div className="flex-1 bg-slate-200 h-[70%] rounded-t-sm opacity-60"></div>
                                        <div className="flex-1 bg-slate-200 h-[55%] rounded-t-sm opacity-60"></div>
                                        <div className="flex-1 bg-slate-200 h-[40%] rounded-t-sm opacity-60"></div>
                                        <div className="flex-1 bg-slate-200 h-[30%] rounded-t-sm opacity-60"></div>
                                        <div className="flex-1 bg-slate-200 h-[25%] rounded-t-sm opacity-60"></div>
                                    </div>
                                    <div className="flex justify-between mt-3 text-[9px] font-bold text-slate-400 px-1">
                                        <span>OCT 25 (ACTUAL)</span>
                                        <span>NOV 01 (PREDICTED)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 border-4 border-white group">
                    <span className="material-symbols-outlined text-3xl font-bold group-hover:rotate-12 transition-transform">psychology</span>
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></span>
                </button>
            </main>
        </div>
    );
}
