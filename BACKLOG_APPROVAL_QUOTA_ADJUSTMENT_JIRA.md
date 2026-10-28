# Epic: Approval Request Quota Adjustment

Cakupan epic ini: sisi **persetujuan** pengajuan Quota Adjustment, yaitu tab Quota di Approval Request, kartu, detail approval, dan aksi Verify / Approve / Reject. Sisi pengajuan (form, riwayat, saldo) ada di epic **Leave Quota** (`BACKLOG_LEAVE_QUOTA_JIRA.md`).

Prototipe sudah jalan di repo ini dengan state di memori (reload = data kembali awal). Backlog ini mengubahnya menjadi fitur produksi.

Referensi perilaku: `npm run dev` (port 5173). Akun demo, password semua `password`:
- `bm@proapps.id` Building Management (Tahap 2)
- `bs@proapps.id` Building Service (Tahap 1)
- `eng@proapps.id` atau role lain: tidak punya akses Approval Request

Cara mencoba: login BS → Work Attendance → Request Permission → Another employee → ajukan, lalu login BM → Approval Request → tab Quota. Mock approval Dimas, Rizky, dan Siti sudah tersedia di tab Quota.

## Aturan bisnis persetujuan

**Alur dua tahap**
- Tahap 1: verifikasi HR atau Building Service (aksi **Verify & Forward**). Tahap 2: persetujuan akhir Building Management (aksi **Approve**). Reject boleh di kedua tahap.
- Pengajuan yang dibuat HR/BS: Tahap 1 **otomatis selesai** saat pengajuan dibuat (`verifiedBy` = pengaju, `verifiedAt` terisi), pengajuan langsung menunggu BM di `approvalStep = 2`.
- Pengajuan karyawan biasa: mulai di `approvalStep = 1`.

**Siapa boleh aksi**
| Tahap | Yang boleh Verify/Approve/Reject |
|---|---|
| 1 (verifikasi) | HR, BS. (Di prototipe BM juga boleh supaya demo dari akun BM jalan. Perlu diputuskan, lihat pertanyaan terbuka) |
| 2 (persetujuan akhir) | Hanya BM |

- Menu **Approval Request** hanya terlihat untuk BM dan BS. Role lain tidak melihat kartunya di Select Permission Option, tidak ada badge jumlah pending.
- Pengguna yang bukan approver tahap berjalan melihat detail tanpa bar aksi. Contoh: BS melihat pengajuan yang dibuatnya sendiri (sudah di tahap 2) tanpa tombol.

**Efek ke saldo**
- Saldo berubah **hanya** saat persetujuan akhir (Tahap 2 Approve). Verify Tahap 1 dan Reject tidak mengubah saldo.
- `ADD` dan `RESTORE` menambah saldo, `DEDUCT` mengurangi.
- Reject: status `REJECTED`, saldo tetap. Untuk Restore, pemotongan sumber bisa dipilih lagi.

## Backend

### BE-01 API daftar approval Quota Adjustment
**Deskripsi:** data untuk tab Quota.
**Kriteria selesai:**
- [ ] Hanya BM dan BS yang boleh memanggil. Role lain ditolak (403), bukan hanya disembunyikan di UI.
- [ ] Filter `status` (`PENDING`/`APPROVED`/`REJECTED`) dan pagination cursor. Terpisah dari approval permit.
- [ ] Cakupan per role: BS melihat pengajuan yang menunggu Tahap 1 dan yang dibuatnya. BM melihat semuanya (atau sesuai keputusan produk).
- [ ] Field kartu: `id`, `requestRef`, karyawan (`name`, `position`, `division`), jenis (`adjustType`), `days`, tanggal, `status`, `approvalStep`.
- [ ] Mengembalikan jumlah `PENDING` untuk badge tab.

### BE-02 API detail approval
**Kriteria selesai:**
- [ ] Field: karyawan (`name`, `nip`, `position`, `division`, `avatar`), `submittedBy` (nama + role), `submittedAt`, `adjustType`, `days`, `reason`, `restoreSource`, `requestRef`.
- [ ] Dampak saldo: `balanceAtRequest` dan `balanceAfterApproval`. Bila hasil < 0, mengembalikan flag peringatan.
- [ ] Alur: `approvalStep`, `status`, `verifiedBy`, `verifiedAt`, `rejectedBy`, `rejectReason`.
- [ ] Flag `canAct` dan aksi yang tersedia (`verify` atau `approve`, `reject`) untuk pemanggil, supaya mobile tidak menebak.

### BE-03 API Verify (Tahap 1)
**Kriteria selesai:**
- [ ] Hanya role yang diizinkan di Tahap 1. Ditolak bila `approvalStep` bukan 1 atau status bukan `PENDING`.
- [ ] Mengubah `approvalStep` ke 2, mencatat `verifiedBy` dan `verifiedAt`. Saldo tidak berubah.
- [ ] `approvalStep`, `verifiedBy`, dan `verifiedAt` ikut diperbarui di entri ledger yang sama (satu sumber kebenaran), supaya detail riwayat di sisi pengaju menampilkan Tahap 1 selesai.
- [ ] Idempotent: klik ganda atau retry tidak memajukan tahap dua kali.

### BE-04 API Approve akhir (Tahap 2)
**Kriteria selesai:**
- [ ] Hanya BM. Ditolak bila `approvalStep` bukan 2 atau status bukan `PENDING`.
- [ ] Status `APPROVED`, entri ledger jadi `APPROVED`, dan saldo berubah, semuanya **dalam satu transaksi atomik**. Saldo berubah tepat sekali walau di-retry.
- [ ] Teks aktor di ledger diperbarui ("Approved by Building Management").
- [ ] `DEDUCT`: saldo dicek ulang saat approve. Bila akan minus, ditolak dengan error jelas (saldo bisa berubah sejak diajukan).
- [ ] `RESTORE`: pemotongan sumber dicek masih valid dan belum dipakai restore lain.

### BE-05 API Reject
**Kriteria selesai:**
- [ ] Hanya approver tahap berjalan. Status `REJECTED`, mencatat `rejectedBy`, tahap, waktu, dan alasan.
- [ ] Entri ledger jadi `REJECTED` dengan teks aktor ("Rejected by …"). Saldo tidak berubah.
- [ ] Alasan penolakan: wajib atau opsional sesuai keputusan produk (prototipe: opsional, default "Ditolak oleh atasan.").
- [ ] Pemotongan sumber Restore dibebaskan lagi.

### BE-06 Konsistensi dan audit
**Kriteria selesai:**
- [ ] Item approval dan entri ledger terhubung lewat ID stabil, status keduanya selalu sama setelah verify/approve/reject, termasuk setelah retry.
- [ ] Setiap aksi menyimpan waktu, aktor, role, tahap, keputusan, dan alasan, dan tampil di detail.
- [ ] Penanganan dua approver yang bertindak bersamaan: hanya satu yang berhasil, yang lain mendapat error status sudah berubah.

### BE-07 Hak akses approval
**Kriteria selesai:**
- [ ] Matriks hak: lihat Approval Request (BM/BS), Tahap 1, Tahap 2, ditegakkan di server.
- [ ] Aturan konflik kepentingan (pengaju menyetujui pengajuannya sendiri) sesuai keputusan produk.

### BE-08 (P2) Notifikasi
- [ ] Push/in-app ke approver saat ada pengajuan baru atau menunggu tahapnya, dan ke pengaju/karyawan saat diverifikasi, disetujui, atau ditolak. Belum ada di prototipe.

## Mobile

### MB-01 Akses menu Approval Request
- [ ] Kartu **Approval Request** di Select Permission Option hanya tampil untuk BM dan BS.
- [ ] Untuk role lain: kartu, badge jumlah pending di kartu Work Attendance, dan subjudul modal ("…atau persetujuan tim") disembunyikan. Subjudul diganti agar tidak menyebut approval.
- [ ] Peran dibaca dari profil/API. Server tetap menolak akses bila layar dibuka lewat jalur lain.

### MB-02 Tab Permission dan Quota
- [ ] Dua tab di header Approval Request: **Permission** dan **Quota**, masing-masing dengan badge jumlah pending (oranye).
- [ ] Filter tipe hanya berlaku di tab Permission. Grup tipe disembunyikan di modal filter saat tab Quota aktif.
- [ ] Data dari BE-01, dengan pagination, loading, empty, dan error.

### MB-03 Kartu Quota Adjustment
- [ ] Kartu: karyawan, jenis (Add Quota/Deduction/Restore Deduction), jumlah hari bertanda, tanggal, status.
- [ ] Untuk yang pending: baris tahap yang menunggu ("Step 1 · Verification · HR or Building Service" atau "Step 2 · Final approval · Building Management").
- [ ] Tap membuka detail.

### MB-04 Detail approval
- [ ] Hero: nama, **jabatan · divisi**, **NIP**, pill status (Waiting Approval/Approved/Rejected), jumlah hari bertanda (merah untuk Deduction).
- [ ] **Balance Impact:** saldo saat diajukan → ±hari → setelah disetujui, kalimat efek, peringatan merah bila hasilnya minus.
- [ ] Informasi: Nomor permohonan, Jenis penyesuaian, Pemotongan yang dikembalikan (untuk Restore), **Diajukan oleh** (nama + role), Diajukan (waktu), Catatan.
- [ ] **Approval Flow:** status per tahap (selesai, berjalan, ditolak, belum, tidak dicapai), catatan "Verified by … · waktu", dan kotak alasan bila ditolak. Untuk pengajuan HR/BS, Tahap 1 sudah hijau dari awal.
- [ ] Tidak ada badge jenis adjustment di bawah badge "Quota Adjustment"; jenis tampil di Informasi.

### MB-05 Aksi Verify, Approve, Reject
- [ ] Bar aksi sticky hanya muncul bila `canAct` true. Selain itu halaman detail penuh tanpa bar.
- [ ] Tahap 1: tombol **Verify & Forward**, konfirmasi "Verify and forward this request?" dengan tombol "Yes, Forward", lalu modal selesai "Request forwarded".
- [ ] Tahap 2: tombol **Approve**, dengan konfirmasi dan modal selesai.
- [ ] **Reject:** modal alasan penolakan, lalu modal selesai.
- [ ] Setelah aksi, daftar, badge tab, dan detail diperbarui dari server. Tidak ada status palsu bila gagal (offline, sudah diputuskan orang lain, saldo akan minus).
- [ ] Cegah aksi ganda saat proses kirim.

### MB-06 Ganti data contoh dengan API
- [ ] Hapus state `teamApprovals` untuk tipe quota di `App.jsx` dan mock Dimas/Rizky/Siti di `src/data/teamApprovals.js`.
- [ ] Hapus sinkronisasi ledger lokal (`onQuotaAdjustmentDecided`). Ledger dan approval kini dari server.
- [ ] Loading, empty, error, dan retry di semua layar epic ini.

## Kondisi prototipe yang tidak boleh terbawa ke produksi

- Verify di Tahap 1 hanya mengubah item approval, **tidak** memperbarui entri ledger. Akibatnya detail riwayat pengaju masih menampilkan Tahap 1 menunggu setelah diverifikasi. Server harus memperbarui keduanya (BE-03).
- BM bisa aksi di Tahap 1 dan bisa menyetujui pengajuannya sendiri. Belum ada aturan konflik kepentingan.
- Layar Approval Request hanya disembunyikan di menu, belum dikunci.
- Alasan penolakan opsional dengan teks default.

## Keputusan produk yang masih terbuka

1. Apakah BM boleh aksi di Tahap 1 (Verify) atau benar-benar hanya HR/BS?
2. Apakah pengaju boleh menyetujui pengajuannya sendiri? Contoh: BM mengajukan lalu menyetujui di Tahap 2, atau BS mengajukan untuk dirinya sendiri.
3. Apakah role HR ada dan punya hak sama dengan BS? HR belum ada di aplikasi.
4. Cakupan daftar: BS melihat semua pengajuan atau hanya yang menunggu Tahap 1 dan yang dibuatnya? BM melihat semuanya?
5. Apakah alasan penolakan wajib? Apakah ada minimal karakter?
6. Apakah ada batas waktu persetujuan (SLA) atau eskalasi bila tidak diproses?
7. Bila saldo berubah sehingga Deduction akan membuat saldo minus saat Approve, apakah ditolak otomatis atau BM boleh memaksa?
8. Apakah verifier boleh membatalkan verifikasi (menarik kembali) sebelum BM memutuskan?

## Usulan kontrak API (untuk disepakati, bukan sudah final)

```
GET  /approvals/quota-adjustments?status=&cursor=
GET  /approvals/quota-adjustments/{id}
POST /approvals/quota-adjustments/{id}/verify
POST /approvals/quota-adjustments/{id}/approve
POST /approvals/quota-adjustments/{id}/reject    {reason}
```

Contoh respons detail (ringkas):
```json
{
  "id": "APV-ADJ-2026-0020", "requestRef": "ADJ-020", "status": "PENDING", "approvalStep": 2,
  "employee": { "name": "Rizky Maulana", "nip": "2023010512", "position": "Teknisi Plumbing", "division": "Engineering" },
  "submittedBy": "Indra Saputra (Building Service)", "submittedAt": "2026-10-21T09:15:00+07:00",
  "adjustType": "DEDUCT", "days": 1, "reason": "…",
  "balanceAtRequest": 7, "balanceAfterApproval": 6, "negativeBalanceWarning": false,
  "verifiedBy": "Indra Saputra (Building Service)", "verifiedAt": "2026-10-21T09:15:00+07:00",
  "canAct": true, "actions": ["approve", "reject"]
}
```

## Urutan pengerjaan yang disarankan

1. Sepakati keputusan produk 1–4 dan kontrak API.
2. BE-01, 02, 07 lalu MB-01, 02, 03, 04 (lihat daftar dan detail).
3. BE-03, 04, 05, 06 lalu MB-05 (aksi).
4. MB-06 (ganti data contoh), lalu BE-08 notifikasi.

Epic ini bergantung pada epic Leave Quota (BE-05 membuat pengajuan dan antrean, BE-02 ledger yang dibaca pengaju).

## Rujukan prototipe

- `src/views/RequestApprovalView.jsx`: tab, kartu, konfirmasi, modal alasan.
- `src/views/QuotaAdjustmentApprovalDetail.jsx`: detail approval dan bar aksi.
- `src/data/leaveQuota.js`: `canActOnAdjustmentStep`, alur dua tahap, `createAdjustmentApproval`.
- `src/data/teamApprovals.js`: mock approval quota.
- `src/views/WorkAttendanceView.jsx`: kartu Approval Request di Select Permission Option (hanya BM/BS).
- `src/App.jsx`: sinkronisasi keputusan ke ledger (`onQuotaAdjustmentDecided`).
