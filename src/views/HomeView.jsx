import React, { useState } from 'react';
import {
  MaterialButton,
  MaterialTextField,
  MaterialCard,
  MaterialSwitch,
  MaterialCheckbox,
  MaterialChip,
  MaterialDialog,
  Badge,
  LogoIcon,
  LogoFull,
  LogoBrand,
} from '../components/common';
import { useHomePresenter } from '../presenters';
import { DEMO_ACCOUNTS } from '../models/accounts';
import {
  Sparkle,
  CheckCircle,
  WarningCircle,
  XCircle,
  Info,
  SlidersHorizontal,
  MagnifyingGlass,
  EnvelopeSimple,
  Plus,
  ArrowRight,
  ShieldCheck,
  DeviceMobile,
  FolderSimple,
  Lightning,
  Image,
  ArrowsClockwise,
  SignOut,
  Buildings,
  Users,
  House,
  Wrench,
  Broom,
  FileText,
  Clock,
  QrCode,
  CalendarCheck,
  Gauge,
  ChatCircleDots,
  BellSimple,
} from '@phosphor-icons/react';

export const HomeView = ({ activeTab = 'components', onReplaySplash, onLogout, currentUser }) => {
  const { appState } = useHomePresenter();
  const [searchVal, setSearchVal] = useState('');
  const [emailVal, setEmailVal] = useState('user@proapps.id');
  const [isSwitchOn, setIsSwitchOn] = useState(true);
  const [isChecked, setIsChecked] = useState(true);
  const [selectedChip, setSelectedChip] = useState('react');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Default to Building Management if not logged in
  const user = currentUser || DEMO_ACCOUNTS[0];

  const getRoleIcon = (roleCode) => {
    switch (roleCode) {
      case 'BM': return Buildings;
      case 'TR': return Users;
      case 'TENANT': return House;
      case 'ENG': return Wrench;
      case 'HK': return Broom;
      case 'SEC': return ShieldCheck;
      default: return Users;
    }
  };

  const RoleIcon = getRoleIcon(user.roleCode);

  // Role Specific Action Modules
  const getRoleModules = (roleCode) => {
    switch (roleCode) {
      case 'BM':
        return [
          { title: 'Persetujuan (Approval)', icon: CheckCircle, desc: '4 Permintaan pending', color: 'purple' },
          { title: 'Laporan Keuangan & IPL', icon: FileText, desc: 'Rekap penerimaan bulan ini', color: 'blue' },
          { title: 'Status Staf Lapangan', icon: Users, desc: '18 Petugas aktif bertugas', color: 'green' },
          { title: 'Broadcast Pengumuman', icon: BellSimple, desc: 'Kirim notifikasi ke semua unit', color: 'orange' },
        ];
      case 'TR':
        return [
          { title: 'Tiket Komplain Tenant', icon: ChatCircleDots, desc: '6 Tiket baru perlu direspon', color: 'blue' },
          { title: 'Tagihan IPL & Utilitas', icon: FileText, desc: 'Monitoring status pembayaran', color: 'green' },
          { title: 'Direktori Tenant', icon: Users, desc: 'Daftar penghuni & status unit', color: 'purple' },
          { title: 'Survei Kepuasan', icon: Sparkle, desc: 'Feedback pelayanan gedung', color: 'amber' },
        ];
      case 'TENANT':
        return [
          { title: 'Tagihan & Pembayaran', icon: FileText, desc: 'IPL Bulan September: Lunas', color: 'green' },
          { title: 'Buat Tiket Bantuan', icon: Plus, desc: 'Lapor kendala air, AC, unit', color: 'blue' },
          { title: 'Visitor Pass (QR Code)', icon: QrCode, desc: 'Buat akses tamu berkunjung', color: 'purple' },
          { title: 'Booking Fasilitas', icon: CalendarCheck, desc: 'Kolam renang, gym, function room', color: 'orange' },
        ];
      case 'ENG':
        return [
          { title: 'Work Order (WO)', icon: Wrench, desc: '3 Perbaikan dalam proses', color: 'orange' },
          { title: 'Catat Meteran Listrik/Air', icon: Gauge, desc: 'Input angka meter bulanan', color: 'blue' },
          { title: 'Preventive AC & Genset', icon: ShieldCheck, desc: 'Jadwal servis berkala', color: 'green' },
          { title: 'Log Kerusakan Alat', icon: WarningCircle, desc: 'Riwayat maintenance pompa', color: 'red' },
        ];
      case 'HK':
        return [
          { title: 'Jadwal Kebersihan', icon: Broom, desc: 'Lobby & Koridor Lt. 1-12', color: 'amber' },
          { title: 'Checklist Toilet', icon: CheckCircle, desc: 'Inspeksi berkala 2 jam sekali', color: 'green' },
          { title: 'Stok Bahan Chemical', icon: FolderSimple, desc: 'Pembersih lantai & sabun', color: 'blue' },
          { title: 'Jadwal Pengangkutan Sampah', icon: Clock, desc: 'Area loading dock & TPS', color: 'orange' },
        ];
      case 'SEC':
        return [
          { title: 'Buku Tamu / Visitor Log', icon: QrCode, desc: '14 Pengunjung hari ini', color: 'red' },
          { title: 'Buku Patroli Digital', icon: ShieldCheck, desc: 'Check point barcode aktif', color: 'blue' },
          { title: 'Laporan Insiden', icon: WarningCircle, desc: 'Catatan kejadian & investigasi', color: 'orange' },
          { title: 'Kontrol Gerbang & Barrier', icon: SlidersHorizontal, desc: 'Akses masuk mobil & motor', color: 'green' },
        ];
      default:
        return [
          { title: 'Menu Umum', icon: FileText, desc: 'Akses umum sistem', color: 'blue' },
        ];
    }
  };

  const modules = getRoleModules(user.roleCode);

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* User Profile Header Card */}
      <div
        style={{
          padding: '16px',
          borderRadius: 'var(--radius-md)', /* 16px */
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-text-on-primary)',
          boxShadow: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <RoleIcon size={22} weight="fill" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
                {user.name}
              </h2>
              <span style={{ fontSize: '0.75rem', opacity: 0.85 }}>
                {user.unitOrDept}
              </span>
            </div>
          </div>
          <Badge color={user.badgeColor || 'blue'}>
            {user.roleCode}
          </Badge>
        </div>

        <p style={{ fontSize: '0.8125rem', opacity: 0.9, lineHeight: 1.4, margin: 0 }}>
          {user.description || 'Dashboard operasional sistem manajemen properti Proapps.'}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '4px' }}>
          {onReplaySplash && (
            <MaterialButton
              variant="tonal"
              size="small"
              icon={ArrowsClockwise}
              onClick={onReplaySplash}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              Splash Screen
            </MaterialButton>
          )}
          {onLogout && (
            <MaterialButton
              variant="tonal"
              size="small"
              icon={SignOut}
              onClick={onLogout}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              Ganti Akun
            </MaterialButton>
          )}
        </div>
      </div>

      {/* Role-Specific Operation Modules (Outer Card 16px -> Inner Tiles 8px) */}
      <MaterialCard variant="elevated">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
            ⚡ Modul Kerja: {user.role}
          </h3>
          <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
            {modules.length} Fitur
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {modules.map((mod, idx) => {
            const ModIcon = mod.icon;
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)', /* 8px inner */
                  backgroundColor: 'var(--color-background-page)',
                  border: '1px solid var(--color-border-default)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
                onClick={() => alert(`Opening module: ${mod.title}`)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-xs)', /* 4px inner */
                      backgroundColor: `var(--color-${mod.color}-50)`,
                      color: `var(--color-${mod.color}-700)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ModIcon size={18} weight="bold" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {mod.title}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)' }}>
                      {mod.desc}
                    </div>
                  </div>
                </div>
                <ArrowRight size={16} color="var(--color-text-secondary)" />
              </div>
            );
          })}
        </div>
      </MaterialCard>



      {activeTab === 'components' && (
        <>
          {/* Section: Material Buttons */}
          <MaterialCard variant="elevated">
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
              🔘 Material 3 Buttons
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '14px' }}>
              Sentuh tombol untuk efek animasi Ripple.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <MaterialButton variant="filled" icon={Plus} style={{ width: '100%', borderRadius: 'var(--radius-sm)' }}>
                Button Utama (Primary)
              </MaterialButton>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <MaterialButton variant="outlined" icon={SlidersHorizontal} size="small" style={{ borderRadius: 'var(--radius-sm)' }}>
                  Outlined
                </MaterialButton>
                <MaterialButton variant="tonal" icon={Lightning} size="small" style={{ borderRadius: 'var(--radius-sm)' }}>
                  Tonal
                </MaterialButton>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                <MaterialButton variant="text" icon={ArrowRight} size="small" style={{ borderRadius: 'var(--radius-sm)' }}>
                  Text Action
                </MaterialButton>
                <MaterialButton variant="fab" size="small" onClick={() => setIsDialogOpen(true)} title="Buka Dialog" style={{ borderRadius: 'var(--radius-md)' }}>
                  <Plus size={16} weight="bold" />
                </MaterialButton>
              </div>
            </div>
          </MaterialCard>

          {/* Section: Outlined Text Fields */}
          <MaterialCard variant="outlined">
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
              📝 Outlined Text Fields
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '14px' }}>
              Floating label dengan border fokus <span style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>#09B2FF</span>.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <MaterialTextField
                label="Cari Menu / Fitur"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Ketik kata kunci..."
                leadingIcon={MagnifyingGlass}
                helperText="Instruksi penting helper text #64748B"
              />
              <MaterialTextField
                label="Email Pengguna"
                value={emailVal}
                onChange={(e) => setEmailVal(e.target.value)}
                leadingIcon={EnvelopeSimple}
              />
            </div>
          </MaterialCard>
        </>
      )}

      {activeTab === 'tokens' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <MaterialCard variant="elevated">
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '10px' }}>
              01 Brand Tokens
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <ColorRow name="primary" hex="#053079" bg="var(--color-primary)" text="#FFFFFF" usage="Button utama, link, aktif" />
              <ColorRow name="secondary" hex="#09B2FF" bg="var(--color-secondary)" text="#053079" usage="Garis tab, progress, fokus" />
              <ColorRow name="selected-background" hex="#EAF7FF" bg="var(--color-selected-background)" text="#053079" usage="Background menu/filter aktif" border="1px solid #09B2FF" />
            </div>
          </MaterialCard>

          <MaterialCard variant="elevated">
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '10px' }}>
              02 Teks & Ikon
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <ColorRow name="text-primary" hex="#334155" bg="#334155" text="#FFFFFF" usage="Judul, body, label" />
              <ColorRow name="text-secondary" hex="#64748B" bg="#64748B" text="#FFFFFF" usage="Deskripsi, helper text" />
              <ColorRow name="text-placeholder" hex="#CBD5E1" bg="#CBD5E1" text="#334155" usage="Placeholder input" />
              <ColorRow name="text-on-primary" hex="#FFFFFF" bg="#053079" text="#FFFFFF" usage="Teks di atas primary" />
            </div>
          </MaterialCard>

          <MaterialCard variant="elevated">
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '10px' }}>
              03 Background & Border
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <ColorRow name="background-page" hex="#F8FAFC" bg="#F8FAFC" text="#334155" usage="Background halaman" border="1px solid #E5E7EB" />
              <ColorRow name="background-surface" hex="#FFFFFF" bg="#FFFFFF" text="#334155" usage="Card, modal, input" border="1px solid #E5E7EB" />
              <ColorRow name="border-default" hex="#E5E7EB" bg="#E5E7EB" text="#334155" usage="Border card, divider" />
              <ColorRow name="border-focus" hex="#09B2FF" bg="#09B2FF" text="#053079" usage="Border fokus" />
            </div>
          </MaterialCard>
        </div>
      )}

      {activeTab === 'preline' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <MaterialCard variant="elevated">
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
              🌈 Preline.co Auxiliary Colors
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '14px' }}>
              Warna semantik untuk status alert & badge.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
              <Badge color="blue"><Info size={13} weight="bold" /> Info</Badge>
              <Badge color="green"><CheckCircle size={13} weight="bold" /> Success</Badge>
              <Badge color="red"><XCircle size={13} weight="bold" /> Danger</Badge>
              <Badge color="orange"><WarningCircle size={13} weight="bold" /> Warning</Badge>
              <Badge color="amber"><Lightning size={13} weight="bold" /> Alert</Badge>
              <Badge color="purple"><Sparkle size={13} weight="bold" /> Purple</Badge>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <ColorRow name="Blue (Info)" hex="#2563EB" bg="var(--color-blue-600)" text="#FFFFFF" usage="Informasi & Aksi" />
              <ColorRow name="Green (Success)" hex="#16A34A" bg="var(--color-green-600)" text="#FFFFFF" usage="Status Berhasil" />
              <ColorRow name="Red (Danger)" hex="#DC2626" bg="var(--color-red-600)" text="#FFFFFF" usage="Error & Destructive" />
              <ColorRow name="Orange (Warning)" hex="#EA580C" bg="var(--color-orange-600)" text="#FFFFFF" usage="Peringatan" />
              <ColorRow name="Amber (Notice)" hex="#D97706" bg="var(--color-amber-600)" text="#FFFFFF" usage="Notifikasi Ringan" />
              <ColorRow name="Purple (Accent)" hex="#9333EA" bg="var(--color-purple-600)" text="#FFFFFF" usage="Fitur Spesial" />
            </div>
          </MaterialCard>
        </div>
      )}

      {/* Modal Demo Dialog */}
      <MaterialDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Material 3 Dialog"
        confirmText="Simpan"
        cancelText="Tutup"
        onConfirm={() => {
          alert('Aksi tersimpan.');
          setIsDialogOpen(false);
        }}
      >
        Dialog modal interaktif berstandar Material Design 3 dengan frame mobile Android dan concentric radius kelipatan 8.
      </MaterialDialog>
    </div>
  );
};

const ColorRow = ({ name, hex, bg, text, usage, border = 'none' }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 12px',
      borderRadius: 'var(--radius-sm)', /* 8px inner row */
      backgroundColor: 'var(--color-background-surface)',
      border: '1px solid var(--color-border-default)',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: 'var(--radius-xs)', /* 4px inner color box */
          backgroundColor: bg,
          color: text,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.625rem',
          fontWeight: 700,
          border: border,
        }}
      />
      <div>
        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{name}</div>
        <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)' }}>{usage}</div>
      </div>
    </div>
    <span style={{ fontSize: '0.75rem', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
      {hex}
    </span>
  </div>
);
