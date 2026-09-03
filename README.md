# GoRail — Sistem Reservasi & Manajemen Tiket Kereta Api

GoRail adalah aplikasi web reservasi dan manajemen tiket kereta api berbasis **Laravel 13 + Inertia.js + React.js + MySQL** dengan fitur Role-Based Access Control (RBAC), alur pembayaran manual dengan verifikasi staff, penerbitan e-ticket beserta QR Code dan download PDF, serta manajemen master data untuk administrator.

---

## Diagram Use Case Sistem

Berikut adalah representasi Use Case Diagram sistem GoRail yang mencakup interaksi antara aktor (Guest, Customer, Staff, Admin) dan fungsionalitas sistem:

![Use Case Diagram](public/use%20case%20gorail.jpg)

---

## Tech Stack & Library

Berikut adalah rincian teknologi, starter kit, library, CSS framework, serta plugin/package yang digunakan pada project GoRail:

| Kategori | Teknologi / Package | Keterangan |
|---|---|---|
| **Backend Framework** | **Laravel 13** (`laravel/framework: ^13.17`) | Core web application framework (PHP 8.3+) |
| **Starter Kit** | **Laravel Breeze** (`laravel/breeze: ^2.4`) | Auth scaffolding bawaan Laravel berbasis Inertia + React |
| **Frontend Library** | **React 18** (`react`, `react-dom: ^18.2.0`) | UI Library untuk komponen interaktif dan dinamis |
| **Fullstack Bridge** | **Inertia.js** (`@inertiajs/react: ^2.0.0`, `inertiajs/inertia-laravel: ^2.0`) | Menghubungkan Laravel backend dengan React tanpa REST API terpisah |
| **CSS Framework** | **Tailwind CSS** (`tailwindcss: ^3.2.1` / `@tailwindcss/vite: ^4.0.0`) | Utility-first CSS framework *(Catatan: **Bukan Bootstrap**, Bootstrap **tidak** digunakan di project ini)* |
| **Build Tool / Bundler** | **Vite 8** (`vite: ^8.0.0`) | Frontend development & asset bundler super cepat |
| **Database** | **MySQL** | Relational database management system |

### Plugin & Package yang Digunakan

#### **1. Backend Packages & Plugins (Composer / PHP)**
- **`laravel/breeze`**: Starter kit autentikasi (login, register, reset password, profil).
- **`spatie/laravel-permission`**: Role-Based Access Control (RBAC) untuk pemisahan role `customer`, `staff`, dan `admin`.
- **`barryvdh/laravel-dompdf`**: Generator dokumen PDF untuk pencetakan e-ticket.
- **`simplesoftwareio/simple-qrcode`**: Generator QR Code tiket yang dipindai saat verifikasi.
- **`tightenco/ziggy`**: Menyediakan helper route Laravel (`route(...)`) secara langsung di komponen React.
- **`laravel/sanctum`**: Otentikasi token / session guard.
- **`laravel/tinker`**: REPL CLI interaktif untuk debugging data Laravel.
- **`laravel/pint`**: PHP code style fixer & linter.
- **`laravel/pail`**: Tool logging interaktif via CLI.

#### **2. Frontend Plugins & Libraries (NPM / JS)**
- **`@vitejs/plugin-react`**: Plugin Vite resmi untuk kompilasi Fast Refresh React (JSX/TSX).
- **`laravel-vite-plugin`**: Plugin Vite integrasi resmi dengan ekosistem Laravel blade/assets.
- **`@tailwindcss/vite` & `@tailwindcss/forms`**: Plugin Tailwind CSS untuk form styling dan Vite compilation.
- **`@headlessui/react`**: Komponen UI headless tanpa style untuk aksesibilitas tinggi (modal, dropdown, transition).
- **`lucide-react`**: Kumpulan icon modern untuk UI GoRail.
- **`axios`**: HTTP Client berbasis Promise untuk request asynchronous.
- **`concurrently`**: Utility runner untuk menjalankan proses secara bersamaan.

---

## Struktur Database

```
users
├── roles (Spatie RBAC)
└── bookings (1:N)
    ├── schedule (N:1)
    │   ├── train (N:1) ── coaches (1:N) ── seats (1:N)
    │   ├── station_asal (N:1 -> stations)
    │   └── station_tujuan (N:1 -> stations)
    ├── passengers (1:N)
    ├── booking_seats (1:N -> seats)
    └── payment (1:1)
```

---

## Akun Demo Bawaan (Seeder)

Setelah menjalankan database seeder, tersedia 3 akun default untuk pengujian:

| Role | Email | Password |
|---|---|---|
| **Customer** | `customer@gorail.test` | `password` |
| **Staff** | `staff@gorail.test` | `password` |
| **Admin** | `admin@gorail.test` | `password` |

---

## Panduan Instalasi & Menjalankan Project

### 1. Clone & Setup Environment
```bash
cp .env.example .env
composer install
npm install
php artisan key:generate
```

### 2. Konfigurasi Database pada `.env`
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=GoRail
DB_USERNAME=root
DB_PASSWORD=
```

### 3. Migrasi & Seed Database
```bash
php artisan migrate:fresh --seed
```

### 4. Jalankan Server Pengembangan
Terminal 1 (Laravel Server):
```bash
php artisan serve
```

Terminal 2 (Vite / React Build):
```bash
npm run dev
```

---

## Ringkasan Route & Endpoint

### Publik / Guest
- `GET /` — Halaman Utama
- `GET /schedules/search` — Pencarian Jadwal Kereta
- `GET /schedules/{schedule}` — Detail Jadwal & Denah Kursi

### Customer (`role:customer`)
- `GET /bookings` — Riwayat Booking
- `POST /bookings` — Pembuatan Booking Baru
- `GET /bookings/{booking}` — Detail Booking
- `POST /bookings/{booking}/cancel` — Pembatalan Booking
- `POST /payments/{booking}/upload` — Upload Bukti Pembayaran
- `GET /tickets/{booking}` — Tampilan E-Ticket
- `GET /tickets/{booking}/download` — Download E-Ticket PDF

### Staff (`role:staff,admin`)
- `GET /staff/payments` — Daftar Pembayaran Menunggu Verifikasi
- `POST /staff/payments/{payment}/verify` — Verifikasi / Tolak Pembayaran
- `GET /reports/bookings/export` — Export Laporan Booking ke CSV

### Admin (`role:admin`)
- `RESOURCE /admin/users` — Manajemen Pengguna & Role
- `RESOURCE /admin/stations` — Manajemen Stasiun
- `POST /admin/stations/import` — Import Massal Stasiun (CSV)
- `RESOURCE /admin/trains` — Manajemen Kereta Api
- `RESOURCE /admin/coaches` — Manajemen Gerbong & Kelas
- `RESOURCE /admin/seats` — Manajemen Kursi
- `RESOURCE /admin/schedules` — Manajemen Jadwal & Tarif Perjalanan

