<?php

namespace Database\Seeders;

use App\Models\Schedule;
use App\Models\Station;
use App\Models\Train;
use Illuminate\Database\Seeder;

class ScheduleSeeder extends Seeder
{
    public function run(): void
    {
        $stasiunGmr = Station::where('kode_stasiun', 'GMR')->first();
        $stasiunBd = Station::where('kode_stasiun', 'BD')->first();
        $stasiunYk = Station::where('kode_stasiun', 'YK')->first();
        $stasiunSgu = Station::where('kode_stasiun', 'SGU')->first();

        $keretaParahyangan = Train::where('nama_kereta', 'Argo Parahyangan')->first();
        $keretaTaksaka = Train::where('nama_kereta', 'Taksaka')->first();
        $keretaAnggrek = Train::where('nama_kereta', 'Argo Bromo Anggrek')->first();

        if ($stasiunGmr && $stasiunBd && $keretaParahyangan) {
            Schedule::updateOrCreate(
                ['kode_jadwal' => 'JD-GMR-BD-01'],
                [
                    'train_id' => $keretaParahyangan->id,
                    'station_asal_id' => $stasiunGmr->id,
                    'station_tujuan_id' => $stasiunBd->id,
                    'waktu_berangkat' => now()->addDays(1)->setTime(8, 0),
                    'waktu_tiba' => now()->addDays(1)->setTime(11, 0),
                    'harga' => 150000,
                    'harga_ekonomi' => 150000,
                    'harga_bisnis' => 200000,
                    'harga_eksekutif' => 250000,
                ]
            );

            Schedule::updateOrCreate(
                ['kode_jadwal' => 'JD-BD-GMR-01'],
                [
                    'train_id' => $keretaParahyangan->id,
                    'station_asal_id' => $stasiunBd->id,
                    'station_tujuan_id' => $stasiunGmr->id,
                    'waktu_berangkat' => now()->addDays(1)->setTime(14, 0),
                    'waktu_tiba' => now()->addDays(1)->setTime(17, 0),
                    'harga' => 150000,
                    'harga_ekonomi' => 150000,
                    'harga_bisnis' => 200000,
                    'harga_eksekutif' => 250000,
                ]
            );
        }

        if ($stasiunGmr && $stasiunYk && $keretaTaksaka) {
            Schedule::updateOrCreate(
                ['kode_jadwal' => 'JD-GMR-YK-01'],
                [
                    'train_id' => $keretaTaksaka->id,
                    'station_asal_id' => $stasiunGmr->id,
                    'station_tujuan_id' => $stasiunYk->id,
                    'waktu_berangkat' => now()->addDays(1)->setTime(9, 30),
                    'waktu_tiba' => now()->addDays(1)->setTime(16, 45),
                    'harga' => 350000,
                    'harga_ekonomi' => 350000,
                    'harga_bisnis' => 450000,
                    'harga_eksekutif' => 550000,
                ]
            );
        }

        if ($stasiunGmr && $stasiunSgu && $keretaAnggrek) {
            Schedule::updateOrCreate(
                ['kode_jadwal' => 'JD-GMR-SGU-01'],
                [
                    'train_id' => $keretaAnggrek->id,
                    'station_asal_id' => $stasiunGmr->id,
                    'station_tujuan_id' => $stasiunSgu->id,
                    'waktu_berangkat' => now()->addDays(2)->setTime(8, 20),
                    'waktu_tiba' => now()->addDays(2)->setTime(17, 30),
                    'harga' => 500000,
                    'harga_ekonomi' => 500000,
                    'harga_bisnis' => 650000,
                    'harga_eksekutif' => 800000,
                ]
            );
        }
    }
}
