<?php

namespace App\Enums;

enum StatusPembayaran: string
{
    case BELUM_BAYAR = 'UNPAID';
    case MENUNGGU_VERIFIKASI = 'WAITING_VERIFICATION';
    case LUNAS = 'PAID';
    case DITOLAK = 'REJECTED';
}
