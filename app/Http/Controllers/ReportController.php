<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use ZipArchive;

class ReportController extends Controller
{
    /**
     * Export laporan booking ke format Excel (.xlsx) dengan filter rentang waktu.
     * Menggunakan native PHP ZipArchive & OpenXML Spreadsheet tanpa ketergantungan library pihak ketiga yang berat.
     */
    public function eksporLaporanBooking(Request $request)
    {
        $query = Booking::with(['user', 'schedule.train', 'schedule.stationAsal', 'schedule.stationTujuan', 'payment']);

        $tanggalMulaiInput = $request->query('tanggal_mulai');
        $tanggalSelesaiInput = $request->query('tanggal_selesai');

        $periodeInfo = 'Semua Periode';

        if (! empty($tanggalMulaiInput) && ! empty($tanggalSelesaiInput)) {
            $tglAwal = Carbon::parse($tanggalMulaiInput)->startOfDay();
            $tglAkhir = Carbon::parse($tanggalSelesaiInput)->endOfDay();

            $query->whereBetween('created_at', [$tglAwal, $tglAkhir]);
            $periodeInfo = $tglAwal->translatedFormat('d F Y') . ' s.d. ' . $tglAkhir->translatedFormat('d F Y');
        } elseif (! empty($tanggalMulaiInput)) {
            $tglAwal = Carbon::parse($tanggalMulaiInput)->startOfDay();
            $query->where('created_at', '>=', $tglAwal);
            $periodeInfo = 'Mulai ' . $tglAwal->translatedFormat('d F Y');
        } elseif (! empty($tanggalSelesaiInput)) {
            $tglAkhir = Carbon::parse($tanggalSelesaiInput)->endOfDay();
            $query->where('created_at', '<=', $tglAkhir);
            $periodeInfo = 'Sampai ' . $tglAkhir->translatedFormat('d F Y');
        }

        $daftarBooking = $query->orderBy('created_at', 'desc')->get();

        // Pastikan folder laporan ada
        $direktoriLaporan = storage_path('app/private/laporan');
        if (! File::isDirectory($direktoriLaporan)) {
            File::makeDirectory($direktoriLaporan, 0755, true);
        }

        $namaFile = 'laporan-booking-' . now()->format('Ymd-His') . '.xlsx';
        $lokasiFile = $direktoriLaporan . '/' . $namaFile;

        $this->generateExcelFile($lokasiFile, $daftarBooking, $periodeInfo);

        return response()->download($lokasiFile, $namaFile, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ])->deleteFileAfterSend(true);
    }

    /**
     * Membangun file .xlsx asli dengan format OpenXML (SpreadsheetML).
     */
    private function generateExcelFile(string $filePath, $daftarBooking, string $periodeInfo): void
    {
        $zip = new ZipArchive();
        if ($zip->open($filePath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            throw new \Exception('Gagal membuat berkas Excel (.xlsx).');
        }

        // [Content_Types].xml
        $contentTypes = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' .
            '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' .
            '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' .
            '<Default Extension="xml" ContentType="application/xml"/>' .
            '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' .
            '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' .
            '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' .
            '</Types>';
        $zip->addFromString('[Content_Types].xml', $contentTypes);

        // _rels/.rels
        $rootRels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' .
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' .
            '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' .
            '</Relationships>';
        $zip->addFromString('_rels/.rels', $rootRels);

        // xl/_rels/workbook.xml.rels
        $wbRels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' .
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' .
            '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>' .
            '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' .
            '</Relationships>';
        $zip->addFromString('xl/_rels/workbook.xml.rels', $wbRels);

        // xl/workbook.xml
        $workbook = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' .
            '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' .
            '<sheets>' .
            '<sheet name="Laporan Booking" sheetId="1" r:id="rId1"/>' .
            '</sheets>' .
            '</workbook>';
        $zip->addFromString('xl/workbook.xml', $workbook);

        // xl/styles.xml
        $styles = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' .
            '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' .
            '<fonts count="3">' .
            '<font><sz val="11"/><name val="Calibri"/></font>' .
            '<font><b/><sz val="14"/><color rgb="FF0F172A"/><name val="Calibri"/></font>' .
            '<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>' .
            '</fonts>' .
            '<fills count="4">' .
            '<fill><patternFill patternType="none"/></fill>' .
            '<fill><patternFill patternType="gray125"/></fill>' .
            '<fill><patternFill patternType="solid"><fgColor rgb="FF059669"/></patternFill></fill>' . // Hijau Emerald GoRail
            '<fill><patternFill patternType="solid"><fgColor rgb="FFF8FAFC"/></patternFill></fill>' . // Zebra row
            '</fills>' .
            '<borders count="2">' .
            '<border><left/><right/><top/><bottom/><diagonal/></border>' .
            '<border>' .
            '<left style="thin"><color rgb="FFE2E8F0"/></left>' .
            '<right style="thin"><color rgb="FFE2E8F0"/></right>' .
            '<top style="thin"><color rgb="FFE2E8F0"/></top>' .
            '<bottom style="thin"><color rgb="FFE2E8F0"/></bottom>' .
            '</border>' .
            '</borders>' .
            '<cellStyleXfs count="1">' .
            '<xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>' .
            '</cellStyleXfs>' .
            '<cellXfs count="4">' .
            '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' . // 0: Normal
            '<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>' . // 1: Title Judul
            '<xf numFmtId="0" fontId="2" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' . // 2: Header Table
            '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="center"/></xf>' . // 3: Data Cell dengan border
            '</cellXfs>' .
            '</styleSheet>';
        $zip->addFromString('xl/styles.xml', $styles);

        // xl/worksheets/sheet1.xml
        $sheetXml = $this->buildSheetXml($daftarBooking, $periodeInfo);
        $zip->addFromString('xl/worksheets/sheet1.xml', $sheetXml);

        $zip->close();
    }

    /**
     * Menyusun XML baris dan kolom untuk Sheet1.
     */
    private function buildSheetXml($daftarBooking, string $periodeInfo): string
    {
        $sheetData = '';
        $rowNum = 1;

        // Baris 1: Judul Utama Laporan
        $sheetData .= '<row r="' . $rowNum . '" ht="26" customHeight="1">';
        $sheetData .= '<c r="A' . $rowNum . '" s="1" t="inlineStr"><is><t>GORAIL - LAPORAN TRANSAKSI RESERVASI TIKET</t></is></c>';
        $sheetData .= '</row>';
        $rowNum++;

        // Baris 2: Informasi Periode & Tanggal Unduh
        $sheetData .= '<row r="' . $rowNum . '" ht="20" customHeight="1">';
        $sheetData .= '<c r="A' . $rowNum . '" t="inlineStr"><is><t>Periode: ' . htmlspecialchars($periodeInfo) . ' | Tanggal Unduh: ' . now()->translatedFormat('d F Y, H:i') . ' WIB</t></is></c>';
        $sheetData .= '</row>';
        $rowNum++;

        // Baris 3: Kosong
        $sheetData .= '<row r="' . $rowNum . '" ht="12" customHeight="1"></row>';
        $rowNum++;

        // Baris 4: Header Tabel
        $headers = [
            'No',
            'Kode Booking',
            'Nama Pemesan',
            'Email Pemesan',
            'Kereta Api',
            'Rute Perjalanan',
            'Tanggal Berangkat',
            'Status Booking',
            'Status Pembayaran',
            'Total Bayar (Rp)',
            'Waktu Booking',
        ];

        $colLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];

        $sheetData .= '<row r="' . $rowNum . '" ht="25" customHeight="1">';
        foreach ($headers as $idx => $head) {
            $ref = $colLetters[$idx] . $rowNum;
            $sheetData .= '<c r="' . $ref . '" s="2" t="inlineStr"><is><t>' . htmlspecialchars($head) . '</t></is></c>';
        }
        $sheetData .= '</row>';
        $rowNum++;

        // Baris 5+: Data Transaksi
        $no = 1;
        $totalNominal = 0;

        foreach ($daftarBooking as $booking) {
            $asal = $booking->schedule?->stationAsal?->nama_stasiun ?? 'Asal';
            $tujuan = $booking->schedule?->stationTujuan?->nama_stasiun ?? 'Tujuan';
            $rute = "{$asal} -> {$tujuan}";
            $namaKereta = $booking->schedule?->train?->nama_kereta ?? 'GoRail Express';
            $tglBerangkat = $booking->schedule?->waktu_berangkat ? Carbon::parse($booking->schedule->waktu_berangkat)->format('d/m/Y H:i') : '-';
            $nominal = (int) ($booking->payment?->jumlah ?? 0);
            $totalNominal += $nominal;

            $rowData = [
                (string) $no++,
                (string) $booking->kode_booking,
                (string) ($booking->user?->name ?? '-'),
                (string) ($booking->user?->email ?? '-'),
                (string) $namaKereta,
                (string) $rute,
                (string) $tglBerangkat,
                (string) ($booking->status?->value ?? $booking->status),
                (string) ($booking->payment?->status?->value ?? $booking->payment?->status ?? 'BELUM_BAYAR'),
                number_format($nominal, 0, ',', '.'),
                $booking->created_at->format('d/m/Y H:i'),
            ];

            $sheetData .= '<row r="' . $rowNum . '" ht="20" customHeight="1">';
            foreach ($rowData as $idx => $val) {
                $ref = $colLetters[$idx] . $rowNum;
                $sheetData .= '<c r="' . $ref . '" s="3" t="inlineStr"><is><t>' . htmlspecialchars($val) . '</t></is></c>';
            }
            $sheetData .= '</row>';
            $rowNum++;
        }

        // Baris Ringkasan Total
        if (count($daftarBooking) > 0) {
            $sheetData .= '<row r="' . $rowNum . '" ht="22" customHeight="1">';
            $sheetData .= '<c r="A' . $rowNum . '" s="3" t="inlineStr"><is><t></t></is></c>';
            $sheetData .= '<c r="B' . $rowNum . '" s="3" t="inlineStr"><is><t>TOTAL TRANSAKSI</t></is></c>';
            for ($i = 2; $i <= 8; $i++) {
                $sheetData .= '<c r="' . $colLetters[$i] . $rowNum . '" s="3" t="inlineStr"><is><t></t></is></c>';
            }
            $sheetData .= '<c r="J' . $rowNum . '" s="3" t="inlineStr"><is><t>' . number_format($totalNominal, 0, ',', '.') . '</t></is></c>';
            $sheetData .= '<c r="K' . $rowNum . '" s="3" t="inlineStr"><is><t>' . count($daftarBooking) . ' Booking</t></is></c>';
            $sheetData .= '</row>';
        }

        // Tentukan lebar kolom
        $cols = '<cols>' .
            '<col min="1" max="1" width="6" customWidth="1"/>' .
            '<col min="2" max="2" width="18" customWidth="1"/>' .
            '<col min="3" max="3" width="24" customWidth="1"/>' .
            '<col min="4" max="4" width="26" customWidth="1"/>' .
            '<col min="5" max="5" width="20" customWidth="1"/>' .
            '<col min="6" max="6" width="30" customWidth="1"/>' .
            '<col min="7" max="7" width="20" customWidth="1"/>' .
            '<col min="8" max="8" width="18" customWidth="1"/>' .
            '<col min="9" max="9" width="20" customWidth="1"/>' .
            '<col min="10" max="10" width="18" customWidth="1"/>' .
            '<col min="11" max="11" width="18" customWidth="1"/>' .
            '</cols>';

        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' .
            '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' .
            $cols .
            '<sheetData>' . $sheetData . '</sheetData>' .
            '</worksheet>';
    }
}

