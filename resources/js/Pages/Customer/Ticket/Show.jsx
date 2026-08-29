import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function TicketShow({ booking }) {
    const dataBooking = booking?.data || booking || {};
    const daftarBookingSeats = dataBooking.booking_seats || dataBooking.bookingSeats || [];
    const daftarPenumpang = dataBooking.passengers || [];

    const formatTanggal = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatJam = (dateString) => {
        if (!dateString) return '--:--';
        return new Date(dateString).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(angka || 0);
    };

    return (
        <AuthenticatedLayout>
            <Head title={`E-Ticket - ${dataBooking.kode_booking || ''}`} />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* ─── Breadcrumbs & Action Bar ─── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <nav className="flex items-center gap-2 text-sm text-slate-500">
                        <Link href={route('bookings.index')} className="text-emerald-600 hover:underline font-medium">
                            Pesanan Saya
                        </Link>
                        <span>/</span>
                        <Link href={route('bookings.show', dataBooking.id)} className="text-emerald-600 hover:underline font-medium">
                            Detail Booking
                        </Link>
                        <span>/</span>
                        <span className="text-slate-700 font-semibold">E-Ticket</span>
                    </nav>

                    <div className="flex items-center gap-3">
                        <a
                            href={route('tickets.download', dataBooking.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 active:scale-95 transition"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Unduh Tiket (PDF)
                        </a>
                        <button
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 active:scale-95 transition"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Cetak
                        </button>
                    </div>
                </div>

                {/* ─── Modern Ticket Card ─── */}
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden print:border-none print:shadow-none">
                    {/* Ticket Header */}
                    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 font-black text-lg">
                                    G
                                </div>
                                <span className="text-xl font-black tracking-tight text-white">GoRail Boarding Pass</span>
                            </div>
                            <p className="text-xs text-slate-300">Tiket Elektronik Resmi PT GoRail Indonesia</p>
                        </div>

                        <div className="text-left sm:text-right bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15">
                            <p className="text-[11px] uppercase tracking-wider text-emerald-300 font-bold">Kode Booking</p>
                            <p className="text-lg sm:text-xl font-mono font-black text-white">{dataBooking.kode_booking}</p>
                        </div>
                    </div>

                    {/* Ticket Body */}
                    <div className="p-6 sm:p-8 space-y-8">
                        {/* Perjalanan & Kereta */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Kereta Api</p>
                                <p className="text-base font-extrabold text-slate-900">{dataBooking.schedule?.train?.nama_kereta}</p>
                                <p className="text-xs text-slate-500 font-mono mt-0.5">{dataBooking.schedule?.kode_jadwal}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tanggal Keberangkatan</p>
                                <p className="text-base font-extrabold text-slate-900">{formatTanggal(dataBooking.tanggal_berangkat)}</p>
                                <p className="text-xs text-emerald-600 font-semibold mt-0.5">Status: Terkonfirmasi</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Pembayaran</p>
                                <p className="text-base font-extrabold text-emerald-700">{formatRupiah(dataBooking.payment?.jumlah)}</p>
                                <span className="inline-block mt-0.5 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                    LUNAS
                                </span>
                            </div>
                        </div>

                        {/* Rute Visual */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4 py-3">
                            <div className="text-center sm:text-left">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Berangkat</span>
                                <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                                    {formatJam(dataBooking.schedule?.waktu_berangkat)}
                                </p>
                                <p className="text-sm font-bold text-slate-800 mt-0.5">
                                    {dataBooking.schedule?.station_asal?.nama_stasiun} ({dataBooking.schedule?.station_asal?.kode_stasiun})
                                </p>
                                <p className="text-xs text-slate-500">{dataBooking.schedule?.station_asal?.kota}</p>
                            </div>

                            <div className="flex-1 w-full max-w-xs flex flex-col items-center gap-2">
                                <div className="flex items-center justify-between w-full text-xs text-slate-400 font-medium">
                                    <span>Asal</span>
                                    <span className="text-emerald-600 font-bold">Langsung</span>
                                    <span>Tujuan</span>
                                </div>
                                <div className="w-full flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-sm"></div>
                                    <div className="flex-1 border-t-2 border-dashed border-emerald-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-rose-500 border-2 border-white shadow-sm"></div>
                                </div>
                            </div>

                            <div className="text-center sm:text-right">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tiba</span>
                                <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                                    {formatJam(dataBooking.schedule?.waktu_tiba)}
                                </p>
                                <p className="text-sm font-bold text-slate-800 mt-0.5">
                                    {dataBooking.schedule?.station_tujuan?.nama_stasiun} ({dataBooking.schedule?.station_tujuan?.kode_stasiun})
                                </p>
                                <p className="text-xs text-slate-500">{dataBooking.schedule?.station_tujuan?.kota}</p>
                            </div>
                        </div>

                        {/* Pemisah Tiket (Tear Line) */}
                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t-2 border-dashed border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-between -mx-6 sm:-mx-8">
                                <div className="w-6 h-6 bg-slate-50 rounded-full -ml-3 border-r border-slate-200"></div>
                                <div className="w-6 h-6 bg-slate-50 rounded-full -mr-3 border-l border-slate-200"></div>
                            </div>
                        </div>

                        {/* Daftar Penumpang & Kursi */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                                Rincian Penumpang & Tempat Duduk
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/70">
                                            <th className="py-3 px-4 rounded-l-xl">No</th>
                                            <th className="py-3 px-4">Nama Penumpang</th>
                                            <th className="py-3 px-4">Tipe & No. Identitas</th>
                                            <th className="py-3 px-4">Gerbong / Kelas</th>
                                            <th className="py-3 px-4 rounded-r-xl">Nomor Kursi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {daftarBookingSeats.length > 0 ? (
                                            daftarBookingSeats.map((bs, index) => {
                                                const penumpang = bs.passenger || daftarPenumpang[index] || {};
                                                const kursi = bs.seat || {};
                                                const gerbong = kursi.coach || {};

                                                return (
                                                    <tr key={bs.id || index} className="hover:bg-slate-50/50">
                                                        <td className="py-3 px-4 font-bold text-slate-500">{index + 1}</td>
                                                        <td className="py-3 px-4 font-bold text-slate-900">{penumpang.nama_penumpang || '-'}</td>
                                                        <td className="py-3 px-4 text-slate-600 font-mono text-xs">
                                                            {penumpang.nomor_identitas ? `${penumpang.jenis_identitas || 'ID'} - ${penumpang.nomor_identitas}` : '-'}
                                                        </td>
                                                        <td className="py-3 px-4 text-slate-700">
                                                            {gerbong.nama_gerbong ? `${gerbong.nama_gerbong} (${gerbong.kelas || '-'})` : '-'}
                                                        </td>
                                                        <td className="py-3 px-4 font-black text-emerald-700 text-base">
                                                            {kursi.nomor_kursi || '-'}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : daftarPenumpang.length > 0 ? (
                                            daftarPenumpang.map((p, index) => (
                                                <tr key={p.id || index} className="hover:bg-slate-50/50">
                                                    <td className="py-3 px-4 font-bold text-slate-500">{index + 1}</td>
                                                    <td className="py-3 px-4 font-bold text-slate-900">{p.nama_penumpang}</td>
                                                    <td className="py-3 px-4 text-slate-600 font-mono text-xs">
                                                        {p.jenis_identitas || 'ID'} - {p.nomor_identitas}
                                                    </td>
                                                    <td className="py-3 px-4 text-slate-700">-</td>
                                                    <td className="py-3 px-4 font-black text-emerald-700">-</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="py-4 text-center text-slate-400">
                                                    Tidak ada data penumpang.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Petunjuk / Disclaimer */}
                        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900 space-y-1.5">
                            <p className="font-bold flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Ketentuan Boarding:
                            </p>
                            <ul className="list-disc list-inside space-y-1 pl-1 text-amber-800/90">
                                <li>Tunjukkan e-ticket ini atau PDF boarding pass beserta kartu identitas asli saat proses boarding di stasiun.</li>
                                <li>Harap tiba di stasiun keberangkatan minimal 30 menit sebelum jadwal keberangkatan kereta.</li>
                                <li>Pintu boarding ditutup 5 menit sebelum waktu keberangkatan kereta api.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
