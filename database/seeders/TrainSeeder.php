<?php

namespace Database\Seeders;

use App\Models\Train;
use Illuminate\Database\Seeder;

class TrainSeeder extends Seeder
{
    public function run(): void
    {
        $daftarKereta = [
            ['nama_kereta' => 'Argo Parahyangan', 'nomor_kereta' => 'KA-34'],
            ['nama_kereta' => 'Argo Bromo Anggrek', 'nomor_kereta' => 'KA-01'],
            ['nama_kereta' => 'Taksaka', 'nomor_kereta' => 'KA-68'],
            ['nama_kereta' => 'Lodaya', 'nomor_kereta' => 'KA-92'],
            ['nama_kereta' => 'Matarmaja', 'nomor_kereta' => 'KA-281'],
        ];

        foreach ($daftarKereta as $kereta) {
            Train::firstOrCreate(
                ['nomor_kereta' => $kereta['nomor_kereta']],
                ['nama_kereta' => $kereta['nama_kereta']]
            );
        }
    }
}
