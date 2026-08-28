<?php

namespace App\Http\Controllers\Staff;

use App\Enums\StatusPembayaran;
use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use Inertia\Inertia;

class PaymentVerificationController extends Controller
{
    /**
     * Tampilkan daftar pembayaran yang menunggu verifikasi.
     */
    public function index()
    {
        $daftarPembayaran = Payment::with([
            'booking.user',
            'booking.schedule.stationAsal',
            'booking.schedule.stationTujuan',
            'booking.schedule.train',
            'booking.passengers',
            'verifier',
        ])
            ->latest()
            ->paginate(15);

        return Inertia::render('Staff/PaymentVerification/Index', [
            'payments' => PaymentResource::collection($daftarPembayaran),
        ]);
    }
}
