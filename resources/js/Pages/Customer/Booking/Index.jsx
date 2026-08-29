import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function BookingIndex({ bookings }) {
    const daftarBooking = bookings?.data || [];
    const paginasi = bookings?.meta || bookings || {};

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(angka || 0);
    };

    const formatTanggal = (dateString) => {
        if (!dateString) return '-';
        const tanggal = new Date(dateString);
        return tanggal.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const formatJam = (dateString) => {
        if (!dateString) return '--:--';
        const tanggal = new Date(dateString);
        return tanggal.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusBookingBadge = (status) => {
        const s = (status || '').toUpperCase();
        switch (s) {
            case 'CONFIRMED':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Dikonfirmasi
                    </span>
                );
            case 'PENDING':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        Menunggu
                    </span>
                );
            case 'CANCELLED':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        Dibatalkan
                    </span>
                );
            case 'COMPLETED':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                        Selesai
                    </span>
                );
            default:
                return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">{status}</span>;
        }
    };

    const getStatusPembayaranBadge = (status) => {
        const s = (status || '').toUpperCase();
        switch (s) {
            case 'PAID':
                return <span className="text-xs font-bold text-emerald-600">Lunas</span>;
            case 'WAITING_VERIFICATION':
                return <span className="text-xs font-bold text-amber-600">Menunggu Verifikasi</span>;
            case 'UNPAID':
                return <span className="text-xs font-bold text-sky-600">Belum Bayar</span>;
            case 'REJECTED':
                return <span className="text-xs font-bold text-rose-600">Ditolak</span>;
            default:
                return <span className="text-xs font-medium text-slate-500">{status || '-'}</span>;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Pesanan Saya — GoRail" />

            <div className="space-y-6">
                {/* ─── HEADER ─────────────────────────────── */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-8 shadow-sm border border-slate-700/50">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-1">Pesanan Saya</h1>
                            <p className="text-sm text-slate-300">Kelola seluruh booking dan tiket kereta Anda.</p>
                        </div>
                        <Link
                            href={route('schedules.search')}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 active:scale-95 transition"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                            Booking Baru
                        </Link>
                    </div>
                </div>

                {/* ─── DAFTAR BOOKING ─────────────────────── */}
                {daftarBooking.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        </div>
                        <h3 className="text-base font-bold text-slate-700 mb-1">Belum Ada Pesanan</h3>
                        <p className="text-sm text-slate-500 mb-4">Anda belum membuat booking. Mulai cari jadwal kereta untuk memesan tiket.</p>
                        <Link
                            href={route('schedules.search')}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition"
                        >
                            Cari Jadwal Kereta
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {daftarBooking.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-200/60 transition-all duration-200">
                                <div className="p-5">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                                                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{booking.kode_booking}</p>
                                                <p className="text-xs text-slate-500">{formatTanggal(booking.created_at)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getStatusBookingBadge(booking.status)}
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 pt-3">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-slate-700">
                                                <span className="font-medium">{booking.schedule?.station_asal?.nama_stasiun}</span>
                                                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                                <span className="font-medium">{booking.schedule?.station_tujuan?.nama_stasiun}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                                <span>{booking.schedule?.train?.nama_kereta}</span>
                                                <span>•</span>
                                                <span>{formatTanggal(booking.tanggal_berangkat)}</span>
                                                <span>•</span>
                                                <span>{formatJam(booking.schedule?.waktu_berangkat)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-slate-500">Pembayaran:</span>
                                                {getStatusPembayaranBadge(booking.payment?.status)}
                                                {booking.payment?.jumlah && (
                                                    <span className="text-xs font-bold text-slate-700 ml-1">{formatRupiah(booking.payment.jumlah)}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <Link
                                                href={route('bookings.show', booking.id)}
                                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
                                            >
                                                Detail
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                            </Link>
                                            {booking.status === 'CONFIRMED' && booking.payment?.status === 'PAID' && (
                                                <Link
                                                    href={route('tickets.show', booking.id)}
                                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                                                    E-Ticket
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ─── PAGINATION ─────────────────────────── */}
                {paginasi.links && paginasi.links.length > 3 && (
                    <div className="flex items-center justify-center gap-1">
                        {paginasi.links.map((link, indeks) => (
                            <Link
                                key={indeks}
                                href={link.url || '#'}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition
                                    ${link.active
                                        ? 'bg-emerald-600 text-white shadow-sm'
                                        : link.url
                                            ? 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                            : 'text-slate-400 cursor-not-allowed'
                                    }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                preserveState
                            />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
