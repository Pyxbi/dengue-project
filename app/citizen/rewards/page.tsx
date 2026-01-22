"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, Ticket } from "lucide-react";

interface Voucher {
    id: string;
    title: string;
    points: number;
    merchant: string;
}

export default function RewardsPage() {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [loading, setLoading] = useState(true);
    const [userPoints, setUserPoints] = useState(0);
    const [showQR, setShowQR] = useState(false);
    const [qrCode, setQrCode] = useState("");

    useEffect(() => {
        const fetchRewards = async () => {
            try {
                const res = await fetch("http://localhost:5328/api/vouchers");
                const data = await res.json();
                setVouchers(data.vouchers);
                
                // Check localStorage first, then fallback to API
                const savedPoints = localStorage.getItem('userPoints');
                if (savedPoints) {
                    setUserPoints(parseInt(savedPoints, 10));
                } else {
                    setUserPoints(data.user_points);
                }
            } catch (error) {
                console.error("Failed to fetch vouchers", error);
                // Still try to load points from localStorage
                const savedPoints = localStorage.getItem('userPoints');
                if (savedPoints) {
                    setUserPoints(parseInt(savedPoints, 10));
                }
            } finally {
                setLoading(false);
            }
        };
        fetchRewards();
    }, []);

    const handleRedeem = async (voucherId: string, cost: number) => {
        if (userPoints < cost) {
            alert("Not enough points!");
            return;
        }

        try {
            const res = await fetch("http://localhost:5328/api/vouchers/redeem", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: "user_123",
                    voucher_id: voucherId
                })
            });

            if (res.ok) {
                const data = await res.json();
                const newBalance = userPoints - cost;
                setUserPoints(newBalance);
                // Save to localStorage so it syncs across pages
                localStorage.setItem('userPoints', newBalance.toString());
                setQrCode(data.qr_code);
                setShowQR(true);
            }
        } catch (error) {
            console.error("Redemption failed", error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-charcoal pb-20 relative">
            {/* Header */}
            <div className="bg-white border-b border-border-soft px-6 py-4 sticky top-0 z-10 flex items-center gap-3">
                <Link href="/" className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-500">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="text-lg font-bold">Rewards Center</h1>
                <div className="ml-auto flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
                    <span className="material-symbols-outlined text-primary text-sm">database</span>
                    <span className="text-sm font-bold text-primary">{userPoints} pts</span>
                </div>
            </div>

            <div className="p-6 max-w-md mx-auto space-y-6">
                <div className="bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-primary/20">
                    <p className="opacity-90 text-sm font-medium mb-1">Available Point Balance</p>
                    <h2 className="text-4xl font-black tracking-tight">{userPoints}</h2>
                    <p className="text-xs opacity-75 mt-4">Earn more points by completing daily verification tasks.</p>
                </div>

                <h3 className="font-bold text-lg text-charcoal flex items-center gap-2">
                    <Ticket className="text-primary size-5" />
                    Redeem Vouchers
                </h3>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="animate-spin text-primary size-8" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {vouchers.map((voucher) => (
                            <div key={voucher.id} className="bg-white border border-border-soft rounded-xl p-4 flex gap-4 shadow-sm">
                                <div className="size-16 bg-slate-100 rounded-lg flex items-center justify-center text-3xl">
                                    🎁
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-charcoal">{voucher.title}</h4>
                                    <p className="text-xs text-slate-500 mb-2">{voucher.merchant}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-primary font-bold text-sm">{voucher.points} pts</span>
                                        <button
                                            onClick={() => handleRedeem(voucher.id, voucher.points)}
                                            className="bg-charcoal text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-black transition-colors"
                                        >
                                            Redeem
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* QR Code Modal using basic fixed positioning */}
            {showQR && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl scale-100 animate-in zoom-in-95 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-blue-500"></div>
                        <div className="text-center space-y-6">
                            <div className="size-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                <span className="material-symbols-outlined text-3xl">check_circle</span>
                            </div>

                            <div>
                                <h3 className="text-2xl font-black text-charcoal">Redeemed!</h3>
                                <p className="text-slate-500 mt-2">Present this code to the merchant.</p>
                            </div>

                            <div className="bg-white p-4 rounded-xl border-2 border-dashed border-slate-200 inline-block">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={qrCode} alt="Redemption QR Code" className="size-48" />
                            </div>

                            <button
                                onClick={() => setShowQR(false)}
                                className="w-full py-3.5 bg-charcoal text-white font-bold rounded-xl hover:bg-black transition-transform active:scale-95"
                            >
                                Close & Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
