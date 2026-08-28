<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Support\Facades\File;

class ReportController extends Controller
{
    /**
     * Export laporan booking ke CSV (Staff/Admin).
     * Menggunakan array + native PHP file I/O (fopen, fputcsv, fclose) — sesuai §7 SKILL.md.
     */
    public function eksporLaporanBooking()
    {
        $daftarBooking = Booking::with(['user', 'schedule', 'payment'])->get();

        // Susun array baris data
        $baris = [];
        $baris[] = ['Kode Booking', 'Nama Customer', 'Jadwal', 'Status Booking', 'Status Pembayaran', 'Jumlah', 'Tanggal Booking'];

        foreach ($daftarBooking as $booking) {
            $baris[] = [
                $booking->kode_booking,
                $booking->user->name,
                $booking->schedule->kode_jadwal,
                $booking->status->value,
                $booking->payment?->status->value ?? '-',
                $booking->payment?->jumlah ?? 0,
                $booking->created_at->format('Y-m-d H:i'),
            ];
        }

        // Pastikan direktori laporan ada
        $direktoriLaporan = storage_path('app/private/laporan');
        if (! File::isDirectory($direktoriLaporan)) {
            File::makeDirectory($direktoriLaporan, 0755, true);
        }

        $namaFile = 'laporan-booking-' . now()->format('Ymd-His') . '.csv';
        $lokasiFile = $direktoriLaporan . '/' . $namaFile;

        // Tulis CSV menggunakan native PHP file I/O
        $handleFile = fopen($lokasiFile, 'w');
        foreach ($baris as $satuBaris) {
            fputcsv($handleFile, $satuBaris);
        }
        fclose($handleFile);

        return response()->download($lokasiFile)->deleteFileAfterSend(true);
    }
}
