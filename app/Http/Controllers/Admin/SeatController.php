<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSeatRequest;
use App\Http\Resources\SeatResource;
use App\Models\Coach;
use App\Models\Seat;
use Inertia\Inertia;

class SeatController extends Controller
{
    public function index()
    {
        $daftarKursi = Seat::with('coach.train')->latest()->paginate(20);
        $daftarGerbong = Coach::with('train')->orderBy('nama_gerbong')->get();

        return Inertia::render('Admin/Seats/Index', [
            'seats' => SeatResource::collection($daftarKursi),
            'coaches' => $daftarGerbong,
        ]);
    }

    public function store(StoreSeatRequest $request)
    {
        Seat::create($request->validated());

        return back()->with('sukses', 'Kursi berhasil ditambahkan.');
    }

    public function update(StoreSeatRequest $request, Seat $seat)
    {
        $seat->update($request->validated());

        return back()->with('sukses', 'Kursi berhasil diperbarui.');
    }

    public function destroy(Seat $seat)
    {
        $seat->delete();

        return back()->with('sukses', 'Kursi berhasil dihapus.');
    }
}
