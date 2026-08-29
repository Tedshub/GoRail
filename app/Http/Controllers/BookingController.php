<?php

namespace App\Http\Controllers;

use App\Enums\StatusBooking;
use App\Enums\StatusPembayaran;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Models\BookingSeat;
use App\Models\Passenger;
use App\Models\Payment;
use App\Models\Schedule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * Daftar booking milik customer yang login.
     */
    public function index()
    {
        $userLogin = auth()->user();

        $daftarBooking = Booking::with(['schedule.stationAsal', 'schedule.stationTujuan', 'schedule.train', 'payment'])
            ->where('user_id', $userLogin->id)
            ->latest()
            ->paginate(10);

        return Inertia::render('Customer/Booking/Index', [
            'bookings' => BookingResource::collection($daftarBooking),
        ]);
    }

    /**
     * Buat booking baru.
     */
    public function store(StoreBookingRequest $request)
    {
        $dataValid = $request->validated();
        $userLogin = auth()->user();
        $jadwalTerpilih = Schedule::findOrFail($dataValid['schedule_id']);

        // Ambil data kursi beserta gerbong untuk menghitung harga berdasarkan kelas
        $kursiTerpilih = \App\Models\Seat::with('coach')->whereIn('id', $dataValid['seat_ids'])->get();

        // Hitung total harga dinamis berdasarkan tarif kelas masing-masing kursi
        $totalHarga = 0;
        foreach ($kursiTerpilih as $kursi) {
            $namaKelas = $kursi->coach?->kelas?->value ?? $kursi->coach?->kelas ?? 'ekonomi';
            $totalHarga += $jadwalTerpilih->getHargaUntukKelas($namaKelas);
        }

        // Cek ketersediaan kursi sebelum booking (pakai array untuk mengecek konflik)
        $kursiTerbooking = BookingSeat::whereHas('booking', function ($query) use ($jadwalTerpilih) {
            $query->where('schedule_id', $jadwalTerpilih->id)
                ->whereNotIn('status', ['CANCELLED', 'DIBATALKAN', \App\Enums\StatusBooking::DIBATALKAN->value]);
        })->pluck('seat_id')->map(fn ($id) => (int) $id)->toArray();

        $kursiDipilih = array_map('intval', $dataValid['seat_ids']);
        $kursiKonflik = array_intersect($kursiDipilih, $kursiTerbooking);

        if (! empty($kursiKonflik)) {
            return back()->withErrors([
                'seat_ids' => 'Beberapa kursi yang dipilih sudah tidak tersedia. Silakan pilih kursi lain.',
            ]);
        }

        $bookingBaru = DB::transaction(function () use ($userLogin, $dataValid, $totalHarga) {
            // Buat booking
            $booking = Booking::create([
                'user_id' => $userLogin->id,
                'schedule_id' => $dataValid['schedule_id'],
                'tanggal_berangkat' => $dataValid['tanggal_berangkat'],
                'status' => StatusBooking::MENUNGGU,
            ]);

            // Simpan data penumpang
            $daftarPenumpang = [];
            foreach ($dataValid['penumpang'] as $dataPenumpang) {
                $penumpangBaru = Passenger::create([
                    'booking_id' => $booking->id,
                    'nama_penumpang' => $dataPenumpang['nama_penumpang'],
                    'nomor_identitas' => $dataPenumpang['nomor_identitas'],
                    'jenis_identitas' => $dataPenumpang['jenis_identitas'],
                ]);
                $daftarPenumpang[] = $penumpangBaru;
            }

            // Simpan kursi yang dipilih — assign penumpang ke kursi
            foreach ($dataValid['seat_ids'] as $indeks => $seatId) {
                $penumpangUntukKursi = $daftarPenumpang[$indeks] ?? null;

                BookingSeat::create([
                    'booking_id' => $booking->id,
                    'seat_id' => $seatId,
                    'passenger_id' => $penumpangUntukKursi?->id,
                ]);
            }

            // Buat record pembayaran (UNPAID)
            Payment::create([
                'booking_id' => $booking->id,
                'jumlah' => $totalHarga,
                'status' => StatusPembayaran::BELUM_BAYAR,
            ]);

            return $booking;
        });

        return redirect()->route('bookings.show', $bookingBaru)
            ->with('sukses', 'Booking berhasil dibuat! Silakan lakukan pembayaran.');
    }

    /**
     * Detail booking.
     */
    public function show(Booking $booking)
    {
        Gate::authorize('view', $booking);

        $booking->load([
            'schedule.stationAsal',
            'schedule.stationTujuan',
            'schedule.train',
            'passengers',
            'bookingSeats.seat.coach',
            'bookingSeats.passenger',
            'payment',
            'user',
        ]);

        return Inertia::render('Customer/Booking/Show', [
            'booking' => new BookingResource($booking),
        ]);
    }

    /**
     * Batalkan booking.
     */
    public function cancel(Booking $booking)
    {
        Gate::authorize('cancel', $booking);

        $berhasilBatal = $booking->batalkan();

        if (! $berhasilBatal) {
            return back()->withErrors([
                'status' => 'Booking tidak dapat dibatalkan pada status saat ini.',
            ]);
        }

        return back()->with('sukses', 'Booking berhasil dibatalkan.');
    }
}
