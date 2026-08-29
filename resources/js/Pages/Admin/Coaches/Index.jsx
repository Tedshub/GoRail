import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import { Head, useForm, router, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function CoachesIndex({ coaches, trains = [], classes = [] }) {
    const { flash } = usePage().props;
    const daftarGerbong = coaches?.data || [];
    const meta = coaches?.meta || coaches || {};
    const daftarKereta = trains || [];
    const daftarKelas = classes.length > 0 ? classes : ['ekonomi', 'bisnis', 'eksekutif'];

    const [modalBuka, setModalBuka] = useState(false);
    const [modeEdit, setModeEdit] = useState(false);
    const [gerbongSedangDiedit, setGerbongSedangDiedit] = useState(null);

    const form = useForm({
        train_id: daftarKereta[0]?.id || '',
        nama_gerbong: '',
        kelas: daftarKelas[0] || 'ekonomi',
    });

    const handleBukaTambah = () => {
        setModeEdit(false);
        setGerbongSedangDiedit(null);
        form.reset();
        form.clearErrors();
        form.setData({
            train_id: daftarKereta[0]?.id || '',
            nama_gerbong: '',
            kelas: daftarKelas[0] || 'ekonomi',
        });
        setModalBuka(true);
    };

    const handleBukaEdit = (g) => {
        setModeEdit(true);
        setGerbongSedangDiedit(g);
        form.clearErrors();
        form.setData({
            train_id: g.train_id || (g.train && g.train.id) || '',
            nama_gerbong: g.nama_gerbong || '',
            kelas: g.kelas || 'ekonomi',
        });
        setModalBuka(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (modeEdit && gerbongSedangDiedit) {
            form.put(route('admin.coaches.update', gerbongSedangDiedit.id), {
                onSuccess: () => {
                    setModalBuka(false);
                    form.reset();
                },
            });
        } else {
            form.post(route('admin.coaches.store'), {
                onSuccess: () => {
                    setModalBuka(false);
                    form.reset();
                },
            });
        }
    };

    const handleHapus = (g) => {
        if (confirm(`Yakin ingin menghapus gerbong "${g.nama_gerbong}"?`)) {
            router.delete(route('admin.coaches.destroy', g.id));
        }
    };

    const getKelasBadge = (kelas) => {
        const k = (kelas || '').toLowerCase();
        if (k === 'eksekutif') {
            return (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 uppercase">
                    Eksekutif
                </span>
            );
        }
        if (k === 'bisnis') {
            return (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200 uppercase">
                    Bisnis
                </span>
            );
        }
        return (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                Ekonomi
            </span>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Gerbong - Admin GoRail" />

            <div className="space-y-6">
                {/* ─── Header ─── */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-8 shadow-sm border border-slate-700/50">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Manajemen Gerbong Kereta</h1>
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                    Master Data
                                </span>
                            </div>
                            <p className="text-sm text-slate-300 mt-1">
                                Kelola gerbong dan kelas (Ekonomi, Bisnis, Eksekutif) yang terhubung ke armada kereta.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                            <Link
                                href={route('admin.seats.index')}
                                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-sm transition backdrop-blur-sm"
                            >
                                Kelola Kursi
                            </Link>

                            <button
                                onClick={handleBukaTambah}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 active:scale-95 transition"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Tambah Gerbong
                            </button>
                        </div>
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
                        {daftarGerbong.length === 0 ? (
                            <div className="py-10 text-center text-slate-400">
                                Belum ada data gerbong.
                            </div>
                        ) : (
                            daftarGerbong.map((g) => {
                                const seatCount = g.seats ? g.seats.length : 0;
                                return (
                                    <div key={g.id} className="p-4 space-y-2.5 hover:bg-slate-50/50 transition">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="font-bold text-sm text-slate-900">{g.nama_gerbong}</span>
                                            <div>{getKelasBadge(g.kelas)}</div>
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                            <div>
                                                <span className="text-[10px] text-slate-400 block uppercase font-bold">Kereta</span>
                                                <span className="font-semibold text-slate-800">{g.train?.nama_kereta || '-'}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] text-slate-400 block uppercase font-bold">Kapasitas</span>
                                                <span className="font-bold text-slate-800">{seatCount} Kursi</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                                            <button
                                                onClick={() => handleBukaEdit(g)}
                                                className="px-3 py-1.5 rounded-lg font-semibold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleHapus(g)}
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
                                    <th className="py-4 px-5">Nama Gerbong</th>
                                    <th className="py-4 px-5">Armada Kereta</th>
                                    <th className="py-4 px-5">Kelas</th>
                                    <th className="py-4 px-5">Total Kursi</th>
                                    <th className="py-4 px-5 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {daftarGerbong.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-10 text-center text-slate-400">
                                            Belum ada data gerbong.
                                        </td>
                                    </tr>
                                ) : (
                                    daftarGerbong.map((g) => {
                                        const seatCount = g.seats ? g.seats.length : 0;
                                        return (
                                            <tr key={g.id} className="hover:bg-slate-50/60 transition">
                                                <td className="py-4 px-5 font-bold text-slate-900">
                                                    {g.nama_gerbong}
                                                </td>
                                                <td className="py-4 px-5">
                                                    <p className="font-semibold text-slate-800">
                                                        {g.train?.nama_kereta || '-'}
                                                    </p>
                                                    <p className="text-xs text-slate-400 font-mono">
                                                        {g.train?.nomor_kereta || ''}
                                                    </p>
                                                </td>
                                                <td className="py-4 px-5">
                                                    {getKelasBadge(g.kelas)}
                                                </td>
                                                <td className="py-4 px-5 text-slate-600">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                                                        {seatCount} Kursi
                                                    </span>
                                                </td>
                                                <td className="py-4 px-5 text-right">
                                                    <div className="inline-flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleBukaEdit(g)}
                                                            className="px-3 py-1.5 rounded-lg font-semibold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleHapus(g)}
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
            <Modal show={modalBuka} onClose={() => setModalBuka(false)} maxWidth="md">
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="text-base font-bold text-slate-900">
                            {modeEdit ? 'Edit Data Gerbong' : 'Tambah Gerbong Baru'}
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
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                                Pilih Kereta Api
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

                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                                Nama / Nomor Gerbong
                            </label>
                            <input
                                type="text"
                                value={form.data.nama_gerbong}
                                onChange={(e) => form.setData('nama_gerbong', e.target.value)}
                                className="w-full rounded-xl border-slate-300 bg-slate-50 py-2.5 px-3 text-sm focus:border-emerald-500 focus:ring-emerald-500/20 focus:ring-4 transition"
                                placeholder="Contoh: Gerbong 1, Eksekutif 2"
                                required
                            />
                            <InputError message={form.errors.nama_gerbong} className="mt-1" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                                Kelas Pelayanan
                            </label>
                            <select
                                value={form.data.kelas}
                                onChange={(e) => form.setData('kelas', e.target.value)}
                                className="w-full rounded-xl border-slate-300 bg-slate-50 py-2.5 px-3 text-sm focus:border-emerald-500 focus:ring-emerald-500/20 focus:ring-4 transition"
                            >
                                {daftarKelas.map((kls) => (
                                    <option key={kls} value={kls} className="capitalize">
                                        {kls.charAt(0).toUpperCase() + kls.slice(1)}
                                    </option>
                                ))}
                            </select>
                            <InputError message={form.errors.kelas} className="mt-1" />
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
                            {form.processing ? 'Menyimpan...' : modeEdit ? 'Simpan Perubahan' : 'Tambah Gerbong'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
