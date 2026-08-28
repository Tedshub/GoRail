<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
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
            'kode_booking' => $this->kode_booking,
            'status' => $this->status->value,
            'tanggal_berangkat' => $this->tanggal_berangkat->format('Y-m-d'),
            'created_at' => $this->created_at->format('Y-m-d H:i'),
            'user' => new UserResource($this->whenLoaded('user')),
            'schedule' => new ScheduleResource($this->whenLoaded('schedule')),
            'passengers' => PassengerResource::collection($this->whenLoaded('passengers')),
            'booking_seats' => BookingSeatResource::collection($this->whenLoaded('bookingSeats')),
            'payment' => new PaymentResource($this->whenLoaded('payment')),
        ];
    }
}
