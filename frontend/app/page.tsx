"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { RiskGauge } from "@/components/RiskGauge";
import { ChatBot } from "@/components/ChatBot";
import { DailyQuest } from "@/components/DailyQuest";
import { Menu, X } from "lucide-react";

// Dynamically import RiskMap with SSR disabled (Leaflet requires window)
const RiskMap = dynamic(() => import("@/components/RiskMap").then(mod => ({ default: mod.RiskMap })), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-100 rounded-2xl animate-pulse" />
});

export default function CitizenDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 text-charcoal relative">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-border-soft flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-3">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined font-bold text-lg">query_stats</span>
          </div>
          <span className="font-bold text-charcoal">No Dịch</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:sticky top-0 h-screen bg-white border-r border-border-soft flex-col transition-transform duration-300 z-50 w-72 lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center gap-3">
          <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white">
            <span className="material-symbols-outlined font-bold">query_stats</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-charcoal">No Dịch</h1>
            <p className="text-xs text-slate-500">Mekong Delta Hub</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <Link href="/" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-semibold">Dashboard</span>
          </Link>
          <Link href="/citizen/map" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined">map</span>
            <span className="font-medium">Sentinel Map</span>
          </Link>
          <Link href="/citizen/tasks" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined">assignment_turned_in</span>
            <span className="font-medium">Task Center</span>
          </Link>
          <Link href="/citizen/rewards" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined">military_tech</span>
            <span className="font-medium">Rewards</span>
          </Link>
          <Link href="/settings" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
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
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto mt-16 lg:mt-0 w-full">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 lg:mb-8 gap-4">
          <div>
            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-charcoal">Good morning, An</h2>
            <p className="text-sm lg:text-base text-slate-500">Can Tho City, Vietnam • Current Risk: <span className="text-risk-high font-bold">High</span></p>
          </div>
          <div className="flex items-center gap-4 self-end lg:self-auto">
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
          <div className="col-span-12 lg:col-span-5">
            <RiskGauge />
          </div>

          {/* Sentinel Heatmap Card */}
          <div className="col-span-12 lg:col-span-7 h-[400px] lg:h-[500px]">
            <RiskMap />
          </div>

          {/* Daily Quests */}
          <DailyQuest />

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
      <ChatBot />
    </div>
  );
}
