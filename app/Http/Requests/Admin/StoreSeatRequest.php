<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreSeatRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'coach_id' => ['required', 'exists:coaches,id'],
            'nomor_kursi' => ['required', 'string', 'max:10'],
        ];
    }

    public function messages(): array
    {
        return [
            'coach_id.required' => 'Gerbong harus dipilih.',
            'coach_id.exists' => 'Gerbong tidak ditemukan.',
            'nomor_kursi.required' => 'Nomor kursi harus diisi.',
        ];
    }
}
