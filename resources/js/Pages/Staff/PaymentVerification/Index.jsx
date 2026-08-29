import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import { Head, router, usePage, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { CheckCircle2, XCircle, Eye, Download, ExternalLink, Calendar, Clock, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';

export default function PaymentVerificationIndex({ payments }) {
    const { flash } = usePage().props;
    const daftarPembayaran = payments?.data || [];
    const meta = payments?.meta || payments || {};

    const [tabAktif, setTabAktif] = useState('BELUM_BAYAR'); // 'BELUM_BAYAR' | 'LUNAS'
    const [modalBuktiTerbuka, setModalBuktiTerbuka] = useState(false);
    const [pembayaranTerpilih, setPembayaranTerpilih] = useState(null);
    const [modalAksiTerbuka, setModalAksiTerbuka] = useState(false);
    const [tipeAksi, setTipeAksi] = useState('verifikasi'); // 'verifikasi' | 'tolak'
    const [sedangMemproses, setSedangMemproses] = useState(false);

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(angka || 0);
    };

    const formatTanggal = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatTanggalOnly = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const getBuktiUrl = (id) => {
        if (!id) return '#';
        try {
            return route('payments.bukti', id);
        } catch {
            return `/payments/${id}/bukti`;
        }
    };

    const getExportUrl = () => {
        try {
            return route('reports.bookings.export');
        } catch {
            return '/reports/bookings/export';
        }
    };

    const getStatusPembayaranBadge = (status) => {
        const s = (status || '').toUpperCase();
        switch (s) {
            case 'PAID':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Lunas
                    </span>
                );
            case 'WAITING_VERIFICATION':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        Menunggu Verifikasi
                    </span>
                );
            case 'UNPAID':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                        Belum Dibayar
                    </span>
                );
            case 'REJECTED':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        Ditolak
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {status}
                    </span>
                );
        }
    };

    // Filter data berdasarkan tab aktif
    const daftarBelumBayar = useMemo(() => {
        return daftarPembayaran.filter((p) => (p?.status || '').toUpperCase() !== 'PAID');
    }, [daftarPembayaran]);

    const daftarLunas = useMemo(() => {
        return daftarPembayaran.filter((p) => (p?.status || '').toUpperCase() === 'PAID');
    }, [daftarPembayaran]);

    const jumlahMenungguVerifikasi = useMemo(() => {
        return daftarPembayaran.filter((p) => (p?.status || '').toUpperCase() === 'WAITING_VERIFICATION').length;
    }, [daftarPembayaran]);

    const daftarTampil = tabAktif === 'LUNAS' ? daftarLunas : daftarBelumBayar;

    const handleBukaModalAksi = (pembayaran, aksi) => {
        setPembayaranTerpilih(pembayaran);
        setTipeAksi(aksi);
        setModalAksiTerbuka(true);
    };

    const handleEksekusiAksi = () => {
        if (!pembayaranTerpilih) return;
        setSedangMemproses(true);

        router.post(
            route('staff.payments.verify', pembayaranTerpilih.id),
            { aksi: tipeAksi },
            {
                onFinish: () => {
                    setSedangMemproses(false);
                    setModalAksiTerbuka(false);
                    setPembayaranTerpilih(null);
                },
            }
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Verifikasi Pembayaran - Staff GoRail" />

            <div className="space-y-6">
                {/* ─── Header & Export ─── */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-8 shadow-sm border border-slate-700/50">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Verifikasi Pembayaran</h1>
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                    Staff Desk
                                </span>
                            </div>
                            <p className="text-sm text-slate-300 mt-1">
                                Periksa bukti transfer pelanggan dan validasi transaksi tiket kereta api.
                            </p>
                        </div>

                        <a
                            href={getExportUrl()}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xs transition active:scale-95 self-start sm:self-auto"
                        >
                            <Download className="w-4 h-4 text-emerald-400" />
                            Ekspor CSV
                        </a>
                    </div>
                </div>

                {/* ─── Flash Alert ─── */}
                {flash?.sukses && (
                    <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 shadow-xs">
                        <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                        <span className="font-semibold">{flash.sukses}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="flex items-center gap-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 shadow-xs">
                        <XCircle className="w-5 h-5 shrink-0 text-rose-500" />
                        <span className="font-semibold">{flash.error}</span>
                    </div>
                )}

                {/* ─── TAB NAVIGATION MENU ─── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
                    <div className="flex items-center gap-2">
                        {/* Tab Belum Bayar */}
                        <button
                            type="button"
                            onClick={() => setTabAktif('BELUM_BAYAR')}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                tabAktif === 'BELUM_BAYAR'
                                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                        >
                            <Clock className="w-4 h-4" />
                            <span>Belum Bayar & Menunggu</span>
                            <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                                    tabAktif === 'BELUM_BAYAR'
                                        ? 'bg-emerald-700/80 text-white'
                                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                                }`}
                            >
                                {daftarBelumBayar.length}
                            </span>
                            {jumlahMenungguVerifikasi > 0 && (
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                </span>
                            )}
                        </button>

                        {/* Tab Lunas */}
                        <button
                            type="button"
                            onClick={() => setTabAktif('LUNAS')}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                tabAktif === 'LUNAS'
                                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Lunas (Terkonfirmasi)</span>
                            <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                                    tabAktif === 'LUNAS'
                                        ? 'bg-emerald-700/80 text-white'
                                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                                }`}
                            >
                                {daftarLunas.length}
                            </span>
                        </button>
                    </div>

                    <div className="text-xs text-slate-500 px-3 py-1 font-medium">
                        Menampilkan <strong className="text-slate-800">{daftarTampil.length}</strong> transaksi{' '}
                        {tabAktif === 'LUNAS' ? 'Lunas' : 'Belum Lunas / Menunggu'}
                    </div>
                </div>

                {/* ─── Table Card ─── */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                    {/* ─── Mobile View (Cards) ─── */}
                    <div className="md:hidden divide-y divide-slate-100">
                        {daftarTampil.length === 0 ? (
                            <div className="py-12 px-4 text-center text-slate-400">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    {tabAktif === 'LUNAS' ? (
                                        <CheckCircle2 className="w-8 h-8 text-slate-300" />
                                    ) : (
                                        <Clock className="w-8 h-8 text-slate-300" />
                                    )}
                                    <p className="text-sm font-semibold text-slate-600">
                                        {tabAktif === 'LUNAS'
                                            ? 'Belum ada transaksi pembayaran berstatus Lunas.'
                                            : 'Tidak ada pembayaran yang berstatus Belum Bayar atau Menunggu Verifikasi.'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            daftarTampil.map((p) => {
                                const booking = p?.booking || {};
                                const schedule = booking?.schedule || {};
                                const isWaiting = p?.status === 'WAITING_VERIFICATION';

                                const namaStasiunAsal = schedule?.station_asal?.nama_stasiun || schedule?.stationAsal?.nama_stasiun || '-';
                                const namaStasiunTujuan = schedule?.station_tujuan?.nama_stasiun || schedule?.stationTujuan?.nama_stasiun || '-';
                                const namaKereta = schedule?.train?.nama_kereta || '-';
                                const tanggalBerangkat = booking?.tanggal_berangkat ? formatTanggalOnly(booking.tanggal_berangkat) : '';

                                return (
                                    <div key={p.id} className="p-4 space-y-3 hover:bg-slate-50/50 transition">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                                                {booking.kode_booking || `ID #${p.booking_id}`}
                                            </span>
                                            <div>{getStatusPembayaranBadge(p.status)}</div>
                                        </div>

                                        <div className="flex items-start justify-between gap-2 pt-1 border-t border-slate-100">
                                            <div>
                                                <p className="text-[11px] font-bold text-slate-400 uppercase">Pelanggan</p>
                                                <p className="text-sm font-bold text-slate-800">{booking.user?.name || '-'}</p>
                                                <p className="text-xs text-slate-400">{booking.user?.email || ''}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[11px] font-bold text-slate-400 uppercase">Nominal</p>
                                                <p className="text-sm font-black text-emerald-700">{formatRupiah(p.jumlah)}</p>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 rounded-xl p-2.5 text-xs text-slate-700 space-y-1 border border-slate-100">
                                            <div className="flex items-center gap-1.5 font-bold text-slate-900">
                                                <span>{namaStasiunAsal}</span>
                                                <span className="text-slate-400">→</span>
                                                <span>{namaStasiunTujuan}</span>
                                            </div>
                                            <p className="text-[11px] text-slate-500">
                                                {namaKereta} {tanggalBerangkat ? `• ${tanggalBerangkat}` : ''}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                                            <div>
                                                {p.has_bukti ? (
                                                    <button
                                                        onClick={() => {
                                                            setPembayaranTerpilih(p);
                                                            setModalBuktiTerbuka(true);
                                                        }}
                                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        Bukti Bayar
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">Belum ada bukti</span>
                                                )}
                                            </div>

                                            <div>
                                                {isWaiting ? (
                                                    <div className="inline-flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleBukaModalAksi(p, 'verifikasi')}
                                                            className="px-3 py-1.5 rounded-lg font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition active:scale-95"
                                                        >
                                                            Verifikasi
                                                        </button>
                                                        <button
                                                            onClick={() => handleBukaModalAksi(p, 'tolak')}
                                                            className="px-3 py-1.5 rounded-lg font-bold text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition active:scale-95"
                                                        >
                                                            Tolak
                                                        </button>
                                                    </div>
                                                ) : p.verifier ? (
                                                    <div className="text-right text-[11px] text-slate-500">
                                                        <span>Verifikator: <strong>{p.verifier.name}</strong></span>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* ─── Desktop Table View ─── */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <th className="py-4 px-5">Kode Booking</th>
                                    <th className="py-4 px-5">Pelanggan</th>
                                    <th className="py-4 px-5">Perjalanan</th>
                                    <th className="py-4 px-5">Nominal</th>
                                    <th className="py-4 px-5">Bukti Transfer</th>
                                    <th className="py-4 px-5">Status</th>
                                    <th className="py-4 px-5">Verifikator</th>
                                    <th className="py-4 px-5 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {daftarTampil.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-slate-400">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                {tabAktif === 'LUNAS' ? (
                                                    <CheckCircle2 className="w-8 h-8 text-slate-300" />
                                                ) : (
                                                    <Clock className="w-8 h-8 text-slate-300" />
                                                )}
                                                <p className="text-sm font-semibold text-slate-600">
                                                    {tabAktif === 'LUNAS'
                                                        ? 'Belum ada transaksi pembayaran berstatus Lunas.'
                                                        : 'Tidak ada pembayaran yang berstatus Belum Bayar atau Menunggu Verifikasi.'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    daftarTampil.map((p) => {
                                        const booking = p?.booking || {};
                                        const schedule = booking?.schedule || {};
                                        const isWaiting = p?.status === 'WAITING_VERIFICATION';

                                        const namaStasiunAsal = schedule?.station_asal?.nama_stasiun || schedule?.stationAsal?.nama_stasiun || '-';
                                        const namaStasiunTujuan = schedule?.station_tujuan?.nama_stasiun || schedule?.stationTujuan?.nama_stasiun || '-';
                                        const namaKereta = schedule?.train?.nama_kereta || '-';
                                        const tanggalBerangkat = booking?.tanggal_berangkat ? formatTanggalOnly(booking.tanggal_berangkat) : '';

                                        return (
                                            <tr key={p.id} className="hover:bg-slate-50/60 transition">
                                                <td className="py-4 px-5">
                                                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                                                        {booking.kode_booking || `ID #${p.booking_id}`}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-5">
                                                    <p className="font-bold text-slate-800">{booking.user?.name || '-'}</p>
                                                    <p className="text-xs text-slate-400">{booking.user?.email || ''}</p>
                                                </td>
                                                <td className="py-4 px-5">
                                                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                                                        <span>{namaStasiunAsal}</span>
                                                        <span className="text-slate-400">→</span>
                                                        <span>{namaStasiunTujuan}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-400 mt-0.5">
                                                        {namaKereta} {tanggalBerangkat ? `• ${tanggalBerangkat}` : ''}
                                                    </p>
                                                </td>
                                                <td className="py-4 px-5 font-bold text-emerald-700">
                                                    {formatRupiah(p.jumlah)}
                                                </td>
                                                <td className="py-4 px-5">
                                                    {p.has_bukti ? (
                                                        <button
                                                            onClick={() => {
                                                                setPembayaranTerpilih(p);
                                                                setModalBuktiTerbuka(true);
                                                            }}
                                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition"
                                                        >
                                                            <Eye className="w-3.5 h-3.5" />
                                                            Lihat Bukti
                                                        </button>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">Belum diunggah</span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-5">
                                                    {getStatusPembayaranBadge(p.status)}
                                                </td>
                                                <td className="py-4 px-5">
                                                    {p.verifier ? (
                                                        <div>
                                                            <p className="text-xs font-bold text-slate-700">{p.verifier.name}</p>
                                                            <p className="text-[11px] text-slate-400">{formatTanggal(p.waktu_verifikasi)}</p>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-slate-400">-</span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-5 text-right">
                                                    {isWaiting ? (
                                                        <div className="inline-flex items-center gap-2">
                                                            <button
                                                                onClick={() => handleBukaModalAksi(p, 'verifikasi')}
                                                                className="px-3 py-1.5 rounded-lg font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition active:scale-95"
                                                            >
                                                                Verifikasi
                                                            </button>
                                                            <button
                                                                onClick={() => handleBukaModalAksi(p, 'tolak')}
                                                                className="px-3 py-1.5 rounded-lg font-bold text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition active:scale-95"
                                                            >
                                                                Tolak
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 font-medium italic">
                                                            {p.status === 'PAID' ? 'Terverifikasi' : 'Selesai'}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {meta.links && meta.links.length > 3 && (
                        <div className="p-4 border-t border-slate-100 flex items-center justify-center gap-1">
                            {meta.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                                        link.active
                                            ? 'bg-emerald-600 text-white shadow-xs'
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
            </div>

            {/* ─── Modal Lihat Bukti Pembayaran ─── */}
            <Modal show={modalBuktiTerbuka} onClose={() => setModalBuktiTerbuka(false)} maxWidth="lg">
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Bukti Pembayaran</h3>
                            <p className="text-xs text-slate-500">
                                Booking: <span className="font-mono font-bold text-slate-800">{pembayaranTerpilih?.booking?.kode_booking || ''}</span>
                                {pembayaranTerpilih?.booking?.user?.name ? ` • ${pembayaranTerpilih.booking.user.name}` : ''}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setModalBuktiTerbuka(false)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                        >
                            <XCircle className="w-5 h-5" />
                        </button>
                    </div>

                    {pembayaranTerpilih && (
                        <div className="space-y-4">
                            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center min-h-[260px] max-h-[460px]">
                                <img
                                    src={getBuktiUrl(pembayaranTerpilih.id)}
                                    alt="Bukti Transfer"
                                    className="max-h-[450px] w-auto object-contain mx-auto"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '';
                                        e.target.parentElement.innerHTML = '<p class="text-xs text-slate-400 p-8">Gagal memuat gambar bukti transfer.</p>';
                                    }}
                                />
                            </div>

                            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
                                <div>
                                    <span className="text-slate-500">Total Tagihan: </span>
                                    <span className="font-bold text-slate-900">{formatRupiah(pembayaranTerpilih.jumlah)}</span>
                                </div>
                                <a
                                    href={getBuktiUrl(pembayaranTerpilih.id)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 font-bold text-emerald-600 hover:underline"
                                >
                                    Buka Gambar Ukuran Penuh <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>

            {/* ─── Modal Konfirmasi Verifikasi / Tolak ─── */}
            <Modal show={modalAksiTerbuka} onClose={() => !sedangMemproses && setModalAksiTerbuka(false)} maxWidth="md">
                <div className="p-6 space-y-4 text-center">
                    <div className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center ${
                        tipeAksi === 'verifikasi' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                    }`}>
                        {tipeAksi === 'verifikasi' ? (
                            <CheckCircle2 className="w-6 h-6" />
                        ) : (
                            <XCircle className="w-6 h-6" />
                        )}
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-slate-900">
                            Konfirmasi {tipeAksi === 'verifikasi' ? 'Verifikasi Pembayaran' : 'Tolak Pembayaran'}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                            {tipeAksi === 'verifikasi'
                                ? `Yakin ingin memverifikasi pembayaran untuk booking ${pembayaranTerpilih?.booking?.kode_booking || ''}? Status tiket akan otomatis menjadi Terkonfirmasi (LUNAS).`
                                : `Yakin ingin menolak pembayaran ini? Customer akan diminta mengunggah ulang bukti transfer.`}
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-3 pt-2">
                        <button
                            type="button"
                            disabled={sedangMemproses}
                            onClick={() => setModalAksiTerbuka(false)}
                            className="px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-600 hover:bg-slate-100 border border-slate-200 transition"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            disabled={sedangMemproses}
                            onClick={handleEksekusiAksi}
                            className={`px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-md transition active:scale-95 disabled:opacity-60 ${
                                tipeAksi === 'verifikasi'
                                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                                    : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20'
                            }`}
                        >
                            {sedangMemproses ? 'Memproses...' : tipeAksi === 'verifikasi' ? 'Ya, Verifikasi' : 'Ya, Tolak'}
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
