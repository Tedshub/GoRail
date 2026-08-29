<?php

namespace App\Models;

use App\Enums\KelasGerbong;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'train_id',
        'station_asal_id',
        'station_tujuan_id',
        'waktu_berangkat',
        'waktu_tiba',
        'harga',
        'harga_ekonomi',
        'harga_bisnis',
        'harga_eksekutif',
        'kode_jadwal',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'waktu_berangkat' => 'datetime',
            'waktu_tiba' => 'datetime',
            'harga' => 'integer',
            'harga_ekonomi' => 'integer',
            'harga_bisnis' => 'integer',
            'harga_eksekutif' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (Schedule $schedule) {
            // Pastikan nilai dasar harga selalu sinkron dengan harga_ekonomi
            if (! empty($schedule->harga_ekonomi)) {
                $schedule->harga = $schedule->harga_ekonomi;
            } elseif (! empty($schedule->harga)) {
                $schedule->harga_ekonomi = $schedule->harga;
            }

            // Fallback default jika harga_bisnis atau harga_eksekutif belum diisi
            if (empty($schedule->harga_bisnis)) {
                $schedule->harga_bisnis = (int) round(($schedule->harga_ekonomi ?: $schedule->harga) * 1.5);
            }
            if (empty($schedule->harga_eksekutif)) {
                $schedule->harga_eksekutif = (int) round(($schedule->harga_ekonomi ?: $schedule->harga) * 2.0);
            }
        });
    }

    /**
     * Dapatkan harga per kursi berdasarkan kelas gerbong.
     */
    public function getHargaUntukKelas(string|KelasGerbong $kelas): int
    {
        $namaKelas = is_object($kelas) ? $kelas->value : strtolower($kelas);

        return match ($namaKelas) {
            'eksekutif' => (int) ($this->harga_eksekutif ?: round(($this->harga_ekonomi ?: $this->harga) * 2.0)),
            'bisnis' => (int) ($this->harga_bisnis ?: round(($this->harga_ekonomi ?: $this->harga) * 1.5)),
            default => (int) ($this->harga_ekonomi ?: $this->harga),
        };
    }

    /**
     * Kereta pada jadwal ini.
     */
    public function train(): BelongsTo
    {
        return $this->belongsTo(Train::class);
    }

    /**
     * Stasiun asal.
     */
    public function stationAsal(): BelongsTo
    {
        return $this->belongsTo(Station::class, 'station_asal_id');
    }

    /**
     * Stasiun tujuan.
     */
    public function stationTujuan(): BelongsTo
    {
        return $this->belongsTo(Station::class, 'station_tujuan_id');
    }

    /**
     * Semua booking untuk jadwal ini.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
