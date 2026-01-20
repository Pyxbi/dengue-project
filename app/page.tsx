import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CitizenDashboard() {
  return (
    <div className="flex min-h-screen bg-slate-50 text-charcoal">
      {/* Sidebar */}
      <aside className="w-72 border-r border-border-soft flex flex-col h-screen sticky top-0 bg-white">
        <div className="p-6 flex items-center gap-3">
          <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white">
            <span className="material-symbols-outlined font-bold">query_stats</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-charcoal">Dengue Sentinel</h1>
            <p className="text-xs text-slate-500">Mekong Delta Hub</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-semibold">Dashboard</span>
          </Link>
          <Link href="/citizen/map" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined">map</span>
            <span className="font-medium">Sentinel Map</span>
          </Link>
          <Link href="/citizen/tasks" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined">assignment_turned_in</span>
            <span className="font-medium">Task Center</span>
          </Link>
          <Link href="/citizen/rewards" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined">military_tech</span>
            <span className="font-medium">Rewards</span>
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-medium">Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-border-soft space-y-2">
          {/* Quick links to other flows for Demo purposes */}
          <div className="text-[10px] uppercase font-bold text-slate-400 px-2">Demo Switches</div>
          <Link href="/manager" className="block text-xs font-medium text-slate-500 hover:text-primary px-2">→ CDC Manager View</Link>
          <Link href="/hospital" className="block text-xs font-medium text-slate-500 hover:text-primary px-2">→ Hospital View</Link>

          <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md shadow-primary/20 mt-4">
            <span className="material-symbols-outlined">add_a_photo</span>
            Report Sighting
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-charcoal">Good morning, An</h2>
            <p className="text-slate-500">Can Tho City, Vietnam • Current Risk: <span className="text-risk-high font-bold">High</span></p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="size-11 rounded-xl bg-white border border-border-soft shadow-sm flex items-center justify-center text-slate-500 hover:text-primary transition-colors">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <span className="absolute top-2 right-2 size-2.5 bg-risk-high rounded-full border-2 border-white"></span>
            </div>
            <div className="h-11 px-4 rounded-xl bg-white border border-border-soft shadow-sm flex items-center gap-3">
              <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-sm">database</span>
              </div>
              <span className="text-sm font-bold text-charcoal">1,240 pts</span>
            </div>
            <div className="size-11 rounded-xl bg-cover bg-center border border-border-soft shadow-sm" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCONjTqbjLyjIw9gbVv0UodQm7hoXnoWwTyjy2g6s5p9b7D5kdp6XAbKkMH2SdTTe3y17fUKnTrEaGhzsQSlDAiOpBFc7GUqqKZupoKlw5v8LO0cu0B7wtE-2c3agOf8oiJTs6SXeUxqHhqEVg8cbxLhJ8pzZ5DwZeIJ5wCiV2msy54hYMgH4RIqJ9dyQ83f795PqHC8EXfnuZ7H1JpwbVPJXBa-0L8kOCPV5ZU2CKMyU4szBbAJrm937x7wMoCPwmS53jbxkr_Jpg')" }}></div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6">
          {/* Risk Gauge Card */}
          <div className="col-span-12 lg:col-span-5 bg-white border border-border-soft shadow-sm rounded-xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="material-symbols-outlined text-slate-400">info</span>
            </div>
            <div className="relative size-64 flex items-center justify-center">
              <svg className="absolute inset-0 size-full -rotate-90">
                <circle cx="128" cy="128" fill="transparent" r="110" stroke="#f1f5f9" strokeWidth="16"></circle>
                <circle cx="128" cy="128" fill="transparent" r="110" stroke="url(#riskGradient)" strokeDasharray="691" strokeDashoffset="124" strokeLinecap="round" strokeWidth="16"></circle>
                <defs>
                  <linearGradient id="riskGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                    <stop offset="0%" stopColor="#EF4444"></stop>
                    <stop offset="100%" stopColor="#F59E0B"></stop>
                  </linearGradient>
                </defs>
              </svg>
              <div className="text-center z-10">
                <span className="text-6xl font-black tracking-tighter text-charcoal">82%</span>
                <p className="text-risk-high font-bold tracking-widest uppercase text-xs mt-1">High Risk</p>
              </div>
            </div>
            <div className="mt-8 text-center max-w-sm">
              <h3 className="text-xl font-bold mb-2 text-charcoal">Outbreak Probability</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Probability has increased by <span className="text-risk-high font-bold">+12%</span> this week due to humidity and stagnant water detected.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full mt-8">
              <div className="p-4 rounded-xl bg-slate-50 border border-border-soft">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Confidence Score</p>
                <p className="text-lg font-bold text-primary">High (94%)</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-border-soft">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Last Update</p>
                <p className="text-lg font-bold text-charcoal">4m ago</p>
              </div>
            </div>
          </div>

          {/* Sentinel Heatmap Card */}
          <div className="col-span-12 lg:col-span-7 bg-white border border-border-soft shadow-sm rounded-xl overflow-hidden flex flex-col">
            <div className="p-6 flex items-center justify-between border-b border-border-soft bg-white">
              <h3 className="font-bold flex items-center gap-2 text-charcoal">
                <span className="material-symbols-outlined text-primary">explore</span>
                Sentinel Heatmap: Mekong Delta
              </h3>
              <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
                <button className="px-4 py-1.5 rounded-md text-slate-500 text-xs font-bold hover:bg-white hover:text-charcoal transition-all">Provincial</button>
                <button className="px-4 py-1.5 rounded-md bg-white text-primary shadow-sm text-xs font-bold">District</button>
              </div>
            </div>
            <div className="flex-1 bg-slate-50 relative min-h-[400px]">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC4dYjtAdNnqWz_HVwo5QxDfltJDCvTY2JYyy9yb4R6VtT4z4yecWNiNOCkthEPQbRRX2KuAXFVPvG98N3sRLjk05RScvSsHfZPr-ia_To9SY2gZjfABVerThrqi_wnwCfzN2S911zzZQfQhNfrTWq1a0hcC0dLk_IEBd2uh88AwqM8XB7BhvJ1ggxc7x0twVTLBeiVyu1HFHTaK9J5zpq0U9Kx2I65JSDmdwlftPpU1TNow0t3kD8T0QGT2U94FNqZ9R5e00_QbW8')", opacity: 0.6 }}></div>
              <div className="absolute top-1/3 left-1/4 size-24 bg-risk-high/40 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute top-1/2 left-1/2 size-32 bg-risk-high/50 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute top-1/4 right-1/4 size-16 bg-risk-med/40 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                <button className="size-10 bg-white border border-border-soft shadow-lg rounded-lg flex items-center justify-center font-bold text-charcoal hover:bg-slate-50 transition-colors">+</button>
                <button className="size-10 bg-white border border-border-soft shadow-lg rounded-lg flex items-center justify-center font-bold text-charcoal hover:bg-slate-50 transition-colors">-</button>
              </div>
            </div>
          </div>

          {/* Daily Quests */}
          <div className="col-span-12 lg:col-span-8 bg-white border border-border-soft shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-charcoal">Daily Quests</h3>
                <p className="text-sm text-slate-500">Earn rewards for local prevention</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Season Progress</p>
                <div className="w-32 h-2.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-primary h-full w-[65%] rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl border border-border-soft hover:border-primary/30 hover:bg-slate-50 transition-all group">
                <div className="size-12 rounded-xl bg-risk-low/10 flex items-center justify-center text-risk-low">
                  <span className="material-symbols-outlined">water_drop</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-charcoal">Clear Standing Water</h4>
                  <p className="text-sm text-slate-500">Check garden pots and discarded containers</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-primary font-bold">+50 pts</span>
                  <button className="size-10 rounded-full bg-primary flex items-center justify-center text-white transition-transform active:scale-90 shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined">photo_camera</span>
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-border-soft hover:border-primary/30 hover:bg-slate-50 transition-all group">
                <div className="size-12 rounded-xl bg-risk-med/10 flex items-center justify-center text-risk-med">
                  <span className="material-symbols-outlined">dataset</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-charcoal">Verify Water Storage Lid</h4>
                  <p className="text-sm text-slate-500">Ensure large water vats are tightly covered</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-primary font-bold">+100 pts</span>
                  <button className="size-10 rounded-full bg-primary flex items-center justify-center text-white transition-transform active:scale-90 shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined">photo_camera</span>
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-border-soft hover:border-primary/30 hover:bg-slate-50 transition-all group">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">campaign</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-charcoal">Neighborhood Alert</h4>
                  <p className="text-sm text-slate-500">Share prevention tips with 3 neighbors</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-primary font-bold">+30 pts</span>
                  <button className="h-10 px-6 rounded-full bg-slate-800 text-white font-bold text-sm hover:bg-charcoal transition-colors">Verify</button>
                </div>
              </div>
            </div>
          </div>

          {/* Community Feed */}
          <div className="col-span-12 lg:col-span-4 bg-white border border-border-soft shadow-sm rounded-xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-charcoal">
              <span className="material-symbols-outlined text-primary">diversity_3</span>
              Community Feed
            </h3>
            <div className="space-y-6">
              <div className="flex gap-3">
                <div className="size-9 rounded-full bg-cover border border-border-soft" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCZDVvo4i2RHWksxKUplaXeJUd48VBAMjTz86E1PpI0rfDSyr3wpvrwowSHH0lrh_nxfkz1bnPUImzAN_hj0rEpJKD5pj5NJ4m9pYR7ve-PNqrYZlsFWu9d90k1o80CWr-PAp3XVbOjV2k6Y3QwR2QFZ3RX4A5yNIlOWt91CtRSN3mAiOTidB-yeAlv0o6rXXc9hBgagUSgblHRCOwrteoZfohEcyzUiL7bsAZr03hW6x3PSJ_qOx_QB05b48_UnebJCzRN4NwsetQ')" }}></div>
                <div className="flex-1 text-sm">
                  <p className="text-slate-600"><span className="font-bold text-charcoal">Minh T.</span> cleared standing water in <span className="text-primary font-medium">Ninh Kieu District</span>.</p>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">2 minutes ago</span>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="size-9 rounded-full bg-cover border border-border-soft" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAdULmjzYov38lL8lO5wTZGZoXxUNeUg9xH0AXWGf3LMRGBw9_z0qsfG4Fkw1sTKxeXy9cPmlfweXCHVB8ROTLRwJMv8RNEGrYfj48kpQ3Y4y8sx9kp4hAOxktoE0VOXj5x9VNo-WDuBAnGtnW6r8T0AnvWxeyCkNYUxzGEUccSyzsJ-QJ4ekWIAX8Yulngv2q3438mSK-UI4iRyY4PaQNpsfHyMld6xY6y8P7H4qItUEn3TqPyR7jL2tQgYeb_zBGy1HSI-i7Vhu0')" }}></div>
                <div className="flex-1 text-sm">
                  <p className="text-slate-600"><span className="font-bold text-charcoal">Linh H.</span> just reached <span className="text-primary font-medium">Sentinel Silver</span> rank!</p>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">15 minutes ago</span>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="size-9 rounded-full bg-cover border border-border-soft" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA-BP9IIu3mKazAXN7FX-5H0gi2EBysaDPwhm435A4skx5BRvKGD14NeOcs-OioqP7G2tel-1rI8xdD7-FQ1XLqp8ml6cI9iXpIxzZjU6N5o4zioE-GKRjzCyG2SxRTkbL5dc2W0m-0qWl4A348IFjjt7pf3bYf5E3AcztmznnYh__ieAHIjc9t94MittjP49yIFmTaB9kXqlKizXkwJ7pb9HBptbKEqhYX0Tb8FBVuQ9a6FCNEBFpEpBZ0Y_sVHPLvhJVE0ZhTwB4')" }}></div>
                <div className="flex-1 text-sm">
                  <p className="text-slate-600"><span className="font-bold text-charcoal">An B.</span> uploaded 3 verification photos today.</p>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">1 hour ago</span>
                </div>
              </div>
            </div>

            <div className="mt-8 p-5 bg-primary/5 border border-primary/10 rounded-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-primary uppercase tracking-widest">Community Shield</p>
                <span className="material-symbols-outlined text-primary text-sm">verified_user</span>
              </div>
              <p className="text-3xl font-black text-charcoal">4,289</p>
              <p className="text-[11px] text-slate-500 mt-1 leading-tight">Total breeding sites eliminated by the community this month.</p>
              <div className="absolute -right-4 -bottom-4 size-20 bg-primary/10 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating AI Assistant */}
      <div className="fixed bottom-8 right-8 group z-50">
        <div className="absolute bottom-full right-0 mb-4 w-72 p-5 bg-white border border-border-soft rounded-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="size-2 bg-risk-low rounded-full"></span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">AI Assistant Online</span>
          </div>
          <p className="text-sm leading-relaxed text-charcoal">&quot;Hello! I&apos;m Sentinel AI. Need advice on prevention or identifying symptoms?&quot;</p>
        </div>
        <button className="size-16 rounded-full bg-charcoal text-white shadow-xl flex items-center justify-center hover:scale-105 hover:bg-black active:scale-95 transition-all">
          <span className="material-symbols-outlined text-3xl font-bold">smart_toy</span>
          <span className="absolute -top-1 -right-1 size-4 bg-risk-low rounded-full border-4 border-slate-50"></span>
        </button>
      </div>
    </div>
  );
}
