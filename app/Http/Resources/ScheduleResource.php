<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ScheduleResource extends JsonResource
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
            'kode_jadwal' => $this->kode_jadwal,
            'waktu_berangkat' => $this->waktu_berangkat->format('Y-m-d H:i'),
            'waktu_tiba' => $this->waktu_tiba->format('Y-m-d H:i'),
            'harga' => $this->harga,
            'train' => new TrainResource($this->whenLoaded('train')),
            'station_asal' => new StationResource($this->whenLoaded('stationAsal')),
            'station_tujuan' => new StationResource($this->whenLoaded('stationTujuan')),
        ];
    }
}
