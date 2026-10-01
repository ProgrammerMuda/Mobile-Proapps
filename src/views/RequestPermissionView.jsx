import React, { useState } from 'react';
import { createPortal } from 'react-dom';
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
  MagnifyingGlass,
  FunnelSimple,
  CalendarCheck,
  User,
  Paperclip,
  Check,
  Info,
  CalendarBlank,
  Buildings,
  ArrowRight,
} from '@phosphor-icons/react';
import { useLanguage } from '../context/LanguageContext';

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

export const RequestPermissionView = ({ onBack, user }) => {
  const { language } = useLanguage();

  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [activeTab, setActiveTab] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const hasActiveFilter = activeTab !== 'ALL' || statusFilter !== 'ALL';
  const activeFiltersCount = (activeTab !== 'ALL' ? 1 : 0) + (statusFilter !== 'ALL' ? 1 : 0);

  // New Request Modal state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [formType, setFormType] = useState('PERMIT');
  const [formSubType, setFormSubType] = useState('Cuti Tahunan');
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('02 Okt 2026');
  const [formEndDate, setFormEndDate] = useState('03 Okt 2026');
  const [formTime, setFormTime] = useState('08:00');
  const [formEndTime, setFormEndTime] = useState('17:00');
  const [formReason, setFormReason] = useState('');
  const [formSwapWith, setFormSwapWith] = useState('Dimas Prasetyo (Teknisi Listrik)');
  const [formSuccessMessage, setFormSuccessMessage] = useState(false);

  const TYPE_CONFIG = {
    PERMIT: {
      label: 'Permit',
      fullLabel: language === 'id' ? 'Permit (Izin/Cuti)' : 'Permit (Leave/Permit)',
      icon: FileText,
      color: '#059669',
      bgColor: '#ECFDF5',
      borderColor: '#A7F3D0',
    },
    MANUAL_ATTENDANCE: {
      label: language === 'id' ? 'Presensi Manual' : 'Manual Clock',
      fullLabel: language === 'id' ? 'Presensi Manual (Koreksi)' : 'Manual Attendance Correction',
      icon: Clock,
      color: '#0284C7',
      bgColor: '#F0F9FF',
      borderColor: '#BAE6FD',
    },
    OVERTIME: {
      label: language === 'id' ? 'Lembur' : 'Overtime',
      fullLabel: language === 'id' ? 'Lembur (Overtime)' : 'Overtime Request',
      icon: ClockCountdown,
      color: '#D97706',
      bgColor: '#FFFBEB',
      borderColor: '#FDE68A',
    },
    CHANGE_SHIFT: {
      label: language === 'id' ? 'Tukar Shift' : 'Change Shift',
      fullLabel: language === 'id' ? 'Tukar Shift (Shift Swap)' : 'Shift Swap Request',
      icon: ArrowsLeftRight,
      color: '#7C3AED',
      bgColor: '#F5F3FF',
      borderColor: '#DDD6FE',
    },
  };

  const filteredRequests = requests.filter((item) => {
    if (activeTab !== 'ALL' && item.type !== activeTab) return false;
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSubType = item.subType.toLowerCase().includes(q);
      const matchReason = item.reason.toLowerCase().includes(q);
      const matchId = item.id.toLowerCase().includes(q);
      if (!matchTitle && !matchSubType && !matchReason && !matchId) return false;
    }
    return true;
  });

  const handleCreateRequest = (e) => {
    e.preventDefault();
    const newId = `REQ-${formType.substring(0, 3)}-2026-00${Math.floor(Math.random() * 90) + 10}`;
    const newEntry = {
      id: newId,
      type: formType,
      subType: formSubType,
      title: formTitle || `${formSubType} - Baru`,
      dateDisplay: formType === 'PERMIT' ? `${formDate} - ${formEndDate}` : formDate,
      duration: formType === 'PERMIT' ? '2 Hari' : formType === 'OVERTIME' ? '2 Jam' : '1 Kali',
      submittedAt: 'Hari ini • Baru saja',
      status: 'PENDING',
      reason: formReason || 'Permohonan baru yang diajukan oleh karyawan.',
      approver: 'Menunggu SPV Operasional',
      swapWith: formType === 'CHANGE_SHIFT' ? formSwapWith : undefined,
    };

    setRequests([newEntry, ...requests]);
    setFormSuccessMessage(true);
    setTimeout(() => {
      setFormSuccessMessage(false);
      setIsNewModalOpen(false);
      setFormTitle('');
      setFormReason('');
    }, 1200);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        backgroundColor: '#F8FAFC',
        color: '#1E293B',
        fontFamily: 'Inter, -apple-system, sans-serif',
      }}
    >
      {/* Top Header Bar with Integrated Search & Filter */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          padding: '12px 16px 14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxSizing: 'border-box',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
        }}
      >
        {/* Row 1: Back Button & Title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            minHeight: '36px',
          }}
        >
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            style={{
              border: 'none',
              background: 'transparent',
              color: '#0F172A',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <CaretLeft size={22} weight="bold" />
          </button>

          <h1
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '1.0625rem',
              fontWeight: 700,
              color: '#0F172A',
              margin: 0,
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
              textAlign: 'center',
            }}
          >
            {language === 'id' ? 'Request Permission' : 'Request Permission'}
          </h1>

          <div style={{ width: '36px' }} />
        </div>

        {/* Row 2: Search Input & Filter Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          {/* Search Box */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
              height: '44px',
              backgroundColor: '#F8FAFC',
              borderRadius: '12px',
              border: '1px solid #F1F5F9',
              display: 'flex',
              alignItems: 'center',
              padding: '0 14px',
              gap: '10px',
              boxSizing: 'border-box',
            }}
          >
            <MagnifyingGlass size={18} weight="bold" color="#64748B" style={{ flexShrink: 0 }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'id' ? 'Cari ID, jenis, atau alasan...' : 'Find request number, type, reason...'}
              style={{
                flex: 1,
                minWidth: 0,
                width: '100%',
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '0.8125rem',
                color: '#1E293B',
                fontFamily: 'inherit',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                <X size={16} weight="bold" />
              </button>
            )}
          </div>

          {/* Filter Button (Square Rounded with FunnelSimple) */}
          <button
            type="button"
            onClick={() => {
              setTempActiveTab(activeTab);
              setTempStatusFilter(statusFilter);
              setIsFilterModalOpen(true);
            }}
            aria-label="Filter"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: hasActiveFilter ? '#053079' : '#FFFFFF',
              border: hasActiveFilter ? '1px solid #053079' : '1px solid #E2E8F0',
              color: hasActiveFilter ? '#FFFFFF' : '#334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              position: 'relative',
              boxShadow: 'none',
              transition: 'all 0.15s ease',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.94)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="7" y1="12" x2="17" y2="12" />
              <line x1="10" y1="18" x2="14" y2="18" />
            </svg>
            {hasActiveFilter && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  minWidth: '18px',
                  height: '18px',
                  borderRadius: '9999px',
                  backgroundColor: '#09B2FF',
                  color: '#FFFFFF',
                  fontSize: '0.625rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                  border: '2px solid #FFFFFF',
                }}
              >
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Row 3: Active Filter Badges (Only shown when filters are active) */}
        {hasActiveFilter && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flexWrap: 'wrap',
              paddingTop: '2px',
            }}
          >
            <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>
              {language === 'id' ? 'Filter aktif:' : 'Active filters:'}
            </span>
            {activeTab !== 'ALL' && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  backgroundColor: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  color: '#1D4ED8',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                }}
              >
                <span>
                  {activeTab === 'PERMIT'
                    ? 'Permit'
                    : activeTab === 'MANUAL_ATTENDANCE'
                    ? (language === 'id' ? 'Presensi Manual' : 'Manual Clock')
                    : activeTab === 'OVERTIME'
                    ? (language === 'id' ? 'Lembur' : 'Overtime')
                    : (language === 'id' ? 'Tukar Shift' : 'Change Shift')}
                </span>
                <X
                  size={12}
                  weight="bold"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setActiveTab('ALL')}
                />
              </span>
            )}
            {statusFilter !== 'ALL' && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  backgroundColor: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  color: '#1D4ED8',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                }}
              >
                <span>
                  {statusFilter === 'PENDING'
                    ? (language === 'id' ? 'Menunggu' : 'Pending')
                    : statusFilter === 'APPROVED'
                    ? (language === 'id' ? 'Disetujui' : 'Approved')
                    : (language === 'id' ? 'Ditolak' : 'Rejected')}
                </span>
                <X
                  size={12}
                  weight="bold"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setStatusFilter('ALL')}
                />
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setActiveTab('ALL');
                setStatusFilter('ALL');
              }}
              style={{
                border: 'none',
                background: 'none',
                color: '#EF4444',
                fontSize: '0.6875rem',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '2px 4px',
              }}
            >
              {language === 'id' ? 'Reset Semua' : 'Clear All'}
            </button>
          </div>
        )}
      </header>

      {/* Requests Cards List */}
      <div
        style={{
          padding: '14px 16px 80px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          flex: 1,
        }}
      >
        {filteredRequests.length === 0 ? (
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
              <FileText size={28} />
            </div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#334155', margin: '0 0 4px 0' }}>
              {language === 'id' ? 'Tidak Ada Permohonan' : 'No Requests Found'}
            </h4>
            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>
              {language === 'id'
                ? 'Belum ada data permohonan yang sesuai dengan filter ini.'
                : 'No permission requests match your current filter.'}
            </p>
          </div>
        ) : (
          filteredRequests.map((item) => {
            const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.PERMIT;
            const IconComponent = config.icon;
            const isApproved = item.status === 'APPROVED';
            const isPending = item.status === 'PENDING';

            return (
              <div
                key={item.id}
                onClick={() => setSelectedDetail(item)}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  padding: '14px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                }}
              >
                {/* Top Row: Type Badge + Status Badge */}
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
                    <IconComponent size={13} weight="bold" />
                    <span>{item.subType}</span>
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
                    {isApproved ? (
                      <CheckCircle size={12} weight="fill" />
                    ) : isPending ? (
                      <Clock size={12} weight="fill" />
                    ) : (
                      <XCircle size={12} weight="fill" />
                    )}
                    <span>
                      {isApproved
                        ? (language === 'id' ? 'Disetujui' : 'Approved')
                        : isPending
                        ? (language === 'id' ? 'Menunggu' : 'Pending')
                        : (language === 'id' ? 'Ditolak' : 'Rejected')}
                    </span>
                  </div>
                </div>

                {/* Title & Reason */}
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A', margin: '0 0 3px 0' }}>
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: '#64748B',
                      margin: 0,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.35,
                    }}
                  >
                    {item.reason}
                  </p>
                </div>

                {/* Date & Extra Info Pill */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '6px',
                    borderTop: '1px solid #F1F5F9',
                    fontSize: '0.6875rem',
                    color: '#64748B',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CalendarCheck size={14} color="#0284C7" />
                    <span style={{ fontWeight: 600, color: '#334155' }}>{item.dateDisplay}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ backgroundColor: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                      {item.duration}
                    </span>
                    <ArrowRight size={13} color="#94A3B8" />
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
          padding: '12px 16px 14px 16px',
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
            backgroundColor: '#053079',
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
            boxShadow: '0 4px 16px rgba(5, 48, 121, 0.28)',
            letterSpacing: '-0.01em',
            transition: 'transform 0.1s ease',
          }}
        >
          <Plus size={20} weight="bold" />
          <span>Apply Request Permission</span>
        </button>
      </div>

      {/* =========================================================================
          MODAL: DETAIL PERMOHONAN (DETAIL MODAL)
          ========================================================================= */}
      {selectedDetail && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
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
              gap: '14px',
              boxShadow: '0 -8px 30px rgba(0, 0, 0, 0.15)',
            }}
          >
            {/* Header Modal */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>
                  {language === 'id' ? 'Detail Permohonan' : 'Request Detail'}
                </span>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {selectedDetail.id}
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
                  padding: '40px 20px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#DCFCE7',
                    color: '#16A34A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Check size={32} weight="bold" />
                </div>
                <h4 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {language === 'id' ? 'Permohonan Berhasil Dikirim!' : 'Request Successfully Submitted!'}
                </h4>
                <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: 0 }}>
                  {language === 'id'
                    ? 'Pengajuan Anda telah diteruskan ke atasan untuk ditinjau.'
                    : 'Your request has been forwarded to your supervisor for review.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateRequest} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* 1. Pilih Jenis Permohonan (4 Cards) */}
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '8px' }}>
                    {language === 'id' ? 'Pilih Jenis Permohonan' : 'Select Request Type'}
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {[
                      { id: 'PERMIT', label: 'Permit (Izin/Cuti)', subTypes: ['Cuti Tahunan', 'Sakit', 'Izin Penting', 'Cuti Khusus'] },
                      { id: 'MANUAL_ATTENDANCE', label: 'Presensi Manual', subTypes: ['Lupa Clock In', 'Lupa Clock Out', 'Error GPS / Jaringan'] },
                      { id: 'OVERTIME', label: 'Lembur', subTypes: ['Lembur Hari Kerja', 'Lembur Hari Libur', 'Penugasan Khusus'] },
                      { id: 'CHANGE_SHIFT', label: 'Tukar Shift', subTypes: ['Tukar Shift', 'Ganti Hari Kerja'] },
                    ].map((t) => {
                      const isSelected = formType === t.id;
                      const cfg = TYPE_CONFIG[t.id];
                      const Icon = cfg.icon;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            setFormType(t.id);
                            setFormSubType(t.subTypes[0]);
                          }}
                          style={{
                            border: isSelected ? '1.5px solid #053079' : '1px solid #E2E8F0',
                            backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                            borderRadius: '12px',
                            padding: '10px 8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            textAlign: 'left',
                          }}
                        >
                          <div
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '8px',
                              backgroundColor: cfg.bgColor,
                              color: cfg.color,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <Icon size={16} weight="bold" />
                          </div>
                          <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: isSelected ? '#053079' : '#334155', lineHeight: 1.2 }}>
                            {t.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Sub Type Selector */}
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    {language === 'id' ? 'Kategori / Sub-jenis' : 'Sub-category'}
                  </label>
                  <select
                    value={formSubType}
                    onChange={(e) => setFormSubType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: '#1E293B',
                      backgroundColor: '#FFFFFF',
                      outline: 'none',
                    }}
                  >
                    {formType === 'PERMIT' && (
                      <>
                        <option value="Cuti Tahunan">Cuti Tahunan (Annual Leave)</option>
                        <option value="Sakit">Sakit (Sick Leave)</option>
                        <option value="Izin Penting">Izin Penting / Keperluan Pribadi</option>
                        <option value="Cuti Khusus">Cuti Khusus (Menikah/Melahirkan)</option>
                      </>
                    )}
                    {formType === 'MANUAL_ATTENDANCE' && (
                      <>
                        <option value="Lupa Clock In">Lupa Clock In</option>
                        <option value="Lupa Clock Out">Lupa Clock Out</option>
                        <option value="Error GPS / Jaringan">Error GPS / Jaringan Handphone</option>
                      </>
                    )}
                    {formType === 'OVERTIME' && (
                      <>
                        <option value="Lembur Hari Kerja">Lembur Hari Kerja (Weekday Overtime)</option>
                        <option value="Lembur Hari Libur">Lembur Hari Libur (Weekend / Holiday)</option>
                        <option value="Penugasan Khusus">Penugasan Darurat / Khusus</option>
                      </>
                    )}
                    {formType === 'CHANGE_SHIFT' && (
                      <>
                        <option value="Tukar Shift">Tukar Shift dengan Rekan Kerja</option>
                        <option value="Ganti Hari Kerja">Ganti Hari Kerja (Off Day Swap)</option>
                      </>
                    )}
                  </select>
                </div>

                {/* 3. Judul / Ringkasan */}
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    {language === 'id' ? 'Judul / Perihal Permohonan' : 'Request Subject / Title'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder={
                      language === 'id'
                        ? 'Contoh: Izin Cuti Tahunan 3 Hari'
                        : 'e.g., 3 Days Annual Leave Request'
                    }
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.8125rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* 4. Tanggal & Waktu */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                      {formType === 'PERMIT'
                        ? (language === 'id' ? 'Tanggal Mulai' : 'Start Date')
                        : (language === 'id' ? 'Tanggal Pelaksanaan' : 'Date')}
                    </label>
                    <input
                      type="text"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      placeholder="DD MMM YYYY"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.8125rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                      {formType === 'PERMIT'
                        ? (language === 'id' ? 'Tanggal Selesai' : 'End Date')
                        : formType === 'OVERTIME'
                        ? (language === 'id' ? 'Durasi Jam' : 'Hours')
                        : (language === 'id' ? 'Jam Presensi' : 'Time')}
                    </label>
                    <input
                      type="text"
                      value={formType === 'PERMIT' ? formEndDate : formType === 'OVERTIME' ? '2.5 Jam (17:00 - 19:30)' : formTime}
                      onChange={(e) => formType === 'PERMIT' ? setFormEndDate(e.target.value) : setFormTime(e.target.value)}
                      placeholder="DD MMM YYYY / HH:MM"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.8125rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                {/* 5. Khusus Tukar Shift: Pilih Rekan Kerja */}
                {formType === 'CHANGE_SHIFT' && (
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                      {language === 'id' ? 'Rekan Kerja yang Diajak Tukar' : 'Swap With Colleague'}
                    </label>
                    <input
                      type="text"
                      value={formSwapWith}
                      onChange={(e) => setFormSwapWith(e.target.value)}
                      placeholder="Nama rekan kerja dan unit"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.8125rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                )}

                {/* 6. Alasan / Deskripsi */}
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    {language === 'id' ? 'Alasan Lengkap' : 'Detailed Reason'}
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formReason}
                    onChange={(e) => setFormReason(e.target.value)}
                    placeholder={
                      language === 'id'
                        ? 'Jelaskan alasan pengajuan secara jelas untuk mempermudah persetujuan...'
                        : 'Explain the reason clearly...'
                    }
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.8125rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      resize: 'none',
                    }}
                  />
                </div>

                {/* 7. Upload Lampiran (Opsional) */}
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    {language === 'id' ? 'Lampiran Dokumen (Opsional)' : 'Attachment (Optional)'}
                  </label>
                  <div
                    style={{
                      border: '1.5px dashed #CBD5E1',
                      borderRadius: '10px',
                      padding: '12px',
                      textAlign: 'center',
                      backgroundColor: '#F8FAFC',
                      cursor: 'pointer',
                    }}
                  >
                    <Paperclip size={20} color="#64748B" style={{ margin: '0 auto 4px auto' }} />
                    <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>
                      {language === 'id' ? 'Unggah surat dokter, foto bukti, atau tiket (PDF/JPG)' : 'Upload doc, photo, or ticket (PDF/JPG)'}
                    </span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#053079',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '13px',
                    fontSize: '0.875rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    marginTop: '8px',
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
          FILTER MODAL (BOTTOM SHEET)
          ========================================================================= */}
      {isFilterModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            backdropFilter: 'blur(3px)',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsFilterModalOpen(false);
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              padding: '20px 20px 28px 20px',
              maxHeight: '85vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              boxShadow: '0 -8px 30px rgba(0, 0, 0, 0.15)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#EFF6FF',
                    color: '#053079',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FunnelSimple size={18} weight="bold" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {language === 'id' ? 'Filter Permohonan' : 'Filter Requests'}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>
                    {language === 'id' ? 'Saring berdasarkan jenis dan status' : 'Filter by type and status'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
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

            {/* Filter 1: Jenis Permohonan */}
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1E293B', marginBottom: '8px' }}>
                {language === 'id' ? 'Jenis Permohonan' : 'Request Type'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[
                  { id: 'ALL', label: language === 'id' ? 'Semua Jenis' : 'All Types', icon: FileText, color: '#053079' },
                  { id: 'PERMIT', label: 'Permit (Izin/Cuti)', icon: FileText, color: '#059669' },
                  { id: 'MANUAL_ATTENDANCE', label: 'Presensi Manual', icon: Clock, color: '#0284C7' },
                  { id: 'OVERTIME', label: 'Lembur', icon: ClockCountdown, color: '#D97706' },
                  { id: 'CHANGE_SHIFT', label: 'Tukar Shift', icon: ArrowsLeftRight, color: '#7C3AED' },
                ].map((item) => {
                  const isSelected = tempActiveTab === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTempActiveTab(item.id)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '12px',
                        border: isSelected ? '1.5px solid #053079' : '1px solid #E2E8F0',
                        backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Icon size={16} weight={isSelected ? 'bold' : 'regular'} color={isSelected ? '#053079' : item.color} />
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected ? '#053079' : '#334155',
                          flex: 1,
                        }}
                      >
                        {item.label}
                      </span>
                      {isSelected && <Check size={14} weight="bold" color="#053079" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter 2: Status Pengajuan */}
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1E293B', marginBottom: '8px' }}>
                {language === 'id' ? 'Status Pengajuan' : 'Request Status'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[
                  { id: 'ALL', label: language === 'id' ? 'Semua Status' : 'All Statuses' },
                  { id: 'PENDING', label: language === 'id' ? 'Menunggu' : 'Pending' },
                  { id: 'APPROVED', label: language === 'id' ? 'Disetujui' : 'Approved' },
                  { id: 'REJECTED', label: language === 'id' ? 'Ditolak' : 'Rejected' },
                ].map((item) => {
                  const isSelected = tempStatusFilter === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTempStatusFilter(item.id)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '12px',
                        border: isSelected ? '1.5px solid #053079' : '1px solid #E2E8F0',
                        backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected ? '#053079' : '#334155',
                        }}
                      >
                        {item.label}
                      </span>
                      {isSelected && <Check size={14} weight="bold" color="#053079" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => {
                  setTempActiveTab('ALL');
                  setTempStatusFilter('ALL');
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#475569',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {language === 'id' ? 'Atur Ulang' : 'Reset'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab(tempActiveTab);
                  setStatusFilter(tempStatusFilter);
                  setIsFilterModalOpen(false);
                }}
                style={{
                  flex: 2,
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#053079',
                  color: '#FFFFFF',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(5, 48, 121, 0.25)',
                }}
              >
                {language === 'id' ? 'Terapkan Filter' : 'Apply Filter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestPermissionView;
