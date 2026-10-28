# Epic: Leave Quota (Riwayat dan Request Adjustment)

Cakupan epic ini: halaman **Leave Quota**, yaitu ringkasan saldo, **riwayat**, detail riwayat, dan **form Request Adjustment** beserta aturan saat mengajukan. Sisi persetujuan (menu Approval Request, tab Quota, detail approval, tombol Verify/Approve/Reject) ada di **epic terpisah**.

Prototipe sudah jalan di repo ini dengan data dan state di memori (reload = data kembali awal). Backlog ini mengubahnya menjadi fitur produksi: backend menyediakan API, mobile mengganti data contoh dengan API.

Referensi perilaku: `npm run dev` (port 5173). Akun demo, password semua `password`:
- `eng@proapps.id` atau role lain: karyawan biasa
- `bm@proapps.id`: Building Management (di sisi pengajuan diperlakukan seperti karyawan biasa)
- `bs@proapps.id`: Building Service

## Aturan bisnis kuota

- Hanya **Annual Leave** yang punya kuota. Periode 1 Jan–31 Des.
- Saldo dihitung dari ledger: `total` = jumlah transaksi `ADDITION` berstatus `APPROVED`, `used` = jumlah transaksi `DEDUCTION` berstatus `APPROVED`, `remaining = total - used`.
- Transaksi `PENDING` dan `REJECTED` **tidak** mengubah saldo. Saldo berubah hanya saat pengajuan disetujui akhir (diproses epic approval).
- Tipe transaksi ledger: `ENTITLEMENT`, `CARRY_OVER`, `LEAVE_TAKEN`, `COLLECTIVE`, `ADJUSTMENT`. `kind` = `ADDITION` atau `DEDUCTION` menentukan tanda.

## Aturan saat mengajukan adjustment

### Jenis adjustment (sama untuk semua role)

| Jenis | Efek ke saldo | Input |
|---|---|---|
| `ADD` (Add Quota) | tambah | jumlah hari 1–30, catatan |
| `DEDUCT` (Deduction) | kurang | jumlah hari 1 sampai sisa saldo karyawan, catatan |
| `RESTORE` (Restore Deduction) | tambah | pilih 1 pemotongan dari riwayat, catatan. Jumlah hari **otomatis = jumlah hari pemotongan itu**, tidak diinput |

- Catatan wajib, minimal 10 karakter.
- Pemotongan yang bisa di-restore: transaksi `DEDUCTION` berstatus `APPROVED` yang belum dirujuk restore lain berstatus `PENDING` atau `APPROVED`. Kalau restore ditolak, pemotongan itu bisa dipilih lagi.
- Saldo tidak berubah saat pengajuan dibuat, hanya muncul entri `PENDING` di ledger.

### Perbedaan per role

| Aturan | Karyawan non HR/BS (termasuk BM) | HR dan Building Service (BS) |
|---|---|---|
| Untuk siapa | Hanya **diri sendiri**. Opsi "Request for" tidak tampil | **Diri sendiri** atau **karyawan lain** lewat opsi "Request for" |
| Pemilih karyawan | Tidak ada | Field Select employee membuka bottom sheet (nama, NIP, jabatan). Pengaju sendiri tidak ada di daftar |
| Saldo, batas Deduction, daftar Restore | Milik sendiri | Milik karyawan yang dipilih. Saat karyawan diganti, pilihan Restore di-reset |
| Tahap 1 (verifikasi HR/BS) | **Perlu** diverifikasi HR/BS. Pengajuan mulai di `approvalStep = 1` | **Otomatis selesai**: dicatat `verifiedBy` = pengaju dan `verifiedAt`. Pengajuan mulai di `approvalStep = 2`, langsung menunggu BM |
| Tahap 2 | Building Management | Building Management |
| Approval Flow di form | HR/BS lalu BM, keduanya menunggu | HR/BS tampil hijau "Terverifikasi otomatis oleh Anda", lalu BM menunggu |
| Pemilik entri ledger | Pengaju sendiri | Karyawan target. Untuk pengajuan atas nama orang lain, entri **tidak** muncul di riwayat pengaju, hanya di riwayat karyawan target |
| `submittedBy` | Nama pengaju + role | Nama HR/BS + role. Berbeda dari karyawan target bila atas nama orang lain |
| Modal sukses | "Menunggu persetujuan HR atau Building Service, lalu Building Management" | Diri sendiri: "sudah terverifikasi dan menunggu Building Management". Atas nama orang lain: menyebut nama karyawan, tombol View Detail disembunyikan |
| Validasi server | Tolak bila `employeeId` bukan dirinya | Terima `employeeId` lain. Sumber Restore harus milik karyawan target |

## Backend

### BE-01 API saldo dan periode
**Deskripsi:** ringkasan kuota Annual Leave per karyawan.
**Kriteria selesai:**
- [ ] Mengembalikan `period {start, end}`, `total`, `used`, `remaining`, `pendingCount`.
- [ ] Default karyawan yang login. `employeeId` hanya diterima dari HR/BS.
- [ ] Angka selalu konsisten dengan ledger (aturan di atas).
- [ ] Periode, entitlement, dan carry-over (termasuk tanggal hangus) diambil dari kebijakan, bukan hardcode.

### BE-02 API ledger riwayat
**Deskripsi:** daftar dan detail transaksi ledger.
**Kriteria selesai:**
- [ ] List mendukung filter `kind` (semua/ADDITION/DEDUCTION) dan pagination cursor.
- [ ] Urut tanggal lalu ID transaksi. Server menghitung `balanceAfter` (running balance, hanya untuk `APPROVED`, `null` untuk lainnya).
- [ ] Field per entri: `id`, `type`, `kind`, `days`, `date`, `status`, `title`, `actor`, `requestRef`, `submittedBy`, `reason`, `adjustType`, `restoreSource`, `approvalStep`, `verifiedBy`, `verifiedAt`.
- [ ] Detail by id mengembalikan field yang sama.
- [ ] `title` dan `actor` tersedia dalam `id` dan `en`.
- [ ] `status`, `approvalStep`, dan `verifiedBy` diperbarui oleh proses approval (epic terpisah), endpoint ini hanya membacanya.

### BE-03 API pencarian karyawan (pengajuan atas nama)
**Deskripsi:** data untuk bottom sheet Select Employee.
**Kriteria selesai:**
- [ ] `GET` dengan `search` (cocok ke nama, NIP, jabatan, divisi) dan pagination.
- [ ] Field: `id`, `name`, `nip`, `position`, `division`, `remainingQuota`.
- [ ] Hanya HR/BS yang boleh memanggil. Karyawan yang sedang login tidak ikut dalam hasil.
- [ ] Batas cakupan (semua karyawan atau hanya gedung/divisi tertentu) sesuai keputusan produk.

### BE-04 API pemotongan yang bisa di-restore
**Deskripsi:** daftar pemotongan untuk pilihan Restore Deduction, untuk diri sendiri atau `employeeId` tertentu.
**Kriteria selesai:**
- [ ] Hanya `DEDUCTION` berstatus `APPROVED` yang belum dirujuk restore `PENDING`/`APPROVED`.
- [ ] Field: `id`, `type`, `days`, `date`, `title`.
- [ ] `employeeId` selain diri sendiri hanya diterima dari HR/BS.

### BE-05 API membuat pengajuan adjustment
**Deskripsi:** submit pengajuan dengan semua validasi di server.
**Kriteria selesai:**
- [ ] Body: `type` (`ADD`/`DEDUCT`/`RESTORE`), `days` (tidak dipakai untuk RESTORE), `restoreLedgerId` (wajib untuk RESTORE), `reason`, `employeeId` (opsional).
- [ ] `ADD`: 1–30 hari. `DEDUCT`: 1 sampai sisa saldo karyawan target. `RESTORE`: pemotongan harus `APPROVED`, milik karyawan target, belum dirujuk restore aktif. Hari diambil dari pemotongan, bukan dari klien.
- [ ] `reason` minimal 10 karakter. Periode aktif.
- [ ] Pengaju non HR/BS: `employeeId` kosong atau diri sendiri, selain itu ditolak. Pengajuan mulai `approvalStep = 1`.
- [ ] Pengaju HR/BS: boleh `employeeId` lain. Pengajuan mulai `approvalStep = 2` dengan `verifiedBy` dan `verifiedAt` terisi.
- [ ] Membuat entri ledger `PENDING` milik karyawan target, nomor unik `ADJ-xxx`, dan menyimpan `submittedBy` (nama + role pengaju).
- [ ] Membuat item untuk antrean approval dengan ID yang stabil. Penanganan antrean ada di epic approval.
- [ ] Mendukung `Idempotency-Key`: kirim ulang tidak membuat duplikat.
- [ ] Error validasi spesifik per field (dipakai pesan di form).

### BE-06 Role dan hak akses pengajuan
**Kriteria selesai:**
- [ ] Role Building Service ada di sistem (menu sama dengan Tenant Relation). Role HR tersedia bila dipakai.
- [ ] Hak "ajukan untuk orang lain" hanya untuk HR/BS, ditegakkan di server (bukan hanya disembunyikan di UI).
- [ ] Hak melihat ledger dan saldo karyawan lain hanya untuk HR/BS (dan role yang disepakati).

### BE-07 Audit pengajuan
**Kriteria selesai:**
- [ ] Setiap pengajuan menyimpan waktu, aktor, role, karyawan target, jenis, jumlah hari, catatan, dan sumber Restore.
- [ ] Jejak ini bisa dibaca dari detail riwayat.

## Mobile

### MB-01 Pintu masuk dan kartu ringkasan
- [ ] Work Attendance → Select Permission Option punya kartu **Leave Quota**.
- [ ] Request Permission menampilkan section Annual Leave Quota: judul, periode, tombol **View History**.
- [ ] Kartu ringkasan: sisa hari besar (oranye bila ≤ 2 hari), "left of N", progress bar, tile Total dan Used (tampil `−N` merah), banner oranye bila ada pengajuan menunggu.
- [ ] Data dari BE-01, dengan state loading dan error.

### MB-02 Daftar riwayat kuota
- [ ] Filter All / Additions / Deductions, setiap kartu bisa dibuka ke detail.
- [ ] Kartu: badge tipe, `+N`/`−N` hari, judul, nomor request, aktor, status (Waiting Approval/Rejected), tanggal, saldo setelah (hanya yang approved).
- [ ] Data dan pagination dari BE-02. Empty state per filter.
- [ ] Tombol **Request Quota Adjustment** di footer memakai ukuran sama dengan "Apply Request Permission" (tinggi 52, font 15px/700).

### MB-03 Detail riwayat kuota
- [ ] Hero: tipe, status, jumlah hari bertanda, judul, tanggal.
- [ ] Balance Change: approved = sebelum → sesudah. Pending = saldo saat ini → "Jika disetujui" + catatan saldo belum berubah. Rejected = pesan ditolak.
- [ ] Kalimat efek singkat (tambah/kurang/dikembalikan) untuk adjustment.
- [ ] Informasi: Tipe, Jenis penyesuaian, Tanggal, Nomor permohonan, Pemotongan yang dikembalikan, Catatan, **Diajukan oleh**, Sumber.
- [ ] Approval Flow untuk yang pending: tahap selesai hijau dengan "Diverifikasi oleh …", tahap berjalan oranye. Data dari `approvalStep` dan `verifiedBy`.

### MB-04 Form Request Adjustment (inti)
- [ ] Halaman memakai gaya form Permit Permission.
- [ ] Pilihan Type: Add Quota, Deduction, Restore Deduction.
- [ ] Add/Deduction: stepper hari bisa diketik (kolom boleh kosong saat mengetik, dipulihkan ke minimal 1 saat blur), unit "days" di dalam field. Deduction dibatasi sisa saldo. Saldo 0 menonaktifkan submit dengan pesan.
- [ ] Restore: tampil daftar pemotongan (judul, tipe · tanggal, `−N hari`) untuk dipilih. Kolom jumlah hari **disembunyikan**, hari otomatis dari pemotongan. Bila tidak ada pemotongan, tampil pesan kosong.
- [ ] Catatan minimal 10 karakter.
- [ ] Summary: saldo saat ini → ±hari → saldo baru, plus Approval Flow.
- [ ] Submit nonaktif sampai valid. Data Restore dari BE-04.

### MB-05 Aturan per role di form
- [ ] **Karyawan non HR/BS (termasuk BM):** tanpa opsi "Request for". Approval Flow menampilkan HR/BS dan BM sama-sama menunggu. Modal sukses menyebut menunggu HR/BS lalu BM.
- [ ] **HR/BS:** opsi **Request for** Myself / Another employee di paling atas form.
- [ ] HR/BS: langkah HR/BS di Approval Flow tampil hijau "Terverifikasi otomatis oleh Anda". Modal sukses menyebut sudah terverifikasi dan menunggu BM.
- [ ] HR/BS atas nama orang lain: label saldo menyebut nama karyawan, Type baru muncul setelah karyawan dipilih. Setelah submit, tombol View Detail disembunyikan dan modal menyebut nama karyawan.
- [ ] Peran pengguna dibaca dari profil/API, bukan hardcode.

### MB-06 Bottom sheet Select Employee
- [ ] Field **Select employee** muncul di bawah "Request for" saat Another employee dipilih, membuka bottom sheet.
- [ ] Bottom sheet: pencarian nama/NIP/jabatan, jumlah hasil, baris berisi avatar inisial, nama, NIP, jabatan · divisi, tanda terpilih. Tutup lewat tap area gelap, tombol ✕, atau Esc.
- [ ] Setelah dipilih: field menampilkan nama + NIP · jabatan, dan sisa kuota karyawan (oranye bila ≤ 2). Tap lagi untuk mengganti.
- [ ] Data dari BE-03 dengan pencarian di server, loading, dan empty state.

### MB-07 Submit, sukses, dan error
- [ ] Cegah submit ganda saat proses kirim. Kirim dengan `Idempotency-Key`.
- [ ] Pesan error spesifik dari BE-05. Tidak ada sukses palsu saat gagal atau offline.
- [ ] Modal sukses memakai ilustrasi success yang sama dengan Request Permission, tombol View Detail Request dan Back to Quota History.
- [ ] Setelah sukses, riwayat dan kartu ringkasan diperbarui (entri pending muncul, saldo belum berubah).

### MB-08 Ganti data contoh dengan API
- [ ] Hapus state ledger lokal di `App.jsx` dan data contoh di `src/data/leaveQuota.js`.
- [ ] Loading, empty, error, dan retry di semua layar epic ini.
- [ ] Kartu ringkasan di Request Permission dan halaman Leave Quota memakai satu sumber data.

## Dependensi dengan epic Approval

- Epic Approval menulis ke ledger: `status`, `approvalStep`, `verifiedBy`, `verifiedAt`, alasan penolakan. Epic ini membacanya.
- Antrean approval dibuat saat pengajuan dibuat (BE-05) dan diproses di epic Approval, termasuk siapa yang boleh Verify/Approve/Reject dan perubahan saldo.

## Keputusan produk yang masih terbuka

1. Role **HR** belum ada di aplikasi. Apakah HR dan BS punya hak yang sama persis?
2. Cakupan "Another employee": semua karyawan atau hanya gedung/divisi tertentu?
3. Apakah karyawan melihat pengajuan yang dibuat HR/BS atas namanya (status pending di riwayatnya)?
4. Apakah ada batas jumlah pengajuan atau larangan untuk periode yang sudah ditutup?
5. Apakah Restore boleh sebagian dari hari pemotongan? Prototipe: tidak, harus penuh.
6. Apakah BM sebagai pengaju perlu perlakuan khusus? Prototipe: sama seperti karyawan biasa (Tahap 1 oleh HR/BS).
7. Bagaimana carry-over yang hangus memengaruhi saldo dan urutan pemakaian?

## Usulan kontrak API (untuk disepakati, bukan sudah final)

```
GET  /leave-quota/annual?employeeId=
GET  /leave-quota/ledger?employeeId=&kind=&cursor=
GET  /leave-quota/ledger/{id}
GET  /leave-quota/restorable-deductions?employeeId=
GET  /employees?search=&purpose=quota-adjustment&cursor=
POST /leave-quota/adjustments            (Idempotency-Key)
```

Contoh body pengajuan atas nama karyawan (HR/BS):
```json
{ "type": "RESTORE", "restoreLedgerId": "QL-SR-014", "reason": "Cuti dibatalkan karena dipanggil bertugas", "employeeId": "emp-siti" }
```

Contoh body pengajuan sendiri (karyawan biasa):
```json
{ "type": "ADD", "days": 1, "reason": "Kerja di hari libur nasional untuk perbaikan genset" }
```

## Urutan pengerjaan yang disarankan

1. Sepakati keputusan produk 1–3 dan kontrak API (BE dan Mobile bersama).
2. BE-01, 02, 06 lalu MB-01, 02, 03, 08 (baca data).
3. BE-03, 04, 05, 07 lalu MB-04, 05, 06, 07 (pengajuan).

## Rujukan prototipe

- `src/views/LeaveQuotaView.jsx`: riwayat, detail, form, bottom sheet karyawan.
- `src/views/AnnualLeaveQuota.jsx`: kartu ringkasan.
- `src/data/leaveQuota.js`: aturan saldo, validasi, pembentukan request, `canAdjustForOthers`.
- `src/models/accounts.js`: akun demo termasuk Building Service.
