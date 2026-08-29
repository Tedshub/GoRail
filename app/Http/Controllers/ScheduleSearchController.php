<?php

namespace App\Http\Controllers;

use App\Http\Resources\ScheduleResource;
use App\Models\BookingSeat;
use App\Models\Schedule;
use App\Models\Station;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScheduleSearchController extends Controller
{
    /**
     * Tampilkan form pencarian dan hasil jadwal.
     */
    public function index(Request $request)
    {
        $daftarStasiun = Station::orderBy('nama_stasiun')->get();
        $hasilPencarian = null;

        if ($request->filled(['asal', 'tujuan', 'tanggal'])) {
            $request->validate([
                'asal' => 'required|exists:stations,id',
                'tujuan' => 'required|exists:stations,id|different:asal',
                'tanggal' => 'required|date',
            ]);

            $jadwalDitemukan = Schedule::with(['train', 'stationAsal', 'stationTujuan'])
                ->where('station_asal_id', $request->asal)
                ->where('station_tujuan_id', $request->tujuan)
                ->whereDate('waktu_berangkat', $request->tanggal)
                ->orderBy('waktu_berangkat')
                ->get();

            $hasilPencarian = ScheduleResource::collection($jadwalDitemukan);
        } else {
            // Tampilkan daftar jadwal aktif yang tersedia secara default
            $semuaJadwal = Schedule::with(['train', 'stationAsal', 'stationTujuan'])
                ->orderBy('waktu_berangkat')
                ->take(10)
                ->get();

            $hasilPencarian = ScheduleResource::collection($semuaJadwal);
        }

        return Inertia::render('Public/ScheduleSearch', [
            'stations' => $daftarStasiun,
            'schedules' => $hasilPencarian,
            'filters' => $request->only(['asal', 'tujuan', 'tanggal']),
        ]);
    }

    /**
     * Tampilkan detail jadwal + kursi tersedia.
     */
    public function show(Schedule $schedule, Request $request)
    {
        $schedule->load(['train.coaches.seats', 'stationAsal', 'stationTujuan']);

        // Ambil tanggal berangkat dari query param atau dari waktu berangkat jadwal
        $tanggalBerangkat = $request->query('tanggal')
            ?: ($schedule->waktu_berangkat ? $schedule->waktu_berangkat->format('Y-m-d') : now()->format('Y-m-d'));

        // Kumpulkan ID kursi yang sudah dibooking pada jadwal tersebut (yang belum dibatalkan)
        $kursiTerbooking = BookingSeat::whereHas('booking', function ($query) use ($schedule) {
            $query->where('schedule_id', $schedule->id)
                ->whereNotIn('status', ['CANCELLED', 'DIBATALKAN', \App\Enums\StatusBooking::DIBATALKAN->value]);
        })->pluck('seat_id')->map(fn ($id) => (int) $id)->toArray();

        // Susun array kursi per gerbong dengan status ketersediaan & tarif kelas
        $denahKursi = [];
        foreach ($schedule->train->coaches as $gerbong) {
            $namaKelas = is_object($gerbong->kelas) ? $gerbong->kelas->value : $gerbong->kelas;
            $hargaKelas = $schedule->getHargaUntukKelas($namaKelas);

            $kursiPerGerbong = [];
            foreach ($gerbong->seats as $kursi) {
                $kursiId = (int) $kursi->id;
                $kursiPerGerbong[] = [
                    'id' => $kursiId,
                    'nomor_kursi' => $kursi->nomor_kursi,
                    'tersedia' => ! in_array($kursiId, $kursiTerbooking, true),
                    'harga' => $hargaKelas,
                    'kelas' => $namaKelas,
                ];
            }
            $denahKursi[] = [
                'gerbong' => $gerbong->nama_gerbong,
                'kelas' => $namaKelas,
                'harga' => $hargaKelas,
                'kursi' => $kursiPerGerbong,
            ];
        }

        return Inertia::render('Public/ScheduleDetail', [
            'schedule' => new ScheduleResource($schedule),
            'denah_kursi' => $denahKursi,
            'tanggal' => $tanggalBerangkat,
        ]);
    }
}
