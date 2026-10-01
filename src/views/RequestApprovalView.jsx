import React, { useState } from 'react';
import {
  CaretLeft,
  FileText,
  Clock,
  ClockCountdown,
  ArrowsLeftRight,
  CheckCircle,
  XCircle,
  X,
  MagnifyingGlass,
  CalendarCheck,
  Users,
  Paperclip,
  Check,
} from '@phosphor-icons/react';
import { useLanguage } from '../context/LanguageContext';

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

export const RequestApprovalView = ({ onBack, user }) => {
  const { language } = useLanguage();

  const [teamApprovals, setTeamApprovals] = useState(INITIAL_TEAM_APPROVALS);
  const [approvalTab, setApprovalTab] = useState('ALL');
  const [approvalSearchQuery, setApprovalSearchQuery] = useState('');
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [rejectModalItem, setRejectModalItem] = useState(null);
  const [rejectReasonInput, setRejectReasonInput] = useState('');

  const TYPE_CONFIG = {
    PERMIT: {
      label: 'Permit',
      icon: FileText,
      color: '#059669',
      bgColor: '#ECFDF5',
      borderColor: '#A7F3D0',
    },
    MANUAL_ATTENDANCE: {
      label: language === 'id' ? 'Presensi Manual' : 'Manual Clock',
      icon: Clock,
      color: '#0284C7',
      bgColor: '#F0F9FF',
      borderColor: '#BAE6FD',
    },
    OVERTIME: {
      label: language === 'id' ? 'Lembur' : 'Overtime',
      icon: ClockCountdown,
      color: '#D97706',
      bgColor: '#FFFBEB',
      borderColor: '#FDE68A',
    },
    CHANGE_SHIFT: {
      label: language === 'id' ? 'Tukar Shift' : 'Change Shift',
      icon: ArrowsLeftRight,
      color: '#7C3AED',
      bgColor: '#F5F3FF',
      borderColor: '#DDD6FE',
    },
  };

  const pendingApprovalsCount = teamApprovals.filter((r) => r.status === 'PENDING').length;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const handleApprove = (id) => {
    setTeamApprovals((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'APPROVED',
              approver: 'Anda (Supervisor / Manager)',
              approvedAt: 'Hari ini • Baru saja',
            }
          : item
      )
    );
    showToast(language === 'id' ? 'Permohonan berhasil disetujui!' : 'Request successfully approved!');
    if (selectedDetail && selectedDetail.id === id) {
      setSelectedDetail(null);
    }
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
              approver: 'Anda (Supervisor / Manager)',
              rejectReason: rejectReasonInput.trim() || 'Ditolak oleh atasan.',
              rejectedAt: 'Hari ini • Baru saja',
            }
          : item
      )
    );
    const rejectedName = rejectModalItem.employeeName;
    setRejectModalItem(null);
    showToast(language === 'id' ? `Permohonan ${rejectedName} telah ditolak.` : `Request from ${rejectedName} has been rejected.`);
    if (selectedDetail && selectedDetail.id === rejectModalItem.id) {
      setSelectedDetail(null);
    }
  };

  const filteredApprovals = teamApprovals.filter((item) => {
    if (approvalTab !== 'ALL' && item.status !== approvalTab) return false;
    if (approvalSearchQuery.trim()) {
      const q = approvalSearchQuery.toLowerCase();
      const matchName = item.employeeName.toLowerCase().includes(q);
      const matchRole = item.employeeRole.toLowerCase().includes(q);
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchType = item.subType.toLowerCase().includes(q);
      const matchReason = item.reason.toLowerCase().includes(q);
      if (!matchName && !matchRole && !matchTitle && !matchType && !matchReason) return false;
    }
    return true;
  });

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
      {/* Top Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          padding: '0 16px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
        }}
      >
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          style={{
            border: 'none',
            background: 'transparent',
            color: '#334155',
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

        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <h1
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: '#334155',
              margin: 0,
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
              textAlign: 'center',
            }}
          >
            {language === 'id' ? 'Request Approval' : 'Request Approval'}
          </h1>
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
        </div>

        <div style={{ width: '36px' }} />
      </header>

      {/* =========================================================================
          UNIFIED APPROVAL FILTER TABS & SEARCH CONTAINER
          ========================================================================= */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          padding: '10px 16px 12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          position: 'sticky',
          top: '56px',
          zIndex: 30,
        }}
      >
        {/* Approval Filter Tabs */}
        <div
          style={{
            overflowX: 'auto',
            display: 'flex',
            gap: '8px',
            scrollbarWidth: 'none',
            margin: '0 -16px',
            padding: '2px 16px',
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
                  flexShrink: 0,
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
              backgroundColor: '#F8FAFC',
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
          padding: '14px 16px 40px 16px',
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
                    {isApproved
                      ? (language === 'id' ? 'Disetujui' : 'Approved')
                      : isPending
                      ? (language === 'id' ? 'Perlu Review' : 'Need Review')
                      : (language === 'id' ? 'Ditolak' : 'Rejected')}
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
                    <span style={{ fontWeight: 600, color: '#334155' }}>
                      {language === 'id' ? 'Alasan: ' : 'Reason: '}
                    </span>
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
                    <span>
                      {language === 'id'
                        ? `Telah disetujui oleh ${item.approver} (${item.approvedAt})`
                        : `Approved by ${item.approver} (${item.approvedAt})`}
                    </span>
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
                      gap: '4px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                      <XCircle size={15} weight="fill" />
                      <span>{language === 'id' ? 'Permohonan Ditolak' : 'Request Rejected'}</span>
                    </div>
                    {item.rejectReason && (
                      <span style={{ fontSize: '0.6875rem', color: '#7F1D1D', paddingLeft: '21px' }}>
                        "{item.rejectReason}"
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

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

export default RequestApprovalView;
