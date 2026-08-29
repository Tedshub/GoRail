import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import { Head, useForm, router, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Calendar, Clock, ArrowRight, Plus, Edit2, Trash2, Tag, Train } from 'lucide-react';

export default function SchedulesIndex({ schedules, trains = [], stations = [] }) {
    const { flash } = usePage().props;
    const daftarJadwal = schedules?.data || [];
    const meta = schedules?.meta || schedules || {};
    const daftarKereta = trains || [];
    const daftarStasiun = stations || [];

    const [modalBuka, setModalBuka] = useState(false);
    const [modeEdit, setModeEdit] = useState(false);
    const [jadwalSedangDiedit, setJadwalSedangDiedit] = useState(null);

    const form = useForm({
        kode_jadwal: '',
        train_id: daftarKereta[0]?.id || '',
        station_asal_id: daftarStasiun[0]?.id || '',
        station_tujuan_id: daftarStasiun[1]?.id || '',
        waktu_berangkat: '',
        waktu_tiba: '',
        harga_ekonomi: '',
        harga_bisnis: '',
        harga_eksekutif: '',
    });

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(angka || 0);
    };

    const formatTanggalWaktu = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleBukaTambah = () => {
        setModeEdit(false);
        setJadwalSedangDiedit(null);
        form.reset();
        form.clearErrors();
        form.setData({
            kode_jadwal: '',
            train_id: daftarKereta[0]?.id || '',
            station_asal_id: daftarStasiun[0]?.id || '',
            station_tujuan_id: daftarStasiun[1]?.id || '',
            waktu_berangkat: '',
            waktu_tiba: '',
            harga_ekonomi: '',
            harga_bisnis: '',
            harga_eksekutif: '',
        });
        setModalBuka(true);
    };

    const handleBukaEdit = (j) => {
        setModeEdit(true);
        setJadwalSedangDiedit(j);
        form.clearErrors();

        // format to datetime-local format YYYY-MM-DDTHH:MM
        const toInputDatetime = (dt) => {
            if (!dt) return '';
            const d = new Date(dt);
            const pad = (n) => String(n).padStart(2, '0');
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        };

        const ekonomi = j.harga_ekonomi || j.harga || '';
        const bisnis = j.harga_bisnis || (ekonomi ? Math.round(ekonomi * 1.5) : '');
        const eksekutif = j.harga_eksekutif || (ekonomi ? Math.round(ekonomi * 2) : '');

        form.setData({
            kode_jadwal: j.kode_jadwal || '',
            train_id: j.train_id || (j.train && j.train.id) || '',
            station_asal_id: j.station_asal_id || (j.station_asal && j.station_asal.id) || '',
            station_tujuan_id: j.station_tujuan_id || (j.station_tujuan && j.station_tujuan.id) || '',
            waktu_berangkat: toInputDatetime(j.waktu_berangkat),
            waktu_tiba: toInputDatetime(j.waktu_tiba),
            harga_ekonomi: ekonomi,
            harga_bisnis: bisnis,
            harga_eksekutif: eksekutif,
        });
        setModalBuka(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (modeEdit && jadwalSedangDiedit) {
            form.put(route('admin.schedules.update', jadwalSedangDiedit.id), {
                onSuccess: () => {
                    setModalBuka(false);
                    form.reset();
                },
            });
        } else {
            form.post(route('admin.schedules.store'), {
                onSuccess: () => {
                    setModalBuka(false);
                    form.reset();
                },
            });
        }
    };

    const handleHapus = (j) => {
        if (confirm(`Yakin ingin menghapus jadwal "${j.kode_jadwal}"?`)) {
            router.delete(route('admin.schedules.destroy', j.id));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Jadwal - Admin GoRail" />

            <div className="space-y-6">
                {/* ─── Header ─── */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-8 shadow-sm border border-slate-700/50">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Manajemen Jadwal & Tarif Kelas</h1>
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                    Master Data
                                </span>
                            </div>
                            <p className="text-sm text-slate-300 mt-1">
                                Atur rute perjalanan, waktu keberangkatan & kedatangan, serta tarif tiket terpisah per kelas (Ekonomi, Bisnis, Eksekutif).
                            </p>
                        </div>

                        <button
                            onClick={handleBukaTambah}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 active:scale-95 transition self-start sm:self-auto"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Tambah Jadwal
                        </button>
                    </div>
                </div>

                {/* ─── Flash Alert ─── */}
                {flash?.sukses && (
                    <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 shadow-xs">
                        <svg className="w-5 h-5 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold">{flash.sukses}</span>
                    </div>
                )}

                {/* ─── Table Card ─── */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                    {/* ─── Mobile View (Cards) ─── */}
                    <div className="md:hidden divide-y divide-slate-100">
                        {daftarJadwal.length === 0 ? (
                            <div className="py-10 text-center text-slate-400">
                                Belum ada data jadwal kereta.
                            </div>
                        ) : (
                            daftarJadwal.map((j) => {
                                const ekonomi = j.harga_ekonomi || j.harga || 0;
                                const bisnis = j.harga_bisnis || Math.round(ekonomi * 1.5);
                                const eksekutif = j.harga_eksekutif || Math.round(ekonomi * 2);

                                return (
                                    <div key={j.id} className="p-4 space-y-3 hover:bg-slate-50/50 transition">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                                                {j.kode_jadwal}
                                            </span>
                                            <span className="font-bold text-xs text-slate-800">
                                                {j.train?.nama_kereta || '-'}
                                            </span>
                                        </div>

                                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5">
                                            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                                                <span>{j.station_asal?.nama_stasiun || 'Asal'}</span>
                                                <span className="text-slate-400">→</span>
                                                <span>{j.station_tujuan?.nama_stasiun || 'Tujuan'}</span>
                                            </div>
                                            <div className="text-xs text-slate-500 flex items-center justify-between">
                                                <span>{j.station_asal?.kota}</span>
                                                <span>ke</span>
                                                <span>{j.station_tujuan?.kota}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="bg-slate-50/80 p-2 rounded-lg border border-slate-100">
                                                <span className="text-[10px] text-slate-400 font-bold uppercase block">Berangkat</span>
                                                <span className="font-semibold text-slate-800 text-[11px] flex items-center gap-1 mt-0.5">
                                                    <Calendar className="w-3 h-3 text-emerald-600 shrink-0" />
                                                    {formatTanggalWaktu(j.waktu_berangkat)}
                                                </span>
                                            </div>
                                            <div className="bg-slate-50/80 p-2 rounded-lg border border-slate-100">
                                                <span className="text-[10px] text-slate-400 font-bold uppercase block">Tiba</span>
                                                <span className="font-semibold text-slate-800 text-[11px] flex items-center gap-1 mt-0.5">
                                                    <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                                                    {formatTanggalWaktu(j.waktu_tiba)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="bg-emerald-50/50 rounded-xl p-2.5 border border-emerald-100 flex items-center justify-between gap-1 text-[11px]">
                                            <div className="text-center flex-1">
                                                <span className="text-[10px] text-slate-500 font-bold uppercase block">Eko</span>
                                                <span className="font-bold text-emerald-700">{formatRupiah(ekonomi)}</span>
                                            </div>
                                            <div className="text-center flex-1 border-x border-emerald-200/60 px-1">
                                                <span className="text-[10px] text-slate-500 font-bold uppercase block">Bisnis</span>
                                                <span className="font-bold text-sky-700">{formatRupiah(bisnis)}</span>
                                            </div>
                                            <div className="text-center flex-1">
                                                <span className="text-[10px] text-slate-500 font-bold uppercase block">Ekse</span>
                                                <span className="font-bold text-amber-700">{formatRupiah(eksekutif)}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                                            <button
                                                onClick={() => handleBukaEdit(j)}
                                                className="px-3 py-1.5 rounded-lg font-semibold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleHapus(j)}
                                                className="px-3 py-1.5 rounded-lg font-semibold text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition"
                                            >
                                                Hapus
                                            </button>
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
                                    <th className="py-4 px-5">Kode Jadwal</th>
                                    <th className="py-4 px-5">Kereta Api</th>
                                    <th className="py-4 px-5">Rute Perjalanan</th>
                                    <th className="py-4 px-5">Waktu Berangkat & Tiba</th>
                                    <th className="py-4 px-5">Tarif per Kelas</th>
                                    <th className="py-4 px-5 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {daftarJadwal.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-10 text-center text-slate-400">
                                            Belum ada data jadwal kereta.
                                        </td>
                                    </tr>
                                ) : (
                                    daftarJadwal.map((j) => {
                                        const ekonomi = j.harga_ekonomi || j.harga || 0;
                                        const bisnis = j.harga_bisnis || Math.round(ekonomi * 1.5);
                                        const eksekutif = j.harga_eksekutif || Math.round(ekonomi * 2);

                                        return (
                                            <tr key={j.id} className="hover:bg-slate-50/60 transition">
                                                <td className="py-4 px-5">
                                                    <span className="font-mono font-bold text-sm px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                                                        {j.kode_jadwal}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-5">
                                                    <p className="font-bold text-slate-900">{j.train?.nama_kereta || '-'}</p>
                                                    <p className="text-xs text-slate-400 font-mono">{j.train?.nomor_kereta || ''}</p>
                                                </td>
                                                <td className="py-4 px-5">
                                                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                                                        <span>{j.station_asal?.nama_stasiun || 'Asal'}</span>
                                                        <span className="text-slate-400">→</span>
                                                        <span>{j.station_tujuan?.nama_stasiun || 'Tujuan'}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-400">
                                                        {j.station_asal?.kota} ke {j.station_tujuan?.kota}
                                                    </p>
                                                </td>
                                                <td className="py-4 px-5">
                                                    <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                                        <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                                        <span>{formatTanggalWaktu(j.waktu_berangkat)}</span>
                                                    </p>
                                                    <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                        <span>{formatTanggalWaktu(j.waktu_tiba)}</span>
                                                    </p>
                                                </td>
                                                <td className="py-4 px-5">
                                                    <div className="space-y-1 text-xs">
                                                        <div className="flex items-center justify-between gap-3">
                                                            <span className="px-2 py-0.5 rounded font-bold uppercase text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                                Ekonomi
                                                            </span>
                                                            <span className="font-bold text-slate-800">{formatRupiah(ekonomi)}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between gap-3">
                                                            <span className="px-2 py-0.5 rounded font-bold uppercase text-[10px] bg-sky-100 text-sky-800 border border-sky-200">
                                                                Bisnis
                                                            </span>
                                                            <span className="font-bold text-slate-800">{formatRupiah(bisnis)}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between gap-3">
                                                            <span className="px-2 py-0.5 rounded font-bold uppercase text-[10px] bg-amber-100 text-amber-800 border border-amber-200">
                                                                Eksekutif
                                                            </span>
                                                            <span className="font-bold text-amber-700">{formatRupiah(eksekutif)}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-5 text-right">
                                                    <div className="inline-flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleBukaEdit(j)}
                                                            className="px-3 py-1.5 rounded-lg font-semibold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleHapus(j)}
                                                            className="px-3 py-1.5 rounded-lg font-semibold text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </div>
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

            {/* ─── Modal Form Tambah / Edit ─── */}
            <Modal show={modalBuka} onClose={() => setModalBuka(false)} maxWidth="lg">
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="text-base font-bold text-slate-900">
                            {modeEdit ? 'Edit Jadwal & Tarif Kereta' : 'Tambah Jadwal Kereta Baru'}
                        </h3>
                        <button
                            type="button"
                            onClick={() => setModalBuka(false)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                                    Kode Jadwal
                                </label>
                                <input
                                    type="text"
                                    value={form.data.kode_jadwal}
                                    onChange={(e) => form.setData('kode_jadwal', e.target.value.toUpperCase())}
                                    className="w-full uppercase font-mono rounded-xl border-slate-300 bg-slate-50 py-2.5 px-3 text-sm focus:border-emerald-500 focus:ring-emerald-500/20 focus:ring-4 transition"
                                    placeholder="JDW-001"
                                    required
                                />
                                <InputError message={form.errors.kode_jadwal} className="mt-1" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                                    Pilih Kereta
                                </label>
                                <select
                                    value={form.data.train_id}
                                    onChange={(e) => form.setData('train_id', e.target.value)}
                                    className="w-full rounded-xl border-slate-300 bg-slate-50 py-2.5 px-3 text-sm focus:border-emerald-500 focus:ring-emerald-500/20 focus:ring-4 transition"
                                    required
                                >
                                    <option value="">-- Pilih Kereta --</option>
                                    {daftarKereta.map((k) => (
                                        <option key={k.id} value={k.id}>
                                            {k.nama_kereta} ({k.nomor_kereta})
                                        </option>
                                    ))}
                                </select>
                                <InputError message={form.errors.train_id} className="mt-1" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                                    Stasiun Asal
                                </label>
                                <select
                                    value={form.data.station_asal_id}
                                    onChange={(e) => form.setData('station_asal_id', e.target.value)}
                                    className="w-full rounded-xl border-slate-300 bg-slate-50 py-2.5 px-3 text-sm focus:border-emerald-500 focus:ring-emerald-500/20 focus:ring-4 transition"
                                    required
                                >
                                    <option value="">-- Pilih Stasiun Asal --</option>
                                    {daftarStasiun.map((st) => (
                                        <option key={st.id} value={st.id}>
                                            {st.nama_stasiun} ({st.kode_stasiun}) - {st.kota}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={form.errors.station_asal_id} className="mt-1" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                                    Stasiun Tujuan
                                </label>
                                <select
                                    value={form.data.station_tujuan_id}
                                    onChange={(e) => form.setData('station_tujuan_id', e.target.value)}
                                    className="w-full rounded-xl border-slate-300 bg-slate-50 py-2.5 px-3 text-sm focus:border-emerald-500 focus:ring-emerald-500/20 focus:ring-4 transition"
                                    required
                                >
                                    <option value="">-- Pilih Stasiun Tujuan --</option>
                                    {daftarStasiun.map((st) => (
                                        <option key={st.id} value={st.id}>
                                            {st.nama_stasiun} ({st.kode_stasiun}) - {st.kota}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={form.errors.station_tujuan_id} className="mt-1" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                                    Waktu Keberangkatan
                                </label>
                                <input
                                    type="datetime-local"
                                    value={form.data.waktu_berangkat}
                                    onChange={(e) => form.setData('waktu_berangkat', e.target.value)}
                                    className="w-full rounded-xl border-slate-300 bg-slate-50 py-2.5 px-3 text-sm focus:border-emerald-500 focus:ring-emerald-500/20 focus:ring-4 transition"
                                    required
                                />
                                <InputError message={form.errors.waktu_berangkat} className="mt-1" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                                    Waktu Kedatangan (Tiba)
                                </label>
                                <input
                                    type="datetime-local"
                                    value={form.data.waktu_tiba}
                                    onChange={(e) => form.setData('waktu_tiba', e.target.value)}
                                    className="w-full rounded-xl border-slate-300 bg-slate-50 py-2.5 px-3 text-sm focus:border-emerald-500 focus:ring-emerald-500/20 focus:ring-4 transition"
                                    required
                                />
                                <InputError message={form.errors.waktu_tiba} className="mt-1" />
                            </div>
                        </div>

                        {/* Tarif Berdasarkan 3 Kelas */}
                        <div className="pt-2 border-t border-slate-100">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                Penataan Tarif Tiket Berdasarkan Kelas Gerbong (IDR)
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200">
                                    <label className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                        Kelas Ekonomi
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        step={1000}
                                        value={form.data.harga_ekonomi}
                                        onChange={(e) => form.setData('harga_ekonomi', e.target.value)}
                                        className="w-full rounded-lg border-slate-300 bg-white py-2 px-2.5 text-sm font-bold text-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20 focus:ring-4 transition"
                                        placeholder="150000"
                                        required
                                    />
                                    <InputError message={form.errors.harga_ekonomi} className="mt-1" />
                                </div>

                                <div className="p-3 bg-sky-50/50 rounded-xl border border-sky-200">
                                    <label className="flex items-center gap-1.5 text-[11px] font-bold text-sky-800 uppercase tracking-wider mb-1">
                                        <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                                        Kelas Bisnis
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        step={1000}
                                        value={form.data.harga_bisnis}
                                        onChange={(e) => form.setData('harga_bisnis', e.target.value)}
                                        className="w-full rounded-lg border-slate-300 bg-white py-2 px-2.5 text-sm font-bold text-slate-800 focus:border-sky-500 focus:ring-sky-500/20 focus:ring-4 transition"
                                        placeholder="250000"
                                        required
                                    />
                                    <InputError message={form.errors.harga_bisnis} className="mt-1" />
                                </div>

                                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200">
                                    <label className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1">
                                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                        Kelas Eksekutif
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        step={1000}
                                        value={form.data.harga_eksekutif}
                                        onChange={(e) => form.setData('harga_eksekutif', e.target.value)}
                                        className="w-full rounded-lg border-slate-300 bg-white py-2 px-2.5 text-sm font-bold text-slate-800 focus:border-amber-500 focus:ring-amber-500/20 focus:ring-4 transition"
                                        placeholder="400000"
                                        required
                                    />
                                    <InputError message={form.errors.harga_eksekutif} className="mt-1" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setModalBuka(false)}
                            className="px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-600 hover:bg-slate-100 border border-slate-200 transition"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition active:scale-95 disabled:opacity-60"
                        >
                            {form.processing ? 'Menyimpan...' : modeEdit ? 'Simpan Perubahan' : 'Tambah Jadwal'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
