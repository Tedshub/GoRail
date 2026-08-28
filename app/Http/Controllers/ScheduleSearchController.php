<?php

namespace App\Http\Controllers;

use App\Http\Resources\ScheduleResource;
use App\Http\Resources\SeatResource;
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
                'tanggal' => 'required|date|after_or_equal:today',
            ]);

            $jadwalDitemukan = Schedule::with(['train', 'stationAsal', 'stationTujuan'])
                ->where('station_asal_id', $request->asal)
                ->where('station_tujuan_id', $request->tujuan)
                ->whereDate('waktu_berangkat', $request->tanggal)
                ->orderBy('waktu_berangkat')
                ->get();

            $hasilPencarian = ScheduleResource::collection($jadwalDitemukan);
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

        $tanggalBerangkat = $request->query('tanggal', now()->format('Y-m-d'));

        // Kumpulkan ID kursi yang sudah dibooking pada tanggal tersebut
        $kursiTerbooking = BookingSeat::whereHas('booking', function ($query) use ($schedule, $tanggalBerangkat) {
            $query->where('schedule_id', $schedule->id)
                ->whereDate('tanggal_berangkat', $tanggalBerangkat)
                ->whereNotIn('status', ['CANCELLED']);
        })->pluck('seat_id')->toArray();

        // Susun array kursi per gerbong dengan status ketersediaan
        $denahKursi = [];
        foreach ($schedule->train->coaches as $gerbong) {
            $kursiPerGerbong = [];
            foreach ($gerbong->seats as $kursi) {
                $kursiPerGerbong[] = [
                    'id' => $kursi->id,
                    'nomor_kursi' => $kursi->nomor_kursi,
                    'tersedia' => ! in_array($kursi->id, $kursiTerbooking),
                ];
            }
            $denahKursi[] = [
                'gerbong' => $gerbong->nama_gerbong,
                'kelas' => $gerbong->kelas->value,
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
