import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children, title, subtitle }) {
    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-emerald-600 selection:text-white">
            {/* ─── DYNAMIC TRAIN & LANDSCAPE ANIMATION BACKGROUND ─── */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
                {/* Night / Dusk Sky Glow */}
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-96 bg-gradient-to-b from-emerald-500/15 via-teal-500/5 to-transparent rounded-full blur-3xl"></div>

                {/* Drifting Clouds */}
                <div className="absolute top-8 left-0 opacity-20 animate-cloud-slow">
                    <svg width="240" height="60" viewBox="0 0 240 60" fill="none">
                        <path d="M20 40c0-11 9-20 20-20 3 0 6 1 8 2 4-12 15-20 28-20 16 0 29 11 31 26 3-2 7-3 11-3 12 0 22 10 22 22v3H20v-7z" fill="white" />
                    </svg>
                </div>
                <div className="absolute top-20 left-1/3 opacity-15 animate-cloud-fast">
                    <svg width="180" height="45" viewBox="0 0 180 45" fill="none">
                        <path d="M15 30c0-8 7-15 15-15 2 0 4 1 6 2 3-9 11-15 21-15 12 0 22 8 23 20 2-2 5-2 8-2 9 0 17 8 17 17v3H15v-5z" fill="white" />
                    </svg>
                </div>

                {/* Distant Mountain Silhouette */}
                <div className="absolute bottom-28 inset-x-0 h-40 opacity-20">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 200" fill="none">
                        <path d="M0 200L180 110L360 160L560 80L740 140L980 60L1180 130L1340 90L1440 150V200H0Z" fill="#10b981" fillOpacity="0.3" />
                        <path d="M0 200L120 140L280 170L480 110L680 160L880 100L1080 150L1280 120L1440 170V200H0Z" fill="#0f172a" fillOpacity="0.7" />
                    </svg>
                </div>

                {/* Railway Electric Overhead Wires & Poles */}
                <div className="absolute bottom-24 inset-x-0 h-10 border-b border-emerald-500/20 opacity-30 flex justify-around">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="w-[2px] h-10 bg-slate-600/40 relative">
                            <div className="w-4 h-[2px] bg-slate-500/40 -ml-2 top-2 absolute"></div>
                        </div>
                    ))}
                </div>

                {/* Railway Track */}
                <div className="absolute bottom-20 inset-x-0 h-4 bg-slate-950/80 border-t border-b border-emerald-500/30">
                    <div className="w-full h-full track-pattern opacity-40"></div>
                </div>

                {/* ─── ANIMATED HIGH-SPEED BULLET TRAIN ─── */}
                <div className="absolute bottom-[86px] left-0 w-[620px] h-12 animate-train z-10">
                    <svg viewBox="0 0 620 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_8px_16px_rgba(16,185,129,0.35)]">
                        {/* Headlight Beam Cone */}
                        <polygon points="615,28 780,10 780,45 615,35" fill="url(#guestHeadlightGradient)" className="animate-headlight" />

                        {/* Speed Motion Trail Lines Behind */}
                        <line x1="0" y1="20" x2="60" y2="20" stroke="#10b981" strokeWidth="2" strokeDasharray="8 6" opacity="0.6" />
                        <line x1="10" y1="30" x2="80" y2="30" stroke="#34d399" strokeWidth="2" strokeDasharray="12 8" opacity="0.8" />
                        <line x1="5" y1="38" x2="70" y2="38" stroke="#10b981" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.5" />

                        {/* ─── CARRIAGE 3 (Rear) ─── */}
                        <g transform="translate(90, 8)">
                            <rect x="0" y="0" width="120" height="34" rx="4" fill="#f8fafc" />
                            <rect x="0" y="24" width="120" height="6" fill="#059669" />
                            <rect x="0" y="30" width="120" height="4" fill="#0f172a" />
                            {/* Windows */}
                            <rect x="12" y="7" width="18" height="11" rx="2" fill="#0284c7" fillOpacity="0.8" />
                            <rect x="38" y="7" width="18" height="11" rx="2" fill="#0284c7" fillOpacity="0.8" />
                            <rect x="64" y="7" width="18" height="11" rx="2" fill="#0284c7" fillOpacity="0.8" />
                            <rect x="90" y="7" width="18" height="11" rx="2" fill="#0284c7" fillOpacity="0.8" />
                            {/* Wheels */}
                            <circle cx="25" cy="36" r="4" fill="#334155" />
                            <circle cx="95" cy="36" r="4" fill="#334155" />
                        </g>

                        {/* Coupler */}
                        <rect x="210" y="22" width="8" height="6" rx="1" fill="#475569" />

                        {/* ─── CARRIAGE 2 (Middle) ─── */}
                        <g transform="translate(218, 8)">
                            <rect x="0" y="0" width="130" height="34" rx="4" fill="#f8fafc" />
                            {/* GoRail Emerald Stripe */}
                            <rect x="0" y="24" width="130" height="6" fill="#10b981" />
                            <rect x="0" y="30" width="130" height="4" fill="#0f172a" />
                            {/* Windows with warm light */}
                            <rect x="12" y="7" width="18" height="11" rx="2" fill="#38bdf8" fillOpacity="0.9" />
                            <rect x="38" y="7" width="18" height="11" rx="2" fill="#38bdf8" fillOpacity="0.9" />
                            <rect x="64" y="7" width="18" height="11" rx="2" fill="#38bdf8" fillOpacity="0.9" />
                            <rect x="90" y="7" width="18" height="11" rx="2" fill="#38bdf8" fillOpacity="0.9" />
                            {/* Pantograph */}
                            <path d="M60 0L65 -6L75 -6L80 0" stroke="#64748b" strokeWidth="1.5" fill="none" />
                            {/* Wheels */}
                            <circle cx="28" cy="36" r="4" fill="#334155" />
                            <circle cx="102" cy="36" r="4" fill="#334155" />
                        </g>

                        {/* Coupler */}
                        <rect x="348" y="22" width="8" height="6" rx="1" fill="#475569" />

                        {/* ─── CARRIAGE 1 (Lead Bullet Locomotive) ─── */}
                        <g transform="translate(356, 8)">
                            {/* Aerodynamic Locomotive Body */}
                            <path d="M0 0 H180 Q230 4 255 24 Q260 29 255 34 H0 Z" fill="#ffffff" />
                            {/* Emerald Dynamic Swoosh Stripe */}
                            <path d="M0 22 H210 Q240 25 252 32 H0 Z" fill="#059669" />
                            <rect x="0" y="30" width="250" height="4" fill="#0f172a" />

                            {/* Front Cockpit Aerodynamic Window */}
                            <path d="M195 6 Q222 10 236 20 H195 Z" fill="#0f172a" />

                            {/* Passenger Windows */}
                            <rect x="18" y="7" width="20" height="11" rx="2" fill="#38bdf8" fillOpacity="0.9" />
                            <rect x="48" y="7" width="20" height="11" rx="2" fill="#38bdf8" fillOpacity="0.9" />
                            <rect x="78" y="7" width="20" height="11" rx="2" fill="#38bdf8" fillOpacity="0.9" />
                            <rect x="108" y="7" width="20" height="11" rx="2" fill="#38bdf8" fillOpacity="0.9" />
                            <rect x="138" y="7" width="20" height="11" rx="2" fill="#38bdf8" fillOpacity="0.9" />

                            {/* GoRail Brand Accent on Train Head */}
                            <circle cx="178" cy="18" r="4" fill="#10b981" />

                            {/* Headlight Glowing Point */}
                            <circle cx="254" cy="30" r="3" fill="#fef08a" />
                            <circle cx="254" cy="30" r="5" fill="#fef08a" fillOpacity="0.5" />

                            {/* Wheels */}
                            <circle cx="30" cy="36" r="4" fill="#334155" />
                            <circle cx="120" cy="36" r="4" fill="#334155" />
                            <circle cx="190" cy="36" r="4" fill="#334155" />
                        </g>

                        <defs>
                            <linearGradient id="guestHeadlightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
                                <stop offset="60%" stopColor="#fef08a" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>

            {/* ─── FOREGROUND CONTENT ─── */}
            <div className="relative z-20 w-full flex flex-col items-center">
                {/* Top Brand Logo */}
                <div className="flex flex-col items-center mb-6 text-center">
                    <Link href="/" className="group inline-block">
                        <ApplicationLogo className="h-16 w-auto p-1.5 bg-white/95 rounded-2xl shadow-lg shadow-black/20 group-hover:scale-105 transition duration-200" />
                    </Link>
                </div>

                {/* Auth Card Container */}
                <div className="w-full sm:max-w-md bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/50 p-6 sm:p-8">
                    {title && (
                        <div className="mb-6 text-center">
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
                            {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
                        </div>
                    )}
                    {children}
                </div>

                {/* Back to Home Link */}
                <div className="mt-6 text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-emerald-400 drop-shadow transition"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </div>
    );
}
