import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import { Head, useForm, router, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function StationsIndex({ stations }) {
    const { flash } = usePage().props;
    const daftarStasiun = stations?.data || [];
    const meta = stations?.meta || stations || {};

    const [modalBuka, setModalBuka] = useState(false);
    const [modeEdit, setModeEdit] = useState(false);
    const [stasiunSedangDiedit, setStasiunSedangDiedit] = useState(null);
    const [modalImportBuka, setModalImportBuka] = useState(false);

    const form = useForm({
        kode_stasiun: '',
        nama_stasiun: '',
        kota: '',
    });

    const formImport = useForm({
        file_csv: null,
    });

    const handleBukaTambah = () => {
        setModeEdit(false);
        setStasiunSedangDiedit(null);
        form.reset();
        form.clearErrors();
        setModalBuka(true);
    };

    const handleBukaEdit = (st) => {
        setModeEdit(true);
        setStasiunSedangDiedit(st);
        form.clearErrors();
        form.setData({
            kode_stasiun: st.kode_stasiun || '',
            nama_stasiun: st.nama_stasiun || '',
            kota: st.kota || '',
        });
        setModalBuka(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (modeEdit && stasiunSedangDiedit) {
            form.put(route('admin.stations.update', stasiunSedangDiedit.id), {
                onSuccess: () => {
                    setModalBuka(false);
                    form.reset();
                },
            });
        } else {
            form.post(route('admin.stations.store'), {
                onSuccess: () => {
                    setModalBuka(false);
                    form.reset();
                },
            });
        }
    };

    const handleHapus = (st) => {
        if (confirm(`Yakin ingin menghapus stasiun "${st.nama_stasiun}" (${st.kode_stasiun})?`)) {
            router.delete(route('admin.stations.destroy', st.id));
        }
    };

    const handleImportSubmit = (e) => {
        e.preventDefault();
        formImport.post(route('admin.stations.import'), {
            forceFormData: true,
            onSuccess: () => {
                setModalImportBuka(false);
                formImport.reset();
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Stasiun - Admin GoRail" />

            <div className="space-y-6">
                {/* ─── Header ─── */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-8 shadow-sm border border-slate-700/50">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Manajemen Stasiun</h1>
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                    Master Data
                                </span>
                            </div>
                            <p className="text-sm text-slate-300 mt-1">
                                Kelola daftar stasiun kereta api dan import massal data stasiun via format CSV.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 self-start sm:self-auto">
                            <button
                                onClick={() => {
                                    formImport.reset();
                                    formImport.clearErrors();
                                    setModalImportBuka(true);
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-sm active:scale-95 transition backdrop-blur-sm"
                            >
                                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                Impor CSV
                            </button>

                            <button
                                onClick={handleBukaTambah}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 active:scale-95 transition"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Tambah Stasiun
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
                        {daftarStasiun.length === 0 ? (
                            <div className="py-10 text-center text-slate-400">
                                Belum ada data stasiun.
                            </div>
                        ) : (
                            daftarStasiun.map((st) => (
                                <div key={st.id} className="p-4 space-y-2.5 hover:bg-slate-50/50 transition">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-mono font-black text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                                            {st.kode_stasiun}
                                        </span>
                                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                                            {st.kota}
                                        </span>
                                    </div>
                                    <p className="font-bold text-sm text-slate-900">{st.nama_stasiun}</p>

                                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                                        <button
                                            onClick={() => handleBukaEdit(st)}
                                            className="px-3 py-1.5 rounded-lg font-semibold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleHapus(st)}
                                            className="px-3 py-1.5 rounded-lg font-semibold text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* ─── Desktop Table View ─── */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <th className="py-4 px-5">Kode Stasiun</th>
                                    <th className="py-4 px-5">Nama Stasiun</th>
                                    <th className="py-4 px-5">Kota / Wilayah</th>
                                    <th className="py-4 px-5 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {daftarStasiun.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-10 text-center text-slate-400">
                                            Belum ada data stasiun.
                                        </td>
                                    </tr>
                                ) : (
                                    daftarStasiun.map((st) => (
                                        <tr key={st.id} className="hover:bg-slate-50/60 transition">
                                            <td className="py-4 px-5">
                                                <span className="font-mono font-black text-sm px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                                                    {st.kode_stasiun}
                                                </span>
                                            </td>
                                            <td className="py-4 px-5 font-bold text-slate-900">
                                                {st.nama_stasiun}
                                            </td>
                                            <td className="py-4 px-5 text-slate-600">
                                                {st.kota}
                                            </td>
                                            <td className="py-4 px-5 text-right">
                                                <div className="inline-flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleBukaEdit(st)}
                                                        className="px-3 py-1.5 rounded-lg font-semibold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleHapus(st)}
                                                        className="px-3 py-1.5 rounded-lg font-semibold text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
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
                            {modeEdit ? 'Edit Data Stasiun' : 'Tambah Stasiun Baru'}
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
                                Kode Stasiun (3-5 Huruf)
                            </label>
                            <input
                                type="text"
                                value={form.data.kode_stasiun}
                                onChange={(e) => form.setData('kode_stasiun', e.target.value.toUpperCase())}
                                className="w-full uppercase font-mono rounded-xl border-slate-300 bg-slate-50 py-2.5 px-3 text-sm focus:border-emerald-500 focus:ring-emerald-500/20 focus:ring-4 transition"
                                placeholder="GMR / BD / SGU"
                                maxLength={10}
                                required
                            />
                            <InputError message={form.errors.kode_stasiun} className="mt-1" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                                Nama Stasiun
                            </label>
                            <input
                                type="text"
                                value={form.data.nama_stasiun}
                                onChange={(e) => form.setData('nama_stasiun', e.target.value)}
                                className="w-full rounded-xl border-slate-300 bg-slate-50 py-2.5 px-3 text-sm focus:border-emerald-500 focus:ring-emerald-500/20 focus:ring-4 transition"
                                placeholder="Stasiun Gambir / Bandung"
                                required
                            />
                            <InputError message={form.errors.nama_stasiun} className="mt-1" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                                Kota / Wilayah
                            </label>
                            <input
                                type="text"
                                value={form.data.kota}
                                onChange={(e) => form.setData('kota', e.target.value)}
                                className="w-full rounded-xl border-slate-300 bg-slate-50 py-2.5 px-3 text-sm focus:border-emerald-500 focus:ring-emerald-500/20 focus:ring-4 transition"
                                placeholder="Jakarta Pusat / Bandung"
                                required
                            />
                            <InputError message={form.errors.kota} className="mt-1" />
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
                            {form.processing ? 'Menyimpan...' : modeEdit ? 'Simpan Perubahan' : 'Tambah Stasiun'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ─── Modal Import CSV ─── */}
            <Modal show={modalImportBuka} onClose={() => setModalImportBuka(false)} maxWidth="md">
                <form onSubmit={handleImportSubmit} className="p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="text-base font-bold text-slate-900">
                            Impor Massal Stasiun (CSV)
                        </h3>
                        <button
                            type="button"
                            onClick={() => setModalImportBuka(false)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-3">
                        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5 text-xs text-emerald-900 space-y-1">
                            <p className="font-bold">Format File CSV yang Diperlukan:</p>
                            <p className="font-mono text-[11px] bg-white/80 p-2 rounded border border-emerald-200 text-slate-700">
                                kode_stasiun,nama_stasiun,kota<br />
                                GMR,Gambir,Jakarta Pusat<br />
                                BD,Bandung,Bandung
                            </p>
                            <p className="text-[11px] text-emerald-800">
                                Baris pertama dianggap sebagai judul kolom (header) dan akan dilewati secara otomatis.
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                                Pilih Berkas CSV
                            </label>
                            <input
                                type="file"
                                accept=".csv,.txt"
                                onChange={(e) => formImport.setData('file_csv', e.target.files[0])}
                                className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200 transition"
                                required
                            />
                            <InputError message={formImport.errors.file_csv} className="mt-1" />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setModalImportBuka(false)}
                            className="px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-600 hover:bg-slate-100 border border-slate-200 transition"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={formImport.processing || !formImport.data.file_csv}
                            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition active:scale-95 disabled:opacity-60"
                        >
                            {formImport.processing ? 'Mengimpor...' : 'Mulai Impor'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
