import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { Search, ArrowRightLeft, Calendar, Clock, ArrowRight, Train, CheckCircle2, AlertCircle } from 'lucide-react';

const getTanggalHariIni = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function ScheduleSearch({ stations = [], schedules, filters = {} }) {
    const { auth } = usePage().props;
    const sudahLogin = !!auth?.user;

    const daftarStasiun = stations || [];

    const [stasiunAsal, setStasiunAsal] = useState(filters.asal || '');
    const [stasiunTujuan, setStasiunTujuan] = useState(filters.tujuan || '');
    const [tanggalBerangkat, setTanggalBerangkat] = useState(filters.tanggal || getTanggalHariIni());
    const [sedangMencari, setSedangMencari] = useState(false);
    const [pesanError, setPesanError] = useState('');

    const handleTukarStasiun = () => {
        const sementara = stasiunAsal;
        setStasiunAsal(stasiunTujuan);
        setStasiunTujuan(sementara);
    };

    const handleCari = (e) => {
        e.preventDefault();
        if (!stasiunAsal || !stasiunTujuan) {
            setPesanError('Silakan pilih stasiun asal dan tujuan.');
            return;
        }
        if (stasiunAsal === stasiunTujuan) {
            setPesanError('Stasiun asal dan tujuan tidak boleh sama.');
            return;
        }
        setPesanError('');
        setSedangMencari(true);
        router.get(route('schedules.search'), {
            asal: stasiunAsal,
            tujuan: stasiunTujuan,
            tanggal: tanggalBerangkat,
        }, {
            preserveState: false,
            preserveScroll: true,
            onFinish: () => setSedangMencari(false),
        });
    };

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(angka || 0);
    };

    const formatJam = (dateString) => {
        if (!dateString) return '--:--';
        const tanggal = new Date(dateString);
        return tanggal.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    const formatTanggal = (dateString) => {
        if (!dateString) return '-';
        const tanggal = new Date(dateString);
        return tanggal.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const hitungDurasi = (waktuBerangkat, waktuTiba) => {
        if (!waktuBerangkat || !waktuTiba) return '-';
        const selisihMs = new Date(waktuTiba) - new Date(waktuBerangkat);
        const totalMenit = Math.floor(selisihMs / 60000);
        const jam = Math.floor(totalMenit / 60);
        const menit = totalMenit % 60;
        return `${jam}j ${menit}m`;
    };

    const daftarHasil = schedules?.data || schedules || [];
    const adaHasil = daftarHasil.length > 0;
    const sudahCari = !!filters.asal || daftarHasil.length > 0;

    const kontenHalaman = (
        <>
            <Head title="Cari Jadwal Kereta — GoRail" />

            <div className="space-y-6">
                {/* ─── HEADER ─────────────────────────────────────── */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-8 shadow-sm border border-slate-700/50">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="relative z-10">
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-1">Cari Jadwal Kereta</h1>
                        <p className="text-sm text-slate-300">Temukan jadwal keberangkatan kereta api sesuai rute dan tanggal Anda.</p>
                    </div>
                </div>

                {/* ─── FORM PENCARIAN ─────────────────────────────── */}
                <form onSubmit={handleCari} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                        {/* Stasiun Asal */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Stasiun Asal</label>
                            <select
                                value={stasiunAsal}
                                onChange={(e) => setStasiunAsal(e.target.value)}
                                className="w-full rounded-xl border-slate-300 bg-slate-50 py-2.5 px-3 text-sm font-medium text-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20 focus:ring-4 transition"
                            >
                                <option value="">— Pilih Stasiun Asal —</option>
                                {daftarStasiun.map((st) => (
                                    <option key={st.id} value={st.id}>
                                        {st.nama_stasiun} ({st.kode_stasiun}) — {st.kota}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Stasiun Tujuan */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Stasiun Tujuan</label>
                                <button
                                    type="button"
                                    onClick={handleTukarStasiun}
                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 transition"
                                    title="Tukar stasiun asal & tujuan"
                                >
                                    <ArrowRightLeft className="w-3 h-3" />
                                    Tukar
                                </button>
                            </div>
                            <select
                                value={stasiunTujuan}
                                onChange={(e) => setStasiunTujuan(e.target.value)}
                                className="w-full rounded-xl border-slate-300 bg-slate-50 py-2.5 px-3 text-sm font-medium text-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20 focus:ring-4 transition"
                            >
                                <option value="">— Pilih Stasiun Tujuan —</option>
                                {daftarStasiun.map((st) => (
                                    <option key={st.id} value={st.id}>
                                        {st.nama_stasiun} ({st.kode_stasiun}) — {st.kota}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Tanggal */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Tanggal Berangkat</label>
                            <input
                                type="date"
                                value={tanggalBerangkat}
                                onChange={(e) => setTanggalBerangkat(e.target.value)}
                                min={getTanggalHariIni()}
                                className="w-full rounded-xl border-slate-300 bg-slate-50 py-2.5 px-3 text-sm font-medium text-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20 focus:ring-4 transition"
                            />
                        </div>

                        {/* Tombol Cari */}
                        <button
                            type="submit"
                            disabled={sedangMencari}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/20 active:scale-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {sedangMencari ? (
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                <Search className="w-4 h-4" />
                            )}
                            Cari
                        </button>
                    </div>

                    {pesanError && (
                        <div className="flex items-center gap-2 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-2.5">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {pesanError}
                        </div>
                    )}
                </form>

                {/* ─── HASIL PENCARIAN ────────────────────────────── */}
                {sudahCari && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-800">
                                {filters.asal ? 'Hasil Pencarian' : 'Daftar Jadwal Kereta Api Aktif'}
                                {adaHasil && <span className="ml-2 text-sm font-normal text-slate-500">({daftarHasil.length} jadwal)</span>}
                            </h2>
                            {filters.tanggal && (
                                <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-medium">
                                    {formatTanggal(filters.tanggal)}
                                </span>
                            )}
                        </div>

                        {adaHasil ? (
                            <div className="space-y-3">
                                {daftarHasil.map((jadwal) => {
                                    const tanggalJadwal = filters.tanggal || (jadwal.waktu_berangkat ? String(jadwal.waktu_berangkat).split(' ')[0] : tanggalBerangkat);

                                    return (
                                        <div key={jadwal.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all duration-200 p-5">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                {/* Info Kereta */}
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                                                        <Train className="w-5 h-5 text-emerald-600" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold text-slate-800 truncate">{jadwal.train?.nama_kereta}</p>
                                                        <p className="text-xs text-slate-500 font-mono">{jadwal.kode_jadwal}</p>
                                                    </div>
                                                </div>

                                                {/* Rute & Waktu */}
                                                <div className="flex items-center gap-4 flex-1 justify-center">
                                                    <div className="text-center">
                                                        <p className="text-lg font-bold text-slate-900">{formatJam(jadwal.waktu_berangkat)}</p>
                                                        <p className="text-xs text-slate-500 font-medium">{jadwal.station_asal?.nama_stasiun}</p>
                                                    </div>
                                                    <div className="flex items-center gap-1 min-w-[80px]">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                                        <div className="flex-1 border-t-2 border-dashed border-slate-300"></div>
                                                        <span className="text-[10px] text-slate-400 font-medium">{hitungDurasi(jadwal.waktu_berangkat, jadwal.waktu_tiba)}</span>
                                                        <div className="flex-1 border-t-2 border-dashed border-slate-300"></div>
                                                        <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-lg font-bold text-slate-900">{formatJam(jadwal.waktu_tiba)}</p>
                                                        <p className="text-xs text-slate-500 font-medium">{jadwal.station_tujuan?.nama_stasiun}</p>
                                                    </div>
                                                </div>

                                                {/* Harga & CTA */}
                                                <div className="flex flex-col items-end gap-2 shrink-0">
                                                    <div className="text-right">
                                                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Mulai dari</span>
                                                        <p className="text-lg font-black text-emerald-600">
                                                            {formatRupiah(jadwal.harga_ekonomi || jadwal.harga)}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-1 flex-wrap justify-end">
                                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold" title={`Ekonomi: ${formatRupiah(jadwal.harga_ekonomi || jadwal.harga)}`}>
                                                            Eko {formatRupiah(jadwal.harga_ekonomi || jadwal.harga).replace(',00', '')}
                                                        </span>
                                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 font-bold" title={`Bisnis: ${formatRupiah(jadwal.harga_bisnis)}`}>
                                                            Bis {formatRupiah(jadwal.harga_bisnis).replace(',00', '')}
                                                        </span>
                                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold" title={`Eksekutif: ${formatRupiah(jadwal.harga_eksekutif)}`}>
                                                            Eks {formatRupiah(jadwal.harga_eksekutif).replace(',00', '')}
                                                        </span>
                                                    </div>
                                                    <Link
                                                        href={route('schedules.show', { schedule: jadwal.id, tanggal: tanggalJadwal })}
                                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm active:scale-95 transition mt-1"
                                                    >
                                                        Pilih Kursi
                                                        <ArrowRight className="w-3.5 h-3.5" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
                                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                    <AlertCircle className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-base font-bold text-slate-800">Jadwal Tidak Ditemukan</h3>
                                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                                    Tidak ada jadwal kereta api untuk rute dan tanggal yang Anda pilih. Silakan coba tanggal atau rute lain.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );

    if (sudahLogin) {
        return <AuthenticatedLayout>{kontenHalaman}</AuthenticatedLayout>;
    }

    return (
        <GuestLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {kontenHalaman}
            </div>
        </GuestLayout>
    );
}
