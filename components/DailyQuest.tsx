"use client";

import { useEffect, useState } from "react";
import { Camera, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Task {
    task_id: string;
    title: string;
    description: string;
    reward_points: number;
    type: string;
    status: string;
    expiry: string;
}

export function DailyQuest() {
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);
    const [pointsEarned, setPointsEarned] = useState<number | null>(null);

    useEffect(() => {
        fetchTask();
    }, []);

    const fetchTask = async () => {
        try {
            const res = await fetch("http://localhost:5328/api/daily-task?user_id=user_123");
            if (res.ok) {
                const data = await res.json();
                setTask(data.task);
            }
        } catch (error) {
            console.error("Failed to fetch daily task", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        if (!task) return;
        setVerifying(true);

        try {
            const res = await fetch("http://localhost:5328/api/tasks/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: "user_123",
                    task_id: task.task_id,
                    image: "base64_placeholder"
                })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.verified) {
                    setPointsEarned(data.points_earned);
                    setTask(prev => prev ? { ...prev, status: 'completed' } : null);
                }
            }
        } catch (error) {
            console.error("Verification failed", error);
        } finally {
            setVerifying(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white border border-border-soft shadow-sm rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
                <div className="h-20 bg-slate-100 rounded"></div>
            </div>
        );
    }

    if (!task) return null;

    return (
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
                <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all group ${task.status === 'completed'
                        ? "bg-green-50 border-green-200"
                        : "border-border-soft hover:border-primary/30 hover:bg-slate-50"
                    }`}>
                    <div className={`size-12 rounded-xl flex items-center justify-center ${task.status === 'completed' ? "bg-green-100 text-green-600" : "bg-primary/10 text-primary"
                        }`}>
                        {task.status === 'completed' ? <CheckCircle2 /> : <AlertCircle />}
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h4 className="font-bold text-charcoal">{task.title}</h4>
                            {task.status === 'completed' && <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full font-bold">Completed</span>}
                        </div>
                        <p className="text-sm text-slate-500">{task.description}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-primary font-bold">+{task.reward_points} pts</span>

                        {task.status !== 'completed' && (
                            <Button
                                onClick={handleVerify}
                                disabled={verifying}
                                className="size-10 rounded-full bg-primary flex items-center justify-center text-white p-0 hover:bg-primary/90"
                            >
                                {verifying ? <Loader2 className="animate-spin" /> : <Camera />}
                            </Button>
                        )}
                    </div>
                </div>

                {pointsEarned !== null && (
                    <div className="mt-2 p-3 bg-green-100 text-green-800 rounded-lg text-center text-sm font-bold animate-in fade-in slide-in-from-top-2">
                        🎉 Quest Verified! You earned +{pointsEarned} points!
                    </div>
                )}
            </div>
        </div>
    );
}
