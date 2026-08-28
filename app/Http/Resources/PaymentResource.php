<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
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
            'booking_id' => $this->booking_id,
            'jumlah' => $this->jumlah,
            'status' => $this->status->value,
            'has_bukti' => ! empty($this->bukti_pembayaran),
            'verified_by' => $this->verified_by,
            'waktu_verifikasi' => $this->waktu_verifikasi?->format('Y-m-d H:i'),
            'verifier' => new UserResource($this->whenLoaded('verifier')),
        ];
    }
}
