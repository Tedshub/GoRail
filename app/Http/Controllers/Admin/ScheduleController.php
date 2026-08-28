<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreScheduleRequest;
use App\Http\Resources\ScheduleResource;
use App\Models\Schedule;
use App\Models\Station;
use App\Models\Train;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    public function index()
    {
        $daftarJadwal = Schedule::with(['train', 'stationAsal', 'stationTujuan'])->latest()->paginate(15);
        $daftarKereta = Train::orderBy('nama_kereta')->get();
        $daftarStasiun = Station::orderBy('nama_stasiun')->get();

        return Inertia::render('Admin/Schedules/Index', [
            'schedules' => ScheduleResource::collection($daftarJadwal),
            'trains' => $daftarKereta,
            'stations' => $daftarStasiun,
        ]);
    }

    public function store(StoreScheduleRequest $request)
    {
        Schedule::create($request->validated());

        return back()->with('sukses', 'Jadwal berhasil ditambahkan.');
    }

    public function update(StoreScheduleRequest $request, Schedule $schedule)
    {
        $schedule->update($request->validated());

        return back()->with('sukses', 'Jadwal berhasil diperbarui.');
    }

    public function destroy(Schedule $schedule)
    {
        $schedule->delete();

        return back()->with('sukses', 'Jadwal berhasil dihapus.');
    }
}
