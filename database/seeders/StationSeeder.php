<?php

namespace Database\Seeders;

use App\Models\Station;
use Illuminate\Database\Seeder;

class StationSeeder extends Seeder
{
    public function run(): void
    {
        $daftarStasiun = [
            ['kode_stasiun' => 'GMR', 'nama_stasiun' => 'Gambir', 'kota' => 'Jakarta'],
            ['kode_stasiun' => 'PSE', 'nama_stasiun' => 'Pasar Senen', 'kota' => 'Jakarta'],
            ['kode_stasiun' => 'BD', 'nama_stasiun' => 'Bandung', 'kota' => 'Bandung'],
            ['kode_stasiun' => 'YK', 'nama_stasiun' => 'Yogyakarta', 'kota' => 'Yogyakarta'],
            ['kode_stasiun' => 'SLO', 'nama_stasiun' => 'Solo Balapan', 'kota' => 'Surakarta'],
            ['kode_stasiun' => 'SMT', 'nama_stasiun' => 'Semarang Tawang', 'kota' => 'Semarang'],
            ['kode_stasiun' => 'SGU', 'nama_stasiun' => 'Surabaya Gubeng', 'kota' => 'Surabaya'],
            ['kode_stasiun' => 'ML', 'nama_stasiun' => 'Malang', 'kota' => 'Malang'],
        ];

        foreach ($daftarStasiun as $stasiun) {
            Station::firstOrCreate(
                ['kode_stasiun' => $stasiun['kode_stasiun']],
                [
                    'nama_stasiun' => $stasiun['nama_stasiun'],
                    'kota' => $stasiun['kota'],
                ]
            );
        }
    }
}
