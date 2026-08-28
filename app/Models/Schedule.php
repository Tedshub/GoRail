<?php

namespace App\Models;

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
        ];
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
     * Booking pada jadwal ini.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
