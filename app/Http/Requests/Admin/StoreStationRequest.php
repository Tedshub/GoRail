<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreStationRequest extends FormRequest
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
        $stasiunId = $this->route('station')?->id;

        return [
            'kode_stasiun' => ['required', 'string', 'max:10', 'unique:stations,kode_stasiun,' . $stasiunId],
            'nama_stasiun' => ['required', 'string', 'max:255'],
            'kota' => ['required', 'string', 'max:255'],
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
            'kode_stasiun.required' => 'Kode stasiun harus diisi.',
            'kode_stasiun.unique' => 'Kode stasiun sudah digunakan.',
            'nama_stasiun.required' => 'Nama stasiun harus diisi.',
            'kota.required' => 'Kota harus diisi.',
        ];
    }
}
