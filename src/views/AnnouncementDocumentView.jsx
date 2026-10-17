import React, { useState } from 'react';
import {
  CaretLeft,
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
} from '@phosphor-icons/react';

/**
 * Announcement Document View (Halaman Review Dokumen Resmi)
 * Sesuai referensi: Layout dokumen A4 formal, scrollable vertikal, zoom in & zoom out,
 * tanpa tombol download / share (hanya lihat dokumen).
 */
export const AnnouncementDocumentView = ({ announcement, onBack }) => {
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleZoomIn = () => {
    if (zoomLevel < 150) setZoomLevel((prev) => prev + 15);
  };

  const handleZoomOut = () => {
    if (zoomLevel > 70) setZoomLevel((prev) => prev - 15);
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  const isFinancial = announcement?.id === 'banner-financial';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '100%',
        backgroundColor: '#EEF2F6',
        fontFamily: 'var(--font-sans)',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* 1. Header Bar: Background Putih, Tombol Kembali (<) di Kiri, Judul di Tengah */}
      <header
        style={{
          backgroundColor: '#FFFFFF',
          color: '#0F172A',
          height: '52px',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          borderBottom: '1px solid #E2E8F0',
          flexShrink: 0,
          zIndex: 40,
          boxSizing: 'border-box',
        }}
      >
        {/* Tombol Back di Kiri */}
        <button
          type="button"
          onClick={onBack}
          aria-label="Kembali"
          style={{
            position: 'absolute',
            left: '12px',
            width: '36px',
            height: '36px',
            background: 'none',
            border: 'none',
            borderRadius: '50%',
            color: '#1E293B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
            transition: 'background-color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <CaretLeft size={22} weight="bold" />
        </button>

        {/* Judul Header Tengah: Review File */}
        <h2
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: '#0F172A',
            margin: 0,
            letterSpacing: '-0.2px',
            textAlign: 'center',
          }}
        >
          Review File
        </h2>
      </header>

      {/* 2. Scrollable Document Workspace */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'auto',
          padding: '20px 14px 40px 14px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Lembar Dokumen Kertas Putih (Formal A4 Style persis seperti referensi) */}
        <div
          style={{
            width: '100%',
            maxWidth: '430px',
            backgroundColor: '#FFFFFF',
            borderRadius: '4px',
            boxShadow: '0 2px 14px rgba(0, 0, 0, 0.08)',
            border: '1px solid #CBD5E1',
            padding: '28px 20px',
            boxSizing: 'border-box',
            color: '#0F172A',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease',
            minHeight: '620px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            {/* Header / Kop Surat Resmi */}
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <h1
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 800,
                  color: '#0F172A',
                  margin: '0 0 4px 0',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}
              >
                MANAJEMEN APARTEMENT A
              </h1>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#1E293B',
                  letterSpacing: '0.2px',
                  textTransform: 'uppercase',
                }}
              >
                {isFinancial
                  ? 'BERITA ACARA LAPORAN REALISASI KEUANGAN (BALK)'
                  : 'BERITA ACARA PEMBERITAHUAN RESMI GEDUNG'}
              </div>
              <div
                style={{
                  fontSize: '0.6875rem',
                  color: '#475569',
                  marginTop: '3px',
                }}
              >
                Nomor: 042/FIN/APT-A/IX/2026
              </div>

              {/* Garis Pembatas Kop Surat */}
              <div
                style={{
                  height: '2px',
                  backgroundColor: '#0F172A',
                  marginTop: '12px',
                  width: '100%',
                }}
              />
            </div>

            {/* Paragraf Pembuka Formal */}
            <p
              style={{
                fontSize: '0.6875rem',
                lineHeight: 1.6,
                color: '#334155',
                textAlign: 'justify',
                margin: '0 0 14px 0',
              }}
            >
              {isFinancial
                ? 'Pada hari ini, Jumat, tanggal Tujuh Belas, bulan Oktober, tahun Dua Ribu Dua Puluh Enam (17-10-2026), Badan Pengelola Apartement A bersama Departemen Keuangan dan perwakilan Perhimpunan Penghuni telah menyatakan bahwa seluruh rangkaian rekapitulasi realisasi pendapatan dan beban operasional bulan September 2026 telah diverifikasi dengan rincian sebagai berikut:'
                : 'Pada hari ini, Jumat, tanggal Tujuh Belas, bulan Oktober, tahun Dua Ribu Dua Puluh Enam (17-10-2026), Manajemen Apartement A menerbitkan dokumen pengumuman resmi kepada seluruh pemilik dan penghuni dengan rincian sebagai berikut:'}
            </p>

            {/* I. IDENTITAS UNIT & PEKERJAAN / PROPERTI */}
            <div style={{ marginBottom: '16px' }}>
              <div
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  color: '#0F172A',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                }}
              >
                I. IDENTITAS PROPERTI & PERIODE AUDIT
              </div>
              <table
                style={{
                  width: '100%',
                  fontSize: '0.6875rem',
                  color: '#334155',
                  lineHeight: 1.6,
                  borderCollapse: 'collapse',
                }}
              >
                <tbody>
                  <tr>
                    <td style={{ width: '130px', fontWeight: 600, padding: '2px 0' }}>Nama Properti</td>
                    <td style={{ width: '12px', textAlign: 'center' }}>:</td>
                    <td style={{ fontWeight: 700, color: '#0F172A' }}>Apartement A (Tower A, B, C)</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600, padding: '2px 0' }}>Badan Pengelola</td>
                    <td style={{ textAlign: 'center' }}>:</td>
                    <td>Sinara Manajemen Digital (PROAPPS)</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600, padding: '2px 0' }}>Jenis Laporan</td>
                    <td style={{ textAlign: 'center' }}>:</td>
                    <td>Realisasi Iuran Pengelolaan & Beban Gedung</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600, padding: '2px 0' }}>Periode Berjalan</td>
                    <td style={{ textAlign: 'center' }}>:</td>
                    <td>01 September 2026 s/d 30 September 2026</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* II. HASIL VERIFIKASI LAPANGAN / PEMERIKSAAN */}
            <div style={{ marginBottom: '16px' }}>
              <div
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  color: '#0F172A',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                }}
              >
                II. HASIL VERIFIKASI AUDIT OPERASIONAL
              </div>
              <p
                style={{
                  fontSize: '0.6875rem',
                  lineHeight: 1.55,
                  color: '#334155',
                  textAlign: 'justify',
                  margin: '0 0 8px 0',
                }}
              >
                Berdasarkan hasil inspeksi teknis dan audit internal yang dilakukan oleh Departemen Engineering dan Finance Apartement A, status fasilitas umum dinyatakan <strong>BERFUNGSI NORMAL (100%)</strong> dan memenuhi standar kenyamanan gedung.
              </p>

              {/* Tabel Verifikasi dengan Header Warna Krem/Beige persis seperti gambar */}
              <div style={{ overflowX: 'auto', marginBottom: '8px' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '0.625rem',
                    border: '1px solid #CBD5E1',
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: '#F5EEDB', borderBottom: '1px solid #CBD5E1' }}>
                      <th style={{ padding: '6px 4px', border: '1px solid #CBD5E1', width: '28px', textAlign: 'center' }}>No.</th>
                      <th style={{ padding: '6px 6px', border: '1px solid #CBD5E1', textAlign: 'left' }}>Item Pemeriksaan</th>
                      <th style={{ padding: '6px 6px', border: '1px solid #CBD5E1', textAlign: 'left' }}>Deskripsi Hasil</th>
                      <th style={{ padding: '6px 6px', border: '1px solid #CBD5E1', textAlign: 'left' }}>Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '5px 4px', border: '1px solid #CBD5E1', textAlign: 'center' }}>1.</td>
                      <td style={{ padding: '5px 6px', border: '1px solid #CBD5E1', fontWeight: 600 }}>Perawatan Lift Penumpang</td>
                      <td style={{ padding: '5px 6px', border: '1px solid #CBD5E1' }}>Penggantian sling baja Tower A selesai dilakukan.</td>
                      <td style={{ padding: '5px 6px', border: '1px solid #CBD5E1', color: '#16A34A', fontWeight: 600 }}>Lulus Uji Laik</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '5px 4px', border: '1px solid #CBD5E1', textAlign: 'center' }}>2.</td>
                      <td style={{ padding: '5px 6px', border: '1px solid #CBD5E1', fontWeight: 600 }}>Pompa Air Booster</td>
                      <td style={{ padding: '5px 6px', border: '1px solid #CBD5E1' }}>Pengecekan tekanan normal di lantai 12 s/d 28.</td>
                      <td style={{ padding: '5px 6px', border: '1px solid #CBD5E1', color: '#16A34A', fontWeight: 600 }}>Optimal</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ fontSize: '0.625rem', color: '#64748B', fontStyle: 'italic' }}>
                Seluruh perawatan dilakukan secara berkala demi menjamin kenyamanan seluruh penghuni unit.
              </div>
            </div>

            {/* III. PENYELESAIAN FINANSIAL (SETTLEMENT) */}
            <div style={{ marginBottom: '18px' }}>
              <div
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  color: '#0F172A',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                }}
              >
                III. REKAPITULASI PENYELESAIAN FINANSIAL (SETTLEMENT)
              </div>

              {/* Tabel Keuangan dengan Header Krem/Beige persis seperti gambar */}
              <div style={{ overflowX: 'auto', marginBottom: '8px' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '0.625rem',
                    border: '1px solid #CBD5E1',
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: '#F5EEDB', borderBottom: '1px solid #CBD5E1' }}>
                      <th style={{ padding: '6px 6px', border: '1px solid #CBD5E1', textAlign: 'left' }}>
                        Deskripsi Komponen Dana
                      </th>
                      <th style={{ padding: '6px 6px', border: '1px solid #CBD5E1', textAlign: 'left' }}>
                        Rincian
                      </th>
                      <th style={{ padding: '6px 6px', border: '1px solid #CBD5E1', textAlign: 'right', width: '90px' }}>
                        Nilai (IDR)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '5px 6px', border: '1px solid #CBD5E1', fontWeight: 700 }}>
                        Total Penerimaan IPL & Utilitas
                      </td>
                      <td style={{ padding: '5px 6px', border: '1px solid #CBD5E1' }}>
                        Kolektibilitas tagihan 94.8%
                      </td>
                      <td style={{ padding: '5px 6px', border: '1px solid #CBD5E1', textAlign: 'right', fontWeight: 700 }}>
                        452.350.000
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={3} style={{ padding: '4px 6px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC', fontWeight: 700 }}>
                        Alokasi Pengeluaran Operasional (Deduction)
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '4px 6px 4px 14px', border: '1px solid #CBD5E1' }}>
                        1. Tagihan Listrik PLN & Pompa Air
                      </td>
                      <td style={{ padding: '4px 6px', border: '1px solid #CBD5E1' }}>
                        Utilitas fasilitas umum & lorong
                      </td>
                      <td style={{ padding: '4px 6px', border: '1px solid #CBD5E1', textAlign: 'right' }}>
                        124.650.000
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '4px 6px 4px 14px', border: '1px solid #CBD5E1' }}>
                        2. Jasa Keamanan 24 Jam & Housekeeping
                      </td>
                      <td style={{ padding: '4px 6px', border: '1px solid #CBD5E1' }}>
                        Regu kebersihan & satpam gedung
                      </td>
                      <td style={{ padding: '4px 6px', border: '1px solid #CBD5E1', textAlign: 'right' }}>
                        72.500.000
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '4px 6px 4px 14px', border: '1px solid #CBD5E1' }}>
                        3. Perawatan Lift & Sistem Chiller
                      </td>
                      <td style={{ padding: '4px 6px', border: '1px solid #CBD5E1' }}>
                        Vendor Schindler & Daikin
                      </td>
                      <td style={{ padding: '4px 6px', border: '1px solid #CBD5E1', textAlign: 'right' }}>
                        58.400.000
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '4px 6px 4px 14px', border: '1px solid #CBD5E1' }}>
                        4. Perbaikan Waterproofing Dak & CCTV
                      </td>
                      <td style={{ padding: '4px 6px', border: '1px solid #CBD5E1' }}>
                        Peremajaan sensor lantai
                      </td>
                      <td style={{ padding: '4px 6px', border: '1px solid #CBD5E1', textAlign: 'right' }}>
                        34.200.000
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '4px 6px 4px 14px', border: '1px solid #CBD5E1' }}>
                        5. Administrasi & Perizinan Berkala
                      </td>
                      <td style={{ padding: '4px 6px', border: '1px solid #CBD5E1' }}>
                        Audit akuntansi & kantor BM
                      </td>
                      <td style={{ padding: '4px 6px', border: '1px solid #CBD5E1', textAlign: 'right' }}>
                        28.370.000
                      </td>
                    </tr>

                    {/* Baris Total Potongan Berwarna Merah persis seperti referensi */}
                    <tr style={{ backgroundColor: '#FEF2F2' }}>
                      <td colSpan={2} style={{ padding: '6px 6px', border: '1px solid #CBD5E1', fontWeight: 700 }}>
                        Total Beban Pengeluaran Operasional
                      </td>
                      <td style={{ padding: '6px 6px', border: '1px solid #CBD5E1', textAlign: 'right', fontWeight: 700, color: '#DC2626' }}>
                        (318.120.000)
                      </td>
                    </tr>

                    {/* Baris Total Refund / Saldo Kas Akhir */}
                    <tr style={{ backgroundColor: '#F8FAFC' }}>
                      <td colSpan={2} style={{ padding: '8px 6px', border: '1px solid #CBD5E1', fontWeight: 800, textAlign: 'center', letterSpacing: '0.3px' }}>
                        TOTAL SISA SURPLUS / CADANGAN KAS OPERASIONAL
                      </td>
                      <td style={{ padding: '8px 6px', border: '1px solid #CBD5E1', textAlign: 'right', fontWeight: 800, color: '#0F172A', fontSize: '0.6875rem' }}>
                        134.230.000
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* IV. PERNYATAAN PENUTUP */}
            <div style={{ marginBottom: '20px' }}>
              <div
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  color: '#0F172A',
                  marginBottom: '4px',
                  textTransform: 'uppercase',
                }}
              >
                IV. PERNYATAAN PENUTUP
              </div>
              <p
                style={{
                  fontSize: '0.625rem',
                  lineHeight: 1.6,
                  color: '#334155',
                  fontStyle: 'italic',
                  margin: '0 0 16px 0',
                  textAlign: 'justify',
                }}
              >
                Dokumen ini berfungsi sebagai dasar laporan pertanggungjawaban pengelolaan lingkungan dan sarana prasarana apartemen secara transparan kepada seluruh Pemilik dan Penghuni. Segala bentuk pertanyaan atau klarifikasi pembukuan dapat diajukan kepada Meja Bantuan Keuangan Building Management.
              </p>

              {/* Tiga Kolom Tanda Tangan Resmi persis seperti di gambar */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '6px',
                  textAlign: 'center',
                  fontSize: '0.625rem',
                }}
              >
                {/* Kolom 1 */}
                <div>
                  <div style={{ fontWeight: 700, color: '#1E293B', marginBottom: '32px' }}>
                    Pihak Pertama (BM)
                  </div>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>
                    ( Ahmad Pratama )
                  </div>
                </div>

                {/* Kolom 2 */}
                <div>
                  <div style={{ fontWeight: 700, color: '#1E293B', marginBottom: '32px' }}>
                    Pihak Kedua (Finance)
                  </div>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>
                    ( Dewi Lestari )
                  </div>
                </div>

                {/* Kolom 3 */}
                <div>
                  <div style={{ fontWeight: 700, color: '#1E293B', marginBottom: '32px' }}>
                    Menyetujui (PPPSRS)
                  </div>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>
                    ( Budi Santoso )
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Disclaimer persis seperti gambar */}
            <div
              style={{
                borderTop: '1px solid #CBD5E1',
                paddingTop: '10px',
                textAlign: 'center',
                fontSize: '0.5625rem',
                color: '#64748B',
                lineHeight: 1.45,
              }}
            >
              <div>Dokumen ini diterbitkan secara sah oleh Sinara Manajemen Digital Apartement A (PROAPPS).</div>
              <div>Seluruh tanda tangan elektronik di atas memiliki kekuatan hukum yang setara dengan tanda tangan basah.</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Floating Bottom Zoom Controls (Kecil, Rapi di Pojok Bawah, Tanpa Tombol Download) */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#FFFFFF',
          borderRadius: '9999px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
          border: '1px solid #CBD5E1',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 8px',
          zIndex: 50,
        }}
      >
        <button
          type="button"
          onClick={handleZoomOut}
          aria-label="Perkecil Dokumen"
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: '#F1F5F9',
            border: 'none',
            color: '#334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <MagnifyingGlassMinus size={15} weight="bold" />
        </button>

        <button
          type="button"
          onClick={handleResetZoom}
          aria-label="Reset Zoom 100%"
          title="Klik untuk reset zoom 100%"
          style={{
            background: 'none',
            border: 'none',
            padding: '2px 4px',
            fontSize: '0.6875rem',
            fontWeight: 700,
            color: '#334155',
            minWidth: '38px',
            textAlign: 'center',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
        >
          {zoomLevel}%
        </button>

        <button
          type="button"
          onClick={handleZoomIn}
          aria-label="Perbesar Dokumen"
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: '#F1F5F9',
            border: 'none',
            color: '#334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <MagnifyingGlassPlus size={15} weight="bold" />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementDocumentView;
