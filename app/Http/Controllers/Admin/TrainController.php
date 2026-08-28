<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTrainRequest;
use App\Http\Resources\TrainResource;
use App\Models\Train;
use Inertia\Inertia;

class TrainController extends Controller
{
    public function index()
    {
        $daftarKereta = Train::with('coaches.seats')->latest()->paginate(10);

        return Inertia::render('Admin/Trains/Index', [
            'trains' => TrainResource::collection($daftarKereta),
        ]);
    }

    public function store(StoreTrainRequest $request)
    {
        Train::create($request->validated());

        return back()->with('sukses', 'Kereta berhasil ditambahkan.');
    }

    public function update(StoreTrainRequest $request, Train $train)
    {
        $train->update($request->validated());

        return back()->with('sukses', 'Kereta berhasil diperbarui.');
    }

    public function destroy(Train $train)
    {
        $train->delete();

        return back()->with('sukses', 'Kereta berhasil dihapus.');
    }
}
