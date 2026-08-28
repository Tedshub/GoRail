<?php

namespace Database\Seeders;

use App\Models\Coach;
use App\Models\Seat;
use Illuminate\Database\Seeder;

class SeatSeeder extends Seeder
{
    public function run(): void
    {
        $daftarGerbong = Coach::all();
        $baris = ['1', '2', '3', '4', '5', '6', '7', '8'];
        $kolom = ['A', 'B', 'C', 'D'];

        foreach ($daftarGerbong as $gerbong) {
            foreach ($baris as $b) {
                foreach ($kolom as $k) {
                    $nomorKursi = $b . $k;
                    Seat::firstOrCreate(
                        ['coach_id' => $gerbong->id, 'nomor_kursi' => $nomorKursi]
                    );
                }
            }
        }
    }
}
