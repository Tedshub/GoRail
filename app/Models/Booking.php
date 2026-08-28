<?php

namespace App\Models;

use App\Enums\StatusBooking;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'schedule_id',
        'kode_booking',
        'status',
        'tanggal_berangkat',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => StatusBooking::class,
            'tanggal_berangkat' => 'date',
        ];
    }

    /**
     * Boot model — auto-generate kode_booking.
     */
    protected static function booted(): void
    {
        static::creating(function (Booking $booking) {
            if (empty($booking->kode_booking)) {
                $booking->kode_booking = 'GR-' . strtoupper(Str::random(8));
            }
            if (empty($booking->status)) {
                $booking->status = StatusBooking::MENUNGGU;
            }
        });
    }

    // ─── State Transition Methods ───────────────────────────────

    /**
     * Konfirmasi booking setelah pembayaran diverifikasi.
     */
    public function konfirmasi(): bool
    {
        if ($this->status !== StatusBooking::MENUNGGU) {
            return false;
        }

        $this->status = StatusBooking::DIKONFIRMASI;
        return $this->save();
    }

    /**
     * Batalkan booking.
     */
    public function batalkan(): bool
    {
        if (! in_array($this->status, [StatusBooking::MENUNGGU, StatusBooking::DIKONFIRMASI])) {
            return false;
        }

        $this->status = StatusBooking::DIBATALKAN;
        return $this->save();
    }

    /**
     * Tandai booking sebagai selesai.
     */
    public function selesaikan(): bool
    {
        if ($this->status !== StatusBooking::DIKONFIRMASI) {
            return false;
        }

        $this->status = StatusBooking::SELESAI;
        return $this->save();
    }

    // ─── Relationships ──────────────────────────────────────────

    /**
     * User pemilik booking.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Jadwal yang dibooking.
     */
    public function schedule(): BelongsTo
    {
        return $this->belongsTo(Schedule::class);
    }

    /**
     * Penumpang pada booking ini.
     */
    public function passengers(): HasMany
    {
        return $this->hasMany(Passenger::class);
    }

    /**
     * Kursi yang dibooking.
     */
    public function bookingSeats(): HasMany
    {
        return $this->hasMany(BookingSeat::class);
    }

    /**
     * Pembayaran booking (1:1).
     */
    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }
}
