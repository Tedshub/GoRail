<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'schedule_id' => ['required', 'exists:schedules,id'],
            'tanggal_berangkat' => ['required', 'date', 'after_or_equal:today'],
            'seat_ids' => ['required', 'array', 'min:1'],
            'seat_ids.*' => ['required', 'exists:seats,id'],
            'penumpang' => ['required', 'array', 'min:1'],
            'penumpang.*.nama_penumpang' => ['required', 'string', 'max:255'],
            'penumpang.*.nomor_identitas' => ['required', 'string', 'max:50'],
            'penumpang.*.jenis_identitas' => ['required', 'string', 'in:KTP,SIM,Paspor'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'schedule_id.required' => 'Jadwal harus dipilih.',
            'schedule_id.exists' => 'Jadwal tidak ditemukan.',
            'tanggal_berangkat.required' => 'Tanggal berangkat harus diisi.',
            'tanggal_berangkat.after_or_equal' => 'Tanggal berangkat tidak boleh di masa lalu.',
            'seat_ids.required' => 'Minimal pilih 1 kursi.',
            'seat_ids.min' => 'Minimal pilih 1 kursi.',
            'penumpang.required' => 'Data penumpang harus diisi.',
            'penumpang.min' => 'Minimal 1 penumpang.',
        ];
    }
}
