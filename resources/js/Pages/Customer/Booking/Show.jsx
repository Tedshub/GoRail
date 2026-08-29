import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function BookingShow({ booking }) {
    const { flash } = usePage().props;
    const dataBooking = booking?.data || booking || {};
    const [tampilkanUpload, setTampilkanUpload] = useState(false);

    const formUpload = useForm({
        bukti_pembayaran: null,
    });

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
    };

    const formatTanggal = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    const formatJam = (dateString) => {
        if (!dateString) return '--:--';
        return new Date(dateString).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusBookingBadge = (status) => {
        const s = (status || '').toUpperCase();
        const peta = {
            CONFIRMED: { warna: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500', label: 'Dikonfirmasi' },
            PENDING: { warna: 'bg-amber-100 text-amber-800 border-amber-200', dot: 'bg-amber-500 animate-pulse', label: 'Menunggu' },
            CANCELLED: { warna: 'bg-rose-100 text-rose-800 border-rose-200', dot: 'bg-rose-500', label: 'Dibatalkan' },
            COMPLETED: { warna: 'bg-sky-100 text-sky-800 border-sky-200', dot: 'bg-sky-500', label: 'Selesai' },
        };
        const cfg = peta[s] || { warna: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400', label: status };
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${cfg.warna}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
                {cfg.label}
            </span>
        );
    };

    const getStatusPembayaranBadge = (status) => {
        const s = (status || '').toUpperCase();
        const peta = {
            PAID: { warna: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500', label: 'Lunas' },
            WAITING_VERIFICATION: { warna: 'bg-amber-100 text-amber-800 border-amber-200', dot: 'bg-amber-500 animate-pulse', label: 'Menunggu Verifikasi' },
            UNPAID: { warna: 'bg-sky-100 text-sky-800 border-sky-200', dot: 'bg-sky-500', label: 'Belum Dibayar' },
            REJECTED: { warna: 'bg-rose-100 text-rose-800 border-rose-200', dot: 'bg-rose-500', label: 'Ditolak' },
        };
        const cfg = peta[s] || { warna: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400', label: status };
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${cfg.warna}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
                {cfg.label}
            </span>
        );
    };

    const handleUploadBukti = (e) => {
        e.preventDefault();
        formUpload.post(route('payments.upload', dataBooking.id), {
            forceFormData: true,
            onSuccess: () => {
                setTampilkanUpload(false);
                formUpload.reset();
            },
        });
    };

    const handleBatalkan = () => {
        if (confirm('Apakah Anda yakin ingin membatalkan booking ini?')) {
            router.post(route('bookings.cancel', dataBooking.id));
        }
    };

    const bisaUploadBukti = dataBooking.payment?.status === 'UNPAID' || dataBooking.payment?.status === 'REJECTED';
    const bisaDibatalkan = dataBooking.status === 'PENDING';
    const bisaLihatTiket = dataBooking.status === 'CONFIRMED' && dataBooking.payment?.status === 'PAID';

    return (
        <AuthenticatedLayout>
            <Head title={`Booking ${dataBooking.kode_booking || ''} — GoRail`} />

            <div className="space-y-6">
                {/* ─── BREADCRUMB ─────────────────────────── */}
                <nav className="flex items-center gap-2 text-sm">
                    <Link href={route('bookings.index')} className="text-emerald-600 hover:text-emerald-700 font-medium">← Kembali ke Pesanan</Link>
                </nav>

                {/* ─── FLASH MESSAGE ──────────────────────── */}
                {flash?.sukses && (
                    <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {flash.sukses}
                    </div>
                )}

                {/* ─── HEADER ─────────────────────────────── */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-slate-800">{dataBooking.kode_booking}</h1>
                                <p className="text-xs text-slate-500">Dibuat pada {formatTanggal(dataBooking.created_at)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {getStatusBookingBadge(dataBooking.status)}
                            {bisaLihatTiket && (
                                <Link
                                    href={route('tickets.show', dataBooking.id)}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                                    Lihat E-Ticket
                                </Link>
                            )}
                            {bisaDibatalkan && (
                                <button
                                    onClick={handleBatalkan}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition"
                                >
                                    Batalkan
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* ─── INFO JADWAL ────────────────────────── */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
                    <h2 className="text-sm font-bold text-slate-800 mb-4">Informasi Perjalanan</h2>
                    <div className="flex items-center gap-5">
                        <div className="text-center">
                            <p className="text-xl font-bold text-slate-900">{formatJam(dataBooking.schedule?.waktu_berangkat)}</p>
                            <p className="text-xs text-slate-500 font-medium">{dataBooking.schedule?.station_asal?.nama_stasiun}</p>
                        </div>
                        <div className="flex-1 flex items-center gap-1">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-emerald-200"></div>
                            <div className="flex-1 border-t-2 border-dashed border-slate-300"></div>
                            <div className="text-center px-3">
                                <p className="text-xs font-bold text-slate-700">{dataBooking.schedule?.train?.nama_kereta}</p>
                                <p className="text-[10px] text-slate-400">{dataBooking.schedule?.kode_jadwal}</p>
                            </div>
                            <div className="flex-1 border-t-2 border-dashed border-slate-300"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-rose-400 border-2 border-rose-200"></div>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-bold text-slate-900">{formatJam(dataBooking.schedule?.waktu_tiba)}</p>
                            <p className="text-xs text-slate-500 font-medium">{dataBooking.schedule?.station_tujuan?.nama_stasiun}</p>
                        </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                        <span>Tanggal Berangkat: <strong className="text-slate-700">{formatTanggal(dataBooking.tanggal_berangkat)}</strong></span>
                    </div>
                </div>

                {/* ─── PENUMPANG & KURSI ──────────────────── */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
                    <h2 className="text-sm font-bold text-slate-800 mb-4">Data Penumpang & Kursi</h2>
                    {dataBooking.booking_seats && dataBooking.booking_seats.length > 0 ? (
                        <div className="space-y-3">
                            {dataBooking.booking_seats.map((bs, indeks) => (
                                <div key={bs.id || indeks} className="flex items-center justify-between border border-slate-200 rounded-xl px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <span className="w-7 h-7 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">{indeks + 1}</span>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{bs.passenger?.nama_penumpang || '-'}</p>
                                            <p className="text-xs text-slate-500">{bs.passenger?.jenis_identitas}: {bs.passenger?.nomor_identitas}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                            {bs.seat?.coach?.nama_gerbong} — Kursi {bs.seat?.nomor_kursi}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : dataBooking.passengers && dataBooking.passengers.length > 0 ? (
                        <div className="space-y-3">
                            {dataBooking.passengers.map((penumpang, indeks) => (
                                <div key={penumpang.id || indeks} className="flex items-center gap-3 border border-slate-200 rounded-xl px-4 py-3">
                                    <span className="w-7 h-7 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">{indeks + 1}</span>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">{penumpang.nama_penumpang}</p>
                                        <p className="text-xs text-slate-500">{penumpang.jenis_identitas}: {penumpang.nomor_identitas}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500">Tidak ada data penumpang.</p>
                    )}
                </div>

                {/* ─── PEMBAYARAN ─────────────────────────── */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold text-slate-800">Pembayaran</h2>
                        {getStatusPembayaranBadge(dataBooking.payment?.status)}
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 mb-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Total Pembayaran</span>
                            <span className="text-2xl font-extrabold text-emerald-600">{formatRupiah(dataBooking.payment?.jumlah)}</span>
                        </div>
                        {dataBooking.payment?.waktu_verifikasi && (
                            <div className="mt-2 pt-2 border-t border-slate-200 text-xs text-slate-500">
                                Diverifikasi pada {formatTanggal(dataBooking.payment.waktu_verifikasi)} oleh {dataBooking.payment.verifier?.name || 'Staff'}
                            </div>
                        )}
                    </div>

                    {/* Upload Bukti Pembayaran */}
                    {bisaUploadBukti && (
                        <div className="border border-dashed border-emerald-300 rounded-xl p-4 bg-emerald-50/50">
                            {dataBooking.payment?.status === 'REJECTED' && (
                                <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 mb-3">
                                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                                    Bukti pembayaran sebelumnya ditolak. Silakan upload ulang.
                                </div>
                            )}

                            {!tampilkanUpload ? (
                                <button
                                    onClick={() => setTampilkanUpload(true)}
                                    className="w-full text-center py-3 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition"
                                >
                                    <svg className="w-8 h-8 mx-auto mb-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                    Klik untuk Upload Bukti Pembayaran
                                </button>
                            ) : (
                                <form onSubmit={handleUploadBukti} className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 mb-1.5">File Bukti Pembayaran</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => formUpload.setData('bukti_pembayaran', e.target.files[0])}
                                            className="w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200 transition"
                                        />
                                        {formUpload.errors.bukti_pembayaran && (
                                            <p className="text-xs text-rose-500 mt-1">{formUpload.errors.bukti_pembayaran}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="submit"
                                            disabled={formUpload.processing || !formUpload.data.bukti_pembayaran}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition disabled:opacity-60"
                                        >
                                            {formUpload.processing ? 'Mengunggah...' : 'Upload Bukti'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setTampilkanUpload(false); formUpload.reset(); }}
                                            className="px-4 py-2 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}

                    {/* Bukti sudah diupload */}
                    {dataBooking.payment?.has_bukti && dataBooking.payment?.status !== 'UNPAID' && (
                        <div className="flex items-center gap-2 mt-3">
                            <a
                                href={route('payments.bukti', dataBooking.payment.id)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                Lihat Bukti Pembayaran
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
