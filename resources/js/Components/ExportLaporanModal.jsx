import Modal from '@/Components/Modal';
import { useState } from 'react';
import { Calendar, FileSpreadsheet, Download, X, AlertCircle } from 'lucide-react';

export default function ExportLaporanModal({ show = false, onClose = () => {} }) {
    const [tanggalMulai, setTanggalMulai] = useState('');
    const [tanggalSelesai, setTanggalSelesai] = useState('');
    const [errorPesan, setErrorPesan] = useState('');

    const handleDownload = (e) => {
        e.preventDefault();
        setErrorPesan('');

        if (tanggalMulai && tanggalSelesai && tanggalMulai > tanggalSelesai) {
            setErrorPesan('Tanggal mulai tidak boleh melebihi tanggal selesai.');
            return;
        }

        const params = new URLSearchParams();
        if (tanggalMulai) params.append('tanggal_mulai', tanggalMulai);
        if (tanggalSelesai) params.append('tanggal_selesai', tanggalSelesai);

        const url = `${route('reports.bookings.export')}?${params.toString()}`;

        // Trigger download via window location
        window.location.href = url;

        // Tutup modal setelah mengunduh
        onClose();
    };

    const handleDownloadSemua = () => {
        window.location.href = route('reports.bookings.export');
        onClose();
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6">
                {/* Header Modal */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <FileSpreadsheet className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Unduh Laporan Transaksi</h3>
                            <p className="text-xs text-slate-500">Format Excel (.xlsx) dengan filter rentang waktu</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body Form */}
                <form onSubmit={handleDownload} className="mt-5 space-y-4">
                    {errorPesan && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{errorPesan}</span>
                        </div>
                    )}

                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3.5 text-xs text-emerald-800">
                        <span className="font-bold block mb-1">Info Format Berkas:</span>
                        Laporan otomatis di-generate dalam format <strong>Excel (.xlsx)</strong> dengan rincian kode booking, nama pemesan, rute, jadwal, status transaksi, dan total pembayaran.
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Tanggal Mulai
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={tanggalMulai}
                                    onChange={(e) => setTanggalMulai(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition py-2.5 px-3"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Tanggal Selesai
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={tanggalSelesai}
                                    onChange={(e) => setTanggalSelesai(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition py-2.5 px-3"
                                />
                            </div>
                        </div>
                    </div>

                    <p className="text-[11px] text-slate-400 italic">
                        *Kosongkan kedua tanggal untuk mengunduh seluruh data transaksi booking tanpa filter.
                    </p>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2 justify-end">
                        <button
                            type="button"
                            onClick={handleDownloadSemua}
                            className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                        >
                            Unduh Semua Data
                        </button>
                        <button
                            type="submit"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 active:scale-95 transition"
                        >
                            <Download className="w-4 h-4" />
                            Unduh Excel (.xlsx)
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
