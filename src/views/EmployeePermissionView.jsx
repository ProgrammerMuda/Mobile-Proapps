import React, { useState, useEffect } from 'react';
import {
  CaretLeft,
  Plus,
  FileText,
  Clock,
  ClockCountdown,
  ArrowsLeftRight,
  CheckCircle,
  XCircle,
  X,
  Funnel,
  MagnifyingGlass,
  CalendarCheck,
  User,
  Users,
  Paperclip,
  Check,
  Info,
  CalendarBlank,
  Buildings,
  ArrowRight,
} from '@phosphor-icons/react';
import { useLanguage } from '../context/LanguageContext';

/**
 * Initial Mock Data for Employee Permissions (4 Types):
 * 1. PERMIT (Izin / Sakit / Cuti)
 * 2. MANUAL_ATTENDANCE (Presensi Manual / Koreksi Absen)
 * 3. OVERTIME (Lembur)
 * 4. CHANGE_SHIFT (Tukar / Ganti Shift)
 */
const INITIAL_REQUESTS = [
  {
    id: 'REQ-PRM-2026-0048',
    type: 'PERMIT',
    subType: 'Cuti Tahunan',
    title: 'Cuti Tahunan Libur Keluarga',
    dateDisplay: '12 Okt 2026 - 14 Okt 2026',
    duration: '3 Hari',
    submittedAt: '28 Sep 2026 • 09:30',
    status: 'APPROVED',
    reason: 'Acara keluarga besar di luar kota.',
    approver: 'Hendra Wijaya (SPV Operasional)',
    approvedAt: '28 Sep 2026 • 11:15',
    attachment: null,
  },
  {
    id: 'REQ-MAT-2026-0045',
    type: 'MANUAL_ATTENDANCE',
    subType: 'Lupa Clock Out',
    title: 'Koreksi Absen Clock Out Shift Malam',
    dateDisplay: '27 Sep 2026 • 21:00 WIB',
    duration: 'Clock Out: 21:00',
    submittedAt: '28 Sep 2026 • 07:45',
    status: 'PENDING',
    reason: 'Baterai smartphone habis saat jam pulang dan antrian scan di pos sedang padat.',
    approver: 'Menunggu SPV Operasional',
    location: 'Pos Security Lobby Utama',
    attachment: 'bukti_kehadiran_pos.jpg',
  },
  {
    id: 'REQ-OVT-2026-0039',
    type: 'OVERTIME',
    subType: 'Lembur Hari Kerja',
    title: 'Perbaikan Darurat Pipa Basement 2',
    dateDisplay: '26 Sep 2026 • 17:00 - 20:30',
    duration: '3.5 Jam',
    submittedAt: '26 Sep 2026 • 16:30',
    status: 'APPROVED',
    reason: 'Instalasi pipa pompa transfer air bersih mengalami kebocoran sambungan dan butuh penanganan segera.',
    approver: 'Bambang Sudirgo (Chief Engineering)',
    approvedAt: '26 Sep 2026 • 21:00',
    attachment: 'laporan_pekerjaan_pipa.pdf',
  },
  {
    id: 'REQ-CSH-2026-0034',
    type: 'CHANGE_SHIFT',
    subType: 'Tukar Shift',
    title: 'Tukar Shift Siang ke Shift Pagi',
    dateDisplay: '25 Sep 2026 (Shift 1: 07:00 - 15:00)',
    duration: '1 Shift',
    submittedAt: '24 Sep 2026 • 14:10',
    status: 'APPROVED',
    reason: 'Menemani orang tua kontrol kesehatan di rumah sakit pada sore hari.',
    swapWith: 'Dimas Prasetyo (Teknisi Listrik)',
    approver: 'Hendra Wijaya (SPV Operasional)',
    approvedAt: '24 Sep 2026 • 16:20',
  },
  {
    id: 'REQ-PRM-2026-0028',
    type: 'PERMIT',
    subType: 'Sakit',
    title: 'Izin Sakit (Demam & Flu)',
    dateDisplay: '18 Sep 2026',
    duration: '1 Hari',
    submittedAt: '18 Sep 2026 • 06:15',
    status: 'APPROVED',
    reason: 'Kondisi badan panas tinggi dan dianjurkan dokter klinik istirahat di rumah.',
    approver: 'Hendra Wijaya (SPV Operasional)',
    approvedAt: '18 Sep 2026 • 08:00',
    attachment: 'Surat_Keterangan_Dokter_Klinik.pdf',
  },
  {
    id: 'REQ-MAT-2026-0019',
    type: 'MANUAL_ATTENDANCE',
    subType: 'Koreksi Clock In',
    title: 'Presensi Manual Clock In Pagi',
    dateDisplay: '10 Sep 2026 • 07:55 WIB',
    duration: 'Clock In: 07:55',
    submittedAt: '10 Sep 2026 • 13:00',
    status: 'REJECTED',
    reason: 'Aplikasi sempat error GPS out of range saat di lobby.',
    approver: 'Hendra Wijaya (SPV Operasional)',
    rejectReason: 'Setelah diverifikasi dengan CCTV pos lobby, karyawan baru hadir pukul 08:35 WIB (terlambat). Silakan ajukan ulang sesuai jam kehadiran riil.',
  },
];

const INITIAL_TEAM_APPROVALS = [
  {
    id: 'APV-PRM-2026-0102',
    employeeName: 'Dimas Prasetyo',
    employeeRole: 'Teknisi Listrik & ME',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    type: 'PERMIT',
    subType: 'Cuti Tahunan',
    title: 'Cuti Menikahkan Kerabat di Solo',
    dateDisplay: '05 Okt 2026 - 07 Okt 2026',
    duration: '3 Hari',
    submittedAt: '28 Sep 2026 • 08:20',
    status: 'PENDING',
    reason: 'Izin pulang kampung menghadiri pernikahan adik kandung di Solo, Jawa Tengah.',
    attachment: 'Surat_Undangan_Keluarga.pdf',
  },
  {
    id: 'APV-MAT-2026-0099',
    employeeName: 'Siti Rahma',
    employeeRole: 'Security Officer (Shift 2)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    type: 'MANUAL_ATTENDANCE',
    subType: 'Lupa Clock Out',
    title: 'Koreksi Absen Pulang Shift Sore',
    dateDisplay: '27 Sep 2026 • 21:05 WIB',
    duration: 'Out: 21:05',
    submittedAt: '28 Sep 2026 • 07:45',
    status: 'PENDING',
    reason: 'Ponsel kehabisan baterai saat pergantian pos jaga gerbang utama barat.',
    attachment: 'Foto_Serah_Terima_Pos.jpg',
  },
  {
    id: 'APV-OVT-2026-0084',
    employeeName: 'Agus Saputra',
    employeeRole: 'Teknisi AC & Plumbing',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
    type: 'OVERTIME',
    subType: 'Lembur Hari Kerja',
    title: 'Penanganan Darurat Pipa Chiller Basement 2',
    dateDisplay: '26 Sep 2026 • 17:00 - 20:30',
    duration: '3.5 Jam',
    submittedAt: '27 Sep 2026 • 09:10',
    status: 'PENDING',
    reason: 'Perbaikan mendesak pipa pendingin gedung B yang retak demi kenyamanan tenant.',
    attachment: 'Laporan_Pekerjaan_Basement.pdf',
  },
  {
    id: 'APV-CSH-2026-0071',
    employeeName: 'Rian Hidayat',
    employeeRole: 'Customer Service Front Desk',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    type: 'CHANGE_SHIFT',
    subType: 'Tukar Shift',
    title: 'Tukar Shift dengan Budi Santoso',
    dateDisplay: '01 Okt 2026 • Pagi -> Siang',
    duration: '1 Shift',
    submittedAt: '26 Sep 2026 • 14:00',
    status: 'APPROVED',
    reason: 'Ada urusan perbankan penting di pagi hari, sudah sepakat tukar shift dengan Budi.',
    approver: 'Anda (Manager)',
    approvedAt: '26 Sep 2026 • 15:30',
    attachment: null,
  },
];

export const EmployeePermissionView = ({ onBack, user, initialMode = 'REQUEST' }) => {
  const { language } = useLanguage();

  const [activeMode, setActiveMode] = useState(initialMode); // 'REQUEST' | 'APPROVAL'

  useEffect(() => {
    if (initialMode) {
      setActiveMode(initialMode);
    }
  }, [initialMode]);

  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'PERMIT' | 'MANUAL_ATTENDANCE' | 'OVERTIME' | 'CHANGE_SHIFT'
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDetail, setSelectedDetail] = useState(null);

  // Team Approvals state
  const [teamApprovals, setTeamApprovals] = useState(INITIAL_TEAM_APPROVALS);
  const [approvalTab, setApprovalTab] = useState('ALL'); // 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'
  const [approvalSearchQuery, setApprovalSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [rejectModalItem, setRejectModalItem] = useState(null);
  const [rejectReasonInput, setRejectReasonInput] = useState('');

  // New Request Modal state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [formType, setFormType] = useState('PERMIT'); // 'PERMIT' | 'MANUAL_ATTENDANCE' | 'OVERTIME' | 'CHANGE_SHIFT'
  const [formSubType, setFormSubType] = useState('Cuti Tahunan');
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('02 Okt 2026');
  const [formEndDate, setFormEndDate] = useState('03 Okt 2026');
  const [formTime, setFormTime] = useState('08:00');
  const [formEndTime, setFormEndTime] = useState('17:00');
  const [formReason, setFormReason] = useState('');
  const [formSwapWith, setFormSwapWith] = useState('Dimas Prasetyo (Teknisi Listrik)');
  const [formSuccessMessage, setFormSuccessMessage] = useState(false);

  // Type definitions for UI
  const TYPE_CONFIG = {
    PERMIT: {
      label: language === 'id' ? 'Permit' : 'Permit',
      fullLabel: language === 'id' ? 'Permit (Izin/Cuti)' : 'Permit (Leave/Permit)',
      icon: FileText,
      color: '#059669',
      bgColor: '#ECFDF5',
      borderColor: '#A7F3D0',
      badgeBg: '#DEF7EC',
      badgeText: '#03543F',
    },
    MANUAL_ATTENDANCE: {
      label: language === 'id' ? 'Manual Attendance' : 'Manual Attendance',
      fullLabel: language === 'id' ? 'Presensi Manual' : 'Manual Attendance',
      icon: Clock,
      color: '#2563EB',
      bgColor: '#EFF6FF',
      borderColor: '#BFDBFE',
      badgeBg: '#E1EFFE',
      badgeText: '#1E429F',
    },
    OVERTIME: {
      label: language === 'id' ? 'Overtime' : 'Overtime',
      fullLabel: language === 'id' ? 'Lembur (Overtime)' : 'Overtime',
      icon: ClockCountdown,
      color: '#D97706',
      bgColor: '#FFFBEB',
      borderColor: '#FDE68A',
      badgeBg: '#FEF08A',
      badgeText: '#854D0E',
    },
    CHANGE_SHIFT: {
      label: language === 'id' ? 'Change Shift' : 'Change Shift',
      fullLabel: language === 'id' ? 'Tukar Shift' : 'Change Shift',
      icon: ArrowsLeftRight,
      color: '#7C3AED',
      bgColor: '#F5F3FF',
      borderColor: '#DDD6FE',
      badgeBg: '#EDEBFE',
      badgeText: '#5521B5',
    },
  };

  // Filter requests
  const filteredRequests = requests.filter((item) => {
    if (activeTab !== 'ALL' && item.type !== activeTab) return false;
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchId = item.id.toLowerCase().includes(q);
      const matchReason = item.reason?.toLowerCase().includes(q);
      if (!matchTitle && !matchId && !matchReason) return false;
    }
    return true;
  });

  // Handle Submit New Request
  const handleSubmitNew = (e) => {
    e.preventDefault();

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const prefixMap = {
      PERMIT: 'PRM',
      MANUAL_ATTENDANCE: 'MAT',
      OVERTIME: 'OVT',
      CHANGE_SHIFT: 'CSH',
    };

    let titleComputed = formTitle;
    let dateDisplayComputed = formDate;
    let durationComputed = '1 Hari';

    if (formType === 'PERMIT') {
      titleComputed = formTitle || `${formSubType} - ${formReason ? formReason.slice(0, 30) : 'Pengajuan Cuti'}`;
      dateDisplayComputed = `${formDate} - ${formEndDate}`;
      durationComputed = '2 Hari';
    } else if (formType === 'MANUAL_ATTENDANCE') {
      titleComputed = formTitle || `Presensi Manual (${formSubType})`;
      dateDisplayComputed = `${formDate} • ${formTime} WIB`;
      durationComputed = `${formSubType}: ${formTime}`;
    } else if (formType === 'OVERTIME') {
      titleComputed = formTitle || `Lembur - ${formReason ? formReason.slice(0, 30) : 'Tugas Khusus'}`;
      dateDisplayComputed = `${formDate} • ${formTime} - ${formEndTime}`;
      durationComputed = '3 Jam';
    } else if (formType === 'CHANGE_SHIFT') {
      titleComputed = formTitle || `Tukar Shift dengan ${formSwapWith.split(' ')[0]}`;
      dateDisplayComputed = `${formDate} (Shift Target)`;
      durationComputed = '1 Shift';
    }

    const newReq = {
      id: `REQ-${prefixMap[formType]}-2026-${randomNum}`,
      type: formType,
      subType: formSubType,
      title: titleComputed,
      dateDisplay: dateDisplayComputed,
      duration: durationComputed,
      submittedAt: '01 Okt 2026 • 11:25',
      status: 'PENDING',
      reason: formReason || 'Permohonan diajukan via aplikasi ProApps Mobile.',
      approver: 'Menunggu SPV Operasional',
      swapWith: formType === 'CHANGE_SHIFT' ? formSwapWith : null,
      attachment: null,
    };

    setRequests([newReq, ...requests]);
    setFormSuccessMessage(true);

    setTimeout(() => {
      setFormSuccessMessage(false);
      setIsNewModalOpen(false);
      // Reset form
      setFormTitle('');
      setFormReason('');
    }, 1200);
  };

  // Handle Team Approval Actions
  const handleApprove = (id) => {
    setTeamApprovals((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'APPROVED',
              approver: 'Anda (Manager)',
              approvedAt: 'Hari ini • Baru saja',
            }
          : item
      )
    );
    setToastMessage(language === 'id' ? 'Permohonan berhasil disetujui!' : 'Request successfully approved!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenReject = (item) => {
    setRejectModalItem(item);
    setRejectReasonInput('');
  };

  const handleConfirmReject = () => {
    if (!rejectModalItem) return;
    setTeamApprovals((prev) =>
      prev.map((item) =>
        item.id === rejectModalItem.id
          ? {
              ...item,
              status: 'REJECTED',
              approver: 'Anda (Manager)',
              rejectReason: rejectReasonInput.trim() || 'Permohonan ditolak oleh atasan.',
            }
          : item
      )
    );
    setRejectModalItem(null);
    setToastMessage(language === 'id' ? 'Permohonan telah ditolak.' : 'Request rejected.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter Team Approvals
  const filteredApprovals = teamApprovals.filter((item) => {
    if (approvalTab !== 'ALL' && item.status !== approvalTab) return false;
    if (approvalSearchQuery.trim()) {
      const q = approvalSearchQuery.toLowerCase();
      const matchName = item.employeeName.toLowerCase().includes(q);
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchRole = item.employeeRole.toLowerCase().includes(q);
      const matchReason = item.reason?.toLowerCase().includes(q);
      if (!matchName && !matchTitle && !matchRole && !matchReason) return false;
    }
    return true;
  });

  const pendingApprovalsCount = teamApprovals.filter((r) => r.status === 'PENDING').length;

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100%',
        backgroundColor: '#F8FAFC',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-sans)',
        color: '#1E293B',
      }}
    >
      {/* =========================================================================
          TOP HEADER
          ========================================================================= */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backgroundColor: '#053079',
          color: '#FFFFFF',
          padding: '14px 16px 14px 16px',
          boxShadow: '0 4px 20px rgba(5, 48, 121, 0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={onBack}
              style={{
                border: 'none',
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <CaretLeft size={22} weight="bold" />
            </button>
            <div>
              <h1 style={{ fontSize: '1.0625rem', fontWeight: 800, margin: 0, letterSpacing: '-0.01em' }}>
                {activeMode === 'REQUEST' ? 'Request Permission' : 'Request Approval'}
              </h1>
              <span style={{ fontSize: '0.6875rem', opacity: 0.85, fontWeight: 500 }}>
                {activeMode === 'REQUEST'
                  ? (language === 'id' ? 'Riwayat Permohonan & Izin Karyawan' : 'Request & Permission History')
                  : (language === 'id' ? 'Persetujuan Izin Anggota Tim' : 'Team Member Permission Approvals')}
              </span>
            </div>
          </div>
        </div>

        {/* Top Segmented Mode Switcher */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '12px',
            padding: '4px',
            marginTop: '12px',
            gap: '4px',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveMode('REQUEST')}
            style={{
              padding: '8px 10px',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: activeMode === 'REQUEST' ? '#FFFFFF' : 'transparent',
              color: activeMode === 'REQUEST' ? '#053079' : '#FFFFFF',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: activeMode === 'REQUEST' ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <FileText size={16} weight={activeMode === 'REQUEST' ? 'fill' : 'bold'} />
            <span>{language === 'id' ? 'Request Permission' : 'Request Permission'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('APPROVAL')}
            style={{
              padding: '8px 10px',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: activeMode === 'APPROVAL' ? '#FFFFFF' : 'transparent',
              color: activeMode === 'APPROVAL' ? '#053079' : '#FFFFFF',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: activeMode === 'APPROVAL' ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <CheckCircle size={16} weight={activeMode === 'APPROVAL' ? 'fill' : 'bold'} />
            <span>{language === 'id' ? 'Request Approval' : 'Request Approval'}</span>
            {pendingApprovalsCount > 0 && (
              <span
                style={{
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: '0.625rem',
                  fontWeight: 800,
                  padding: '1px 6px',
                  borderRadius: '10px',
                }}
              >
                {pendingApprovalsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* =========================================================================
          CONDITIONAL CONTENT: REQUEST MODE vs APPROVAL MODE
          ========================================================================= */}
      {activeMode === 'REQUEST' ? (
        <>
          {/* =========================================================================
              FILTER TYPE TABS (Horizontal Scroll)
          Permit, Manual Attendance, Overtime, Change Shift
          ========================================================================= */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          padding: '10px 14px',
          overflowX: 'auto',
          display: 'flex',
          gap: '8px',
          scrollbarWidth: 'none',
          position: 'sticky',
          top: '64px',
          zIndex: 30,
        }}
      >
        {[
          { id: 'ALL', label: language === 'id' ? 'Semua' : 'All', count: requests.length },
          { id: 'PERMIT', label: 'Permit', count: requests.filter((r) => r.type === 'PERMIT').length },
          { id: 'MANUAL_ATTENDANCE', label: 'Manual Attendance', count: requests.filter((r) => r.type === 'MANUAL_ATTENDANCE').length },
          { id: 'OVERTIME', label: 'Overtime', count: requests.filter((r) => r.type === 'OVERTIME').length },
          { id: 'CHANGE_SHIFT', label: 'Change Shift', count: requests.filter((r) => r.type === 'CHANGE_SHIFT').length },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                border: 'none',
                backgroundColor: isActive ? '#053079' : '#F1F5F9',
                color: isActive ? '#FFFFFF' : '#475569',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: isActive ? 700 : 600,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  fontSize: '0.625rem',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : '#E2E8F0',
                  color: isActive ? '#FFFFFF' : '#64748B',
                }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Status Filter Bar */}
      <div
        style={{
          padding: '12px 16px 6px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {/* Search Input */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <MagnifyingGlass
            size={16}
            color="#94A3B8"
            style={{ position: 'absolute', left: '10px', pointerEvents: 'none' }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'id' ? 'Cari ID, jenis, atau alasan...' : 'Search ID, type, or reason...'}
            style={{
              width: '100%',
              padding: '7px 12px 7px 32px',
              fontSize: '0.75rem',
              borderRadius: '10px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              color: '#1E293B',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Status Filter Dropdown / Pills */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '7px 10px',
            fontSize: '0.75rem',
            borderRadius: '10px',
            border: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
            color: '#334155',
            fontWeight: 600,
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="ALL">{language === 'id' ? 'Semua Status' : 'All Status'}</option>
          <option value="PENDING">{language === 'id' ? 'Menunggu' : 'Pending'}</option>
          <option value="APPROVED">{language === 'id' ? 'Disetujui' : 'Approved'}</option>
          <option value="REJECTED">{language === 'id' ? 'Ditolak' : 'Rejected'}</option>
        </select>
      </div>

      {/* =========================================================================
          LIST OF EMPLOYEE REQUESTS
          ========================================================================= */}
      <div
        style={{
          flex: 1,
          padding: '10px 16px 90px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {filteredRequests.length === 0 ? (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              marginTop: '12px',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
                color: '#94A3B8',
              }}
            >
              <FileText size={28} />
            </div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#334155', margin: '0 0 4px 0' }}>
              {language === 'id' ? 'Tidak Ada Permohonan Ditemukan' : 'No Requests Found'}
            </h4>
            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0 0 16px 0' }}>
              {language === 'id'
                ? 'Belum ada riwayat permohonan untuk kategori atau filter ini.'
                : 'No request history found for this category or filter.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveTab('ALL');
                setStatusFilter('ALL');
                setSearchQuery('');
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#053079',
                color: '#FFFFFF',
                borderRadius: '10px',
                border: 'none',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {language === 'id' ? 'Reset Filter' : 'Reset Filter'}
            </button>
          </div>
        ) : (
          filteredRequests.map((item) => {
            const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.PERMIT;
            const IconComponent = config.icon;

            // Status Badge
            const isApproved = item.status === 'APPROVED';
            const isPending = item.status === 'PENDING';
            const isRejected = item.status === 'REJECTED';

            return (
              <div
                key={item.id}
                onClick={() => setSelectedDetail(item)}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  padding: '14px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                  transition: 'transform 0.1s ease, box-shadow 0.1s ease',
                }}
              >
                {/* Header Row: Type Badge + Status Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      backgroundColor: config.bgColor,
                      border: `1px solid ${config.borderColor}`,
                      color: config.color,
                      padding: '3px 8px',
                      borderRadius: '8px',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                    }}
                  >
                    <IconComponent size={14} weight="bold" />
                    <span>{item.subType || config.label}</span>
                  </div>

                  {/* Status Badge */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 8px',
                      borderRadius: '8px',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      backgroundColor: isApproved ? '#DCFCE7' : isPending ? '#FEF3C7' : '#FEE2E2',
                      color: isApproved ? '#15803D' : isPending ? '#B45309' : '#B91C1C',
                    }}
                  >
                    {isApproved && <CheckCircle size={13} weight="fill" />}
                    {isPending && <Clock size={13} weight="fill" />}
                    {isRejected && <XCircle size={13} weight="fill" />}
                    <span>
                      {isApproved
                        ? (language === 'id' ? 'Disetujui' : 'Approved')
                        : isPending
                        ? (language === 'id' ? 'Menunggu' : 'Pending')
                        : (language === 'id' ? 'Ditolak' : 'Rejected')}
                    </span>
                  </div>
                </div>

                {/* Main Content: Title & Details */}
                <div>
                  <h3
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      color: '#0F172A',
                      margin: '0 0 4px 0',
                      lineHeight: 1.3,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: '#64748B',
                      margin: 0,
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {item.reason}
                  </p>
                </div>

                {/* Footer Info: Date / Time + ID */}
                <div
                  style={{
                    borderTop: '1px dashed #E2E8F0',
                    paddingTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.6875rem',
                    color: '#64748B',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#334155', fontWeight: 600 }}>
                    <CalendarCheck size={14} color="#02388A" weight="bold" />
                    <span>{item.dateDisplay}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94A3B8' }}>
                    <span>{item.id}</span>
                    <ArrowRight size={12} weight="bold" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* =========================================================================
          FIXED BOTTOM FOOTER: + Apply Request Permission (Full Button)
          ========================================================================= */}
      <div
        style={{
          position: 'sticky',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#FFFFFF',
          padding: '12px 16px 10px 16px',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.05)',
          borderTop: '1px solid #F1F5F9',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          zIndex: 35,
        }}
      >
        <button
          type="button"
          onClick={() => {
            setFormType('PERMIT');
            setFormSubType('Cuti Tahunan');
            setIsNewModalOpen(true);
          }}
          style={{
            width: '100%',
            height: '52px',
            backgroundColor: '#05192D',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '16px',
            fontSize: '0.9375rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(5, 25, 45, 0.22)',
            letterSpacing: '-0.01em',
            transition: 'transform 0.1s ease',
          }}
        >
          <Plus size={20} weight="bold" />
          <span>Apply Request Permission</span>
        </button>
      </div>
    </>
  ) : (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Approval Filter Tabs */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          padding: '10px 14px',
          overflowX: 'auto',
          display: 'flex',
          gap: '8px',
          scrollbarWidth: 'none',
          position: 'sticky',
          top: '112px',
          zIndex: 30,
        }}
      >
        {[
          { id: 'ALL', label: language === 'id' ? 'Semua' : 'All', count: teamApprovals.length },
          { id: 'PENDING', label: language === 'id' ? 'Perlu Review' : 'Need Review', count: pendingApprovalsCount },
          { id: 'APPROVED', label: language === 'id' ? 'Disetujui' : 'Approved', count: teamApprovals.filter((r) => r.status === 'APPROVED').length },
          { id: 'REJECTED', label: language === 'id' ? 'Ditolak' : 'Rejected', count: teamApprovals.filter((r) => r.status === 'REJECTED').length },
        ].map((tab) => {
          const isActive = approvalTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setApprovalTab(tab.id)}
              style={{
                border: 'none',
                backgroundColor: isActive ? '#053079' : '#F1F5F9',
                color: isActive ? '#FFFFFF' : '#475569',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: isActive ? 700 : 600,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  fontSize: '0.625rem',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : '#E2E8F0',
                  color: isActive ? '#FFFFFF' : '#64748B',
                }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Bar for Approvals */}
      <div style={{ padding: '12px 16px 6px 16px' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <MagnifyingGlass
            size={16}
            color="#94A3B8"
            style={{ position: 'absolute', left: '10px', pointerEvents: 'none' }}
          />
          <input
            type="text"
            value={approvalSearchQuery}
            onChange={(e) => setApprovalSearchQuery(e.target.value)}
            placeholder={language === 'id' ? 'Cari nama karyawan, jenis, atau alasan...' : 'Search employee, type, or reason...'}
            style={{
              width: '100%',
              padding: '7px 12px 7px 32px',
              fontSize: '0.75rem',
              borderRadius: '10px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              color: '#1E293B',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {approvalSearchQuery && (
            <button
              type="button"
              onClick={() => setApprovalSearchQuery('')}
              style={{
                position: 'absolute',
                right: '8px',
                border: 'none',
                background: 'transparent',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Approvals Cards List */}
      <div
        style={{
          padding: '10px 16px 40px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          flex: 1,
        }}
      >
        {filteredApprovals.length === 0 ? (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px dashed #CBD5E1',
              marginTop: '10px',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
                color: '#94A3B8',
              }}
            >
              <Users size={28} />
            </div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#334155', margin: '0 0 4px 0' }}>
              {language === 'id' ? 'Tidak Ada Permohonan Tim' : 'No Team Requests Found'}
            </h4>
            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>
              {language === 'id'
                ? 'Tidak ada permohonan tim yang cocok dengan filter saat ini.'
                : 'No team requests matching the current filter.'}
            </p>
          </div>
        ) : (
          filteredApprovals.map((item) => {
            const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.PERMIT;
            const IconComponent = config.icon;
            const isApproved = item.status === 'APPROVED';
            const isPending = item.status === 'PENDING';

            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                }}
              >
                {/* Header Row: Employee Info + Status Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={item.avatar}
                      alt={item.employeeName}
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '1.5px solid #E2E8F0',
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A' }}>
                        {item.employeeName}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: '#64748B', marginTop: '1px' }}>
                        {item.employeeRole} • {item.submittedAt}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '8px',
                      backgroundColor: isApproved ? '#DCFCE7' : isPending ? '#FEF3C7' : '#FEE2E2',
                      color: isApproved ? '#15803D' : isPending ? '#B45309' : '#B91C1C',
                    }}
                  >
                    {isApproved ? 'Disetujui' : isPending ? 'Perlu Review' : 'Ditolak'}
                  </span>
                </div>

                {/* Type Badge & Title */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: config.bgColor,
                        border: `1px solid ${config.borderColor}`,
                        color: config.color,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                      }}
                    >
                      <IconComponent size={12} weight="bold" />
                      <span>{item.subType}</span>
                    </div>
                    <span style={{ fontSize: '0.6875rem', color: '#94A3B8' }}>{item.id}</span>
                  </div>

                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B' }}>
                    {item.title}
                  </div>
                </div>

                {/* Date & Reason Box */}
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    fontSize: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0369A1', fontWeight: 600 }}>
                    <CalendarCheck size={14} weight="bold" />
                    <span>{item.dateDisplay} ({item.duration})</span>
                  </div>
                  <div style={{ color: '#475569', lineHeight: 1.4 }}>
                    <span style={{ fontWeight: 600, color: '#334155' }}>Alasan: </span>
                    {item.reason}
                  </div>
                  {item.attachment && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#2563EB', marginTop: '2px' }}>
                      <Paperclip size={13} weight="bold" />
                      <span style={{ textDecoration: 'underline', fontSize: '0.6875rem' }}>{item.attachment}</span>
                    </div>
                  )}
                </div>

                {/* Actions if Pending / Note if Decided */}
                {isPending ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '8px', marginTop: '2px' }}>
                    <button
                      type="button"
                      onClick={() => handleOpenReject(item)}
                      style={{
                        padding: '9px 12px',
                        borderRadius: '12px',
                        border: '1.5px solid #FCA5A5',
                        backgroundColor: '#FEF2F2',
                        color: '#DC2626',
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <X size={16} weight="bold" />
                      <span>{language === 'id' ? 'Tolak' : 'Reject'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(item.id)}
                      style={{
                        padding: '9px 12px',
                        borderRadius: '12px',
                        border: 'none',
                        backgroundColor: '#059669',
                        color: '#FFFFFF',
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Check size={16} weight="bold" />
                      <span>{language === 'id' ? 'Setujui' : 'Approve'}</span>
                    </button>
                  </div>
                ) : isApproved ? (
                  <div
                    style={{
                      backgroundColor: '#F0FDF4',
                      border: '1px solid #BBF7D0',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      fontSize: '0.6875rem',
                      color: '#15803D',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontWeight: 600,
                    }}
                  >
                    <CheckCircle size={15} weight="fill" />
                    <span>Telah disetujui oleh {item.approver} ({item.approvedAt})</span>
                  </div>
                ) : (
                  <div
                    style={{
                      backgroundColor: '#FEF2F2',
                      border: '1px solid #FECACA',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      fontSize: '0.6875rem',
                      color: '#B91C1C',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                      <XCircle size={15} weight="fill" />
                      <span>Permohonan Ditolak</span>
                    </div>
                    <span style={{ fontSize: '0.6875rem', color: '#7F1D1D' }}>
                      Alasan: {item.rejectReason}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  )}

      {/* =========================================================================
          MODAL: DETAIL REQUEST BOTTOM SHEET
          ========================================================================= */}
      {selectedDetail && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            backdropFilter: 'blur(3px)',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              padding: '20px',
              maxHeight: '85%',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>
                  {selectedDetail.id}
                </span>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {language === 'id' ? 'Detail Permohonan' : 'Request Detail'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDetail(null)}
                style={{
                  border: 'none',
                  background: '#F1F5F9',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748B',
                }}
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            {/* Type & Status Banner */}
            <div
              style={{
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: TYPE_CONFIG[selectedDetail.type]?.bgColor || '#F1F5F9',
                border: `1px solid ${TYPE_CONFIG[selectedDetail.type]?.borderColor || '#E2E8F0'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>
                  {language === 'id' ? 'Kategori Permohonan' : 'Request Category'}
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 800, color: TYPE_CONFIG[selectedDetail.type]?.color }}>
                  {selectedDetail.subType} ({TYPE_CONFIG[selectedDetail.type]?.label})
                </div>
              </div>
              <div
                style={{
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor:
                    selectedDetail.status === 'APPROVED' ? '#DCFCE7' : selectedDetail.status === 'PENDING' ? '#FEF3C7' : '#FEE2E2',
                  color:
                    selectedDetail.status === 'APPROVED' ? '#15803D' : selectedDetail.status === 'PENDING' ? '#B45309' : '#B91C1C',
                }}
              >
                {selectedDetail.status === 'APPROVED'
                  ? (language === 'id' ? 'Disetujui' : 'Approved')
                  : selectedDetail.status === 'PENDING'
                  ? (language === 'id' ? 'Menunggu Persetujuan' : 'Pending Approval')
                  : (language === 'id' ? 'Ditolak' : 'Rejected')}
              </div>
            </div>

            {/* Information Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.8125rem' }}>
              <div>
                <div style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>
                  {language === 'id' ? 'Judul Permohonan' : 'Title'}
                </div>
                <div style={{ fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>{selectedDetail.title}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>
                  {language === 'id' ? 'Tanggal / Waktu Pelaksanaan' : 'Scheduled Date / Time'}
                </div>
                <div style={{ fontWeight: 600, color: '#1E293B', marginTop: '2px' }}>
                  {selectedDetail.dateDisplay} ({selectedDetail.duration})
                </div>
              </div>

              {selectedDetail.swapWith && (
                <div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>
                    {language === 'id' ? 'Tukar Shift Dengan' : 'Swap Shift With'}
                  </div>
                  <div style={{ fontWeight: 600, color: '#1E293B', marginTop: '2px' }}>
                    {selectedDetail.swapWith}
                  </div>
                </div>
              )}

              {selectedDetail.location && (
                <div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>
                    {language === 'id' ? 'Lokasi Presensi' : 'Attendance Location'}
                  </div>
                  <div style={{ fontWeight: 600, color: '#1E293B', marginTop: '2px' }}>
                    {selectedDetail.location}
                  </div>
                </div>
              )}

              <div>
                <div style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>
                  {language === 'id' ? 'Alasan / Keterangan' : 'Reason / Notes'}
                </div>
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    color: '#334155',
                    marginTop: '4px',
                    lineHeight: 1.4,
                  }}
                >
                  {selectedDetail.reason}
                </div>
              </div>

              {selectedDetail.rejectReason && (
                <div>
                  <div style={{ fontSize: '0.6875rem', color: '#DC2626', fontWeight: 700 }}>
                    {language === 'id' ? 'Alasan Penolakan' : 'Rejection Reason'}
                  </div>
                  <div
                    style={{
                      backgroundColor: '#FEF2F2',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid #FECACA',
                      color: '#B91C1C',
                      marginTop: '4px',
                      lineHeight: 1.4,
                    }}
                  >
                    {selectedDetail.rejectReason}
                  </div>
                </div>
              )}

              {selectedDetail.attachment && (
                <div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>
                    {language === 'id' ? 'Lampiran Dokumen' : 'Attachment'}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      backgroundColor: '#F1F5F9',
                      borderRadius: '8px',
                      marginTop: '4px',
                      color: '#02388A',
                      fontWeight: 600,
                    }}
                  >
                    <Paperclip size={16} />
                    <span>{selectedDetail.attachment}</span>
                  </div>
                </div>
              )}

              {/* Approval Info */}
              <div
                style={{
                  borderTop: '1px solid #E2E8F0',
                  paddingTop: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#64748B' }}>
                  <span>{language === 'id' ? 'Diajukan Pada' : 'Submitted At'}</span>
                  <span style={{ fontWeight: 600, color: '#334155' }}>{selectedDetail.submittedAt}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#64748B' }}>
                  <span>{language === 'id' ? 'Verifikator / SPV' : 'Reviewer / SPV'}</span>
                  <span style={{ fontWeight: 600, color: '#334155' }}>{selectedDetail.approver}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              {selectedDetail.status === 'PENDING' && (
                <button
                  type="button"
                  onClick={() => {
                    setRequests(requests.filter((r) => r.id !== selectedDetail.id));
                    setSelectedDetail(null);
                  }}
                  style={{
                    flex: 1,
                    padding: '11px',
                    borderRadius: '10px',
                    backgroundColor: '#FEE2E2',
                    color: '#DC2626',
                    border: 'none',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {language === 'id' ? 'Batalkan Permohonan' : 'Cancel Request'}
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedDetail(null)}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: '10px',
                  backgroundColor: '#053079',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {language === 'id' ? 'Tutup' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: AJUKAN PERMOHONAN BARU (NEW REQUEST)
          Supports 4 types: Permit, Manual Attendance, Overtime, Change Shift
          ========================================================================= */}
      {isNewModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            backdropFilter: 'blur(3px)',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              padding: '20px',
              maxHeight: '90%',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={20} color="#09B2FF" weight="bold" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {language === 'id' ? 'Formulir Permohonan Karyawan' : 'New Employee Request'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                style={{
                  border: 'none',
                  background: '#F1F5F9',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748B',
                }}
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            {formSuccessMessage ? (
              <div
                style={{
                  padding: '30px 10px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#DCFCE7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#16A34A',
                  }}
                >
                  <Check size={32} weight="bold" />
                </div>
                <h4 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#15803D', margin: 0 }}>
                  {language === 'id' ? 'Permohonan Berhasil Dikirim!' : 'Request Successfully Submitted!'}
                </h4>
                <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: 0 }}>
                  {language === 'id'
                    ? 'Pengajuan Anda telah masuk ke daftar riwayat dan diteruskan ke SPV untuk persetujuan.'
                    : 'Your request has been added to history and sent to SPV for review.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitNew} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* 1. Pilih Jenis Permohonan (4 Tipe) */}
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>
                    {language === 'id' ? 'Pilih Tipe Permohonan' : 'Select Request Type'} *
                  </label>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '8px',
                      marginTop: '6px',
                    }}
                  >
                    {[
                      { id: 'PERMIT', label: 'Permit', desc: language === 'id' ? 'Izin, Cuti, Sakit' : 'Leave, Sick, Permit', icon: FileText, color: '#059669' },
                      { id: 'MANUAL_ATTENDANCE', label: 'Manual Attendance', desc: language === 'id' ? 'Presensi Manual / Koreksi' : 'Manual Clock Correction', icon: Clock, color: '#2563EB' },
                      { id: 'OVERTIME', label: 'Overtime', desc: language === 'id' ? 'Lembur Pekerjaan' : 'Work Overtime', icon: ClockCountdown, color: '#D97706' },
                      { id: 'CHANGE_SHIFT', label: 'Change Shift', desc: language === 'id' ? 'Tukar / Ganti Shift' : 'Shift Swap / Replacement', icon: ArrowsLeftRight, color: '#7C3AED' },
                    ].map((t) => {
                      const isSelected = formType === t.id;
                      const IconCmp = t.icon;
                      return (
                        <div
                          key={t.id}
                          onClick={() => {
                            setFormType(t.id);
                            if (t.id === 'PERMIT') setFormSubType('Cuti Tahunan');
                            if (t.id === 'MANUAL_ATTENDANCE') setFormSubType('Lupa Clock Out');
                            if (t.id === 'OVERTIME') setFormSubType('Lembur Hari Kerja');
                            if (t.id === 'CHANGE_SHIFT') setFormSubType('Tukar Shift');
                          }}
                          style={{
                            padding: '10px 10px',
                            borderRadius: '12px',
                            border: isSelected ? `2px solid ${t.color}` : '1.5px solid #E2E8F0',
                            backgroundColor: isSelected ? '#FFFFFF' : '#F8FAFC',
                            boxShadow: isSelected ? '0 4px 12px rgba(0, 0, 0, 0.06)' : 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '8px',
                                backgroundColor: isSelected ? t.color : '#E2E8F0',
                                color: isSelected ? '#FFFFFF' : '#64748B',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <IconCmp size={16} weight="bold" />
                            </div>
                            {isSelected && (
                              <div
                                style={{
                                  width: '16px',
                                  height: '16px',
                                  borderRadius: '50%',
                                  backgroundColor: t.color,
                                  color: '#FFFFFF',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '10px',
                                }}
                              >
                                ✓
                              </div>
                            )}
                          </div>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: isSelected ? '#0F172A' : '#475569' }}>
                            {t.label}
                          </div>
                          <div style={{ fontSize: '0.625rem', color: '#94A3B8' }}>{t.desc}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Sub-Category selector based on formType */}
                {formType === 'PERMIT' && (
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>
                      {language === 'id' ? 'Kategori Izin / Cuti' : 'Permit Category'}
                    </label>
                    <select
                      value={formSubType}
                      onChange={(e) => setFormSubType(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '10px',
                        border: '1px solid #E2E8F0',
                        fontSize: '0.8125rem',
                        marginTop: '4px',
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      <option value="Cuti Tahunan">{language === 'id' ? 'Cuti Tahunan (Annual Leave)' : 'Annual Leave'}</option>
                      <option value="Sakit">{language === 'id' ? 'Sakit (Sick Leave)' : 'Sick Leave'}</option>
                      <option value="Izin Khusus">{language === 'id' ? 'Izin Khusus / Penting' : 'Special Permit'}</option>
                      <option value="Cuti Melahirkan/Menikah">{language === 'id' ? 'Cuti Menikah / Melahirkan' : 'Maternity / Marriage Leave'}</option>
                    </select>
                  </div>
                )}

                {formType === 'MANUAL_ATTENDANCE' && (
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>
                      {language === 'id' ? 'Jenis Koreksi Presensi' : 'Correction Type'}
                    </label>
                    <select
                      value={formSubType}
                      onChange={(e) => setFormSubType(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '10px',
                        border: '1px solid #E2E8F0',
                        fontSize: '0.8125rem',
                        marginTop: '4px',
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      <option value="Lupa Clock In">{language === 'id' ? 'Lupa Clock In (Datang)' : 'Forgot Clock In'}</option>
                      <option value="Lupa Clock Out">{language === 'id' ? 'Lupa Clock Out (Pulang)' : 'Forgot Clock Out'}</option>
                      <option value="Kendala GPS / Scanner">{language === 'id' ? 'Kendala Teknis GPS / Scanner' : 'GPS / Scanner Technical Issue'}</option>
                    </select>
                  </div>
                )}

                {formType === 'OVERTIME' && (
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>
                      {language === 'id' ? 'Kategori Lembur' : 'Overtime Category'}
                    </label>
                    <select
                      value={formSubType}
                      onChange={(e) => setFormSubType(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '10px',
                        border: '1px solid #E2E8F0',
                        fontSize: '0.8125rem',
                        marginTop: '4px',
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      <option value="Lembur Hari Kerja">{language === 'id' ? 'Lembur Hari Kerja (Weekday)' : 'Weekday Overtime'}</option>
                      <option value="Lembur Hari Libur">{language === 'id' ? 'Lembur Hari Libur (Weekend / Holiday)' : 'Weekend / Holiday Overtime'}</option>
                      <option value="Tugas Darurat / On-Call">{language === 'id' ? 'Tugas Darurat / On-Call' : 'Emergency / On-Call Task'}</option>
                    </select>
                  </div>
                )}

                {formType === 'CHANGE_SHIFT' && (
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>
                      {language === 'id' ? 'Pilih Rekan Kerja untuk Tukar Shift' : 'Colleague to Swap With'}
                    </label>
                    <select
                      value={formSwapWith}
                      onChange={(e) => setFormSwapWith(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '10px',
                        border: '1px solid #E2E8F0',
                        fontSize: '0.8125rem',
                        marginTop: '4px',
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      <option value="Dimas Prasetyo (Teknisi Listrik)">Dimas Prasetyo (Teknisi Listrik)</option>
                      <option value="Agus Saputra (Teknisi Sipil & AC)">Agus Saputra (Teknisi Sipil & AC)</option>
                      <option value="Siti Rahma (Security Leader)">Siti Rahma (Security Leader)</option>
                      <option value="Rian Hidayat (Housekeeping)">Rian Hidayat (Housekeeping)</option>
                    </select>
                  </div>
                )}

                {/* Tanggal & Waktu Inputs */}
                <div style={{ display: 'grid', gridTemplateColumns: formType === 'PERMIT' ? '1fr 1fr' : '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>
                      {formType === 'CHANGE_SHIFT'
                        ? (language === 'id' ? 'Tanggal Shift Anda' : 'Your Shift Date')
                        : (language === 'id' ? 'Tanggal Mulai' : 'Start Date')}
                    </label>
                    <input
                      type="text"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      placeholder="02 Okt 2026"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '10px',
                        border: '1px solid #E2E8F0',
                        fontSize: '0.8125rem',
                        marginTop: '4px',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>
                      {formType === 'PERMIT'
                        ? (language === 'id' ? 'Tanggal Selesai' : 'End Date')
                        : formType === 'OVERTIME'
                        ? (language === 'id' ? 'Jam (Mulai - Selesai)' : 'Hours (Start - End)')
                        : formType === 'CHANGE_SHIFT'
                        ? (language === 'id' ? 'Tanggal Tukar' : 'Target Date')
                        : (language === 'id' ? 'Jam Presensi' : 'Time')}
                    </label>
                    {formType === 'PERMIT' ? (
                      <input
                        type="text"
                        value={formEndDate}
                        onChange={(e) => setFormEndDate(e.target.value)}
                        placeholder="03 Okt 2026"
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: '10px',
                          border: '1px solid #E2E8F0',
                          fontSize: '0.8125rem',
                          marginTop: '4px',
                          boxSizing: 'border-box',
                        }}
                      />
                    ) : (
                      <input
                        type="text"
                        value={formType === 'OVERTIME' ? `${formTime} - ${formEndTime}` : formTime}
                        onChange={(e) => setFormTime(e.target.value)}
                        placeholder="08:00 WIB"
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: '10px',
                          border: '1px solid #E2E8F0',
                          fontSize: '0.8125rem',
                          marginTop: '4px',
                          boxSizing: 'border-box',
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Alasan / Keterangan */}
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>
                    {language === 'id' ? 'Alasan / Uraian Tugas' : 'Reason / Task Description'} *
                  </label>
                  <textarea
                    rows={3}
                    value={formReason}
                    onChange={(e) => setFormReason(e.target.value)}
                    required
                    placeholder={
                      formType === 'PERMIT'
                        ? 'Tuliskan alasan pengajuan cuti/izin...'
                        : formType === 'MANUAL_ATTENDANCE'
                        ? 'Jelaskan mengapa melakukan presensi manual...'
                        : formType === 'OVERTIME'
                        ? 'Jelaskan rincian pekerjaan lembur yang dikerjakan...'
                        : 'Jelaskan alasan tukar jadwal shift...'
                    }
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                      fontSize: '0.8125rem',
                      marginTop: '4px',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                {/* Upload attachment simulation */}
                <div
                  style={{
                    border: '1.5px dashed #CBD5E1',
                    borderRadius: '10px',
                    padding: '12px',
                    textAlign: 'center',
                    backgroundColor: '#F8FAFC',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    color: '#64748B',
                    fontSize: '0.75rem',
                  }}
                >
                  <Paperclip size={16} />
                  <span>
                    {language === 'id'
                      ? 'Upload Bukti / Surat Dokter (Opsional)'
                      : 'Upload Evidence / Doctor Letter (Optional)'}
                  </span>
                </div>

                {/* Submit CTA Button */}
                <button
                  type="submit"
                  style={{
                    marginTop: '4px',
                    width: '100%',
                    height: '46px',
                    backgroundColor: '#053079',
                    color: '#FFFFFF',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(5, 48, 121, 0.25)',
                  }}
                >
                  {language === 'id' ? 'Kirim Permohonan Sekarang' : 'Submit Request Now'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: REJECT CONFIRMATION BOTTOM SHEET
          ========================================================================= */}
      {rejectModalItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            backdropFilter: 'blur(3px)',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              padding: '20px 20px 28px 20px',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#FEE2E2',
                    color: '#DC2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <XCircle size={20} weight="fill" />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                  {language === 'id' ? 'Tolak Permohonan' : 'Reject Request'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRejectModalItem(null)}
                style={{
                  border: 'none',
                  backgroundColor: '#F1F5F9',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748B',
                }}
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            <p style={{ fontSize: '0.8125rem', color: '#475569', margin: '0 0 12px 0' }}>
              {language === 'id'
                ? `Apakah Anda yakin ingin menolak permohonan dari ${rejectModalItem.employeeName} (${rejectModalItem.subType})?`
                : `Are you sure you want to reject the request from ${rejectModalItem.employeeName}?`}
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                {language === 'id' ? 'Catatan / Alasan Penolakan' : 'Rejection Reason'}
              </label>
              <textarea
                rows={3}
                value={rejectReasonInput}
                onChange={(e) => setRejectReasonInput(e.target.value)}
                placeholder={
                  language === 'id'
                    ? 'Tuliskan alasan penolakan untuk karyawan (opsional)...'
                    : 'Enter rejection reason (optional)...'
                }
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '0.8125rem',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  resize: 'none',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setRejectModalItem(null)}
                style={{
                  padding: '11px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#F8FAFC',
                  color: '#475569',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {language === 'id' ? 'Batal' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                style={{
                  padding: '11px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)',
                }}
              >
                {language === 'id' ? 'Konfirmasi Tolak' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TOAST NOTIFICATION
          ========================================================================= */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            padding: '10px 20px',
            borderRadius: '24px',
            fontSize: '0.8125rem',
            fontWeight: 700,
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 99999,
          }}
        >
          <CheckCircle size={18} color="#34D399" weight="fill" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default EmployeePermissionView;
