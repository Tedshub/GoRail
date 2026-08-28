<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>E-Ticket {{ $booking->kode_booking }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            line-height: 1.5;
            margin: 0;
            padding: 20px;
        }
        .header {
            border-bottom: 2px solid #2563eb;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .logo-title {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
        }
        .booking-code {
            font-size: 16px;
            float: right;
            margin-top: 5px;
            font-weight: bold;
            color: #1e40af;
        }
        .clear {
            clear: both;
        }
        .ticket-box {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
            background-color: #f9fafb;
        }
        .info-grid {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        .info-grid td {
            padding: 8px;
            vertical-align: top;
        }
        .label {
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
        }
        .value {
            font-size: 14px;
            font-weight: bold;
            color: #111827;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        .table th, .table td {
            border: 1px solid #e5e7eb;
            padding: 8px 12px;
            text-align: left;
            font-size: 13px;
        }
        .table th {
            background-color: #2563eb;
            color: white;
        }
        .qr-section {
            text-align: center;
            margin-top: 20px;
            padding: 15px;
        }
        .footer {
            margin-top: 30px;
            border-top: 1px dashed #d1d5db;
            padding-top: 10px;
            font-size: 11px;
            color: #6b7280;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="header">
        <span class="logo-title">GoRail E-Ticket</span>
        <span class="booking-code">Kode: {{ $booking->kode_booking }}</span>
        <div class="clear"></div>
    </div>

    <div class="ticket-box">
        <table class="info-grid">
            <tr>
                <td>
                    <div class="label">Kereta</div>
                    <div class="value">{{ $booking->schedule->train->nama_kereta }} ({{ $booking->schedule->train->nomor_kereta }})</div>
                </td>
                <td>
                    <div class="label">Tanggal Berangkat</div>
                    <div class="value">{{ $booking->tanggal_berangkat->format('d M Y') }}</div>
                </td>
            </tr>
            <tr>
                <td>
                    <div class="label">Stasiun Asal</div>
                    <div class="value">{{ $booking->schedule->stationAsal->nama_stasiun }} ({{ $booking->schedule->stationAsal->kota }})</div>
                    <div style="font-size: 12px; color: #4b5563;">{{ $booking->schedule->waktu_berangkat->format('H:i') }} WIB</div>
                </td>
                <td>
                    <div class="label">Stasiun Tujuan</div>
                    <div class="value">{{ $booking->schedule->stationTujuan->nama_stasiun }} ({{ $booking->schedule->stationTujuan->kota }})</div>
                    <div style="font-size: 12px; color: #4b5563;">{{ $booking->schedule->waktu_tiba->format('H:i') }} WIB</div>
                </td>
            </tr>
        </table>
    </div>

    <h3>Daftar Penumpang & Kursi</h3>
    <table class="table">
        <thead>
            <tr>
                <th>No</th>
                <th>Nama Penumpang</th>
                <th>No. Identitas (Jenis)</th>
                <th>Gerbong</th>
                <th>Kursi</th>
            </tr>
        </thead>
        <tbody>
            @foreach($booking->bookingSeats as $index => $bs)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $bs->passenger ? $bs->passenger->nama_penumpang : '-' }}</td>
                <td>{{ $bs->passenger ? $bs->passenger->nomor_identitas . ' (' . $bs->passenger->jenis_identitas . ')' : '-' }}</td>
                <td>{{ $bs->seat->coach->nama_gerbong }} ({{ ucfirst($bs->seat->coach->kelas->value) }})</td>
                <td><strong>{{ $bs->seat->nomor_kursi }}</strong></td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="qr-section">
        <div>{!! $qrCode !!}</div>
        <div style="font-size: 12px; margin-top: 5px; color: #4b5563;">Tunjukkan QR Code ini kepada petugas stasiun saat boarding.</div>
    </div>

    <div class="footer">
        <p>Tiket ini diterbitkan resmi oleh sistem GoRail. Harap membawa identitas asli saat melakukan perjalanan.</p>
    </div>
</body>
</html>
