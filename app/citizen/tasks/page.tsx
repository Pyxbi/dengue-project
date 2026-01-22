"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Loader2, CheckCircle2, Camera, X, Sparkles, Menu } from "lucide-react";

// Task points mapping
const TASK_POINTS: Record<string, number> = {
    'general': 50,
    'gutter': 150,
    'flowerpot': 50,
};

export default function TaskCenter() {
    const [activeTask, setActiveTask] = useState<string | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [verifying, setVerifying] = useState(false);
    const [verified, setVerified] = useState<string | null>(null);
    const [totalPoints, setTotalPoints] = useState(1240); // Base points
    const [earnedPoints, setEarnedPoints] = useState(0); // Points earned this session
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load points from localStorage on mount
    useEffect(() => {
        const savedPoints = localStorage.getItem('userPoints');
        if (savedPoints) {
            setTotalPoints(parseInt(savedPoints, 10));
        }
    }, []);

    // Save points to localStorage when they change
    useEffect(() => {
        localStorage.setItem('userPoints', totalPoints.toString());
    }, [totalPoints]);

    const handleStartMission = (taskId: string) => {
        setActiveTask(taskId);
        // Trigger camera/file picker
        fileInputRef.current?.click();
    };

    const handleFileCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCapturedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleVerifyTask = async () => {
        if (!capturedImage || !activeTask) return;
        setVerifying(true);

        try {
            const res = await fetch("http://localhost:5328/api/tasks/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: "user_123",
                    task_id: activeTask,
                    image: capturedImage
                })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.verified) {
                    // Add points for completed task
                    const pointsToAdd = TASK_POINTS[activeTask] || 50;
                    setTotalPoints(prev => prev + pointsToAdd);
                    setEarnedPoints(pointsToAdd);
                    
                    setVerified(activeTask);
                    setCapturedImage(null);
                    setActiveTask(null);
                    
                    // Clear earned points notification after 3 seconds
                    setTimeout(() => setEarnedPoints(0), 3000);
                }
            }
        } catch (error) {
            console.error("Verification failed", error);
        } finally {
            setVerifying(false);
        }
    };

    const handleCancelCapture = () => {
        setCapturedImage(null);
        setActiveTask(null);
    };

    return (
        <div className="flex min-h-screen bg-slate-50 text-charcoal relative">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-border-soft flex items-center justify-between px-4 z-50">
                <div className="flex items-center gap-3">
                    <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                        <span className="material-symbols-outlined font-bold text-lg">query_stats</span>
                    </div>
                    <span className="font-bold text-charcoal">Dengue Sentinel</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/10 px-3 py-1.5 rounded-full relative">
                        <span className="material-symbols-outlined text-primary text-sm fill-1">stars</span>
                        <span className="text-primary font-extrabold text-xs">{totalPoints.toLocaleString()} pts</span>
                        {earnedPoints > 0 && (
                            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-bounce">
                                +{earnedPoints}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                    >
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
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
                        <h1 className="text-lg font-bold tracking-tight text-charcoal">Dengue Sentinel</h1>
                        <p className="text-xs text-slate-500">Mekong Delta Hub</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                    <Link href="/" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
                        <span className="material-symbols-outlined">dashboard</span>
                        <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link href="/citizen/map" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
                        <span className="material-symbols-outlined">map</span>
                        <span className="font-medium">Sentinel Map</span>
                    </Link>
                    <Link href="/citizen/tasks" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary">
                        <span className="material-symbols-outlined">assignment_turned_in</span>
                        <span className="font-semibold">Task Center</span>
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
                {/* Hidden camera input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileCapture}
                />

                {/* Camera Preview Modal */}
                {capturedImage && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl">
                            <div className="relative">
                                <img src={capturedImage} alt="Captured" className="w-full aspect-square object-cover" />
                                <button
                                    onClick={handleCancelCapture}
                                    className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Verify Your Task</h3>
                                <p className="text-slate-500 text-sm mb-6">Our AI will analyze your photo to confirm task completion.</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleCancelCapture}
                                        className="flex-1 py-3 px-4 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                                    >
                                        Retake
                                    </button>
                                    <button
                                        onClick={handleVerifyTask}
                                        disabled={verifying}
                                        className="flex-1 py-3 px-4 bg-primary text-white rounded-xl font-bold hover:brightness-105 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                                    >
                                        {verifying ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Verifying...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="w-5 h-5" />
                                                Submit
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Toast */}
                {verified && (
                    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-lg flex items-center gap-4 animate-in slide-in-from-top-4">
                        <div className="bg-white/20 p-2 rounded-full">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-bold text-lg">+{TASK_POINTS[verified] || 50} Points Earned! 🎉</p>
                            <p className="text-sm text-green-100">Task verified! Total: {totalPoints.toLocaleString()} pts</p>
                        </div>
                        <button onClick={() => setVerified(null)} className="ml-2 hover:bg-white/20 p-2 rounded-lg transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                <div className="flex flex-wrap justify-between items-center gap-6 mb-12">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-slate-900 text-4xl font-black tracking-tight">Daily Missions</h1>
                        <p className="text-slate-500 text-lg font-medium">Protect your community, earn rewards, and keep the Delta healthy.</p>
                    </div>
                    <div>
                        <button 
                            onClick={() => handleStartMission('general')}
                            className="flex items-center justify-center rounded-2xl h-14 px-8 bg-primary text-white font-bold text-lg hover:brightness-105 transition-all shadow-md group"
                        >
                            <Camera className="w-6 h-6 mr-3" />
                            Complete New Task
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-10">
                    <div className="col-span-12 lg:col-span-8 flex flex-col gap-12">
                        {/* Friends Activity */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex flex-col">
                                    <h3 className="text-xl font-extrabold flex items-center gap-2 text-slate-800">
                                        <span className="material-symbols-outlined text-pink-500 fill-1">favorite</span>
                                        Friends' Activity
                                    </h3>
                                </div>
                                <button className="text-primary text-sm font-bold hover:bg-primary/5 px-4 py-2 rounded-lg transition-colors">See all</button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                                <div className="group relative aspect-square rounded-[2.5rem] overflow-hidden shadow-sm border-4 border-white cursor-pointer bg-white transition-transform duration-200 hover:scale-105">
                                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(to top, rgba(0,0,0,0.4), transparent 40%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBq4-FA2HkVQesnz3E-KKTGxBEGA9PxW9Pm9giMwhC0QhN_VMj7KZWr2y4WBAIEeqwTpAlGD_1xdhe0Hfh3rJ50IJjtkxemp2CDsbJmbwa-XhEi0Zy-odlJlyJtjS_TGy2sElZseFmQHk-oLbiP7v3O1J1zrDmc9DdVT0HtAMtQwHtnVwt1sXTiaCS_YFNSvuTeGbvMoI5kvegkYRJVh3Yy_VzHA7dc2UM6_Wvb_eER-wu6RctKVTNQXytERwkwXEAEKj0Cv0cFRnI')" }}></div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <p className="text-[11px] font-bold text-white/90 uppercase tracking-widest drop-shadow-md">Minh</p>
                                        <p className="text-[10px] text-white/70 font-medium">2m ago</p>
                                    </div>
                                </div>
                                <div className="group relative aspect-square rounded-[2.5rem] overflow-hidden shadow-sm border-4 border-white cursor-pointer bg-white transition-transform duration-200 hover:scale-105">
                                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(to top, rgba(0,0,0,0.4), transparent 40%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuCfrJ92u8GShtWJmkIB1Vzg4LJEWyOUbX5bPppgUArhyOog4Bw3CQS1jbA9Fa0a3bkpPdL4XVeIb0a6KdeWraGk1XXp9GTIDcL5n-6HRtTYb_mwE9mymDTWpSFgwprrt6eI-vsxePhWnXKGNPt2Xd2MgWMQE_jM73QojM_bt3fQvmtvLmpqL6IYjyiP6O2S7EZzOZ2KfowcYFgh8ImxiXjEGlGFbioXs6Lryxp7tbdbM3t-6krPNdLA0ADi4SdXG90RJTJ8NI3ZSeI')" }}></div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <p className="text-[11px] font-bold text-white/90 uppercase tracking-widest drop-shadow-md">An</p>
                                        <p className="text-[10px] text-white/70 font-medium">15m ago</p>
                                    </div>
                                </div>
                                <div className="group relative aspect-square rounded-[2.5rem] overflow-hidden shadow-sm border-4 border-white cursor-pointer bg-white transition-transform duration-200 hover:scale-105">
                                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(to top, rgba(0,0,0,0.4), transparent 40%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuArJ_bgkOd-mKgm1SRKBIHYSv4RyHspRCLzHV2E_akpO1-ytCwywX_qrNf-qegbaCbWgB59k__f5rRW1rW2cCdgbKWxJAAxwIUYiwqloWioG5AHOAS_0DvVV4y1BqYyifE2iYVgZUbrEJeVFNGkpQvSITic7x9hITf1f4XPCHZfgayu4lOst93NpjfsD2N-96f8-A6Oa40AZbq6m0_for_VyaPWu-4FA8Y6JyBFAkbUaOlF2AJ1phC2jrKi2abTYHyenrixQexvXe4')" }}></div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <p className="text-[11px] font-bold text-white/90 uppercase tracking-widest drop-shadow-md">Thuy</p>
                                        <p className="text-[10px] text-white/70 font-medium">1h ago</p>
                                    </div>
                                </div>
                                <div className="group relative aspect-square rounded-[2.5rem] overflow-hidden shadow-sm border-4 border-white cursor-pointer bg-white transition-transform duration-200 hover:scale-105">
                                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(to top, rgba(0,0,0,0.4), transparent 40%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuCzeynny06rgo5GLm0Z6khSLXpBZ0ucnzukb14nPsZq_VydgN-Ncq-grvEamD0NEYD3gqYvH5bw-O5FDxLwZR0INHk2ufOXUdzHRtIpHRNlXKwWQzPIVAgzSIZatgl1ikUEPMK2iJ4NLDZQ4sAsCkGTv3_bDrXnz3l66oD7p1twq2ZUDqt6CAdCMBoPDVkP1-lj-BozeFiZM9sDaoIQqStOela9o4_AZtYf66-if1paxtFbd9c68lnjcOrnFO1krT3_Gae3msJdQwQ')" }}></div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <p className="text-[11px] font-bold text-white/90 uppercase tracking-widest drop-shadow-md">Linh</p>
                                        <p className="text-[10px] text-white/70 font-medium">3h ago</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Active Tasks */}
                        <section className="flex flex-col gap-6">
                            <h3 className="text-xl font-extrabold flex items-center gap-2 text-slate-800">
                                <span className="material-symbols-outlined text-orange-400 fill-1">bolt</span>
                                Active Tasks
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col gap-5">
                                    <div className="flex justify-between items-start">
                                        <div className="bg-primary/10 text-primary p-3 rounded-2xl">
                                            <span className="material-symbols-outlined">cleaning_services</span>
                                        </div>
                                        <span className="px-3 py-1 bg-pink-100 text-pink-500 text-[10px] font-black rounded-full uppercase tracking-widest">High Reward</span>
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-lg text-slate-800">Clean Roof Gutters</h4>
                                        <p className="text-slate-500 text-sm mt-2 leading-relaxed">Prevent water stagnation where mosquitoes can breed. Help protect 4 neighboring homes.</p>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 mt-auto">
                                        <div className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-primary text-sm fill-1">stars</span>
                                            <span className="text-primary font-black">+150 pts</span>
                                        </div>
                                        {verified === 'gutter' ? (
                                            <span className="text-sm font-extrabold bg-green-100 text-green-600 px-5 py-2.5 rounded-xl flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4" /> Completed
                                            </span>
                                        ) : (
                                            <button 
                                                onClick={() => handleStartMission('gutter')}
                                                className="text-sm font-extrabold bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2"
                                            >
                                                <Camera className="w-4 h-4" /> Start Mission
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col gap-5">
                                    <div className="flex justify-between items-start">
                                        <div className="bg-orange-100 text-orange-500 p-3 rounded-2xl">
                                            <span className="material-symbols-outlined">search_check</span>
                                        </div>
                                        <span className="px-3 py-1 bg-green-100 text-green-500 text-[10px] font-black rounded-full uppercase tracking-widest">Daily Quest</span>
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-lg text-slate-800">Flower Pot Inspection</h4>
                                        <p className="text-slate-500 text-sm mt-2 leading-relaxed">A quick check for larvae in 3 outdoor containers. Takes only 5 minutes!</p>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 mt-auto">
                                        <div className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-primary text-sm fill-1">stars</span>
                                            <span className="text-primary font-black">+50 pts</span>
                                        </div>
                                        {verified === 'flowerpot' ? (
                                            <span className="text-sm font-extrabold bg-green-100 text-green-600 px-5 py-2.5 rounded-xl flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4" /> Completed
                                            </span>
                                        ) : (
                                            <button 
                                                onClick={() => handleStartMission('flowerpot')}
                                                className="text-sm font-extrabold bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2"
                                            >
                                                <Camera className="w-4 h-4" /> Start Mission
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
                        {/* Rewards Card */}
                        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
                            <div className="flex justify-between items-center mb-8 relative">
                                <h3 className="text-xl font-black text-slate-800">Your Rewards</h3>
                                <span className="material-symbols-outlined text-slate-300 bg-slate-50 p-2 rounded-lg">wallet</span>
                            </div>
                            <div className="mb-10 text-center relative">
                                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Current Impact Balance</p>
                                <div className="flex flex-col items-center">
                                    <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-green-500 leading-tight">2,450</span>
                                    <div className="flex items-center gap-2 -mt-1">
                                        <span className="w-8 h-[1px] bg-slate-200"></span>
                                        <span className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Available Points</span>
                                        <span className="w-8 h-[1px] bg-slate-200"></span>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-10 bg-slate-50 p-5 rounded-2xl border border-slate-100/50">
                                <div className="flex justify-between text-xs font-black mb-3">
                                    <span className="text-slate-700 uppercase">Pharmacy Voucher</span>
                                    <span className="text-primary">82%</span>
                                </div>
                                <div className="w-full bg-white h-4 rounded-full p-1 border border-slate-100 shadow-inner">
                                    <div className="bg-gradient-to-r from-primary to-green-500 h-full rounded-full w-[82%] shadow-sm"></div>
                                </div>
                                <div className="mt-4 flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                                    <p className="text-[11px] text-slate-500 font-semibold italic">12 households protected this week!</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-800 mb-4 uppercase tracking-wider flex items-center gap-2">
                                    <span className="material-symbols-outlined text-pink-500 text-base">confirmation_number</span>
                                    Active Vouchers
                                </p>
                                <div className="flex flex-col gap-4">
                                    <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-slate-900 rounded-xl">
                                                <span className="material-symbols-outlined text-white text-xl">qr_code_2</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-extrabold text-slate-900">10% Off Medicine</p>
                                                <p className="text-[10px] text-slate-500 font-medium">Can Tho Pharmacy</p>
                                            </div>
                                        </div>
                                        <button className="text-primary font-black text-xs uppercase hover:underline">Tap to Use</button>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-between opacity-60">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-slate-300 rounded-xl">
                                                <span className="material-symbols-outlined text-white text-xl">qr_code_2</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-extrabold text-slate-400">Free Insecticide</p>
                                                <p className="text-[10px] text-slate-400 font-medium">Outreach Center</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-500 bg-slate-200 px-3 py-1 rounded-full">REDEEMED</span>
                                    </div>
                                </div>
                            </div>
                            <button className="w-full mt-8 py-4 bg-slate-50 text-slate-900 border border-slate-200 font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-colors">
                                Browse Rewards Shop
                            </button>
                        </section>

                        {/* Regional Rank */}
                        <div className="bg-slate-900 rounded-[2rem] p-8 shadow-md text-white overflow-hidden relative">
                            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
                            <h4 className="font-black mb-4 flex items-center gap-2 text-sm uppercase tracking-widest text-slate-400">
                                <span className="material-symbols-outlined text-green-500 text-sm">trending_up</span>
                                Regional Rank
                            </h4>
                            <div className="flex justify-between items-end relative">
                                <div className="flex flex-col">
                                    <span className="text-4xl font-black mb-1">#14</span>
                                    <span className="text-xs text-slate-400 font-medium">In District 1, Can Tho</span>
                                </div>
                                <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">Leaderboard</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
