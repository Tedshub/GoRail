<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>E-Ticket - {{ $booking->kode_booking }}</title>
    <style>
        @page {
            margin: 20px;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        }
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #1e293b;
            font-size: 12px;
            line-height: 1.4;
            margin: 0;
            padding: 10px;
        }
        .ticket-box {
            border: 2px solid #059669;
            border-radius: 12px;
            overflow: hidden;
            background-color: #ffffff;
        }
        .header {
            background-color: #0f172a;
            color: #ffffff;
            padding: 16px 20px;
        }
        .header table {
            width: 100%;
        }
        .brand-title {
            font-size: 20px;
            font-weight: bold;
            color: #10b981;
            margin: 0;
        }
        .brand-sub {
            font-size: 10px;
            color: #94a3b8;
            margin: 2px 0 0 0;
        }
        .booking-code-box {
            text-align: right;
        }
        .booking-code-label {
            font-size: 10px;
            color: #10b981;
            text-transform: uppercase;
            font-weight: bold;
        }
        .booking-code-val {
            font-size: 18px;
            font-weight: bold;
            font-family: monospace;
            color: #ffffff;
        }
        .content {
            padding: 20px;
        }
        .info-grid {
            width: 100%;
            margin-bottom: 20px;
            background-color: #f8fafc;
            border-radius: 8px;
            padding: 12px;
        }
        .info-cell {
            padding: 4px 8px;
            vertical-align: top;
        }
        .label {
            font-size: 9px;
            text-transform: uppercase;
            color: #64748b;
            font-weight: bold;
            margin-bottom: 2px;
        }
        .value {
            font-size: 13px;
            font-weight: bold;
            color: #0f172a;
        }
        .route-table {
            width: 100%;
            margin-bottom: 20px;
            border-bottom: 1px dashed #cbd5e1;
            padding-bottom: 15px;
        }
        .station-box {
            width: 40%;
        }
        .arrow-box {
            width: 20%;
            text-align: center;
            vertical-align: middle;
            color: #059669;
            font-weight: bold;
            font-size: 14px;
        }
        .passengers-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .passengers-table th {
            background-color: #f1f5f9;
            color: #475569;
            font-size: 10px;
            text-transform: uppercase;
            font-weight: bold;
            padding: 8px 10px;
            border-bottom: 1px solid #cbd5e1;
            text-align: left;
        }
        .passengers-table td {
            padding: 8px 10px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 11px;
        }
        .qr-section {
            width: 100%;
            margin-top: 10px;
        }
        .qr-box {
            width: 140px;
            text-align: center;
            vertical-align: top;
        }
        .rules-box {
            padding-left: 20px;
            vertical-align: top;
            font-size: 10px;
            color: #475569;
        }
        .rules-title {
            font-weight: bold;
            color: #0f172a;
            margin-bottom: 4px;
        }
        .status-badge {
            display: inline-block;
            padding: 2px 8px;
            background-color: #d1fae5;
            color: #065f46;
            border-radius: 4px;
            font-weight: bold;
            font-size: 9px;
            text-transform: uppercase;
        }
    </style>
</head>
<body>
    <div class="ticket-box">
        <!-- Header -->
        <div class="header">
            <table>
                <tr>
                    <td>
                        <h1 class="brand-title">GoRail Boarding Pass</h1>
                        <p class="brand-sub">PT GoRail Indonesia — Sistem Reservasi Tiket Kereta Api</p>
                    </td>
                    <td class="booking-code-box">
                        <div class="booking-code-label">Kode Booking</div>
                        <div class="booking-code-val">{{ $booking->kode_booking }}</div>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- Info Bar -->
            <table class="info-grid">
                <tr>
                    <td class="info-cell" style="width: 33%;">
                        <div class="label">Kereta Api</div>
                        <div class="value">{{ $booking->schedule->train->nama_kereta ?? '-' }}</div>
                        <div style="font-size: 10px; color: #64748b; font-family: monospace;">{{ $booking->schedule->kode_jadwal ?? '' }}</div>
                    </td>
                    <td class="info-cell" style="width: 33%;">
                        <div class="label">Tanggal Keberangkatan</div>
                        <div class="value">{{ $booking->tanggal_berangkat ? $booking->tanggal_berangkat->format('d M Y') : '-' }}</div>
                        <div style="margin-top: 2px;"><span class="status-badge">TERKONFIRMASI</span></div>
                    </td>
                    <td class="info-cell" style="width: 34%;">
                        <div class="label">Total Pembayaran</div>
                        <div class="value" style="color: #059669;">Rp {{ number_format($booking->payment->jumlah ?? 0, 0, ',', '.') }}</div>
                        <div style="font-size: 10px; color: #64748b;">Status: LUNAS</div>
                    </td>
                </tr>
            </table>

            <!-- Rute Perjalanan -->
            <table class="route-table">
                <tr>
                    <td class="station-box">
                        <div class="label">Keberangkatan</div>
                        <div class="value" style="font-size: 18px;">
                            {{ $booking->schedule->waktu_berangkat ? $booking->schedule->waktu_berangkat->format('H:i') : '--:--' }}
                        </div>
                        <div style="font-size: 12px; font-weight: bold; margin-top: 2px;">
                            {{ $booking->schedule->stationAsal->nama_stasiun ?? 'Asal' }} ({{ $booking->schedule->stationAsal->kode_stasiun ?? '' }})
                        </div>
                        <div style="font-size: 10px; color: #64748b;">{{ $booking->schedule->stationAsal->kota ?? '' }}</div>
                    </td>
                    <td class="arrow-box">
                        ══════►<br>
                        <span style="font-size: 9px; color: #64748b;">LANGSUNG</span>
                    </td>
                    <td class="station-box" style="text-align: right;">
                        <div class="label">Kedatangan</div>
                        <div class="value" style="font-size: 18px;">
                            {{ $booking->schedule->waktu_tiba ? $booking->schedule->waktu_tiba->format('H:i') : '--:--' }}
                        </div>
                        <div style="font-size: 12px; font-weight: bold; margin-top: 2px;">
                            {{ $booking->schedule->stationTujuan->nama_stasiun ?? 'Tujuan' }} ({{ $booking->schedule->stationTujuan->kode_stasiun ?? '' }})
                        </div>
                        <div style="font-size: 10px; color: #64748b;">{{ $booking->schedule->stationTujuan->kota ?? '' }}</div>
                    </td>
                </tr>
            </table>

            <!-- Penumpang -->
            <div style="font-weight: bold; font-size: 11px; margin-bottom: 8px; text-transform: uppercase; color: #0f172a;">
                Daftar Penumpang & Tempat Duduk
            </div>
            <table class="passengers-table">
                <thead>
                    <tr>
                        <th style="width: 5%;">No</th>
                        <th style="width: 35%;">Nama Penumpang</th>
                        <th style="width: 25%;">Identitas</th>
                        <th style="width: 20%;">Gerbong / Kelas</th>
                        <th style="width: 15%;">Kursi</th>
                    </tr>
                </thead>
                <tbody>
                    @if($booking->bookingSeats && $booking->bookingSeats->count() > 0)
                        @foreach($booking->bookingSeats as $index => $bs)
                            @php
                                $penumpang = $bs->passenger ?? ($booking->passengers[$index] ?? null);
                            @endphp
                            <tr>
                                <td>{{ $index + 1 }}</td>
                                <td style="font-weight: bold;">{{ $penumpang->nama_penumpang ?? '-' }}</td>
                                <td>{{ $penumpang->jenis_identitas ?? 'ID' }}: {{ $penumpang->nomor_identitas ?? '-' }}</td>
                                <td>{{ $bs->seat->coach->nama_gerbong ?? '-' }} ({{ ucfirst($bs->seat->coach->kelas->value ?? $bs->seat->coach->kelas ?? '') }})</td>
                                <td style="font-weight: bold; color: #059669; font-size: 12px;">{{ $bs->seat->nomor_kursi ?? '-' }}</td>
                            </tr>
                        @endforeach
                    @elseif($booking->passengers && $booking->passengers->count() > 0)
                        @foreach($booking->passengers as $index => $p)
                            <tr>
                                <td>{{ $index + 1 }}</td>
                                <td style="font-weight: bold;">{{ $p->nama_penumpang }}</td>
                                <td>{{ $p->jenis_identitas }}: {{ $p->nomor_identitas }}</td>
                                <td>-</td>
                                <td>-</td>
                            </tr>
                        @endforeach
                    @endif
                </tbody>
            </table>

            <!-- QR & Ketentuan -->
            <table class="qr-section">
                <tr>
                    <td class="qr-box">
                        <div style="display: inline-block; padding: 6px; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px;">
                            <img src="data:image/svg+xml;base64,{{ base64_encode($qrCode) }}" width="110" height="110" alt="QR Code">
                        </div>
                        <div style="font-size: 8px; color: #64748b; margin-top: 4px; font-family: monospace;">Pindai saat Boarding</div>
                    </td>
                    <td class="rules-box">
                        <div class="rules-title">Ketentuan & Syarat Boarding:</div>
                        <ol style="margin: 0; padding-left: 15px; line-height: 1.5;">
                            <li>Boarding pass ini wajib ditunjukkan bersama kartu identitas asli (KTP/SIM/Paspor) yang masih berlaku.</li>
                            <li>Calon penumpang wajib berada di stasiun paling lambat 30 menit sebelum jadwal keberangkatan kereta.</li>
                            <li>Pintu masuk boarding peron ditutup 5 menit sebelum keberangkatan kereta.</li>
                            <li>Tiket yang telah terbit tunduk pada syarat dan ketentuan angkutan PT GoRail Indonesia.</li>
                        </ol>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</body>
</html>
