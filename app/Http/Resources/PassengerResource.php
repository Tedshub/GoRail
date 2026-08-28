<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PassengerResource extends JsonResource
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
            'nama_penumpang' => $this->nama_penumpang,
            'nomor_identitas' => $this->nomor_identitas,
            'jenis_identitas' => $this->jenis_identitas,
        ];
    }
}
