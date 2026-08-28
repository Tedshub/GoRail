<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TrainResource extends JsonResource
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
            'nama_kereta' => $this->nama_kereta,
            'nomor_kereta' => $this->nomor_kereta,
            'coaches' => CoachResource::collection($this->whenLoaded('coaches')),
        ];
    }
}
