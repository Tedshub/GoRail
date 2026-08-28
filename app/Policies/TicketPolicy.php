<?php

namespace App\Policies;

use App\Enums\StatusPembayaran;
use App\Models\Booking;
use App\Models\User;

class TicketPolicy
{
    /**
     * E-ticket hanya tersedia jika pembayaran PAID.
     * Yang boleh lihat: pemilik booking, staff, admin.
     */
    public function view(User $user, Booking $booking): bool
    {
        // Cek apakah pembayaran sudah lunas
        $pembayaranLunas = $booking->payment
            && $booking->payment->status === StatusPembayaran::LUNAS;

        if (! $pembayaranLunas) {
            return false;
        }

        if ($user->hasAnyRole(['staff', 'admin'])) {
            return true;
        }

        return $user->id === $booking->user_id;
    }

    /**
     * Download PDF e-ticket — sama aturannya dengan view.
     */
    public function download(User $user, Booking $booking): bool
    {
        return $this->view($user, $booking);
    }
}
