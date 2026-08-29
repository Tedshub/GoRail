import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import { Head, useForm, router, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function TrainsIndex({ trains }) {
    const { flash } = usePage().props;
    const daftarKereta = trains?.data || [];
    const meta = trains?.meta || trains || {};

    const [modalBuka, setModalBuka] = useState(false);
    const [modeEdit, setModeEdit] = useState(false);
    const [keretaSedangDiedit, setKeretaSedangDiedit] = useState(null);

    const form = useForm({
        nama_kereta: '',
        nomor_kereta: '',
    });

    const handleBukaTambah = () => {
        setModeEdit(false);
        setKeretaSedangDiedit(null);
        form.reset();
        form.clearErrors();
        setModalBuka(true);
    };

    const handleBukaEdit = (k) => {
        setModeEdit(true);
        setKeretaSedangDiedit(k);
        form.clearErrors();
        form.setData({
            nama_kereta: k.nama_kereta || '',
            nomor_kereta: k.nomor_kereta || '',
        });
        setModalBuka(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (modeEdit && keretaSedangDiedit) {
            form.put(route('admin.trains.update', keretaSedangDiedit.id), {
                onSuccess: () => {
                    setModalBuka(false);
                    form.reset();
                },
            });
        } else {
            form.post(route('admin.trains.store'), {
                onSuccess: () => {
                    setModalBuka(false);
                    form.reset();
                },
            });
        }
    };

    const handleHapus = (k) => {
        if (confirm(`Yakin ingin menghapus kereta "${k.nama_kereta}" (${k.nomor_kereta})?`)) {
            router.delete(route('admin.trains.destroy', k.id));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Kereta - Admin GoRail" />

            <div className="space-y-6">
                {/* ─── Header ─── */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-8 shadow-sm border border-slate-700/50">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Manajemen Armada Kereta</h1>
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                    Master Data
                                </span>
                            </div>
                            <p className="text-sm text-slate-300 mt-1">
                                Kelola daftar rangkaian armada kereta api yang beroperasi pada sistem GoRail.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                            <Link
                                href={route('admin.coaches.index')}
                                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-sm transition backdrop-blur-sm"
                            >
                                Kelola Gerbong
                            </Link>

                            <button
                                onClick={handleBukaTambah}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 active:scale-95 transition"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Tambah Kereta
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
                        {daftarKereta.length === 0 ? (
                            <div className="py-10 text-center text-slate-400">
                                Belum ada armada kereta yang didaftarkan.
                            </div>
                        ) : (
                            daftarKereta.map((k) => {
                                const coachCount = k.coaches ? k.coaches.length : 0;
                                return (
                                    <div key={k.id} className="p-4 space-y-2.5 hover:bg-slate-50/50 transition">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                                                {k.nomor_kereta}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                                                {coachCount} Gerbong
                                            </span>
                                        </div>
                                        <p className="font-bold text-sm text-slate-900">{k.nama_kereta}</p>

                                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                                            <button
                                                onClick={() => handleBukaEdit(k)}
                                                className="px-3 py-1.5 rounded-lg font-semibold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleHapus(k)}
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
                                    <th className="py-4 px-5">Nomor Kereta</th>
                                    <th className="py-4 px-5">Nama Kereta</th>
                                    <th className="py-4 px-5">Jumlah Gerbong</th>
                                    <th className="py-4 px-5 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {daftarKereta.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-10 text-center text-slate-400">
                                            Belum ada armada kereta yang didaftarkan.
                                        </td>
                                    </tr>
                                ) : (
                                    daftarKereta.map((k) => {
                                        const coachCount = k.coaches ? k.coaches.length : 0;
                                        return (
                                            <tr key={k.id} className="hover:bg-slate-50/60 transition">
                                                <td className="py-4 px-5">
                                                    <span className="font-mono font-bold text-sm px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                                                        {k.nomor_kereta}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-5 font-bold text-slate-900">
                                                    {k.nama_kereta}
                                                </td>
                                                <td className="py-4 px-5 text-slate-600">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                                                        {coachCount} Gerbong
                                                    </span>
                                                </td>
                                                <td className="py-4 px-5 text-right">
                                                    <div className="inline-flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleBukaEdit(k)}
                                                            className="px-3 py-1.5 rounded-lg font-semibold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleHapus(k)}
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
                            {modeEdit ? 'Edit Data Kereta' : 'Tambah Kereta Baru'}
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
                                Nomor Kereta (Kode Unik)
                            </label>
                            <input
                                type="text"
                                value={form.data.nomor_kereta}
                                onChange={(e) => form.setData('nomor_kereta', e.target.value.toUpperCase())}
                                className="w-full uppercase font-mono rounded-xl border-slate-300 bg-slate-50 py-2.5 px-3 text-sm focus:border-emerald-500 focus:ring-emerald-500/20 focus:ring-4 transition"
                                placeholder="KA-01 / ARGO-001"
                                required
                            />
                            <InputError message={form.errors.nomor_kereta} className="mt-1" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                                Nama Kereta Api
                            </label>
                            <input
                                type="text"
                                value={form.data.nama_kereta}
                                onChange={(e) => form.setData('nama_kereta', e.target.value)}
                                className="w-full rounded-xl border-slate-300 bg-slate-50 py-2.5 px-3 text-sm focus:border-emerald-500 focus:ring-emerald-500/20 focus:ring-4 transition"
                                placeholder="Argo Bromo Anggrek / Parahyangan"
                                required
                            />
                            <InputError message={form.errors.nama_kereta} className="mt-1" />
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
                            {form.processing ? 'Menyimpan...' : modeEdit ? 'Simpan Perubahan' : 'Tambah Kereta'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
