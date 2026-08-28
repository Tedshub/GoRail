<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ImportStationRequest;
use App\Http\Requests\Admin\StoreStationRequest;
use App\Http\Resources\StationResource;
use App\Models\Station;
use Inertia\Inertia;

class StationController extends Controller
{
    /**
     * Tampilkan daftar stasiun.
     */
    public function index()
    {
        $daftarStasiun = Station::orderBy('nama_stasiun')->paginate(15);

        return Inertia::render('Admin/Stations/Index', [
            'stations' => StationResource::collection($daftarStasiun),
        ]);
    }

    /**
     * Simpan stasiun baru.
     */
    public function store(StoreStationRequest $request)
    {
        Station::create($request->validated());

        return back()->with('sukses', 'Stasiun berhasil ditambahkan.');
    }

    /**
     * Update stasiun.
     */
    public function update(StoreStationRequest $request, Station $station)
    {
        $station->update($request->validated());

        return back()->with('sukses', 'Stasiun berhasil diperbarui.');
    }

    /**
     * Hapus stasiun.
     */
    public function destroy(Station $station)
    {
        $station->delete();

        return back()->with('sukses', 'Stasiun berhasil dihapus.');
    }

    /**
     * Import data stasiun massal dari file CSV (Native PHP file & array I/O — SKILL.md §7).
     */
    public function import(ImportStationRequest $request)
    {
        $fileCsv = $request->file('file_csv');
        $handleFile = fopen($fileCsv->getRealPath(), 'r');
        $daftarStasiunBaru = [];
        $baris = 0;

        while (($data = fgetcsv($handleFile, 1000, ',')) !== false) {
            $baris++;
            if ($baris === 1) {
                continue; // lewati baris header
            }

            if (count($data) >= 3 && ! empty(trim($data[0]))) {
                $kodeStasiun = trim($data[0]);
                $namaStasiun = trim($data[1]);
                $kota = trim($data[2]);

                // Lewati jika kode stasiun sudah ada di database
                if (Station::where('kode_stasiun', $kodeStasiun)->exists()) {
                    continue;
                }

                $daftarStasiunBaru[] = [
                    'kode_stasiun' => $kodeStasiun,
                    'nama_stasiun' => $namaStasiun,
                    'kota' => $kota,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        fclose($handleFile);

        if (! empty($daftarStasiunBaru)) {
            Station::insert($daftarStasiunBaru);
        }

        return back()->with('sukses', count($daftarStasiunBaru) . ' stasiun berhasil diimpor.');
    }
}
