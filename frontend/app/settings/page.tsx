import Link from "next/link";

export default function SettingsPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-charcoal">
            <span className="material-symbols-outlined text-6xl text-slate-400 mb-4">settings</span>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-slate-500 mb-8">Manage your account and preferences.</p>
            <Link href="/" className="px-6 py-3 bg-white border border-slate-300 rounded-xl font-bold hover:bg-slate-100 transition-colors text-slate-700">
                Back to Dashboard
            </Link>
        </div>
    );
}
