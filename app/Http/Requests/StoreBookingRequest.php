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
            'penumpang.*.jenis_identitas' => ['required', 'string', 'in:KTP,SIM,Paspor,ktp,sim,paspor,PASPOR'],
        ];
    }

    /**
     * Custom validation rules for conditional passenger ID formats.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $penumpangList = $this->input('penumpang', []);
            if (!is_array($penumpangList)) {
                return;
            }

            foreach ($penumpangList as $index => $penumpang) {
                $nomorUrut = $index + 1;
                $nama = trim($penumpang['nama_penumpang'] ?? '');
                $jenis = strtoupper($penumpang['jenis_identitas'] ?? '');
                $nomor = trim($penumpang['nomor_identitas'] ?? '');

                if (empty($nama)) {
                    $validator->errors()->add(
                        "penumpang.{$index}.nama_penumpang",
                        "Nama lengkap penumpang ke-{$nomorUrut} wajib diisi."
                    );
                }

                if (in_array($jenis, ['KTP', 'SIM'])) {
                    if (!preg_match('/^[0-9]{16}$/', $nomor)) {
                        $validator->errors()->add(
                            "penumpang.{$index}.nomor_identitas",
                            "Nomor identitas ({$jenis}) penumpang ke-{$nomorUrut} harus terdiri dari 16 digit angka."
                        );
                    }
                } elseif ($jenis === 'PASPOR') {
                    if (!preg_match('/^[A-Za-z0-9]{8,9}$/', $nomor)) {
                        $validator->errors()->add(
                            "penumpang.{$index}.nomor_identitas",
                            "Nomor identitas (Paspor) penumpang ke-{$nomorUrut} harus terdiri dari 8 sampai 9 karakter kombinasi huruf dan angka."
                        );
                    }
                }
            }
        });
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
            'penumpang.*.nama_penumpang.required' => 'Nama lengkap penumpang wajib diisi.',
            'penumpang.*.nomor_identitas.required' => 'Nomor identitas penumpang wajib diisi.',
            'penumpang.*.jenis_identitas.required' => 'Jenis identitas penumpang wajib dipilih.',
            'penumpang.*.jenis_identitas.in' => 'Jenis identitas harus KTP, SIM, atau Paspor.',
        ];
    }
}
