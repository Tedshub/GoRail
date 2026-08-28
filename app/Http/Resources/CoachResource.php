<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CoachResource extends JsonResource
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
            'train_id' => $this->train_id,
            'nama_gerbong' => $this->nama_gerbong,
            'kelas' => $this->kelas->value,
            'train' => new TrainResource($this->whenLoaded('train')),
            'seats' => SeatResource::collection($this->whenLoaded('seats')),
        ];
    }
}
