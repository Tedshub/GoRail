# Laporan Penggunaan Library, Komponen Pre-Existing, dan Plugin
**Proyek: GoRail — Sistem Informasi & Reservasi Tiket Kereta Api**

---

### 1. Daftar Library, Komponen Pre-Existing, dan Plugin yang Digunakan

Berdasarkan rancangan unit program terstruktur pada sistem **GoRail**, berikut adalah daftar library, komponen bawaan (*pre-existing components*), dan plugin yang diintegrasikan ke dalam proyek:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                            EKOSISTEM LIBRARY & PLUGIN GORAIL                                │
├───────────────────────────────┬─────────────────────────────────────────────────────────────┤
│ 1. Backend Libraries (PHP)    │ Spatie Permission, Barryvdh DomPDF, Simple QrCode,         │
│                               │ Inertia Laravel, Ziggy, Laravel Sanctum, Laravel Breeze     │
├───────────────────────────────┼─────────────────────────────────────────────────────────────┤
│ 2. Frontend Libraries (JS/UI) │ React 18, @inertiajs/react, @headlessui/react, Axios        │
├───────────────────────────────┼─────────────────────────────────────────────────────────────┤
│ 3. Build Tools & CSS Plugins  │ Vite, @vitejs/plugin-react, laravel-vite-plugin,            │
│                               │ Tailwind CSS, @tailwindcss/forms, PostCSS, Autoprefixer     │
├───────────────────────────────┼─────────────────────────────────────────────────────────────┤
│ 4. Pre-Existing UI Components │ GuestLayout, AuthenticatedLayout, Dropdown, Modal,          │
│                               │ NavLink, ResponsiveNavLink, TextInput, InputError, Checkbox │
└───────────────────────────────┴─────────────────────────────────────────────────────────────┘
```

---

### 2. Penjelasan Fungsi dan Kegunaan Masing-Masing Library / Komponen / Plugin

#### A. Backend Libraries & Plugins (PHP / Laravel Ecosystem)

1. **`spatie/laravel-permission` (v8.3)**
   - **Fungsi:** Mengelola sistem kontrol akses berbasis peran (*Role-Based Access Control / RBAC*) secara dinamis.
   - **Kegunaan pada GoRail:**
     - Membagi hak akses sistem ke dalam 3 role utama: `admin`, `staff`, dan `customer`.
     - Memproteksi rute pada `routes/web.php` melalui middleware `role:customer`, `role:staff,admin`, dan `role:admin`.
     - Menyediakan metode struktural seperti `$user->assignRole()`, `$user->syncRoles()`, dan `$user->hasRole()`.

2. **`barryvdh/laravel-dompdf` (v3.1)**
   - **Fungsi:** Mengonversi tampilan HTML/Blade menjadi dokumen fisik berformat PDF (*HTML to PDF Rendering Engine*).
   - **Kegunaan pada GoRail:**
     - Digunakan pada `TicketController::download()` untuk menerbitkan E-Ticket resmi yang dapat diunduh penumpang.
     - Menyusun layout tiket (kode booking, nama kereta, gerbong, kursi, manifest penumpang, dan QR Code) dalam format siap cetak/boarding.

3. **`simplesoftwareio/simple-qrcode` (v4.2)**
   - **Fungsi:** Generator kode matriks dua dimensi (*QR Code Generator*).
   - **Kegunaan pada GoRail:**
     - Menghasilkan QR Code dinamis berbasis `kode_booking` unik (format SVG/PNG).
     - Disematkan pada halaman tiket online dan dokumen PDF e-ticket untuk keperluan validasi pemindaian (*boarding scan*) oleh petugas loket/stasiun.

4. **`inertiajs/inertia-laravel` (v2.0)**
   - **Fungsi:** Adapter backend monolithic untuk menghubungkan controller Laravel dengan antarmuka React tanpa perlu membangun REST API terpisah.
   - **Kegunaan pada GoRail:**
     - Mengirimkan data dari controller langsung sebagai props komponen React (`Inertia::render('Dashboard', [...])`).
     - Menyediakan middleware `HandleInertiaRequests` untuk *shared state* global (status user login, flash message sesi, dan otorisasi role).

5. **`tightenco/ziggy` (v2.0)**
   - **Fungsi:** Menyediakan fungsi pembantu rute Laravel (`route('nama.route')`) di sisi JavaScript frontend.
   - **Kegunaan pada GoRail:**
     - Memungkinkan navigasi frontend React memanggil *named route* Laravel (misal: `route('schedules.search')`, `route('bookings.show', id)`).
     - Menjaga konsistensi URL antara backend dan frontend saat terjadi perubahan pola URI.

6. **`laravel/sanctum` (v4.0) & `laravel/breeze` (v2.4)**
   - **Fungsi:** Sistem otentikasi sesi (*session-based authentication*), hashing password, dan CSRF protection.
   - **Kegunaan pada GoRail:**
     - Menangani alur login, registrasi akun baru, reset kata sandi, verifikasi email, dan proteksi sesi login pengguna.

---

#### B. Frontend Libraries, Plugins & Pre-Existing UI Components

1. **`@inertiajs/react` (v2.0) & `react` (v18.2)**
   - **Fungsi:** Library UI deklaratif berbasis komponen untuk Single Page Application (SPA).
   - **Kegunaan pada GoRail:**
     - Membangun antarmuka interaktif seperti denah pemilihan kursi (*interactive seat map*), filter pencarian jadwal, dan dashboard real-time tanpa *full page reload*.
     - Menyediakan komponen `<Link>`, `<Head>`, dan hook `useForm()` untuk manajemen form dan validasi instan.

2. **`@headlessui/react` (v2.0)**
   - **Fungsi:** Komponen antarmuka yang sepenuhnya dapat diakses (*accessible*), tanpa gaya bawaan (*unstyled*), dan mendukung transisi animasi halus.
   - **Kegunaan pada GoRail:**
     - Menghidupkan komponen dropdown navigasi akun profil, menu hamburger mobile, dan dialog modal konfirmasi pembatalan tiket.

3. **`tailwindcss` (v3.2) & `@tailwindcss/forms`**
   - **Fungsi:** Utility-first CSS framework beserta plugin normalisasi elemen form.
   - **Kegunaan pada GoRail:**
     - Membangun tema visual premium GoRail (Emerald, Slate, Glassmorphism, dan Gradient Dark).
     - Membuat animasi latar belakang hero dinamis: pergerakan awan (*drifting clouds*), rel kereta api (*track pattern*), sorot lampu (*headlight beam*), dan laju kereta cepat (*train journey*).

4. **`laravel-vite-plugin` & `@vitejs/plugin-react`**
   - **Fungsi:** *Next-Generation Frontend Tooling* & Module Bundler ultra cepat.
   - **Kegunaan pada GoRail:**
     - Melakukan kompilasi JSX/CSS secara instan melalui *Hot Module Replacement (HMR)* selama tahap pengembangan dan optimasi bundle produksi (*tree-shaking*).

5. **`axios` (v1.20)**
   - **Fungsi:** HTTP Client berbasis Promise untuk komunikasi data asynchronous.
   - **Kegunaan pada GoRail:**
     - Menangani transmisi data background seperti upload bukti transfer file gambar multipart/form-data.

---

#### C. Komponen Pre-Existing UI (Reusable Components)

Sistem memanfaatkan komponen reusable yang terstruktur pada direktori `resources/js/Components/` dan `resources/js/Layouts/`:

1. **`GuestLayout.jsx` & `AuthenticatedLayout.jsx`:**
   - **Fungsi:** Layout utama pembungkus halaman tamu (*Guest Auth Pages*) dan halaman pengguna terotentikasi (*Dashboard & Master Data*).
   - **Kegunaan:** Menjamin konsistensi navbar, footer, background hero beranimasi, dan identitas role pada setiap halaman.
2. **`Dropdown.jsx` & `Modal.jsx`:**
   - **Fungsi:** Komponen interaktif popover dan dialog popup konfirmasi.
3. **`NavLink.jsx` & `ResponsiveNavLink.jsx`:**
   - **Fungsi:** Link navigasi cerdas yang otomatis mendeteksi status aktif (*active state indicator*) menggunakan tema warna emerald.
4. **`TextInput.jsx`, `InputError.jsx`, `InputLabel.jsx`, & `Checkbox.jsx`:**
   - **Fungsi:** Komponen form modular standar dengan penanganan pesan error validasi real-time.