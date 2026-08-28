<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Train extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_kereta',
        'nomor_kereta',
    ];

    /**
     * Gerbong milik kereta ini.
     */
    public function coaches(): HasMany
    {
        return $this->hasMany(Coach::class);
    }

    /**
     * Jadwal milik kereta ini.
     */
    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }
}
