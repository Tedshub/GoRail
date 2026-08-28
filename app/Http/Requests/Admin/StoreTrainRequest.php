<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreTrainRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $keretaId = $this->route('train')?->id;

        return [
            'nama_kereta' => ['required', 'string', 'max:255'],
            'nomor_kereta' => ['required', 'string', 'max:50', 'unique:trains,nomor_kereta,' . $keretaId],
        ];
    }

    public function messages(): array
    {
        return [
            'nama_kereta.required' => 'Nama kereta harus diisi.',
            'nomor_kereta.required' => 'Nomor kereta harus diisi.',
            'nomor_kereta.unique' => 'Nomor kereta sudah digunakan.',
        ];
    }
}
