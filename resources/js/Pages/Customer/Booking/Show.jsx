import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';

export default function BookingShow({ booking }) {
    const { flash } = usePage().props;
    const dataBooking = booking?.data || booking || {};
    const [fileTerpilih, setFileTerpilih] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    const formUpload = useForm({
        bukti_pembayaran: null,
    });

    const handlePilihFile = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validasi ekstensi dan tipe file
        const validExtensions = ['jpg', 'jpeg', 'png'];
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];

        if (!validExtensions.includes(fileExt) || (file.type && !validTypes.includes(file.type))) {
            alert('Format berkas tidak didukung! Hanya file gambar JPG, JPEG, atau PNG yang diperbolehkan.');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        // Validasi ukuran file (maks 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('Ukuran file terlalu besar! Maksimal ukuran file adalah 2MB.');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setFileTerpilih(file);
        formUpload.setData('bukti_pembayaran', file);

        // Buat URL preview
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
    };

    const handleBatalPilih = () => {
        setFileTerpilih(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        formUpload.reset();
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUploadBukti = (e) => {
        e.preventDefault();
        formUpload.post(route('payments.upload', dataBooking.id), {
            forceFormData: true,
            onSuccess: () => {
                handleBatalPilih();
            },
        });
    };

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
                        <div className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-2xl p-5 bg-emerald-50/40 transition">
                            {dataBooking.payment?.status === 'REJECTED' && (
                                <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3.5 py-2.5 mb-4">
                                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                                    <span>Bukti pembayaran sebelumnya ditolak. Silakan upload ulang file baru.</span>
                                </div>
                            )}

                            {/* Hidden File Input dengan batasan jpg, jpeg, png */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            {!fileTerpilih ? (
                                <div
                                    onClick={handlePilihFile}
                                    className="cursor-pointer group flex flex-col items-center justify-center py-6 px-4 text-center rounded-xl hover:bg-emerald-100/50 transition border border-dashed border-transparent hover:border-emerald-300"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 group-hover:scale-105 group-hover:bg-emerald-200 transition flex items-center justify-center mb-3">
                                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-bold text-emerald-800 group-hover:text-emerald-900 transition">
                                        Klik untuk Upload Bukti Pembayaran
                                    </span>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Pilih file gambar dari perangkat Anda
                                    </p>
                                    <span className="inline-block mt-2 px-2.5 py-0.5 rounded-md bg-white border border-emerald-200 text-[11px] font-semibold text-emerald-700 shadow-2xs">
                                        Hanya file JPG, JPEG, atau PNG (Maks. 2MB)
                                    </span>
                                </div>
                            ) : (
                                <form onSubmit={handleUploadBukti} className="space-y-4">
                                    <div className="p-3.5 bg-white rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-center gap-4">
                                        {previewUrl ? (
                                            <img
                                                src={previewUrl}
                                                alt="Preview Bukti"
                                                className="w-20 h-20 object-cover rounded-lg border border-slate-200 shadow-2xs shrink-0"
                                            />
                                        ) : (
                                            <div className="w-20 h-20 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            </div>
                                        )}

                                        <div className="flex-1 min-w-0 text-center sm:text-left">
                                            <div className="flex items-center justify-center sm:justify-start gap-2">
                                                <span className="text-xs font-bold text-slate-800 truncate">{fileTerpilih.name}</span>
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    {(fileTerpilih.size / 1024).toFixed(1)} KB
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 mt-0.5">Format file valid: JPG/JPEG/PNG</p>
                                            <button
                                                type="button"
                                                onClick={handlePilihFile}
                                                className="mt-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                                            >
                                                Ganti file gambar lain
                                            </button>
                                        </div>
                                    </div>

                                    {formUpload.errors.bukti_pembayaran && (
                                        <p className="text-xs font-medium text-rose-500 px-1">{formUpload.errors.bukti_pembayaran}</p>
                                    )}

                                    <div className="flex items-center gap-2 pt-1">
                                        <button
                                            type="submit"
                                            disabled={formUpload.processing}
                                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition active:scale-95 disabled:opacity-60"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                            {formUpload.processing ? 'Mengunggah...' : 'Kirim Bukti Pembayaran'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleBatalPilih}
                                            className="px-4 py-2.5 rounded-xl font-semibold text-xs bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition"
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
