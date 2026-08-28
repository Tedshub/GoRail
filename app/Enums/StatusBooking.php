<?php

namespace App\Enums;

enum StatusBooking: string
{
    case MENUNGGU = 'PENDING';
    case DIKONFIRMASI = 'CONFIRMED';
    case DIBATALKAN = 'CANCELLED';
    case SELESAI = 'COMPLETED';
}
