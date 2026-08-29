import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const getTanggalHariIni = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function ScheduleDetail({ schedule, denah_kursi = [], tanggal }) {
    const { auth } = usePage().props;
    const sudahLogin = !!auth?.user;
    const isCustomer = auth?.user?.roles?.includes('customer') || (sudahLogin && !auth?.user?.roles?.includes('admin') && !auth?.user?.roles?.includes('staff'));

    const dataJadwal = schedule?.data || schedule || {};

    const [kursiDipilih, setKursiDipilih] = useState([]);
    const [tanggalTerpilih, setTanggalTerpilih] = useState(
        tanggal || (dataJadwal.waktu_berangkat ? dataJadwal.waktu_berangkat.split(' ')[0] : getTanggalHariIni())
    );

    const { data, setData, post, processing, errors } = useForm({
        schedule_id: dataJadwal.id || '',
        tanggal_berangkat: tanggalTerpilih,
        seat_ids: [],
        penumpang: [],
    });

    // Reset pilihan kursi setiap kali prop denah_kursi berubah (data segar dari server)
    const prevDenahKursiRef = useRef(denah_kursi);
    useEffect(() => {
        if (prevDenahKursiRef.current !== denah_kursi) {
            prevDenahKursiRef.current = denah_kursi;
            setKursiDipilih([]);
            setData((prev) => ({ ...prev, seat_ids: [], penumpang: [] }));
        }
    }, [denah_kursi]);

    // Peta lookup kursi: ID -> { nomor_kursi, gerbong, kelas, harga }
    const mapKursi = {};
    denah_kursi.forEach((gerbong) => {
        gerbong.kursi?.forEach((k) => {
            const hargaFallback = (gerbong.kelas === 'eksekutif')
                ? (dataJadwal.harga_eksekutif || Math.round((dataJadwal.harga_ekonomi || dataJadwal.harga) * 2))
                : (gerbong.kelas === 'bisnis')
                ? (dataJadwal.harga_bisnis || Math.round((dataJadwal.harga_ekonomi || dataJadwal.harga) * 1.5))
                : (dataJadwal.harga_ekonomi || dataJadwal.harga);

            mapKursi[k.id] = {
                ...k,
                gerbongNama: gerbong.gerbong,
                kelas: gerbong.kelas,
                harga: k.harga || gerbong.harga || hargaFallback || 0,
            };
        });
    });

    // Hitung total harga dinamis berdasarkan tarif kelas dari kursi-kursi yang dipilih
    const totalHarga = kursiDipilih.reduce((total, id) => {
        return total + (mapKursi[id]?.harga || Number(dataJadwal.harga_ekonomi || dataJadwal.harga) || 0);
    }, 0);

    const handleGantiTanggal = (tglBaru) => {
        setTanggalTerpilih(tglBaru);
        setKursiDipilih([]);
        setData({
            ...data,
            tanggal_berangkat: tglBaru,
            seat_ids: [],
            penumpang: [],
        });

        // Muat ulang ketersediaan kursi untuk tanggal yang dipilih.
        // preserveState: false agar denah_kursi dari server selalu segar dan tidak stale.
        router.get(
            route('schedules.show', dataJadwal.id),
            { tanggal: tglBaru },
            { preserveState: false, preserveScroll: true }
        );
    };

    const handlePilihKursi = (kursiId) => {
        const sudahDipilih = kursiDipilih.includes(kursiId);
        let daftarBaru;
        if (sudahDipilih) {
            daftarBaru = kursiDipilih.filter((id) => id !== kursiId);
        } else {
            daftarBaru = [...kursiDipilih, kursiId];
        }
        setKursiDipilih(daftarBaru);

        // Sinkronkan form data penumpang dengan jumlah kursi yang dipilih
        const dataPenumpangBaru = daftarBaru.map((_, indeks) => (
            data.penumpang[indeks] || { nama_penumpang: '', nomor_identitas: '', jenis_identitas: 'KTP' }
        ));

        setData({
            ...data,
            schedule_id: dataJadwal.id || data.schedule_id,
            tanggal_berangkat: tanggalTerpilih,
            seat_ids: daftarBaru,
            penumpang: dataPenumpangBaru,
        });
    };

    const handleUbahPenumpang = (indeks, field, nilai) => {
        const penumpangBaru = [...data.penumpang];
        penumpangBaru[indeks] = { ...penumpangBaru[indeks], [field]: nilai };
        setData('penumpang', penumpangBaru);
    };

    const handleSubmitBooking = (e) => {
        e.preventDefault();
        post(route('bookings.store'));
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
        const tanggalObj = new Date(dateString);
        return tanggalObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    const formatTanggal = (dateString) => {
        if (!dateString) return '-';
        const tanggalObj = new Date(dateString);
        return tanggalObj.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    const hitungDurasi = (waktuBerangkat, waktuTiba) => {
        if (!waktuBerangkat || !waktuTiba) return '-';
        const selisihMs = new Date(waktuTiba) - new Date(waktuBerangkat);
        const totalMenit = Math.floor(selisihMs / 60000);
        const jam = Math.floor(totalMenit / 60);
        const menit = totalMenit % 60;
        return `${jam}j ${menit}m`;
    };

    const getBadgeKelas = (kelas) => {
        const k = (kelas || '').toLowerCase();
        if (k === 'eksekutif') return 'bg-amber-100 text-amber-800 border-amber-200';
        if (k === 'bisnis') return 'bg-sky-100 text-sky-800 border-sky-200';
        return 'bg-slate-100 text-slate-700 border-slate-200';
    };

    const hargaEkonomi = dataJadwal.harga_ekonomi || dataJadwal.harga || 0;
    const hargaBisnis = dataJadwal.harga_bisnis || Math.round(hargaEkonomi * 1.5);
    const hargaEksekutif = dataJadwal.harga_eksekutif || Math.round(hargaEkonomi * 2);

    const kontenHalaman = (
        <>
            <Head title={`Pilih Kursi - ${dataJadwal.kode_jadwal || ''} — GoRail`} />

            <div className="space-y-6">
                {/* ─── BREADCRUMB ─────────────────────────────── */}
                <nav className="flex items-center gap-2 text-sm">
                    <Link href={route('schedules.search')} className="text-emerald-600 hover:text-emerald-700 font-medium">
                        ← Kembali ke Pencarian
                    </Link>
                </nav>

                {/* ─── HEADER JADWAL ─────────────────────────── */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-slate-800">{dataJadwal.train?.nama_kereta}</h1>
                                <p className="text-xs text-slate-500 font-mono">{dataJadwal.kode_jadwal}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-5">
                            <div className="text-center">
                                <p className="text-xl font-bold text-slate-900">{formatJam(dataJadwal.waktu_berangkat)}</p>
                                <p className="text-xs text-slate-500 font-medium">{dataJadwal.station_asal?.nama_stasiun}</p>
                            </div>
                            <div className="flex items-center gap-1 min-w-[80px]">
                                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                <div className="flex-1 border-t-2 border-dashed border-slate-300"></div>
                                <span className="text-[10px] text-slate-400 font-medium">
                                    {hitungDurasi(dataJadwal.waktu_berangkat, dataJadwal.waktu_tiba)}
                                </span>
                                <div className="flex-1 border-t-2 border-dashed border-slate-300"></div>
                                <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-bold text-slate-900">{formatJam(dataJadwal.waktu_tiba)}</p>
                                <p className="text-xs text-slate-500 font-medium">{dataJadwal.station_tujuan?.nama_stasiun}</p>
                            </div>
                        </div>

                        {/* Ringkasan Tarif per Kelas */}
                        <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                            <div className="text-center px-2 py-1 bg-emerald-50 rounded-lg border border-emerald-200">
                                <p className="text-[9px] uppercase font-bold text-emerald-800">Ekonomi</p>
                                <p className="text-xs font-black text-emerald-700">{formatRupiah(hargaEkonomi)}</p>
                            </div>
                            <div className="text-center px-2 py-1 bg-sky-50 rounded-lg border border-sky-200">
                                <p className="text-[9px] uppercase font-bold text-sky-800">Bisnis</p>
                                <p className="text-xs font-black text-sky-700">{formatRupiah(hargaBisnis)}</p>
                            </div>
                            <div className="text-center px-2 py-1 bg-amber-50 rounded-lg border border-amber-200">
                                <p className="text-[9px] uppercase font-bold text-amber-800">Eksekutif</p>
                                <p className="text-xs font-black text-amber-700">{formatRupiah(hargaEksekutif)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Selector Tanggal Perjalanan */}
                    <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70 p-3 rounded-xl">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-xs font-bold text-slate-700">Tanggal Keberangkatan:</span>
                            <span className="text-xs text-emerald-700 font-semibold">{formatTanggal(tanggalTerpilih)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-xs text-slate-500 font-medium">Ubah Tanggal:</label>
                            <input
                                type="date"
                                value={tanggalTerpilih}
                                onChange={(e) => handleGantiTanggal(e.target.value)}
                                min={getTanggalHariIni()}
                                className="text-xs font-bold rounded-lg border-slate-300 py-1 px-2.5 text-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20"
                            />
                        </div>
                    </div>
                </div>

                {/* ─── SEAT MAP ────────────────────────────────── */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-100">
                        <div>
                            <h2 className="text-base font-bold text-slate-800">Denah Kursi Kereta</h2>
                            <p className="text-xs text-slate-500">Pilih kursi pada gerbong yang diinginkan. Tarif tiket otomatis disesuaikan dengan kelas gerbong.</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1.5 font-medium text-emerald-800">
                                <span className="w-4 h-4 rounded-md bg-emerald-50 border-2 border-emerald-400"></span>
                                Tersedia
                            </span>
                            <span className="flex items-center gap-1.5 font-medium text-slate-900">
                                <span className="w-4 h-4 rounded-md bg-emerald-500 border-2 border-emerald-600"></span>
                                Dipilih
                            </span>
                            <span className="flex items-center gap-1.5 font-medium text-slate-500">
                                <span className="w-4 h-4 rounded-md bg-slate-200 border-2 border-slate-300"></span>
                                Terisi (Penuh)
                            </span>
                        </div>
                    </div>

                    {denah_kursi.length === 0 ? (
                        <p className="text-sm text-slate-500 text-center py-8">Tidak ada data kursi untuk jadwal ini.</p>
                    ) : (
                        <div className="space-y-6">
                            {denah_kursi.map((gerbong, indeksGerbong) => (
                                <div key={indeksGerbong} className="border border-slate-200 rounded-2xl p-5 bg-slate-50/40">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200/70">
                                        <div className="flex items-center gap-2.5">
                                            <h3 className="text-sm font-bold text-slate-800">{gerbong.gerbong}</h3>
                                            <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${getBadgeKelas(gerbong.kelas)}`}>
                                                Kelas {gerbong.kelas}
                                            </span>
                                            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                                                {formatRupiah(gerbong.harga)} / kursi
                                            </span>
                                        </div>
                                        <span className="text-xs text-slate-500 font-medium">
                                            {gerbong.kursi?.filter((k) => k.tersedia).length} kursi kosong dari {gerbong.kursi?.length} kursi
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-2.5">
                                        {gerbong.kursi.map((kursi) => {
                                            const terpilih = kursiDipilih.includes(kursi.id);
                                            const tersedia = Boolean(kursi.tersedia);

                                            return (
                                                <button
                                                    key={kursi.id}
                                                    type="button"
                                                    disabled={!tersedia || !sudahLogin || !isCustomer}
                                                    onClick={() => tersedia && handlePilihKursi(kursi.id)}
                                                    className={`relative w-12 h-12 rounded-xl text-xs font-bold transition-all duration-150 border-2 flex flex-col items-center justify-center
                                                        ${terpilih
                                                            ? 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/30 scale-105 z-10'
                                                            : tersedia
                                                                ? 'bg-emerald-50/80 text-emerald-800 border-emerald-300 hover:bg-emerald-100 hover:border-emerald-400 hover:scale-105 cursor-pointer shadow-2xs'
                                                                : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed opacity-80'
                                                        }
                                                    `}
                                                    title={
                                                        !tersedia
                                                            ? `Kursi ${kursi.nomor_kursi} (Sudah Terisi)`
                                                            : terpilih
                                                            ? `Kursi ${kursi.nomor_kursi} (Dipilih) - ${formatRupiah(gerbong.harga)}`
                                                            : `Kursi ${kursi.nomor_kursi} (${gerbong.kelas}) - ${formatRupiah(gerbong.harga)}`
                                                    }
                                                >
                                                    <span>{kursi.nomor_kursi}</span>
                                                    {!tersedia && (
                                                        <span className="text-[8px] uppercase tracking-tighter text-slate-500 font-normal mt-0.5 leading-none">
                                                            Terisi
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Summary rincian kursi yang dipilih */}
                    {kursiDipilih.length > 0 && (
                        <div className="mt-5 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-sm text-emerald-900">
                                    Kursi Terpilih ({kursiDipilih.length} Kursi):
                                </span>
                                <span className="text-lg font-black text-emerald-700">
                                    Total: {formatRupiah(totalHarga)}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-2 border-t border-emerald-200/70">
                                {kursiDipilih.map((id) => {
                                    const k = mapKursi[id] || {};
                                    return (
                                        <span
                                            key={id}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-xs font-bold text-slate-800 shadow-2xs"
                                        >
                                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                            <span>{k.gerbongNama || 'Gerbong'} - Kursi {k.nomor_kursi}</span>
                                            <span className={`text-[10px] uppercase px-1.5 py-0.2 rounded border ${getBadgeKelas(k.kelas)}`}>
                                                {k.kelas}
                                            </span>
                                            <span className="text-emerald-700 font-black">
                                                {formatRupiah(k.harga)}
                                            </span>
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* ─── FORM BOOKING (muncul setelah pilih kursi) ── */}
                {sudahLogin && isCustomer && kursiDipilih.length > 0 && (
                    <form onSubmit={handleSubmitBooking} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-5">
                        <div>
                            <h2 className="text-base font-bold text-slate-800">Data Penumpang</h2>
                            <p className="text-xs text-slate-500 mt-0.5">Isi data penumpang untuk setiap kursi yang dipilih sesuai identitas resmi.</p>
                        </div>

                        {errors.seat_ids && (
                            <div className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-2.5">
                                {errors.seat_ids}
                            </div>
                        )}

                        <div className="space-y-4">
                            {data.penumpang.map((penumpang, indeks) => {
                                const kursiId = kursiDipilih[indeks];
                                const infoKursi = mapKursi[kursiId] || {};

                                return (
                                    <div key={indeks} className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/50">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                                            <div className="flex items-center gap-2">
                                                <span className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">
                                                    {indeks + 1}
                                                </span>
                                                <span className="text-sm font-bold text-slate-700">Penumpang {indeks + 1}</span>
                                            </div>
                                            {infoKursi.nomor_kursi && (
                                                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
                                                    {infoKursi.gerbongNama} — Kursi {infoKursi.nomor_kursi} ({infoKursi.kelas}) • {formatRupiah(infoKursi.harga)}
                                                </span>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-600 mb-1">Nama Lengkap</label>
                                                <input
                                                    type="text"
                                                    value={penumpang.nama_penumpang}
                                                    onChange={(e) => handleUbahPenumpang(indeks, 'nama_penumpang', e.target.value)}
                                                    className="w-full rounded-xl border-slate-300 bg-white py-2 px-3 text-sm focus:border-emerald-500 focus:ring-emerald-500/20 focus:ring-4 transition"
                                                    placeholder="Nama sesuai identitas"
                                                    required
                                                />
                                                {errors[`penumpang.${indeks}.nama_penumpang`] && (
                                                    <p className="text-xs text-rose-500 mt-1">{errors[`penumpang.${indeks}.nama_penumpang`]}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-600 mb-1">Jenis Identitas</label>
                                                <select
                                                    value={penumpang.jenis_identitas}
                                                    onChange={(e) => handleUbahPenumpang(indeks, 'jenis_identitas', e.target.value)}
                                                    className="w-full rounded-xl border-slate-300 bg-white py-2 px-3 text-sm focus:border-emerald-500 focus:ring-emerald-500/20 focus:ring-4 transition"
                                                >
                                                    <option value="KTP">KTP</option>
                                                    <option value="SIM">SIM</option>
                                                    <option value="Paspor">Paspor</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-600 mb-1">Nomor Identitas</label>
                                                <input
                                                    type="text"
                                                    value={penumpang.nomor_identitas}
                                                    onChange={(e) => handleUbahPenumpang(indeks, 'nomor_identitas', e.target.value)}
                                                    className="w-full rounded-xl border-slate-300 bg-white py-2 px-3 text-sm focus:border-emerald-500 focus:ring-emerald-500/20 focus:ring-4 transition"
                                                    placeholder="Nomor KTP / SIM / Paspor"
                                                    required
                                                />
                                                {errors[`penumpang.${indeks}.nomor_identitas`] && (
                                                    <p className="text-xs text-rose-500 mt-1">{errors[`penumpang.${indeks}.nomor_identitas`]}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Total & Submit */}
                        <div className="flex items-center justify-between border-t border-slate-200 pt-5">
                            <div>
                                <p className="text-xs text-slate-500">Total Pembayaran ({kursiDipilih.length} Kursi)</p>
                                <p className="text-2xl font-extrabold text-emerald-600">{formatRupiah(totalHarga)}</p>
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 active:scale-95 transition disabled:opacity-60"
                            >
                                {processing ? (
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                                Buat Booking Sekarang
                            </button>
                        </div>
                    </form>
                )}

                {/* Pesan jika belum login */}
                {!sudahLogin && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
                        <p className="text-sm text-amber-800 font-medium mb-3">Anda harus masuk terlebih dahulu untuk melakukan pemesanan tiket.</p>
                        <div className="flex items-center justify-center gap-2">
                            <Link href={route('login')} className="px-4 py-2 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition">
                                Masuk
                            </Link>
                            <Link href={route('register')} className="px-4 py-2 rounded-xl font-bold text-xs bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 shadow-sm transition">
                                Daftar Akun
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );

    if (sudahLogin) {
        return <AuthenticatedLayout>{kontenHalaman}</AuthenticatedLayout>;
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
            <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <Link href="/" className="flex items-center gap-2 font-extrabold text-lg text-slate-800">
                            <span className="text-emerald-600">Go</span>Rail
                        </Link>
                        <div className="flex items-center gap-2">
                            <Link href={route('login')} className="text-sm font-semibold text-slate-600 hover:text-emerald-600 px-3 py-2 rounded-lg transition">Masuk</Link>
                            <Link href={route('register')} className="text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl shadow-sm transition">Daftar</Link>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{kontenHalaman}</div>
            </main>
        </div>
    );
}
