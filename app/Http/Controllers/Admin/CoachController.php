<?php

namespace App\Http\Controllers\Admin;

use App\Enums\KelasGerbong;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCoachRequest;
use App\Http\Resources\CoachResource;
use App\Models\Coach;
use App\Models\Train;
use Inertia\Inertia;

class CoachController extends Controller
{
    public function index()
    {
        $daftarGerbong = Coach::with(['train', 'seats'])->latest()->paginate(15);
        $daftarKereta = Train::orderBy('nama_kereta')->get();
        $daftarKelas = array_column(KelasGerbong::cases(), 'value');

        return Inertia::render('Admin/Coaches/Index', [
            'coaches' => CoachResource::collection($daftarGerbong),
            'trains' => $daftarKereta,
            'classes' => $daftarKelas,
        ]);
    }

    public function store(StoreCoachRequest $request)
    {
        Coach::create($request->validated());

        return back()->with('sukses', 'Gerbong berhasil ditambahkan.');
    }

    public function update(StoreCoachRequest $request, Coach $coach)
    {
        $coach->update($request->validated());

        return back()->with('sukses', 'Gerbong berhasil diperbarui.');
    }

    public function destroy(Coach $coach)
    {
        $coach->delete();

        return back()->with('sukses', 'Gerbong berhasil dihapus.');
    }
}
