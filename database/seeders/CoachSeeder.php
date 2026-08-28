<?php

namespace Database\Seeders;

use App\Enums\KelasGerbong;
use App\Models\Coach;
use App\Models\Train;
use Illuminate\Database\Seeder;

class CoachSeeder extends Seeder
{
    public function run(): void
    {
        $daftarKereta = Train::all();

        foreach ($daftarKereta as $kereta) {
            // Tiap kereta diberi 3 gerbong contoh (Eksekutif, Bisnis, Ekonomi)
            Coach::firstOrCreate(
                ['train_id' => $kereta->id, 'nama_gerbong' => 'EKS-1'],
                ['kelas' => KelasGerbong::EKSEKUTIF]
            );
            Coach::firstOrCreate(
                ['train_id' => $kereta->id, 'nama_gerbong' => 'BIS-1'],
                ['kelas' => KelasGerbong::BISNIS]
            );
            Coach::firstOrCreate(
                ['train_id' => $kereta->id, 'nama_gerbong' => 'EKO-1'],
                ['kelas' => KelasGerbong::EKONOMI]
            );
        }
    }
}
