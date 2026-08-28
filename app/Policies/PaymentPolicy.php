<?php

namespace App\Policies;

use App\Models\Payment;
use App\Models\User;

class PaymentPolicy
{
    /**
     * Lihat detail pembayaran: pemilik booking, staff, atau admin.
     */
    public function view(User $user, Payment $payment): bool
    {
        if ($user->hasAnyRole(['staff', 'admin'])) {
            return true;
        }

        return $user->id === $payment->booking->user_id;
    }

    /**
     * Upload bukti pembayaran: hanya pemilik booking.
     */
    public function uploadBukti(User $user, Payment $payment): bool
    {
        return $user->id === $payment->booking->user_id;
    }

    /**
     * Verifikasi pembayaran: hanya staff dan admin.
     */
    public function verify(User $user, Payment $payment): bool
    {
        return $user->hasAnyRole(['staff', 'admin']);
    }

    /**
     * Lihat file bukti pembayaran: pemilik booking, staff, atau admin.
     */
    public function viewBukti(User $user, Payment $payment): bool
    {
        if ($user->hasAnyRole(['staff', 'admin'])) {
            return true;
        }

        return $user->id === $payment->booking->user_id;
    }
}
