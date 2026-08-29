import { Head, Link, router } from '@inertiajs/react';
import { useState, useId } from 'react';
import { Calendar, Clock, Timer, ArrowDown, ArrowRight, Train, ShieldCheck, Zap, Sparkles, Users } from 'lucide-react';

const getTanggalHariIni = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function Welcome({ auth, stations, popularSchedules = [], laravelVersion, phpVersion }) {
    const daftarStasiun = stations?.data || stations || [];

    // State untuk form pencarian tiket di hero
    const tanggalHariIni = getTanggalHariIni();
    const [stasiunAsal, setStasiunAsal] = useState(daftarStasiun[0]?.id || '');
    const [stasiunTujuan, setStasiunTujuan] = useState(daftarStasiun[2]?.id || '');
    const [tanggalKeberangkatan, setTanggalKeberangkatan] = useState(tanggalHariIni);
    const [pesanError, setPesanError] = useState('');

    const handleTukarStasiun = () => {
        const temp = stasiunAsal;
        setStasiunAsal(stasiunTujuan);
        setStasiunTujuan(temp);
    };

    const handleCariJadwal = (e) => {
        e.preventDefault();
        if (!stasiunAsal || !stasiunTujuan) {
            setPesanError('Silakan pilih stasiun asal dan stasiun tujuan.');
            return;
        }
        if (stasiunAsal === stasiunTujuan) {
            setPesanError('Stasiun asal dan stasiun tujuan tidak boleh sama.');
            return;
        }
        setPesanError('');

        router.get(route('schedules.search'), {
            asal: stasiunAsal,
            tujuan: stasiunTujuan,
            tanggal: tanggalKeberangkatan,
        });
    };

    const rutePopuler = [
        {
            asal: 'Gambir (Jakarta)',
            tujuan: 'Bandung',
            kereta: 'Argo Parahyangan',
            waktu: '3 Jam',
            harga: 'Rp 150.000',
            kelas: 'Ekonomi / Bisnis / Eksekutif',
            tanggal: '30 Agustus 2026',
            jam: '08:00 WIB',
        },
        {
            asal: 'Gambir (Jakarta)',
            tujuan: 'Yogyakarta',
            kereta: 'Taksaka',
            waktu: '7 Jam 15 Menit',
            harga: 'Rp 350.000',
            kelas: 'Ekonomi / Bisnis / Eksekutif',
            tanggal: '30 Agustus 2026',
            jam: '09:30 WIB',
        },
        {
            asal: 'Gambir (Jakarta)',
            tujuan: 'Surabaya Gubeng',
            kereta: 'Argo Bromo Anggrek',
            waktu: '9 Jam 10 Menit',
            harga: 'Rp 500.000',
            kelas: 'Ekonomi / Bisnis / Eksekutif',
            tanggal: '31 Agustus 2026',
            jam: '08:20 WIB',
        },
        {
            asal: 'Bandung',
            tujuan: 'Gambir (Jakarta)',
            kereta: 'Argo Parahyangan',
            waktu: '3 Jam',
            harga: 'Rp 150.000',
            kelas: 'Ekonomi / Bisnis / Eksekutif',
            tanggal: '30 Agustus 2026',
            jam: '14:00 WIB',
        },
    ];

    const keunggulan = [
        {
            icon: (
                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            judul: 'Pemesanan Instan & Praktis',
            deskripsi: 'Cari jadwal, pilih jadwal yang sesuai, dan lakukan booking tiket hanya dalam beberapa klik.',
        },
        {
            icon: (
                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            judul: 'Pilih Kursi Interaktif',
            deskripsi: 'Denah kursi dinamis memungkinkan Anda memilih posisi tempat duduk terbaik di setiap gerbong.',
        },
        {
            icon: (
                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            judul: 'Pembayaran Aman & Terverifikasi',
            deskripsi: 'Transfer mudah dengan sistem upload bukti pembayaran yang diverifikasi langsung oleh petugas.',
        },
        {
            icon: (
                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
            ),
            judul: 'E-Ticket & QR Code Instan',
            deskripsi: 'Dapatkan e-ticket resmi dengan QR Code yang dapat diunduh dalam format PDF untuk boarding.',
        },
    ];

    const langkahPemesanan = [
        { no: '01', judul: 'Cari Jadwal', ket: 'Tentukan stasiun asal, stasiun tujuan, dan tanggal perjalanan Anda.' },
        { no: '02', judul: 'Pilih Kursi', ket: 'Pilih gerbong dan nomor kursi yang tersedia pada denah interaktif.' },
        { no: '03', judul: 'Upload Pembayaran', ket: 'Lakukan transfer pembayaran dan unggah bukti transfer secara aman.' },
        { no: '04', judul: 'E-Ticket Terbit', ket: 'Setelah diverifikasi, download tiket PDF dan siap untuk berangkat.' },
    ];

    return (
        <>
            <Head title="GoRail — Reservasi Tiket Kereta Api Terpercaya" />

            <div className="min-h-screen bg-slate-50 text-slate-800 antialiased flex flex-col justify-between selection:bg-emerald-600 selection:text-white">
                {/* ─── NAVBAR ─────────────────────────────────────────────── */}
                <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                        {/* Brand Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <img
                                src="/logo_1.jpeg"
                                alt="GoRail Logo"
                                className="h-12 w-auto object-contain rounded-lg shadow-sm group-hover:scale-105 transition duration-200"
                            />
                        </Link>

                        {/* Navigation Links */}
                        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                            <a href="#cari-tiket" className="hover:text-emerald-600 transition">Cari Tiket</a>
                            <a href="#rute-populer" className="hover:text-emerald-600 transition">Rute Populer</a>
                            <a href="#keunggulan" className="hover:text-emerald-600 transition">Keunggulan</a>
                            <a href="#cara-pesan" className="hover:text-emerald-600 transition">Panduan</a>
                        </nav>

                        {/* Auth Buttons */}
                        <div className="flex items-center gap-3">
                            {auth?.user ? (
                                <div className="flex items-center gap-2">
                                    <span className="hidden sm:inline text-xs text-slate-500 font-medium">
                                        Halo, <strong className="text-slate-800">{auth.user.name}</strong>
                                    </span>
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 active:scale-95 transition"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        Dashboard
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-lg shadow-sm transition"
                                    >
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* ─── HERO SECTION WITH ANIMATED TRAIN BACKGROUND ────────── */}
                <section id="cari-tiket" className="relative pt-12 pb-24 lg:pt-16 lg:pb-32 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
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
                                <polygon points="615,28 780,10 780,45 615,35" fill="url(#headlightGradient)" className="animate-headlight" />

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
                                    {/* Pantograph (Roof electrical connector) */}
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
                                    <linearGradient id="headlightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
                                        <stop offset="60%" stopColor="#fef08a" stopOpacity="0.2" />
                                        <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                    </div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
                        {/* Hero Text */}
                        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-12">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-sm">
                                Perjalanan Nyaman & Cepat Bersama <span className="text-emerald-400">GoRail</span>
                            </h1>
                            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
                                Pesan tiket kereta api antar kota secara online dengan cepat, pilih kursi favorit Anda secara langsung, dan dapatkan e-ticket instan.
                            </p>
                        </div>

                        {/* ─── TICKET SEARCH WIDGET CARD ─────────────────────── */}
                        <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl shadow-black/40 border border-white/20 p-6 sm:p-8 text-slate-900">
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-6">
                                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-slate-900">Cari Jadwal Perjalanan Kereta</h2>
                                    <p className="text-xs text-slate-500">Tentukan stasiun rute dan tanggal keberangkatan</p>
                                </div>
                            </div>

                            {pesanError && (
                                <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {pesanError}
                                </div>
                            )}

                            <form onSubmit={handleCariJadwal} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                    {/* Stasiun Asal */}
                                    <div className="md:col-span-5">
                                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                                            Stasiun Asal
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <select
                                                value={stasiunAsal}
                                                onChange={(e) => setStasiunAsal(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                                                required
                                            >
                                                <option value="">Pilih Stasiun Asal</option>
                                                {daftarStasiun.map((stasiun) => (
                                                    <option key={stasiun.id} value={stasiun.id}>
                                                        {stasiun.nama_stasiun} ({stasiun.kode_stasiun}) - {stasiun.kota}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Swap Button */}
                                    <div className="md:col-span-2 flex justify-center pt-2 md:pt-6">
                                        <button
                                            type="button"
                                            onClick={handleTukarStasiun}
                                            title="Tukar Stasiun"
                                            className="p-2.5 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 border border-slate-200 hover:border-emerald-300 transition shadow-sm active:rotate-180"
                                        >
                                            <svg className="w-5 h-5 transition transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Stasiun Tujuan */}
                                    <div className="md:col-span-5">
                                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                                            Stasiun Tujuan
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <select
                                                value={stasiunTujuan}
                                                onChange={(e) => setStasiunTujuan(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                                                required
                                            >
                                                <option value="">Pilih Stasiun Tujuan</option>
                                                {daftarStasiun.map((stasiun) => (
                                                    <option key={stasiun.id} value={stasiun.id}>
                                                        {stasiun.nama_stasiun} ({stasiun.kode_stasiun}) - {stasiun.kota}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                    {/* Tanggal Berangkat */}
                                    <div className="md:col-span-8">
                                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                                            Tanggal Keberangkatan
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="date"
                                                min={tanggalHariIni}
                                                value={tanggalKeberangkatan}
                                                onChange={(e) => setTanggalKeberangkatan(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Submit Search Button */}
                                    <div className="md:col-span-4">
                                        <button
                                            type="submit"
                                            className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 flex items-center justify-center gap-2 transition duration-200"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            Cari Kereta
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>

                {/* ─── RUTE POPULER SECTION ───────────────────────────────── */}
                <section id="rute-populer" className="py-16 bg-white border-t border-slate-200/60">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
                            <div>
                                <span className="text-emerald-600 text-xs font-bold tracking-wider uppercase">
                                    Destinasi Favorit
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                                    Rute Kereta Populer
                                </h2>
                            </div>
                            <p className="text-sm text-slate-500 mt-2 sm:mt-0">
                                Jadwal perjalanan dengan pilihan kelas terbaik
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {(popularSchedules && popularSchedules.length > 0 ? popularSchedules : rutePopuler).map((rute, idx) => {
                                const sisaKursi = rute.kursi_tersedia !== undefined ? rute.kursi_tersedia : 30;

                                return (
                                    <div
                                        key={idx}
                                        className="group bg-slate-50 hover:bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-900/5 transition duration-300 flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
                                                <span className="font-semibold px-2 py-0.5 rounded bg-slate-200/70 text-slate-700">
                                                    {rute.kereta}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Timer className="w-3.5 h-3.5 text-slate-400" />
                                                    {rute.waktu}
                                                </span>
                                            </div>

                                            {/* Keterangan Tanggal & Jam Jadwal */}
                                            <div className="flex items-center justify-between text-[11px] bg-emerald-50/80 border border-emerald-200/70 px-2.5 py-1.5 rounded-xl text-emerald-900 mb-3">
                                                <span className="font-bold flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                                    {rute.tanggal}
                                                </span>
                                                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                                    {rute.jam}
                                                </span>
                                            </div>

                                            <div className="space-y-1 mb-3">
                                                <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                                    {rute.asal}
                                                </div>
                                                <div className="pl-0.5 text-slate-400 py-0.5">
                                                    <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
                                                </div>
                                                <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-full bg-slate-800"></span>
                                                    {rute.tujuan}
                                                </div>
                                            </div>

                                            {/* Keterangan Jumlah Kursi Tersedia */}
                                            <div className="flex items-center justify-between text-xs bg-slate-100/90 border border-slate-200/80 px-2.5 py-1.5 rounded-xl mb-3">
                                                <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                                                    <Users className="w-3.5 h-3.5 text-slate-400" />
                                                    Sisa Kursi:
                                                </span>
                                                <span className={`inline-flex items-center gap-1.5 font-bold text-xs px-2 py-0.5 rounded-lg border ${
                                                    sisaKursi > 0 
                                                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200' 
                                                        : 'text-rose-700 bg-rose-50 border-rose-200'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                                        sisaKursi > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                                                    }`}></span>
                                                    {sisaKursi > 0 ? `${sisaKursi} Kursi Tersedia` : 'Penuh'}
                                                </span>
                                            </div>

                                            <div className="text-xs text-slate-500 mb-4">
                                                Kelas: <span className="font-medium text-slate-700">{rute.kelas}</span>
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                                            <div>
                                                <span className="text-[10px] text-slate-400 block">Mulai dari</span>
                                                <span className="text-base font-extrabold text-emerald-600">
                                                    {rute.harga}
                                                </span>
                                            </div>
                                            <Link
                                                href={route('login')}
                                                className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs hover:shadow active:scale-95 transition"
                                            >
                                                Pesan
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ─── KEUNGGULAN SECTION ─────────────────────────────────── */}
                <section id="keunggulan" className="py-16 bg-slate-50 border-t border-slate-200/60">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-12">
                            <span className="text-emerald-600 text-xs font-bold tracking-wider uppercase">
                                Layanan Unggulan
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                                Mengapa Memilih GoRail?
                            </h2>
                            <p className="text-sm text-slate-600 mt-2">
                                Kenyamanan, kemudahan, dan kepastian perjalanan Anda adalah prioritas utama kami.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {keunggulan.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-5">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 mb-2">
                                        {item.judul}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                        {item.deskripsi}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── CARA PEMESANAN SECTION ─────────────────────────────── */}
                <section id="cara-pesan" className="py-16 bg-white border-t border-slate-200/60">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-12">
                            <span className="text-emerald-600 text-xs font-bold tracking-wider uppercase">
                                Alur Reservasi
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                                4 Langkah Mudah Memesan Tiket
                            </h2>
                            <p className="text-sm text-slate-600 mt-2">
                                Proses pemesanan terstruktur dari pencarian hingga e-ticket terbit.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {langkahPemesanan.map((item, idx) => (
                                <div key={idx} className="relative bg-slate-50 rounded-2xl p-6 border border-slate-200">
                                    <div className="text-3xl font-black text-emerald-600/30 mb-2 font-mono">
                                        {item.no}
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 mb-1">
                                        {item.judul}
                                    </h3>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        {item.ket}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── CTA BANNER SECTION ─────────────────────────────────── */}
                <section className="py-12 bg-emerald-700 text-white relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                Siap Menjelajahi Kota Tujuan Anda?
                            </h2>
                            <p className="text-emerald-100 text-sm mt-1">
                                Dapatkan tiket perjalanan kereta api dengan harga resmi dan kursi terbaik hari ini.
                            </p>
                        </div>
                        <a
                            href="#cari-tiket"
                            className="px-6 py-3 bg-white text-emerald-800 hover:bg-emerald-50 active:scale-95 font-bold text-sm rounded-xl shadow-lg transition duration-200 shrink-0"
                        >
                            Cari Tiket Sekarang
                        </a>
                    </div>
                </section>

                {/* ─── FOOTER ─────────────────────────────────────────────── */}
                <footer className="bg-slate-900 text-slate-400 text-xs py-12 border-t border-slate-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-800">
                            <div className="md:col-span-5 space-y-3">
                                <div className="flex items-center gap-3">
                                    <img
                                        src="/logo_1.jpeg"
                                        alt="GoRail"
                                        className="h-10 w-auto object-contain rounded-md bg-white p-1"
                                    />
                                    <span className="text-xl font-extrabold text-white tracking-tight">
                                        Go<span className="text-emerald-500">Rail</span>
                                    </span>
                                </div>
                                <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                                    Sistem reservasi tiket kereta api berbasis Laravel 13 & Inertia React. Kemudahan perjalanan antar kota dengan keamanan dan kenyamanan terjamin.
                                </p>
                            </div>

                            <div className="md:col-span-3 space-y-2">
                                <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Tautan Cepat</h4>
                                <ul className="space-y-2">
                                    <li><a href="#cari-tiket" className="hover:text-emerald-400 transition">Pencarian Jadwal</a></li>
                                    <li><a href="#rute-populer" className="hover:text-emerald-400 transition">Rute Populer</a></li>
                                    <li><a href="#cara-pesan" className="hover:text-emerald-400 transition">Panduan Pemesanan</a></li>
                                </ul>
                            </div>

                            <div className="md:col-span-4 space-y-2">
                                <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Informasi Sistem</h4>
                                <p className="text-slate-400">
                                    Laravel v{laravelVersion} · PHP v{phpVersion}
                                </p>
                                <p className="text-slate-500 text-[11px]">
                                    Didukung RBAC Multi-Role, QR Code Boarding, dan Unduh E-Ticket PDF.
                                </p>
                            </div>
                        </div>

                        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
                            <div>
                                &copy; {new Date().getFullYear()} GoRail. Hak Cipta Dilindungi Undang-Undang.
                            </div>
                            <div className="flex gap-6">
                                <span>Reservasi Tiket Kereta Api Indonesia</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
