<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'kode_stasiun' => $this->kode_stasiun,
            'nama_stasiun' => $this->nama_stasiun,
            'kota' => $this->kota,
        ];
    }
}
