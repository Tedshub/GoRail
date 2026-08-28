<?php

namespace App\Policies;

use App\Models\Booking;
use App\Models\User;

class BookingPolicy
{
    /**
     * Customer hanya bisa lihat booking miliknya sendiri.
     * Staff dan admin bisa lihat semua booking.
     */
    public function view(User $user, Booking $booking): bool
    {
        if ($user->hasAnyRole(['staff', 'admin'])) {
            return true;
        }

        return $user->id === $booking->user_id;
    }

    /**
     * Hanya customer yang bisa membuat booking.
     */
    public function create(User $user): bool
    {
        return $user->hasRole('customer');
    }

    /**
     * Customer hanya bisa membatalkan booking miliknya sendiri.
     */
    public function cancel(User $user, Booking $booking): bool
    {
        return $user->id === $booking->user_id;
    }

    /**
     * Staff dan admin bisa lihat daftar semua booking.
     * Customer bisa lihat daftar booking miliknya (filter di controller).
     */
    public function viewAny(User $user): bool
    {
        return true;
    }
}
