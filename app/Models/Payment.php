<?php

namespace App\Models;

use App\Enums\StatusPembayaran;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'jumlah',
        'bukti_pembayaran',
        'status',
        'verified_by',
        'waktu_verifikasi',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => StatusPembayaran::class,
            'jumlah' => 'integer',
            'waktu_verifikasi' => 'datetime',
        ];
    }

    /**
     * Boot model — set default status.
     */
    protected static function booted(): void
    {
        static::creating(function (Payment $payment) {
            if (empty($payment->status)) {
                $payment->status = StatusPembayaran::BELUM_BAYAR;
            }
        });
    }

    // ─── State Transition Methods ───────────────────────────────

    /**
     * Upload bukti pembayaran → status WAITING_VERIFICATION.
     */
    public function uploadBukti(string $pathBukti): bool
    {
        if ($this->status !== StatusPembayaran::BELUM_BAYAR) {
            return false;
        }

        $this->bukti_pembayaran = $pathBukti;
        $this->status = StatusPembayaran::MENUNGGU_VERIFIKASI;
        return $this->save();
    }

    /**
     * Verifikasi pembayaran → status PAID, booking → CONFIRMED.
     */
    public function verifikasi(int $verifierId): bool
    {
        if ($this->status !== StatusPembayaran::MENUNGGU_VERIFIKASI) {
            return false;
        }

        $this->status = StatusPembayaran::LUNAS;
        $this->verified_by = $verifierId;
        $this->waktu_verifikasi = now();
        $hasilSimpan = $this->save();

        // Otomatis konfirmasi booking terkait
        if ($hasilSimpan) {
            $this->booking->konfirmasi();
        }

        return $hasilSimpan;
    }

    /**
     * Tolak pembayaran → status REJECTED.
     */
    public function tolak(int $verifierId): bool
    {
        if ($this->status !== StatusPembayaran::MENUNGGU_VERIFIKASI) {
            return false;
        }

        $this->status = StatusPembayaran::DITOLAK;
        $this->verified_by = $verifierId;
        $this->waktu_verifikasi = now();
        return $this->save();
    }

    // ─── Relationships ──────────────────────────────────────────

    /**
     * Booking terkait.
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    /**
     * User yang memverifikasi.
     */
    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
}
