<?php

namespace App\Models;

use App\Enums\KelasGerbong;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Coach extends Model
{
    use HasFactory;

    protected $fillable = [
        'train_id',
        'nama_gerbong',
        'kelas',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'kelas' => KelasGerbong::class,
        ];
    }

    /**
     * Kereta pemilik gerbong ini.
     */
    public function train(): BelongsTo
    {
        return $this->belongsTo(Train::class);
    }

    /**
     * Kursi-kursi di gerbong ini.
     */
    public function seats(): HasMany
    {
        return $this->hasMany(Seat::class);
    }
}
