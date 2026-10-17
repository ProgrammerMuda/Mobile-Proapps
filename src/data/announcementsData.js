import bannerLiftRepairImg from '../assets/banners/banner-lift-repair.png';
import bannerPowerOutageImg from '../assets/banners/banner-power-outage.png';
import bannerTariffAdjustmentImg from '../assets/banners/banner-tariff-adjustment.png';
import bannerParkingRulesImg from '../assets/banners/banner-parking-rules.png';
import bannerBuildingRulesImg from '../assets/banners/banner-building-rules.png';
import bannerFinancialReportImg from '../assets/banners/banner-financial-report.png';

export const ANNOUNCEMENTS_DATA = [
  {
    id: 'banner-financial',
    title: 'Laporan Keuangan Apartement A - Periode September 2026',
    category: 'Keuangan & Akuntansi',
    categoryColor: '#0284C7',
    categoryBg: '#E0F2FE',
    date: '17 Oktober 2026',
    publishedTime: '10:00 WIB',
    author: {
      name: 'Tim Keuangan & Akuntansi',
      role: 'Building Management Apartement A',
      avatarText: 'BM',
    },
    targetAudience: 'Seluruh Pemilik & Penghuni Apartement A',
    image: bannerFinancialReportImg,
    bgColor: '#0284C7',
    borderColor: '#0284C7',
    summary: 'Laporan keuangan bulanan Apartement A periode September 2026 telah selesai disusun dan diverifikasi. Laporan ini disajikan secara transparan mencakup seluruh realisasi pendapatan, alokasi pengeluaran operasional, serta saldo kas cadangan gedung.',
    financialHighlights: [
      {
        label: 'Total Pendapatan',
        amount: 'Rp 452.350.000',
        note: 'Penerimaan IPL, Utilitas & Sinking Fund',
        color: '#16A34A',
        bg: '#F0FDF4',
      },
      {
        label: 'Total Pengeluaran',
        amount: 'Rp 318.120.000',
        note: 'Biaya Operasional, Listrik & Perawatan',
        color: '#DC2626',
        bg: '#FEF2F2',
      },
      {
        label: 'Surplus / Saldo Kas',
        amount: 'Rp 134.230.000',
        note: 'Cadangan Kas Operasional Berjalan',
        color: '#0284C7',
        bg: '#F0F9FF',
      },
    ],
    contentSections: [
      {
        heading: 'Ringkasan Eksekutif Keuangan',
        body: 'Pada periode September 2026, tingkat kepatuhan pembayaran Iuran Pengelolaan Lingkungan (IPL) mencapai 94,8%, mengalami peningkatan sebesar 2,3% dibandingkan bulan sebelumnya. Efisiensi energi pada sistem chiller dan penerangan area publik berhasil menekan biaya operasional listrik gedung sebesar 6,5%.',
      },
      {
        heading: 'Rincian Realisasi Pengeluaran Operasional',
        body: 'Pengeluaran bulan September 2026 difokuskan pada kegiatan pemeliharaan berkala guna menjamin kenyamanan serta keamanan seluruh penghuni:',
        bulletPoints: [
          'Perawatan rutin & overhaul lift penumpang Tower A dan Tower B: Rp 58.400.000',
          'Tagihan listrik PLN area bersama & utilitas pompa air booster: Rp 124.650.000',
          'Jasa pengamanan 24 jam dan regu kebersihan umum: Rp 72.500.000',
          'Perbaikan waterproofing dak beton & peremajaan sensor CCTV lorong: Rp 34.200.000',
          'Biaya administrasi, audit akuntansi & perizinan berkala: Rp 28.370.000',
        ],
      },
      {
        heading: 'Transparansi & Pemeriksaan Lanjutan',
        body: 'Setiap pemilik dan penghuni unit dapat melakukan pengecekan detail kwitansi, invoice vendor, dan rekening koran operasional melalui Helpdesk Building Management di Lantai Mezzanine setiap hari kerja (Senin - Jumat, 08.30 - 17.00 WIB) atau melalui tiket pertanyaan di aplikasi Proapps.',
      },
    ],
    attachment: {
      fileName: 'Laporan_Keuangan_Apartemen_A_Sept_2026.pdf',
      fileSize: '2.4 MB',
      fileType: 'PDF Document',
      totalPages: 4,
      updatedDate: '17 Oktober 2026, 09:30 WIB',
      verifiedBy: 'Kantor Akuntan Publik & Manajemen Pengelola',
      pages: [
        {
          pageNumber: 1,
          pageTitle: 'Ringkasan Neraca & Laba Rugi',
          content: {
            title: 'LAPORAN REKAPITULASI KEUANGAN BULANAN',
            subtitle: 'Apartement A - Periode September 2026',
            tableHeaders: ['Kategori Akun', 'Anggaran (IDR)', 'Realisasi (IDR)', 'Variansi'],
            tableRows: [
              ['Pendapatan IPL Unit', '360.000.000', '355.800.000', '-1.2%'],
              ['Pendapatan Tagihan Air & Listrik', '85.000.000', '82.550.000', '-2.9%'],
              ['Pendapatan Sinking Fund Cadangan', '15.000.000', '14.000.000', '-6.7%'],
              ['Total Penerimaan Operasional', '460.000.000', '452.350.000', '-1.7%'],
              ['Beban Pemeliharaan Fasilitas & Lift', '65.000.000', '58.400.000', '+10.2%'],
              ['Beban Utilitas Fasilitas Publik', '135.000.000', '124.650.000', '+7.7%'],
              ['Beban Kebersihan & Keamanan Gedung', '75.000.000', '72.500.000', '+3.3%'],
              ['Total Beban Operasional', '345.000.000', '318.120.000', '+7.8%'],
              ['Surplus Bersih Kas Operasional', '115.000.000', '134.230.000', '+16.7%'],
            ],
            footerNote: 'Catatan: Angka realisasi telah melalui proses verifikasi dan audit internal Building Management.',
          },
        },
        {
          pageNumber: 2,
          pageTitle: 'Rincian Pengeluaran Fasilitas & Pemeliharaan',
          content: {
            title: 'RINCIAN BIAYA PEMELIHARAAN PREVENTIF & REPARASI',
            subtitle: 'Tower A & Area Podium Komersial',
            tableHeaders: ['Nama Pekerjaan / Komponen', 'Vendor / Pelaksana', 'Nilai (IDR)', 'Status'],
            tableRows: [
              ['Servis Berkala & Ganti Sling Lift Tower A', 'PT Schindler Elevator', '34.500.000', 'Selesai'],
              ['Penggantian Sensor Suhu Chiller AC Sentral', 'PT Daikin HVAC Solution', '18.200.000', 'Selesai'],
              ['Pengurasan & Sanitasi Ground Water Tank (GWT)', 'Tim Internal Engineering', '5.700.000', 'Selesai'],
              ['Penyemprotan Pest Control & Fogging', 'PT Rentokil Indonesia', '6.800.000', 'Selesai'],
              ['Perbaikan Pipa Tekanan Booster Pump Lantai 12', 'Mitra Teknik Mandiri', '4.350.000', 'Selesai'],
            ],
            footerNote: 'Semua pekerjaan disertai berita acara serah terima pekerjaan (BASTP) resmi.',
          },
        },
        {
          pageNumber: 3,
          pageTitle: 'Penerimaan Iuran Pengelolaan Lingkungan (IPL)',
          content: {
            title: 'REKAPITULASI PENAGIHAN & TINGKAT KOLEKTIBILITAS TOWER A',
            subtitle: 'Sebaran Pembayaran Pemilik & Penghuni',
            tableHeaders: ['Lantai / Zona', 'Total Unit', 'Unit Lunas', 'Unit Tertunggak', 'Persentase'],
            tableRows: [
              ['Lantai 01 - Lantai 08 (Low Zone)', '64 Unit', '62 Unit', '2 Unit', '96.8%'],
              ['Lantai 09 - Lantai 18 (Mid Zone)', '80 Unit', '76 Unit', '4 Unit', '95.0%'],
              ['Lantai 19 - Lantai 28 (High Zone)', '80 Unit', '75 Unit', '5 Unit', '93.7%'],
              ['Penthouse & Sky Villa (Lantai 29-30)', '8 Unit', '8 Unit', '0 Unit', '100%'],
              ['Area Ritel / Shophouse Komersial', '12 Unit', '11 Unit', '1 Unit', '91.6%'],
            ],
            footerNote: 'Unit yang mengalami tunggakan telah diberikan surat pemberitahuan peringatan ramah (SP-1).',
          },
        },
        {
          pageNumber: 4,
          pageTitle: 'Lembar Otorisasi & Tanda Tangan Resmi',
          content: {
            title: 'LEMBAR PENGESAHAN LAPORAN KEUANGAN BULANAN',
            subtitle: 'Disetujui bersama oleh Dewan Pengelola Apartemen & Perwakilan Penghuni',
            signatures: [
              { role: 'Building Manager', name: 'Ahmad Pratama, S.T., M.M.', status: 'Ditandatangani secara Digital' },
              { role: 'Head of Finance & Accounting', name: 'Dewi Lestari, S.E., Ak.', status: 'Ditandatangani secara Digital' },
              { role: 'Ketua Perhimpunan Penghuni (PPPSRS)', name: 'Ir. Hendra Gunawan', status: 'Diverifikasi' },
            ],
            footerNote: 'Dokumen ini sah dan diterbitkan melalui sistem informasi manajemen properti terintegrasi PROAPPS.',
          },
        },
      ],
    },
  },
  {
    id: 'banner-1',
    title: 'Pengumuman: Perbaikan & Perawatan Lift Penumpang Tower A',
    category: 'Operasional & Fasilitas',
    categoryColor: '#D97706',
    categoryBg: '#FEF3C7',
    date: '15 September 2026',
    publishedTime: '08:30 WIB',
    author: {
      name: 'Departemen Engineering',
      role: 'Building Management Apartement A',
      avatarText: 'ENG',
    },
    targetAudience: 'Penghuni Tower A & Tamu Gedung',
    image: bannerLiftRepairImg,
    bgColor: '#0284C7',
    borderColor: '#0284C7',
    summary: 'Diberitahukan kepada seluruh warga Tower A bahwa akan dilaksanakan perbaikan dan perawatan berkala pada unit Lift Penumpang #2 guna memastikan kenyamanan dan standar keselamatan pengoperasian.',
    financialHighlights: null,
    contentSections: [
      {
        heading: 'Waktu & Jadwal Pelaksanaan',
        body: 'Perawatan akan berlangsung mulai tanggal 15 hingga 17 September 2026, pada pukul 09.00 - 17.00 WIB setiap harinya.',
      },
      {
        heading: 'Panduan Akses Alternatif Selama Perawatan',
        body: 'Selama pekerjaan berlangsung, lift penumpang #1 dan lift servis (service lift) tetap beroperasi normal dengan kapasitas maksimal. Diharapkan bapak/ibu penghuni mengatur waktu perjalanan keluar/masuk unit lebih awal untuk menghindari antrean pada jam sibuk.',
        bulletPoints: [
          'Lift Servis dapat digunakan oleh seluruh warga tanpa batasan barang bawaan.',
          'Tangga darurat steril dan siap dipergunakan setiap saat.',
          'Petugas keamanan tambahan ditempatkan di lobby untuk membantu alur antrean lift.',
        ],
      },
    ],
    attachment: {
      fileName: 'SOP_Perawatan_Lift_Tower_A_Sept2026.pdf',
      fileSize: '1.8 MB',
      fileType: 'PDF Document',
      totalPages: 2,
      updatedDate: '14 September 2026, 14:00 WIB',
      verifiedBy: 'PT Schindler Elevator & BM Engineering',
      pages: [
        {
          pageNumber: 1,
          pageTitle: 'Jadwal Kerja & Tim Pelaksana',
          content: {
            title: 'STANDAR OPERASIONAL PROSEDUR PERBAIKAN LIFT TOWER A',
            subtitle: 'Apartement A - Divisi Pemeliharaan Transportasi Vertikal',
            tableHeaders: ['Hari / Tanggal', 'Item Pekerjaan', 'Durasi', 'Petugas Teknisi'],
            tableRows: [
              ['Selasa, 15 Sept 2026', 'Pemeriksaan Hoist Cable & Motor Drive', '09.00 - 17.00', 'Tim Schindler (3 org)'],
              ['Rabu, 16 Sept 2026', 'Kalibrasi Sensor Beban & Leveling Pintu', '09.00 - 17.00', 'Tim Schindler (2 org)'],
              ['Kamis, 17 Sept 2026', 'Uji Coba Beban Penuh & Safety Test', '09.00 - 15.00', 'Tim BM & Safety Officer'],
            ],
            footerNote: 'Sertifikat kelayakan operasi akan diterbitkan segera setelah uji fungsi selesai.',
          },
        },
      ],
    },
  },
  {
    id: 'banner-2',
    title: 'Pengumuman: Pemadaman Listrik Berkala Semua Tower',
    category: 'Pemeliharaan Gedung',
    categoryColor: '#DC2626',
    categoryBg: '#FEE2E2',
    date: '20 September 2026',
    publishedTime: '09:00 WIB',
    author: {
      name: 'Departemen Engineering & PLN',
      role: 'Building Management Apartement A',
      avatarText: 'ENG',
    },
    targetAudience: 'Seluruh Penghuni Tower A, B, C',
    image: bannerPowerOutageImg,
    bgColor: '#0284C7',
    borderColor: '#0284C7',
    summary: 'Sehubungan dengan adanya pemeliharaan kubikel gardu induk tegangan menengah 20kV oleh PT PLN (Persero) dan simulasi beban genset gedung, maka akan terjadi pemadaman aliran listrik terencana.',
    financialHighlights: null,
    contentSections: [
      {
        heading: 'Waktu Pemadaman & Pengalihan Sumber Daya',
        body: 'Pemeliharaan dilaksanakan pada hari Minggu, 20 September 2026 pukul 09.00 - 17.00 WIB. Genset cadangan gedung (Genset Perkins 1500kVA) akan menyuplai daya darurat untuk sistem esensial (lift darurat, pompa air, CCTV, koridor utama).',
      },
      {
        heading: 'Langkah Pencegahan untuk Penghuni',
        body: 'Mohon memperhatikan beberapa hal penting demi keselamatan barang elektronik Anda:',
        bulletPoints: [
          'Lepaskan steker alat elektronik sensitif (TV, komputer, AC) sebelum pukul 09.00 WIB.',
          'Pastikan pintu kulkas tertutup rapat untuk menjaga suhu dingin selama periode pemadaman.',
          'Pastikan daya baterai gawai pribadi terisi penuh sebelumnya.',
        ],
      },
    ],
    attachment: {
      fileName: 'Jadwal_Pemadaman_PLN_dan_SOP_Genset.pdf',
      fileSize: '1.4 MB',
      fileType: 'PDF Document',
      totalPages: 2,
      updatedDate: '18 September 2026, 11:20 WIB',
      verifiedBy: 'PLN UID Jaya & Chief Engineering BM',
      pages: [
        {
          pageNumber: 1,
          pageTitle: 'Alur Pasokan Daya Darurat Genset',
          content: {
            title: 'SOP PEMBAGIAN DAYA DARURAT GENSET GEDUNG',
            subtitle: 'Prioritas Pasokan Daya Selama Pemadaman Terencana',
            tableHeaders: ['Sistem / Beban', 'Sumber Daya', 'Status', 'Catatan'],
            tableRows: [
              ['Pompa Air Bersih (Booster & Transfer)', 'Genset 1', 'Aktif 100%', 'Tekanan air normal'],
              ['Lift Darurat (1 Unit per Tower)', 'Genset 1', 'Aktif 100%', 'Operasi normal'],
              ['Penerangan Koridor & Tangga Darurat', 'Genset 2', 'Aktif 100%', 'Lampu darurat LED on'],
              ['Stopkontak Unit Hunian', 'Non-Aktif', 'Mati Sementara', 'Daya unit dipadamkan'],
            ],
            footerNote: 'Pengalihan daya memakan waktu jeda sekitar 15 - 30 detik saat perpindahan switch ATS.',
          },
        },
      ],
    },
  },
  {
    id: 'banner-3',
    title: 'Pengumuman: Penyesuaian Tarif & Kebijakan Pembayaran IPL',
    category: 'Kebijakan & Keuangan',
    categoryColor: '#2563EB',
    categoryBg: '#DBEAFE',
    date: '1 Oktober 2026',
    publishedTime: '11:00 WIB',
    author: {
      name: 'PPPSRS & Pengelola Properti',
      role: 'Building Management Apartement A',
      avatarText: 'BM',
    },
    targetAudience: 'Seluruh Pemilik Unit Apartement A',
    image: bannerTariffAdjustmentImg,
    bgColor: '#0284C7',
    borderColor: '#0284C7',
    summary: 'Berdasarkan hasil Rapat Umum Anggota Tahunan (RUAT) PPPSRS bersama seluruh pemilik unit, ditetapkan penyesuaian tarif Iuran Pengelolaan Lingkungan (IPL) dan sinking fund yang mulai berlaku efektif per 1 Oktober 2026.',
    financialHighlights: null,
    contentSections: [
      {
        heading: 'Dasar Keputusan Penyesuaian',
        body: 'Penyesuaian tarif dilakukan menyusul kenaikan Tarif Tenaga Listrik (TTL) golongan B-2/TR, upah minimum regional tenaga kerja alih daya (kebersihan & pengamanan), serta kebutuhan dana cadangan peremajaan lift gedung.',
      },
    ],
    attachment: {
      fileName: 'Surat_Edaran_Kebijakan_Tarif_IPL_2026.pdf',
      fileSize: '1.6 MB',
      fileType: 'PDF Document',
      totalPages: 3,
      updatedDate: '28 September 2026, 16:00 WIB',
      verifiedBy: 'Notaris & Dewan Pengurus PPPSRS',
      pages: [
        {
          pageNumber: 1,
          pageTitle: 'Tabel Tarif IPL & Sinking Fund 2026',
          content: {
            title: 'TABEL RINCIAN TARIF IPL PER METER PERSEGI',
            subtitle: 'Berlaku Efektif Mulai Invoice 1 Oktober 2026',
            tableHeaders: ['Tipe Unit', 'Luas Rata-rata', 'Tarif Lama / m2', 'Tarif Baru / m2'],
            tableRows: [
              ['Studio / 1BR (Tower A/B)', '28 - 36 m2', 'Rp 18.500', 'Rp 19.800'],
              ['2 Bedroom (Tower A/B)', '48 - 60 m2', 'Rp 18.500', 'Rp 19.800'],
              ['3 Bedroom / Corner Unit', '75 - 90 m2', 'Rp 19.000', 'Rp 20.500'],
              ['Penthouse Suites', '120 - 180 m2', 'Rp 21.000', 'Rp 22.500'],
            ],
            footerNote: 'Pembayaran tepat waktu sebelum tanggal 20 setiap bulan mendapatkan poin loyalty di Proapps.',
          },
        },
      ],
    },
  },
  {
    id: 'banner-4',
    title: 'Pengumuman: Aturan Baru Tamu, Kendaraan, atau Parkir',
    category: 'Keamanan & Ketertiban',
    categoryColor: '#7C3AED',
    categoryBg: '#EDE9FE',
    date: '1 Oktober 2026',
    publishedTime: '14:00 WIB',
    author: {
      name: 'Departemen Keamanan & Operasional',
      role: 'Building Management Apartement A',
      avatarText: 'SEC',
    },
    targetAudience: 'Seluruh Penghuni & Tamu Berkunjung',
    image: bannerParkingRulesImg,
    bgColor: '#0284C7',
    borderColor: '#0284C7',
    summary: 'Guna meningkatkan ketertiban area basement serta efisiensi kapasitas parkir, diberlakukan regulasi baru mengenai registrasi tamu melalui digital QR code pass dan kuota parkir mobil/motor penghuni.',
    financialHighlights: null,
    contentSections: [
      {
        heading: 'Sistem Tiket Digital Tamu (Visitor Pass QR)',
        body: 'Mulai 1 Oktober 2026, seluruh tamu yang berkunjung wajib didaftarkan terlebih dahulu oleh pemilik/penghuni unit melalui menu "Visitor Information" di aplikasi Proapps untuk mendapatkan QR Code Akses Otomatis pada barrier gate.',
      },
    ],
    attachment: {
      fileName: 'Buku_Panduan_Parkir_dan_Registrasi_Tamu.pdf',
      fileSize: '2.1 MB',
      fileType: 'PDF Document',
      totalPages: 2,
      updatedDate: '29 September 2026, 10:00 WIB',
      verifiedBy: 'Chief of Security & Building Manager',
      pages: [
        {
          pageNumber: 1,
          pageTitle: 'Alur Registrasi Visitor Pass QR',
          content: {
            title: 'PANDUAN OPERASIONAL SISTEM PARKIR DIGITAL',
            subtitle: 'Prosedur Check-in Tamu & Penghuni',
            tableHeaders: ['Kategori Pengguna', 'Akses Masuk', 'Tarif Parkir', 'Ketentuan'],
            tableRows: [
              ['Penghuni Terdaftar (RFID Tag)', 'Gerbang Otomatis', 'Gratis (Termasuk IPL)', 'Maks 1 Mobil / 1 Motor'],
              ['Tamu Penghuni (Dengan QR Pass)', 'Scan Barcode Gate B', 'Gratis 2 Jam Pertama', 'Wajib diundang via app'],
              ['Ojek Online / Pengantar Makanan', 'Drop-Off Lobby', 'Gratis Maks 15 Menit', 'Hanya di lobby utama'],
            ],
            footerNote: 'Pelanggaran parkir di luar slot bertanda akan dikenakan sanksi gembok ban.',
          },
        },
      ],
    },
  },
  {
    id: 'banner-5',
    title: 'Pengumuman: Tata Tertib Demi Kenyamanan Bersama',
    category: 'Tata Tertib Hunian',
    categoryColor: '#059669',
    categoryBg: '#D1FAE5',
    date: '1 Oktober 2026',
    publishedTime: '15:30 WIB',
    author: {
      name: 'Customer Relations Management',
      role: 'Building Management Apartement A',
      avatarText: 'CRM',
    },
    targetAudience: 'Seluruh Penghuni Apartement A',
    image: bannerBuildingRulesImg,
    bgColor: '#0284C7',
    borderColor: '#0284C7',
    summary: 'Mari kita bersama-sama mewujudkan lingkungan hunian yang asri, tenang, dan tertib. Berikut rangkuman tata tertib bersama seputar larangan merokok di area koridor, jam tenang malam hari, dan aturan hewan peliharaan.',
    financialHighlights: null,
    contentSections: [
      {
        heading: 'Ketentuan Area Bebas Asap Rokok (No-Smoking Zone)',
        body: 'Dilarang keras merokok di seluruh area koridor lantai hunian, lift, tangga darurat, lobby bersama, dan taman bermain anak. Merokok hanya diperkenankan pada Designated Smoking Area yang terletak di Taman Podium Lantai 3.',
      },
    ],
    attachment: {
      fileName: 'House_Rules_Buku_Panduan_Tata_Tertib.pdf',
      fileSize: '3.1 MB',
      fileType: 'PDF Document',
      totalPages: 3,
      updatedDate: '30 September 2026, 09:00 WIB',
      verifiedBy: 'Legal Department & Building Management',
      pages: [
        {
          pageNumber: 1,
          pageTitle: 'Ringkasan House Rules Penting',
          content: {
            title: 'TATA TERTIB & KETENTUAN KENYAMANAN BERSAMA',
            subtitle: 'Apartement A - Edisi Revisi 2026',
            tableHeaders: ['Aspek Ketertiban', 'Aturan Berlaku', 'Area Berlaku', 'Sanksi'],
            tableRows: [
              ['Larangan Merokok', 'Kawasan Tanpa Rokok', 'Koridor, Lift, Lobby', 'Peringatan & Denda Rp 500rb'],
              ['Jam Tenang Malam', 'Maksimal 45 dB (22.00 - 07.00)', 'Seluruh Unit & Koridor', 'Teguran Keamanan'],
              ['Pembuangan Sampah', 'Wajib Kantong Terikat Rapi', 'Chute Sampah Tiap Lantai', 'Teguran Kebersihan'],
              ['Hewan Peliharaan', 'Wajib Tali Pengikat & Di Lift Servis', 'Area Publik', 'Larangan Membawa'],
            ],
            footerNote: 'Kenyamanan bersama adalah tanggung jawab seluruh warga penghuni.',
          },
        },
      ],
    },
  },
];

export const getAnnouncementById = (id) => {
  return ANNOUNCEMENTS_DATA.find((item) => item.id === id) || ANNOUNCEMENTS_DATA[0];
};
