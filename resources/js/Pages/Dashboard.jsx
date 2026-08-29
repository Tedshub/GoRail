import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    Calendar,
    Clock,
    ArrowRight,
    CheckCircle2,
    AlertCircle,
    XCircle,
    ChevronRight,
    Train,
    Users,
    CreditCard,
    Ticket,
    Shield,
    Sparkles,
    Search,
    ArrowRightLeft,
    FileText,
    Settings,
    MapPin
} from 'lucide-react';

const getTanggalHariIni = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function Dashboard({ stats = {}, recentBookings = [], upcomingSchedules = [], stations = [] }) {
    const user = usePage().props.auth.user;
    const roles = user?.roles || [];
    const isAdmin = roles.includes('admin');
    const isStaff = roles.includes('staff');
    const isCustomer = roles.includes('customer') || (!isAdmin && !isStaff);

    const daftarStasiun = stations?.data || stations || [];
    const tanggalHariIni = getTanggalHariIni();

    // State untuk tab menu khusus Customer
    const [customerTab, setCustomerTab] = useState('jadwal'); // 'jadwal' | 'reservasi'

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

    const formatTanggal = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
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

    // Component: Card Riwayat Reservasi / Transaksi
    const CardRecentBookings = () => (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Ticket className="w-4 h-4" />
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
                                    <ArrowRight className="w-4 h-4 text-emerald-600" />
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
                        <Ticket className="w-6 h-6" />
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
    );

    // Component: Card Pintasan Menu & Navigasi Cepat
    const CardQuickShortcuts = () => (
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
                                <span className="flex items-center gap-1.5">
                                    <Search className="w-3.5 h-3.5 text-emerald-600" />
                                    Cari Jadwal
                                </span>
                                <span>&rarr;</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1">Cek jadwal & rute kereta</p>
                        </Link>

                        <Link
                            href={route('bookings.index')}
                            className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition group"
                        >
                            <div className="font-bold text-xs text-slate-800 group-hover:text-emerald-700 flex items-center justify-between">
                                <span className="flex items-center gap-1.5">
                                    <Ticket className="w-3.5 h-3.5 text-emerald-600" />
                                    Pesanan Saya
                                </span>
                                <span>&rarr;</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1">Status tiket & bukti transfer</p>
                        </Link>

                        <Link
                            href={route('home')}
                            className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition group"
                        >
                            <div className="font-bold text-xs text-slate-800 group-hover:text-emerald-700 flex items-center justify-between">
                                <span className="flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                                    Halaman Utama
                                </span>
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
    );

    // Component: Card Jadwal Keberangkatan Aktif
    const CardUpcomingSchedules = () => (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                        <Train className="w-4 h-4" />
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
                    upcomingSchedules.map((schedule) => {
                        const tanggalJadwal = schedule.waktu_berangkat ? String(schedule.waktu_berangkat).split(' ')[0] : '';
                        const hargaMulai = schedule.harga_ekonomi || schedule.harga;

                        return (
                            <div key={schedule.id} className="p-4 hover:bg-slate-50/80 transition">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-bold text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80">
                                        {schedule.train?.nama_kereta || 'GoRail Express'}
                                    </span>
                                    <span className="font-extrabold text-xs text-emerald-700">
                                        {formatRupiah(hargaMulai)}
                                    </span>
                                </div>

                                <div className="text-xs font-semibold text-slate-800 flex items-center justify-between py-1">
                                    <span className="truncate">{schedule.station_asal?.nama_stasiun || schedule.stationAsal?.nama_stasiun}</span>
                                    <span className="text-emerald-500 font-bold px-1">&rarr;</span>
                                    <span className="truncate">{schedule.station_tujuan?.nama_stasiun || schedule.stationTujuan?.nama_stasiun}</span>
                                </div>

                                {/* Keterangan Tanggal & Jam */}
                                <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                                            <Calendar className="w-3 h-3 text-emerald-600 shrink-0" />
                                            {formatTanggal(schedule.waktu_berangkat)}
                                        </span>
                                        <span className="text-slate-300">•</span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                                            {formatJam(schedule.waktu_berangkat)} WIB
                                        </span>
                                    </div>

                                    {isCustomer ? (
                                        <Link
                                            href={route('schedules.show', { schedule: schedule.id, tanggal: tanggalJadwal })}
                                            className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline inline-flex items-center gap-0.5"
                                        >
                                            Pilih <ArrowRight className="w-3 h-3" />
                                        </Link>
                                    ) : (
                                        <span className="text-emerald-600 font-bold text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded">Aktif</span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="p-6 text-center text-xs text-slate-500">
                        Tidak ada jadwal keberangkatan aktif saat ini.
                    </div>
                )}
            </div>
        </div>
    );

    // Component: Card Pencarian Tiket Cepat (Customer)
    const CardQuickSearch = () => (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Search className="w-4 h-4" />
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
                            <ArrowRightLeft className="w-3 h-3" />
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
                        <Search className="w-4 h-4" />
                        Cari Jadwal Sekarang
                    </button>
                </div>
            </form>
        </div>
    );

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard — GoRail" />

            <div className="space-y-6">
                {/* ─── 1. TOP HEADER BANNER ─────────────────────────────── */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-5 sm:p-8 shadow-sm border border-slate-700/50">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 right-1/4 -mb-10 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                        <div className="flex items-start gap-3.5 sm:gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 font-extrabold text-lg sm:text-xl shadow-inner shrink-0">
                                {user.name.charAt(0)}
                            </div>
                            <div className="space-y-0.5 sm:space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white">
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
                                    className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 active:scale-95 transition"
                                >
                                    <Search className="w-3.5 h-3.5" />
                                    Cari Jadwal
                                </Link>
                            )}
                            {(isStaff || isAdmin) && (
                                <Link
                                    href={route('staff.payments.index')}
                                    className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 active:scale-95 transition"
                                >
                                    <CreditCard className="w-3.5 h-3.5" />
                                    Verifikasi Pembayaran
                                </Link>
                            )}
                            <Link
                                href={route('profile.edit')}
                                className="inline-flex items-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-xl font-semibold text-xs bg-white/10 hover:bg-white/20 text-white backdrop-blur border border-white/15 transition"
                                title="Pengaturan Profil"
                            >
                                <Settings className="w-3.5 h-3.5" />
                                Profil
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ─── 2. KPI METRICS SUMMARY CARDS (2 Cols & 2 Rows on Mobile) ─────────── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {isAdmin && (
                        <>
                            <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition group flex flex-col justify-between">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] sm:text-xs font-semibold text-slate-500">Master Stasiun</span>
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
                                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                </div>
                                <div className="mt-2 sm:mt-3">
                                    <div className="text-xl sm:text-2xl font-black text-slate-900">{stats.total_stations || 0}</div>
                                    <Link href={route('admin.stations.index')} className="text-[10px] sm:text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline mt-1 inline-flex items-center gap-1">
                                        Kelola Stasiun &rarr;
                                    </Link>
                                </div>
                            </div>

                            <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-teal-300 transition group flex flex-col justify-between">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] sm:text-xs font-semibold text-slate-500">Armada Kereta</span>
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition">
                                        <Train className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                </div>
                                <div className="mt-2 sm:mt-3">
                                    <div className="text-xl sm:text-2xl font-black text-slate-900">{stats.total_trains || 0}</div>
                                    <Link href={route('admin.trains.index')} className="text-[10px] sm:text-[11px] font-bold text-teal-600 hover:text-teal-700 hover:underline mt-1 inline-flex items-center gap-1">
                                        Kelola Kereta &rarr;
                                    </Link>
                                </div>
                            </div>

                            <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-sky-300 transition group flex flex-col justify-between">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] sm:text-xs font-semibold text-slate-500">Jadwal Aktif</span>
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition">
                                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                </div>
                                <div className="mt-2 sm:mt-3">
                                    <div className="text-xl sm:text-2xl font-black text-slate-900">{stats.total_schedules || 0}</div>
                                    <Link href={route('admin.schedules.index')} className="text-[10px] sm:text-[11px] font-bold text-sky-600 hover:text-sky-700 hover:underline mt-1 inline-flex items-center gap-1">
                                        Atur Jadwal &rarr;
                                    </Link>
                                </div>
                            </div>

                            <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-rose-300 transition group flex flex-col justify-between">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] sm:text-xs font-semibold text-slate-500">Perlu Verifikasi</span>
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition">
                                        <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                </div>
                                <div className="mt-2 sm:mt-3">
                                    <div className="text-xl sm:text-2xl font-black text-rose-600">{stats.pending_payments || 0}</div>
                                    <Link href={route('staff.payments.index')} className="text-[10px] sm:text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline mt-1 inline-flex items-center gap-1">
                                        Periksa Bukti &rarr;
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}

                    {isStaff && (
                        <>
                            <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-rose-300 transition group flex flex-col justify-between">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] sm:text-xs font-semibold text-slate-500">Menunggu Verifikasi</span>
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition">
                                        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                </div>
                                <div className="mt-2 sm:mt-3">
                                    <div className="text-xl sm:text-2xl font-black text-rose-600">{stats.pending_payments || 0}</div>
                                    <Link href={route('staff.payments.index')} className="text-[10px] sm:text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline mt-1 inline-flex items-center gap-1">
                                        Verifikasi Pembayaran &rarr;
                                    </Link>
                                </div>
                            </div>

                            <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition group flex flex-col justify-between">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] sm:text-xs font-semibold text-slate-500">Pembayaran Terverifikasi</span>
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
                                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                </div>
                                <div className="mt-2 sm:mt-3">
                                    <div className="text-xl sm:text-2xl font-black text-emerald-600">{stats.verified_payments || 0}</div>
                                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 mt-1 inline-block">Status Lunas</span>
                                </div>
                            </div>

                            <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-sky-300 transition group flex flex-col justify-between">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] sm:text-xs font-semibold text-slate-500">Jadwal Kereta</span>
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition">
                                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                </div>
                                <div className="mt-2 sm:mt-3">
                                    <div className="text-xl sm:text-2xl font-black text-slate-900">{stats.active_schedules || 0}</div>
                                    <Link href={route('schedules.search')} className="text-[10px] sm:text-[11px] font-bold text-sky-600 hover:text-sky-700 hover:underline mt-1 inline-flex items-center gap-1">
                                        Lihat Rute Aktif &rarr;
                                    </Link>
                                </div>
                            </div>

                            <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-300 transition group flex flex-col justify-between">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] sm:text-xs font-semibold text-slate-500">Laporan Transaksi</span>
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition">
                                        <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                </div>
                                <div className="mt-2 sm:mt-3">
                                    <div className="text-base sm:text-xl font-bold text-slate-900">Format CSV</div>
                                    <a href={route('reports.bookings.export')} className="text-[10px] sm:text-[11px] font-bold text-amber-600 hover:text-amber-700 hover:underline mt-1 inline-flex items-center gap-1">
                                        Unduh Laporan &rarr;
                                    </a>
                                </div>
                            </div>
                        </>
                    )}

                    {isCustomer && (
                        <>
                            <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition group flex flex-col justify-between">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] sm:text-xs font-semibold text-slate-500">Total Riwayat Pesanan</span>
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
                                        <Ticket className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                </div>
                                <div className="mt-2 sm:mt-3">
                                    <div className="text-xl sm:text-2xl font-black text-slate-900">{stats.my_bookings || 0}</div>
                                    <Link href={route('bookings.index')} className="text-[10px] sm:text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline mt-1 inline-flex items-center gap-1">
                                        Lihat Semua Pesanan &rarr;
                                    </Link>
                                </div>
                            </div>

                            <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-300 transition group flex flex-col justify-between">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] sm:text-xs font-semibold text-slate-500">Menunggu Pembayaran</span>
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition">
                                        <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                </div>
                                <div className="mt-2 sm:mt-3">
                                    <div className="text-xl sm:text-2xl font-black text-amber-600">{stats.pending_bookings || 0}</div>
                                    <Link href={route('bookings.index')} className="text-[10px] sm:text-[11px] font-bold text-amber-600 hover:text-amber-700 hover:underline mt-1 inline-flex items-center gap-1">
                                        Upload Bukti Bayar &rarr;
                                    </Link>
                                </div>
                            </div>

                            <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition group flex flex-col justify-between">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] sm:text-xs font-semibold text-slate-500">Tiket Terkonfirmasi</span>
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
                                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                </div>
                                <div className="mt-2 sm:mt-3">
                                    <div className="text-xl sm:text-2xl font-black text-emerald-600">{stats.confirmed_bookings || 0}</div>
                                    <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-700 mt-1 inline-block">Siap Digunakan</span>
                                </div>
                            </div>

                            <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-teal-300 transition group flex flex-col justify-between">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] sm:text-xs font-semibold text-slate-500">Pesan Tiket Baru</span>
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition">
                                        <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                </div>
                                <div className="mt-2 sm:mt-3">
                                    <div className="text-base sm:text-lg font-bold text-slate-800">Cari Rute</div>
                                    <Link href={route('schedules.search')} className="text-[10px] sm:text-[11px] font-bold text-teal-600 hover:text-teal-700 hover:underline mt-1 inline-flex items-center gap-1">
                                        Mulai Pencarian &rarr;
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* ─── 3. WORKSPACE FOR CUSTOMER (2 Tab Menus: Jadwal Aktif vs Reservasi) ─── */}
                {isCustomer && (
                    <div className="space-y-5">
                        {/* Tab Menu Selector */}
                        <div className="flex items-center gap-2 p-1.5 bg-slate-200/70 backdrop-blur rounded-2xl w-full sm:w-auto self-start border border-slate-300/60">
                            <button
                                type="button"
                                onClick={() => setCustomerTab('jadwal')}
                                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                                    customerTab === 'jadwal'
                                        ? 'bg-white text-emerald-700 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                                }`}
                            >
                                <Calendar className="w-4 h-4" />
                                Jadwal Aktif
                            </button>
                            <button
                                type="button"
                                onClick={() => setCustomerTab('reservasi')}
                                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                                    customerTab === 'reservasi'
                                        ? 'bg-white text-emerald-700 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                                }`}
                            >
                                <Ticket className="w-4 h-4" />
                                Reservasi
                            </button>
                        </div>

                        {/* Tab Content 1: Jadwal Aktif */}
                        {customerTab === 'jadwal' && (
                            <div className="space-y-6">
                                <CardUpcomingSchedules />
                                <CardQuickShortcuts />
                            </div>
                        )}

                        {/* Tab Content 2: Reservasi */}
                        {customerTab === 'reservasi' && (
                            <div className="space-y-6">
                                <CardQuickSearch />
                                <CardRecentBookings />
                            </div>
                        )}
                    </div>
                )}

                {/* ─── 4. WORKSPACE FOR ADMIN & STAFF (2 Columns Grid) ───── */}
                {!isCustomer && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column: Recent Bookings & Quick Actions (2 cols) */}
                        <div className="lg:col-span-2 space-y-6">
                            <CardRecentBookings />
                            <CardQuickShortcuts />
                        </div>

                        {/* Right Column: Live Departure Board (1 col) */}
                        <div className="space-y-6">
                            <CardUpcomingSchedules />
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
