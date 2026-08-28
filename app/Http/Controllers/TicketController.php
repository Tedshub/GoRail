<?php

namespace App\Http\Controllers;

use App\Http\Resources\BookingResource;
use App\Models\Booking;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class TicketController extends Controller
{
    /**
     * Lihat e-ticket (Inertia page).
     */
    public function show(Booking $booking)
    {
        Gate::authorize('view', [Booking::class, $booking]);

        $booking->load([
            'schedule.stationAsal',
            'schedule.stationTujuan',
            'schedule.train',
            'passengers',
            'bookingSeats.seat.coach',
            'payment',
            'user',
        ]);

        return Inertia::render('Customer/Ticket/Show', [
            'booking' => new BookingResource($booking),
        ]);
    }

    /**
     * Download e-ticket sebagai PDF.
     */
    public function download(Booking $booking)
    {
        Gate::authorize('download', [Booking::class, $booking]);

        $booking->load([
            'schedule.stationAsal',
            'schedule.stationTujuan',
            'schedule.train',
            'passengers',
            'bookingSeats.seat.coach',
            'payment',
            'user',
        ]);

        // Generate QR Code berisi kode booking
        $qrCodeSvg = QrCode::size(150)->generate($booking->kode_booking);

        $pdf = Pdf::loadView('pdf.ticket', [
            'booking' => $booking,
            'qrCode' => $qrCodeSvg,
        ]);

        $namaFile = 'eticket-' . $booking->kode_booking . '.pdf';

        return $pdf->download($namaFile);
    }
}
