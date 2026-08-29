---
name: gorail-development
description: Panduan pengembangan sistem GoRail (reservasi & manajemen tiket kereta) berbasis Laravel 13 + Breeze + Inertia + React.js dengan database MySQL. Gunakan skill ini setiap kali mengerjakan fitur, migration, model, controller, request, policy, halaman React/Inertia, atau perubahan apa pun di dalam project GoRail — termasuk autentikasi & role, pencarian jadwal, pemilihan kursi, booking, upload/verifikasi bukti pembayaran, e-ticket, dan admin management. Wajib dibaca sebelum menulis kode agar konsisten dengan konvensi penamaan (variabel berbahasa Indonesia), struktur database, alur status booking/pembayaran, lokasi penyimpanan file bukti pembayaran, serta pemilihan package/library yang tepat.
---

# GoRail — Panduan Pengembangan

Skill ini adalah acuan konsistensi untuk membangun **GoRail**, aplikasi web reservasi tiket kereta (Laravel 13 + Breeze + Inertia + React.js + MySQL). Baca ini sebelum membuat migration, model, controller, request, policy, atau halaman React baru, agar hasilnya konsisten dengan bagian lain dari sistem.

## 1. Ringkasan Project

GoRail mencakup alur inti: pencarian perjalanan → pemilihan kursi → booking → pembayaran manual (upload bukti) → verifikasi oleh staff → penerbitan e-ticket.

**Tujuan:**
- Reservasi tiket terstruktur dari pencarian sampai tiket terbit.
- Pengelolaan data kereta, stasiun, gerbong, kursi, dan jadwal.
- Workflow pembayaran manual dengan verifikasi staff.
- Role-based access control (RBAC).

**Role pengguna** (Guest **bukan** role database — pengunjung belum login hanya bisa browsing publik & cari jadwal, wajib login/register untuk booking):
| Role | Fokus Akses |
|---|---|
| `customer` | Cari jadwal, booking, pilih kursi, upload bukti pembayaran, lihat tiket |
| `staff` | Verifikasi pembayaran, lihat booking & data penumpang |
| `admin` | Kelola user & seluruh master data |

## 2. Prinsip & Konvensi Penamaan (WAJIB DIIKUTI)

Selalu jaga konsistensi berikut di seluruh codebase:

- **Variabel dalam bahasa Indonesia.** Semua nama variabel lokal di PHP (controller, service, request, dsb) dan di React/JS (state, props lokal, variabel dalam function) ditulis dalam bahasa Indonesia yang jelas. Contoh: `$jadwalTerpilih`, `$kursiTersedia`, `$totalHarga`, `$buktiPembayaran`, `const [dataPenumpang, setDataPenumpang] = useState(...)`.
- **Struktur & konvensi framework tetap bahasa Inggris**, mengikuti standar Laravel supaya tooling (route model binding, auto-resolve, Eloquent) tetap jalan normal:
  - Nama tabel & kolom database, nama class Model/Controller/Request/Policy/Resource, nama route, nama file migration — tetap bahasa Inggris standar Laravel (`bookings`, `BookingController`, `StoreBookingRequest`).
  - Isi logic di dalam class-class tersebut (variabel lokal, nama argumen closure, dsb) — bahasa Indonesia.
- **PSR-12** untuk PHP, ikuti default ESLint/Prettier project React untuk JS/JSX.
- Gunakan **Form Request** untuk validasi (jangan validasi inline di controller).
- Gunakan **Eloquent Resource** untuk membentuk data yang dikirim ke Inertia/React (jangan expose model mentah).
- Gunakan **Policy** untuk otorisasi per-resource (`BookingPolicy`, `PaymentPolicy`, dst), dikombinasikan dengan middleware role di level route group.
- Gunakan **PHP native enum** (didukung penuh di Laravel 13) untuk status, bukan string bebas — lihat §5.

## 3. Struktur Database Inti

| Tabel | Keterangan |
|---|---|
| `users` | Data akun pengguna |
| `roles` | customer / staff / admin (jika RBAC dipisah ke tabel) |
| `stations` | Kode, nama, kota stasiun |
| `trains` | Nama & nomor kereta |
| `coaches` | Gerbong & kelas kereta |
| `seats` | Nomor kursi, relasi ke gerbong |
| `schedules` | Rute, jadwal berangkat/tiba, harga |
| `bookings` | Transaksi reservasi & status booking |
| `passengers` | Data penumpang pada booking |
| `booking_seats` | Relasi booking ↔ kursi yang dipilih |
| `payments` | Nominal, bukti pembayaran, status, verifier, waktu verifikasi |

Relasi kunci: `schedules` → `trains`, `stations` (asal/tujuan); `bookings` → `users`, `schedules`; `booking_seats` → `bookings`, `seats`; `passengers` → `bookings`; `payments` → `bookings` (1:1).

## 4. Hak Akses per Fitur

| Fitur | Customer | Staff | Admin |
|---|---|---|---|
| Cari & lihat jadwal | ✓ | ✓ | ✓ |
| Booking & pilih kursi | ✓ | — | — |
| Upload bukti pembayaran | ✓ | — | — |
| Verifikasi / tolak pembayaran | — | ✓ | ✓ |
| Lihat booking & penumpang | milik sendiri | ✓ | ✓ |
| Lihat / download e-ticket | ✓ | ✓ | ✓ |
| Kelola user / stasiun / kereta / gerbong / kursi / jadwal & tarif | — | — | ✓ |

Implementasikan lewat route group + middleware, contoh:

```php
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    // manajemen master data
});

Route::middleware(['auth', 'role:staff,admin'])->prefix('staff')->group(function () {
    // verifikasi pembayaran
});

Route::middleware(['auth', 'role:customer'])->group(function () {
    // booking, upload bukti pembayaran
});
```

Untuk cek kepemilikan data (customer hanya boleh lihat booking miliknya), gunakan Policy, bukan hanya middleware role.

## 5. Alur Bisnis & Status (State Machine)

```
1. Customer cari perjalanan (asal, tujuan, tanggal)
2. Customer pilih jadwal & kursi tersedia
3. Customer isi data penumpang → buat booking
4. Sistem buat booking, status pembayaran = UNPAID
5. Customer transfer sesuai nominal & upload bukti pembayaran
6. Status pembayaran → WAITING_VERIFICATION
7. Staff periksa bukti pembayaran
8. Valid  -> payment = PAID,     booking = CONFIRMED
   Invalid-> payment = REJECTED
9. Customer lihat e-ticket setelah pembayaran dikonfirmasi
```

**Status Payment:** `UNPAID → WAITING_VERIFICATION → PAID / REJECTED`
**Status Booking:** `PENDING → CONFIRMED / CANCELLED → COMPLETED`

Definisikan sebagai PHP enum, class boleh dalam bahasa Indonesia, value tetap sesuai istilah bisnis di atas:

```php
enum StatusPembayaran: string
{
    case BELUM_BAYAR = 'UNPAID';
    case MENUNGGU_VERIFIKASI = 'WAITING_VERIFICATION';
    case LUNAS = 'PAID';
    case DITOLAK = 'REJECTED';
}

enum StatusBooking: string
{
    case MENUNGGU = 'PENDING';
    case DIKONFIRMASI = 'CONFIRMED';
    case DIBATALKAN = 'CANCELLED';
    case SELESAI = 'COMPLETED';
}
```

Cast di model: `protected $casts = ['status' => StatusPembayaran::class];`

Transisi status **hanya** boleh terjadi lewat method khusus di Model/Service (mis. `Payment::verifikasi()`, `Payment::tolak()`), jangan set kolom status langsung dari controller, supaya alur bisnis tidak bisa dilompati.

## 6. Penyimpanan Bukti Pembayaran (WAJIB)

Bukti pembayaran **tidak boleh publik**. Simpan di disk `local`, yang secara default di Laravel 11+/13 sudah mengarah ke `storage/app/private`:

```php
// config/filesystems.php — pastikan disk 'local' seperti ini (default Laravel 13):
'local' => [
    'driver' => 'local',
    'root' => storage_path('app/private'),
    'serve' => true,
    'throw' => false,
],
```

- Upload: `Storage::disk('local')->putFile('bukti-pembayaran', $request->file('bukti_pembayaran'));`
- Simpan **path**-nya saja di kolom `payments.bukti_pembayaran`.
- Akses file: **jangan** pakai `Storage::url()` publik. Buat route terproteksi (`auth` + Policy) yang stream file lewat controller, contoh:

```php
Route::get('/payments/{payment}/bukti', function (Payment $payment) {
    Gate::authorize('view', $payment); // staff, admin, atau pemilik booking saja
    return Storage::disk('local')->response($payment->bukti_pembayaran);
})->middleware('auth')->name('payments.bukti');
```

## 7. Implementasi Array & Akses File (Persyaratan Wajib Project)

Project ini harus **secara eksplisit** menunjukkan pemakaian array dan akses file (native PHP), terpisah dari operasi Eloquent biasa. Terapkan pada dua fitur berikut supaya terasa natural dan tetap berguna:

**a) Export laporan booking (Staff/Admin) ke CSV**
Gunakan array untuk menyusun baris data, lalu fungsi file native (`fopen`, `fputcsv`, `fclose`) — bukan package seperti Laravel-Excel, agar konsep array & file I/O terlihat jelas:

```php
public function eksporLaporanBooking()
{
    $daftarBooking = Booking::with(['user', 'schedule', 'payment'])->get();

    $baris = [];
    $baris[] = ['Kode Booking', 'Nama Customer', 'Jadwal', 'Status Booking', 'Status Pembayaran'];
    foreach ($daftarBooking as $booking) {
        $baris[] = [
            $booking->kode_booking,
            $booking->user->name,
            $booking->schedule->kode_jadwal,
            $booking->status->value,
            $booking->payment?->status->value ?? '-',
        ];
    }

    $namaFile = 'laporan-booking-' . now()->format('Ymd-His') . '.csv';
    $lokasiFile = storage_path('app/private/laporan/' . $namaFile);

    $handleFile = fopen($lokasiFile, 'w');
    foreach ($baris as $satuBaris) {
        fputcsv($handleFile, $satuBaris);
    }
    fclose($handleFile);

    return response()->download($lokasiFile)->deleteFileAfterSend(true);
}
```

**b) Import data stasiun massal (Admin) dari CSV**
Baca file dengan `fopen`/`fgetcsv`, tampung ke array, validasi tiap baris, baru simpan ke database:

```php
public function importStasiun(Request $request)
{
    $request->validate(['file_csv' => 'required|file|mimes:csv,txt']);

    $handleFile = fopen($request->file('file_csv')->getRealPath(), 'r');
    $daftarStasiunBaru = [];
    $baris = 0;

    while (($data = fgetcsv($handleFile)) !== false) {
        $baris++;
        if ($baris === 1) continue; // lewati header

        $daftarStasiunBaru[] = [
            'kode_stasiun' => $data[0],
            'nama_stasiun' => $data[1],
            'kota' => $data[2],
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
    fclose($handleFile);

    Station::insert($daftarStasiunBaru);

    return back()->with('sukses', count($daftarStasiunBaru) . ' stasiun berhasil diimpor.');
}
```

Fitur array lain yang boleh dipakai secara alami (bukan dipaksakan): menyusun array kursi per gerbong untuk ditampilkan sebagai denah kursi (seat map), dan menyusun array ketersediaan kursi saat proses booking untuk mengecek konflik sebelum insert ke `booking_seats`.

## 8. Library / Package

Sebelum menambah dependency baru, **selalu cek `composer.json` dan `package.json` project dulu** — jika sudah ada, gunakan yang ada dan beri tahu user; jika belum, baru tambahkan dan beri tahu user apa yang ditambahkan & alasannya. Rekomendasi per kebutuhan:

| Kebutuhan | Package | Catatan |
|---|---|---|
| RBAC (role customer/staff/admin) | `spatie/laravel-permission` | Standar de-facto Laravel untuk role & permission, hemat waktu dibanding bikin sistem role manual |
| QR Code untuk e-ticket | `simplesoftwareio/simple-qrcode` atau `endroid/qr-code` | Generate QR berisi kode booking untuk validasi tiket |
| PDF e-ticket / laporan | `barryvdh/laravel-dompdf` | Untuk tombol "download e-ticket" berupa PDF |
| Upload & validasi gambar bukti pembayaran | Bawaan Laravel (`Illuminate\Http\UploadedFile`, `image` rule di Form Request) | Tidak perlu package tambahan |
| Import/export CSV | **Native PHP** (`fopen`, `fgetcsv`, `fputcsv`) — lihat §7 | Sengaja tidak pakai Laravel-Excel di fitur ini agar syarat "array & akses file" terpenuhi eksplisit |
| Notifikasi status pembayaran/booking | Laravel Notification bawaan (mail/database channel) | Tidak perlu package eksternal |

Instalasi jika belum ada:

```bash
composer require spatie/laravel-permission
composer require barryvdh/laravel-dompdf
composer require simplesoftwareio/simple-qrcode
```

Setelah `spatie/laravel-permission` terpasang, jalankan migration bawaannya lalu buat seeder role `customer`, `staff`, `admin`.

### Seeder Akun Default

Wajib sediakan **`DatabaseSeeder`** yang membuat 3 akun contoh, satu untuk tiap role, supaya testing/demo tidak perlu register manual dulu. Buat `UserSeeder` khusus:

```php
// database/seeders/UserSeeder.php
class UserSeeder extends Seeder
{
    public function run(): void
    {
        $akunPerRole = [
            [
                'name' => 'Customer Demo',
                'email' => 'customer@gorail.test',
                'password' => Hash::make('password'),
                'role' => 'customer',
            ],
            [
                'name' => 'Staff Demo',
                'email' => 'staff@gorail.test',
                'password' => Hash::make('password'),
                'role' => 'staff',
            ],
            [
                'name' => 'Admin Demo',
                'email' => 'admin@gorail.test',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ],
        ];

        foreach ($akunPerRole as $dataAkun) {
            $user = User::firstOrCreate(
                ['email' => $dataAkun['email']],
                [
                    'name' => $dataAkun['name'],
                    'password' => $dataAkun['password'],
                    'email_verified_at' => now(),
                ]
            );

            $user->assignRole($dataAkun['role']); // dari spatie/laravel-permission
        }
    }
}
```

Panggil dari `DatabaseSeeder::run()`:

```php
public function run(): void
{
    $this->call([
        RoleSeeder::class,  // seeder role customer/staff/admin (spatie) — jalankan lebih dulu
        UserSeeder::class,  // 3 akun demo
        // seeder master data lain (stations, trains, dst) bila ada
    ]);
}
```

Jalankan dengan `php artisan migrate:fresh --seed`. Gunakan `firstOrCreate` (bukan `create`) supaya seeder aman dijalankan berulang tanpa duplikat akun.

## 9. Struktur Frontend (Inertia + React)

```
resources/js/Pages/
├── Auth/                  # bawaan Breeze
├── Public/                # landing, pencarian jadwal (bisa diakses guest)
├── Customer/
│   ├── Booking/
│   ├── Payment/
│   └── Ticket/
├── Staff/
│   └── PaymentVerification/
└── Admin/
    ├── Users/
    ├── Stations/
    ├── Trains/
    ├── Coaches/
    ├── Seats/
    └── Schedules/
```

- Komponen reusable (form kursi, kartu jadwal, badge status) taruh di `resources/js/Components/`.
- Kirim data status (`StatusBooking`, `StatusPembayaran`) sebagai string value dari enum lewat Resource — jangan expose seluruh enum PHP ke frontend, cukup label + value untuk badge warna status.
- Gunakan `useForm` dari Inertia untuk semua form (booking, upload bukti, verifikasi), bukan `fetch`/`axios` manual, supaya penanganan error validasi konsisten.

## 10. Checklist Sebelum Commit Fitur Baru

- [x] Variabel lokal PHP & JS pakai bahasa Indonesia, class/route/table tetap bahasa Inggris.
- [x] Perubahan status booking/pembayaran lewat method khusus di model/service, bukan set kolom langsung.
- [x] Bukti pembayaran tersimpan di `storage/app/private`, tidak ada akses publik langsung.
- [x] Otorisasi dicek lewat Policy, bukan hanya `if` role di controller.
- [x] Validasi input lewat Form Request.
- [x] Package baru dicek dulu di `composer.json`/`package.json` sebelum ditambahkan, dan diberitahukan ke user.
- [x] `UserSeeder` tersedia dan menghasilkan 3 akun demo (customer, staff, admin) lewat `DatabaseSeeder`.
