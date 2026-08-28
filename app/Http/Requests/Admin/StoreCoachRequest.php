<?php

namespace App\Http\Requests\Admin;

use App\Enums\KelasGerbong;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCoachRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'train_id' => ['required', 'exists:trains,id'],
            'nama_gerbong' => ['required', 'string', 'max:50'],
            'kelas' => ['required', Rule::enum(KelasGerbong::class)],
        ];
    }

    public function messages(): array
    {
        return [
            'train_id.required' => 'Kereta harus dipilih.',
            'train_id.exists' => 'Kereta tidak ditemukan.',
            'nama_gerbong.required' => 'Nama gerbong harus diisi.',
            'kelas.required' => 'Kelas gerbong harus dipilih.',
        ];
    }
}
