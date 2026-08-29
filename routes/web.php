<?php

use App\Http\Controllers\Admin\CoachController;
use App\Http\Controllers\Admin\ScheduleController as AdminScheduleController;
use App\Http\Controllers\Admin\SeatController;
use App\Http\Controllers\Admin\StationController;
use App\Http\Controllers\Admin\TrainController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ScheduleSearchController;
use App\Http\Controllers\Staff\PaymentVerificationController;
use App\Http\Controllers\TicketController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    $daftarStasiun = \App\Models\Station::orderBy('nama_stasiun')->get();

    // Hitung ketersediaan kursi pada rute jadwal populer
    $popularSchedules = \App\Models\Schedule::with(['train.coaches.seats', 'stationAsal', 'stationTujuan'])
        ->orderBy('waktu_berangkat')
        ->take(4)
        ->get()
        ->map(function ($s) {
            $totalKursi = $s->train ? $s->train->coaches->flatMap->seats->count() : 0;
            $kursiTerbooking = \App\Models\BookingSeat::whereHas('booking', function ($q) use ($s) {
                $q->where('schedule_id', $s->id)
                  ->whereNotIn('status', ['CANCELLED', 'DIBATALKAN', \App\Enums\StatusBooking::DIBATALKAN->value]);
            })->distinct('seat_id')->count();

            $kursiTersedia = max(0, $totalKursi - $kursiTerbooking);

            $selisihMenit = $s->waktu_berangkat && $s->waktu_tiba ? $s->waktu_berangkat->diffInMinutes($s->waktu_tiba) : 0;
            $jam = floor($selisihMenit / 60);
            $menit = $selisihMenit % 60;
            $durasi = $menit > 0 ? "{$jam} Jam {$menit} Menit" : "{$jam} Jam";

            return [
                'id' => $s->id,
                'kode_jadwal' => $s->kode_jadwal,
                'asal' => $s->stationAsal ? $s->stationAsal->nama_stasiun . ' (' . $s->stationAsal->kota . ')' : 'Stasiun Asal',
                'tujuan' => $s->stationTujuan ? $s->stationTujuan->nama_stasiun : 'Stasiun Tujuan',
                'kereta' => $s->train ? $s->train->nama_kereta : 'Kereta Api',
                'waktu' => $durasi,
                'tanggal' => $s->waktu_berangkat ? $s->waktu_berangkat->translatedFormat('d F Y') : '-',
                'jam' => $s->waktu_berangkat ? $s->waktu_berangkat->format('H:i') . ' WIB' : '--:--',
                'harga' => 'Rp ' . number_format($s->harga_ekonomi ?: $s->harga, 0, ',', '.'),
                'kelas' => 'Ekonomi / Bisnis / Eksekutif',
                'total_kursi' => $totalKursi,
                'kursi_tersedia' => $kursiTersedia,
            ];
        });

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'stations' => \App\Http\Resources\StationResource::collection($daftarStasiun),
        'popularSchedules' => $popularSchedules,
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

Route::get('/schedules', [ScheduleSearchController::class, 'index'])->name('schedules.index');
Route::get('/schedules/search', [ScheduleSearchController::class, 'index'])->name('schedules.search');
Route::get('/schedules/{schedule}', [ScheduleSearchController::class, 'show'])->name('schedules.show');

/*
|--------------------------------------------------------------------------
| Authenticated User Routes (Umum)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        $user = auth()->user();
        $isAdmin = $user->hasRole('admin');
        $isStaff = $user->hasRole('staff');

        $stats = [];
        $recentBookings = [];

        if ($isAdmin) {
            $stats = [
                'total_users' => \App\Models\User::count(),
                'total_trains' => \App\Models\Train::count(),
                'total_stations' => \App\Models\Station::count(),
                'total_schedules' => \App\Models\Schedule::count(),
                'total_bookings' => \App\Models\Booking::count(),
                'pending_payments' => \App\Models\Payment::where('status', \App\Enums\StatusPembayaran::MENUNGGU_VERIFIKASI)->count(),
            ];
            $recentBookings = \App\Models\Booking::with(['user', 'schedule.train', 'schedule.stationAsal', 'schedule.stationTujuan', 'payment'])
                ->latest()
                ->take(5)
                ->get();
        } elseif ($isStaff) {
            $stats = [
                'pending_payments' => \App\Models\Payment::where('status', \App\Enums\StatusPembayaran::MENUNGGU_VERIFIKASI)->count(),
                'verified_payments' => \App\Models\Payment::where('status', \App\Enums\StatusPembayaran::LUNAS)->count(),
                'active_schedules' => \App\Models\Schedule::count(),
            ];
            $recentBookings = \App\Models\Booking::with(['user', 'schedule.train', 'schedule.stationAsal', 'schedule.stationTujuan', 'payment'])
                ->latest()
                ->take(5)
                ->get();
        } else {
            $stats = [
                'my_bookings' => \App\Models\Booking::where('user_id', $user->id)->count(),
                'pending_bookings' => \App\Models\Booking::where('user_id', $user->id)->where('status', \App\Enums\StatusBooking::MENUNGGU)->count(),
                'confirmed_bookings' => \App\Models\Booking::where('user_id', $user->id)->where('status', \App\Enums\StatusBooking::DIKONFIRMASI)->count(),
            ];
            $recentBookings = \App\Models\Booking::with(['schedule.train', 'schedule.stationAsal', 'schedule.stationTujuan', 'payment'])
                ->where('user_id', $user->id)
                ->latest()
                ->take(5)
                ->get();
        }

        $upcomingSchedules = \App\Models\Schedule::with(['train', 'stationAsal', 'stationTujuan'])
            ->orderBy('waktu_berangkat', 'asc')
            ->take(4)
            ->get();

        $stations = \App\Models\Station::orderBy('nama_stasiun')->get();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentBookings' => $recentBookings,
            'upcomingSchedules' => $upcomingSchedules,
            'stations' => \App\Http\Resources\StationResource::collection($stations),
        ]);
    })->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Akses streaming bukti pembayaran (diproteksi Policy di dalam controller)
    Route::get('/payments/{payment}/bukti', [PaymentController::class, 'showBukti'])->name('payments.bukti');
});

/*
|--------------------------------------------------------------------------
| Customer Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:customer'])->group(function () {
    Route::get('/bookings', [BookingController::class, 'index'])->name('bookings.index');
    Route::post('/bookings', [BookingController::class, 'store'])->name('bookings.store');
    Route::get('/bookings/{booking}', [BookingController::class, 'show'])->name('bookings.show');
    Route::post('/bookings/{booking}/cancel', [BookingController::class, 'cancel'])->name('bookings.cancel');

    Route::post('/payments/{booking}/upload', [PaymentController::class, 'upload'])->name('payments.upload');

    Route::get('/tickets/{booking}', [TicketController::class, 'show'])->name('tickets.show');
    Route::get('/tickets/{booking}/download', [TicketController::class, 'download'])->name('tickets.download');
});

/*
|--------------------------------------------------------------------------
| Staff & Admin Shared Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:staff,admin'])->group(function () {
    Route::get('/staff/payments', [PaymentVerificationController::class, 'index'])->name('staff.payments.index');
    Route::post('/staff/payments/{payment}/verify', [PaymentController::class, 'verify'])->name('staff.payments.verify');
    Route::get('/staff/payments/{payment}/proof', [PaymentController::class, 'showBukti'])->name('staff.payments.proof');
    Route::get('/staff/payments/export', [ReportController::class, 'eksporLaporanBooking'])->name('staff.payments.export');

    // Export Laporan Booking (CSV)
    Route::get('/reports/bookings/export', [ReportController::class, 'eksporLaporanBooking'])->name('reports.bookings.export');
});

/*
|--------------------------------------------------------------------------
| Admin Routes (Master Data & User Management)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    // User Management
    Route::resource('users', UserController::class)->except(['create', 'show', 'edit']);

    // Stations + Import CSV
    Route::post('stations/import', [StationController::class, 'import'])->name('stations.import');
    Route::resource('stations', StationController::class)->except(['create', 'show', 'edit']);

    // Trains
    Route::resource('trains', TrainController::class)->except(['create', 'show', 'edit']);

    // Coaches
    Route::resource('coaches', CoachController::class)->except(['create', 'show', 'edit']);

    // Seats
    Route::resource('seats', SeatController::class)->except(['create', 'show', 'edit']);

    // Schedules
    Route::resource('schedules', AdminScheduleController::class)->except(['create', 'show', 'edit']);
});

require __DIR__.'/auth.php';
