<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Station extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode_stasiun',
        'nama_stasiun',
        'kota',
    ];

    /**
     * Jadwal dengan stasiun ini sebagai asal.
     */
    public function schedulesAsal(): HasMany
    {
        return $this->hasMany(Schedule::class, 'station_asal_id');
    }

    /**
     * Jadwal dengan stasiun ini sebagai tujuan.
     */
    public function schedulesTujuan(): HasMany
    {
        return $this->hasMany(Schedule::class, 'station_tujuan_id');
    }
}
