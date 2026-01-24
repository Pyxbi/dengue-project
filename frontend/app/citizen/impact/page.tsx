import Link from "next/link";

export default function PlaceholderPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-charcoal">
            <span className="material-symbols-outlined text-6xl text-primary mb-4">analytics</span>
            <h1 className="text-2xl font-bold">Impact Analytics</h1>
            <p className="text-slate-500 mb-8">Visualizing the community effort against Dengue.</p>
            <Link href="/" className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-opacity">
                Back to Dashboard
            </Link>
        </div>
    );
}
