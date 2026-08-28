import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard({ stats = {}, recentBookings = [], upcomingSchedules = [], stations = [] }) {
    const user = usePage().props.auth.user;
    const roles = user?.roles || [];
    const isAdmin = roles.includes('admin');
    const isStaff = roles.includes('staff');
    const isCustomer = roles.includes('customer') || (!isAdmin && !isStaff);

    const daftarStasiun = stations?.data || stations || [];
    const tanggalHariIni = new Date().toISOString().split('T')[0];

    // State untuk widget cari tiket cepat di dashboard (Customer)
    const [stasiunAsal, setStasiunAsal] = useState(daftarStasiun[0]?.id || '');
    const [stasiunTujuan, setStasiunTujuan] = useState(daftarStasiun[1]?.id || '');
    const [tanggalKeberangkatan, setTanggalKeberangkatan] = useState(tanggalHariIni);
    const [searchError, setSearchError] = useState('');

    const handleTukarStasiun = () => {
        const temp = stasiunAsal;
        setStasiunAsal(stasiunTujuan);
        setStasiunTujuan(temp);
    };

    const handleCariTiket = (e) => {
        e.preventDefault();
        if (!stasiunAsal || !stasiunTujuan) {
            setSearchError('Silakan pilih stasiun asal dan tujuan.');
            return;
        }
        if (stasiunAsal === stasiunTujuan) {
            setSearchError('Stasiun asal dan tujuan tidak boleh sama.');
            return;
        }
        setSearchError('');
        router.get(route('schedules.search'), {
            asal: stasiunAsal,
            tujuan: stasiunTujuan,
            tanggal: tanggalKeberangkatan,
        });
    };

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(angka || 0);
    };

    const formatTanggalWaktu = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatJam = (dateString) => {
        if (!dateString) return '--:--';
        const date = new Date(dateString);
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const tanggalFormatLengkap = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const getStatusBadge = (status) => {
        const s = (status || '').toUpperCase();
        switch (s) {
            case 'CONFIRMED':
            case 'PAID':
            case 'LUNAS':
            case 'DIKONFIRMASI':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Terkonfirmasi
                    </span>
                );
            case 'PENDING':
            case 'WAITING_VERIFICATION':
            case 'MENUNGGU':
            case 'MENUNGGU_VERIFIKASI':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        Menunggu Verifikasi
                    </span>
                );
            case 'UNPAID':
            case 'BELUM_BAYAR':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                        Belum Dibayar
                    </span>
                );
            case 'CANCELLED':
            case 'REJECTED':
            case 'DIBATALKAN':
            case 'DITOLAK':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        Dibatalkan
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {status || 'Status'}
                    </span>
                );
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard — GoRail" />

            <div className="space-y-6">
                {/* ─── 1. TOP HEADER BANNER ─────────────────────────────── */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-8 shadow-sm border border-slate-700/50">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 right-1/4 -mb-10 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 font-extrabold text-xl shadow-inner shrink-0">
                                {user.name.charAt(0)}
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                                        Selamat Datang, {user.name}
                                    </h1>
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                        {isAdmin ? 'Administrator' : isStaff ? 'Staff Operasional' : 'Customer'}
                                    </span>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-300">
                                    {tanggalFormatLengkap} • Sistem Reservasi Tiket Kereta Api GoRail
                                </p>
                            </div>
                        </div>

                        {/* Fast CTA */}
                        <div className="flex items-center gap-2.5 self-start md:self-auto">
                            {isCustomer && (
                                <Link
                                    href={route('schedules.search')}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 active:scale-95 transition"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    Cari Jadwal Kereta
                                </Link>
                            )}
                            {(isStaff || isAdmin) && (
                                <Link
                                    href={route('staff.payments.index')}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 active:scale-95 transition"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Verifikasi Pembayaran
                                </Link>
                            )}
                            <Link
                                href={route('profile.edit')}
                                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl font-semibold text-xs bg-white/10 hover:bg-white/20 text-white backdrop-blur border border-white/15 transition"
                                title="Pengaturan Profil"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Profil
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ─── 2. KPI METRICS CARDS ─────────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {isAdmin && (
                        <>
                            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition group">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-500">Master Stasiun</span>
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="text-2xl font-black text-slate-900">{stats.total_stations || 0}</div>
                                    <Link href={route('admin.stations.index')} className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline mt-1 inline-flex items-center gap-1">
                                        Kelola Stasiun &rarr;
                                    </Link>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-teal-300 transition group">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-500">Armada Kereta</span>
                                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="text-2xl font-black text-slate-900">{stats.total_trains || 0}</div>
                                    <Link href={route('admin.trains.index')} className="text-[11px] font-bold text-teal-600 hover:text-teal-700 hover:underline mt-1 inline-flex items-center gap-1">
                                        Kelola Kereta &rarr;
                                    </Link>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-sky-300 transition group">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-500">Jadwal Aktif</span>
                                    <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="text-2xl font-black text-slate-900">{stats.total_schedules || 0}</div>
                                    <Link href={route('admin.schedules.index')} className="text-[11px] font-bold text-sky-600 hover:text-sky-700 hover:underline mt-1 inline-flex items-center gap-1">
                                        Atur Jadwal &rarr;
                                    </Link>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-rose-300 transition group">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-500">Perlu Verifikasi</span>
                                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="text-2xl font-black text-rose-600">{stats.pending_payments || 0}</div>
                                    <Link href={route('staff.payments.index')} className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline mt-1 inline-flex items-center gap-1">
                                        Periksa Bukti &rarr;
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}

                    {isStaff && (
                        <>
                            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-rose-300 transition group">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-500">Menunggu Verifikasi</span>
                                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="text-2xl font-black text-rose-600">{stats.pending_payments || 0}</div>
                                    <Link href={route('staff.payments.index')} className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline mt-1 inline-flex items-center gap-1">
                                        Verifikasi Pembayaran &rarr;
                                    </Link>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition group">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-500">Pembayaran Terverifikasi</span>
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="text-2xl font-black text-emerald-600">{stats.verified_payments || 0}</div>
                                    <span className="text-[11px] font-semibold text-slate-400 mt-1 inline-block">Status Lunas</span>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-sky-300 transition group">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-500">Jadwal Kereta</span>
                                    <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="text-2xl font-black text-slate-900">{stats.active_schedules || 0}</div>
                                    <Link href={route('schedules.search')} className="text-[11px] font-bold text-sky-600 hover:text-sky-700 hover:underline mt-1 inline-flex items-center gap-1">
                                        Lihat Rute Aktif &rarr;
                                    </Link>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-300 transition group">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-500">Laporan Transaksi</span>
                                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="text-xl font-bold text-slate-900">Format CSV</div>
                                    <a href={route('reports.bookings.export')} className="text-[11px] font-bold text-amber-600 hover:text-amber-700 hover:underline mt-1 inline-flex items-center gap-1">
                                        Unduh Laporan &rarr;
                                    </a>
                                </div>
                            </div>
                        </>
                    )}

                    {isCustomer && (
                        <>
                            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition group">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-500">Total Riwayat Pesanan</span>
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="text-2xl font-black text-slate-900">{stats.my_bookings || 0}</div>
                                    <Link href={route('bookings.index')} className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline mt-1 inline-flex items-center gap-1">
                                        Lihat Semua Pesanan &rarr;
                                    </Link>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-300 transition group">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-500">Menunggu Pembayaran</span>
                                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="text-2xl font-black text-amber-600">{stats.pending_bookings || 0}</div>
                                    <Link href={route('bookings.index')} className="text-[11px] font-bold text-amber-600 hover:text-amber-700 hover:underline mt-1 inline-flex items-center gap-1">
                                        Upload Bukti Bayar &rarr;
                                    </Link>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition group">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-500">Tiket Terkonfirmasi</span>
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="text-2xl font-black text-emerald-600">{stats.confirmed_bookings || 0}</div>
                                    <span className="text-[11px] font-semibold text-emerald-700 mt-1 inline-block">Siap Digunakan</span>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-teal-300 transition group">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-500">Pesan Tiket Baru</span>
                                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="text-lg font-bold text-slate-800">Cari Rute</div>
                                    <Link href={route('schedules.search')} className="text-[11px] font-bold text-teal-600 hover:text-teal-700 hover:underline mt-1 inline-flex items-center gap-1">
                                        Mulai Pencarian &rarr;
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* ─── 3. QUICK SEARCH WIDGET (For Customer) ───────────── */}
                {isCustomer && (
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900">Pencarian Tiket Cepat</h2>
                                    <p className="text-xs text-slate-500">Cari dan booking kursi perjalanan Anda hari ini</p>
                                </div>
                            </div>
                        </div>

                        {searchError && (
                            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
                                {searchError}
                            </div>
                        )}

                        <form onSubmit={handleCariTiket} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
                            {/* Stasiun Asal */}
                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                                    Stasiun Asal
                                </label>
                                <select
                                    value={stasiunAsal}
                                    onChange={(e) => setStasiunAsal(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition py-2.5"
                                    required
                                >
                                    <option value="" disabled>Pilih Asal</option>
                                    {daftarStasiun.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.nama_stasiun} ({s.kode_stasiun})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Stasiun Tujuan */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        Stasiun Tujuan
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleTukarStasiun}
                                        className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 hover:underline"
                                    >
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                        </svg>
                                        Tukar
                                    </button>
                                </div>
                                <select
                                    value={stasiunTujuan}
                                    onChange={(e) => setStasiunTujuan(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition py-2.5"
                                    required
                                >
                                    <option value="" disabled>Pilih Tujuan</option>
                                    {daftarStasiun.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.nama_stasiun} ({s.kode_stasiun})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Tanggal Keberangkatan */}
                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                                    Tanggal Berangkat
                                </label>
                                <input
                                    type="date"
                                    min={tanggalHariIni}
                                    value={tanggalKeberangkatan}
                                    onChange={(e) => setTanggalKeberangkatan(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition py-2.5"
                                    required
                                />
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    Cari Jadwal Sekarang
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* ─── 4. MAIN WORKSPACE (2 Columns Layout) ──────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Recent Bookings & Quick Actions (2 cols) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Recent Bookings Card */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold text-slate-900">
                                            {isCustomer ? 'Riwayat Reservasi Terbaru' : 'Transaksi & Booking Terbaru'}
                                        </h2>
                                        <p className="text-[11px] text-slate-500">Daftar transaksi terakhir dalam sistem</p>
                                    </div>
                                </div>

                                {isCustomer ? (
                                    <Link href={route('bookings.index')} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline">
                                        Lihat Semua &rarr;
                                    </Link>
                                ) : (
                                    <Link href={route('staff.payments.index')} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline">
                                        Verifikasi &rarr;
                                    </Link>
                                )}
                            </div>

                            {recentBookings && recentBookings.length > 0 ? (
                                <div className="divide-y divide-slate-100">
                                    {recentBookings.map((booking) => (
                                        <div key={booking.id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                                        {booking.kode_booking}
                                                    </span>
                                                    {getStatusBadge(booking.status)}
                                                    {booking.user && !isCustomer && (
                                                        <span className="text-xs text-slate-500 font-medium">
                                                            Pemesan: <strong>{booking.user.name}</strong>
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                                                    <span>{booking.schedule?.station_asal?.nama_stasiun || booking.schedule?.stationAsal?.nama_stasiun || 'Stasiun Asal'}</span>
                                                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                    </svg>
                                                    <span>{booking.schedule?.station_tujuan?.nama_stasiun || booking.schedule?.stationTujuan?.nama_stasiun || 'Stasiun Tujuan'}</span>
                                                </div>

                                                <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                                                    <span className="flex items-center gap-1 font-semibold text-emerald-700">
                                                        {booking.schedule?.train?.nama_kereta || 'GoRail Express'}
                                                    </span>
                                                    <span>•</span>
                                                    <span>Keberangkatan: {formatTanggalWaktu(booking.schedule?.waktu_berangkat)}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 self-end sm:self-center">
                                                {isCustomer && (
                                                    <Link
                                                        href={route('bookings.show', booking.id)}
                                                        className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
                                                    >
                                                        Detail
                                                    </Link>
                                                )}
                                                {booking.status === 'DIKONFIRMASI' && isCustomer && (
                                                    <Link
                                                        href={route('tickets.show', booking.id)}
                                                        className="px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs transition"
                                                    >
                                                        Tiket PDF
                                                    </Link>
                                                )}
                                                {(isStaff || isAdmin) && (
                                                    <Link
                                                        href={route('staff.payments.index')}
                                                        className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition"
                                                    >
                                                        Cek Bukti
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-800">Belum Ada Transaksi Booking</h3>
                                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                                        {isCustomer
                                            ? 'Anda belum memiliki riwayat reservasi. Temukan jadwal perjalanan yang Anda inginkan.'
                                            : 'Belum ada transaksi pemesanan yang tercatat.'}
                                    </p>
                                    {isCustomer && (
                                        <Link
                                            href={route('schedules.search')}
                                            className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm"
                                        >
                                            Cari Jadwal Kereta Sekarang
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Quick Shortcuts Grid */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                                Pintasan Menu & Navigasi Cepat
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {isCustomer && (
                                    <>
                                        <Link
                                            href={route('schedules.search')}
                                            className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition group"
                                        >
                                            <div className="font-bold text-xs text-slate-800 group-hover:text-emerald-700 flex items-center justify-between">
                                                <span>Cari Jadwal</span>
                                                <span>&rarr;</span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 mt-1">Cek jadwal & rute kereta</p>
                                        </Link>

                                        <Link
                                            href={route('bookings.index')}
                                            className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition group"
                                        >
                                            <div className="font-bold text-xs text-slate-800 group-hover:text-emerald-700 flex items-center justify-between">
                                                <span>Pesanan Saya</span>
                                                <span>&rarr;</span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 mt-1">Status tiket & bukti transfer</p>
                                        </Link>

                                        <Link
                                            href={route('home')}
                                            className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition group"
                                        >
                                            <div className="font-bold text-xs text-slate-800 group-hover:text-emerald-700 flex items-center justify-between">
                                                <span>Halaman Utama</span>
                                                <span>&rarr;</span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 mt-1">Informasi promo & panduan</p>
                                        </Link>
                                    </>
                                )}

                                {(isStaff || isAdmin) && (
                                    <>
                                        <Link
                                            href={route('staff.payments.index')}
                                            className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition group"
                                        >
                                            <div className="font-bold text-xs text-slate-800 group-hover:text-emerald-700 flex items-center justify-between">
                                                <span>Verifikasi Bayar</span>
                                                <span>&rarr;</span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 mt-1">Persetujuan bukti transfer</p>
                                        </Link>

                                        <a
                                            href={route('reports.bookings.export')}
                                            className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 transition group"
                                        >
                                            <div className="font-bold text-xs text-slate-800 group-hover:text-amber-700 flex items-center justify-between">
                                                <span>Ekspor Laporan</span>
                                                <span>&rarr;</span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 mt-1">Download CSV transaksi</p>
                                        </a>

                                        <Link
                                            href={route('schedules.search')}
                                            className="p-3.5 rounded-xl border border-slate-200 hover:border-sky-400 hover:bg-sky-50/40 transition group"
                                        >
                                            <div className="font-bold text-xs text-slate-800 group-hover:text-sky-700 flex items-center justify-between">
                                                <span>Jadwal Operasi</span>
                                                <span>&rarr;</span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 mt-1">Cek keterisian kursi</p>
                                        </Link>
                                    </>
                                )}

                                {isAdmin && (
                                    <>
                                        <Link
                                            href={route('admin.schedules.index')}
                                            className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition group"
                                        >
                                            <div className="font-bold text-xs text-slate-800 group-hover:text-emerald-700 flex items-center justify-between">
                                                <span>Kelola Jadwal</span>
                                                <span>&rarr;</span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 mt-1">Tambah & ubah jadwal kereta</p>
                                        </Link>

                                        <Link
                                            href={route('admin.stations.index')}
                                            className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition group"
                                        >
                                            <div className="font-bold text-xs text-slate-800 group-hover:text-emerald-700 flex items-center justify-between">
                                                <span>Kelola Stasiun</span>
                                                <span>&rarr;</span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 mt-1">Daftar stasiun & kota</p>
                                        </Link>

                                        <Link
                                            href={route('admin.users.index')}
                                            className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition group"
                                        >
                                            <div className="font-bold text-xs text-slate-800 group-hover:text-emerald-700 flex items-center justify-between">
                                                <span>Kelola Pengguna</span>
                                                <span>&rarr;</span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 mt-1">Manajemen akun & role</p>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Live Departure Board & Help Box (1 col) */}
                    <div className="space-y-6">
                        {/* Live Schedules Board */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold text-slate-900">Jadwal Keberangkatan</h2>
                                        <p className="text-[11px] text-slate-500">Rute kereta api aktif</p>
                                    </div>
                                </div>
                                <Link href={route('schedules.search')} className="text-xs font-bold text-emerald-600 hover:underline">
                                    Lainnya &rarr;
                                </Link>
                            </div>

                            <div className="divide-y divide-slate-100">
                                {upcomingSchedules && upcomingSchedules.length > 0 ? (
                                    upcomingSchedules.map((schedule) => (
                                        <div key={schedule.id} className="p-4 hover:bg-slate-50/80 transition">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-bold text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80">
                                                    {schedule.train?.nama_kereta || 'GoRail Express'}
                                                </span>
                                                <span className="font-extrabold text-xs text-slate-900">
                                                    {formatRupiah(schedule.harga)}
                                                </span>
                                            </div>

                                            <div className="text-xs font-semibold text-slate-800 flex items-center justify-between py-1">
                                                <span className="truncate">{schedule.station_asal?.nama_stasiun || schedule.stationAsal?.nama_stasiun}</span>
                                                <span className="text-emerald-500 font-bold px-1">&rarr;</span>
                                                <span className="truncate">{schedule.station_tujuan?.nama_stasiun || schedule.stationTujuan?.nama_stasiun}</span>
                                            </div>

                                            <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                                                <span>Jam: <strong className="text-slate-800">{formatJam(schedule.waktu_berangkat)} WIB</strong></span>
                                                {isCustomer ? (
                                                    <Link
                                                        href={route('schedules.show', schedule.id)}
                                                        className="text-emerald-600 font-bold hover:underline"
                                                    >
                                                        Pilih &rarr;
                                                    </Link>
                                                ) : (
                                                    <span className="text-slate-400 font-medium">Aktif</span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-6 text-center text-xs text-slate-500">
                                        Tidak ada jadwal keberangkatan aktif saat ini.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Demo Testing Credentials Card */}
                        <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-5 border border-slate-800 shadow-sm">
                            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Informasi Akun Pengujian
                            </h3>
                            <p className="text-xs text-slate-300 leading-relaxed mb-3">
                                Semua akun demo dapat diakses dengan kata sandi:{' '}
                                <strong className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-emerald-300 border border-white/10">
                                    Password123_
                                </strong>
                            </p>
                            <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                                <div className="flex justify-between py-1 border-b border-white/10">
                                    <span className="text-slate-400 font-sans">Admin:</span>
                                    <span className="text-emerald-300 font-bold">admin@gorail.test</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-white/10">
                                    <span className="text-slate-400 font-sans">Staff:</span>
                                    <span className="text-emerald-300 font-bold">staff@gorail.test</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-slate-400 font-sans">Customer:</span>
                                    <span className="text-emerald-300 font-bold">customer@gorail.test</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
