<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreScheduleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $jadwalId = $this->route('schedule')?->id;

        return [
            'train_id' => ['required', 'exists:trains,id'],
            'station_asal_id' => ['required', 'exists:stations,id', 'different:station_tujuan_id'],
            'station_tujuan_id' => ['required', 'exists:stations,id', 'different:station_asal_id'],
            'waktu_berangkat' => ['required', 'date'],
            'waktu_tiba' => ['required', 'date', 'after:waktu_berangkat'],
            'harga' => ['required', 'integer', 'min:1'],
            'kode_jadwal' => ['required', 'string', 'max:20', 'unique:schedules,kode_jadwal,' . $jadwalId],
        ];
    }

    public function messages(): array
    {
        return [
            'train_id.required' => 'Kereta harus dipilih.',
            'station_asal_id.required' => 'Stasiun asal harus dipilih.',
            'station_asal_id.different' => 'Stasiun asal dan tujuan tidak boleh sama.',
            'station_tujuan_id.required' => 'Stasiun tujuan harus dipilih.',
            'station_tujuan_id.different' => 'Stasiun tujuan dan asal tidak boleh sama.',
            'waktu_berangkat.required' => 'Waktu berangkat harus diisi.',
            'waktu_tiba.required' => 'Waktu tiba harus diisi.',
            'waktu_tiba.after' => 'Waktu tiba harus setelah waktu berangkat.',
            'harga.required' => 'Harga harus diisi.',
            'harga.min' => 'Harga minimal 1.',
            'kode_jadwal.required' => 'Kode jadwal harus diisi.',
            'kode_jadwal.unique' => 'Kode jadwal sudah digunakan.',
        ];
    }
}
