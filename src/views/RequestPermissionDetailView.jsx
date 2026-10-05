import React, { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { getCategoryOptions } from '../utils/requestCategories';
import {
  CaretLeft,
  FileText,
  Clock,
  ClockCountdown,
  ArrowsLeftRight,
  XCircle,
  WarningCircle,
  CalendarBlank,
  FilePdf,
  FileImage,
  Check,
  HourglassHigh,
  Trash,
  User,
  UserCheck,
  MapPin,
  Buildings,
  Eye,
  SignIn,
  SignOut,
} from '@phosphor-icons/react';

export default function RequestPermissionDetailView({
  request,
  user,
  language = 'id',
  onBack,
  onCancelRequest,
  _onReapply,
}) {
  const pageRef = useRef(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // Scroll to top inside mobile simulator container when opened
  useLayoutEffect(() => {
    const scrollContainer = pageRef.current?.closest('.android-scroll-content');
    if (scrollContainer) scrollContainer.scrollTop = 0;
  }, []);

  if (!request) return null;

  const isId = language === 'id';

  // Category Configuration
  const categoryConfig = {
    PERMIT: {
      label: 'Permit Permission',
      icon: FileText,
      color: '#0284C7',
      bgColor: '#E0F2FE',
      borderColor: '#BAE6FD',
    },
    MANUAL_ATTENDANCE: {
      label: 'Manual Attendance',
      icon: Clock,
      color: '#0284C7',
      bgColor: '#EAF7FF',
      borderColor: '#BAE6FD',
    },
    OVERTIME: {
      label: 'Overtime',
      icon: ClockCountdown,
      color: '#D97706',
      bgColor: '#FEF3C7',
      borderColor: '#FDE68A',
    },
    CHANGE_SHIFT: {
      label: 'Change Shift',
      icon: ArrowsLeftRight,
      color: '#0D9488',
      bgColor: '#CCFBF1',
      borderColor: '#99F6E4',
    },
  };

  const currentCategory = categoryConfig[request.type] || categoryConfig.PERMIT;

  const isPending = request.status === 'PENDING';
  const isApproved = request.status === 'APPROVED';
  const isRejected = request.status === 'REJECTED';

  const approverName = request.approver && !request.approver.toLowerCase().includes('menunggu')
    ? request.approver.replace(/\s*\(.*?\)/, '').trim()
    : (isPending ? (isId ? 'Menunggu Building Service' : 'Waiting for Building Service') : 'Hendra Wijaya');

  // Manual Attendance Specific Helpers
  const isManualAttendance = request.type === 'MANUAL_ATTENDANCE';

  const checkInTime = request.checkIn !== undefined
    ? request.checkIn
    : request.duration?.includes('Clock In:')
    ? request.duration.replace('Clock In:', '').trim()
    : request.duration?.includes('In:')
    ? request.duration.split('In:')[1]?.split('•')[0]?.trim()
    : '';

  const checkOutTime = request.checkOut !== undefined
    ? request.checkOut
    : request.duration?.includes('Clock Out:')
    ? request.duration.replace('Clock Out:', '').trim()
    : request.duration?.includes('Out:')
    ? request.duration.split('Out:')[1]?.trim()
    : '';

  const scheduleDateDisplay = request.formattedDate ||
    (request.dateDisplay ? request.dateDisplay.split('•')[0].trim() : '') ||
    request.scheduleDate ||
    '-';

  const shiftDisplay = request.shift || (isId ? 'Shift Pagi (08:00 - 17:00)' : 'Morning Shift (08:00 - 17:00)');
  const notesDisplay = request.reason || request.notes || (isId ? 'Tidak ada catatan.' : 'No notes provided.');

  // Helper to determine specific manual attendance title
  const getManualAttendanceTitle = () => {
    const durationLower = (request.duration || '').toLowerCase();
    if (durationLower.startsWith('clock out:') || request.title === 'Manual Clock Out') {
      return 'Manual Clock Out';
    }
    if (durationLower.startsWith('clock in:') || request.title === 'Manual Clock In') {
      return 'Manual Clock In';
    }

    const hasIn = Boolean(checkInTime && checkInTime !== '--:--' && checkInTime.trim() !== '');
    const hasOut = Boolean(checkOutTime && checkOutTime !== '--:--' && checkOutTime.trim() !== '');

    if (hasIn && hasOut) {
      return 'Manual Clock In & Out';
    }
    if (hasOut) {
      return 'Manual Clock Out';
    }
    if (hasIn) {
      return 'Manual Clock In';
    }
    return request.title || 'Manual Clock In & Out';
  };

  const isChangeShift = request.type === 'CHANGE_SHIFT';
  const isShiftSwap = isChangeShift && Boolean(request.swapWith);
  const isShiftChange = isChangeShift && !request.swapWith;
  const subtypeLabel = getCategoryOptions(request.type, language)
    .find((option) => option.value === request.subType)?.title || request.subType;
  const heroTitle = isManualAttendance
    ? getManualAttendanceTitle()
    : isShiftChange
    ? request.title
    : subtypeLabel || request.title;
  const showRequestTitle = request.type !== 'PERMIT' && !isManualAttendance && !isChangeShift && request.title && request.title !== heroTitle;
  const heroStatus = isApproved ? 'Approved' : isPending ? 'Waiting Approval' : 'Rejected';
  const heroAccent = isApproved ? '#16A34A' : isPending ? '#F97316' : '#DC2626';

  // Cohesive Status Theme Palette for Header & Hero Card
  const statusTheme = isApproved
    ? {
        accent: '#16A34A',
        heroBg: 'linear-gradient(145deg, #FFFFFF 0%, #F6FEF9 55%, #F0FDF4 100%)',
        borderColor: '#BBF7D0',
        pillBg: '#16A34A',
        pillColor: '#FFFFFF',
        pillShadow: '0 2px 8px rgba(22, 163, 74, 0.28)',
        categoryBg: '#F0FDF4',
        categoryColor: '#15803D',
        categoryBorder: '#DCFCE7',
        metaBg: '#FFFFFF',
        metaBorder: '#BBF7D0',
        metaColor: '#166534',
        metaIcon: '#16A34A',
        topGlow: 'linear-gradient(90deg, #16A34A 0%, #22C55E 100%)',
      }
    : isPending
    ? {
        accent: '#F97316',
        heroBg: 'linear-gradient(145deg, #FFFFFF 0%, #FFFBF5 55%, #FFF7ED 100%)',
        borderColor: '#FED7AA',
        pillBg: '#F97316',
        pillColor: '#FFFFFF',
        pillShadow: '0 2px 8px rgba(249, 115, 22, 0.28)',
        categoryBg: '#FFF7ED',
        categoryColor: '#EA580C',
        categoryBorder: '#FFEDD5',
        metaBg: '#FFFFFF',
        metaBorder: '#FED7AA',
        metaColor: '#9A3412',
        metaIcon: '#EA580C',
        topGlow: 'linear-gradient(90deg, #F97316 0%, #FB923C 100%)',
      }
    : {
        accent: '#DC2626',
        heroBg: 'linear-gradient(145deg, #FFFFFF 0%, #FFF8F8 55%, #FEF2F2 100%)',
        borderColor: '#FECACA',
        pillBg: '#DC2626',
        pillColor: '#FFFFFF',
        pillShadow: '0 2px 8px rgba(220, 38, 38, 0.28)',
        categoryBg: '#FEF2F2',
        categoryColor: '#B91C1C',
        categoryBorder: '#FEE2E2',
        metaBg: '#FFFFFF',
        metaBorder: '#FECACA',
        metaColor: '#991B1B',
        metaIcon: '#DC2626',
        topGlow: 'linear-gradient(90deg, #DC2626 0%, #EF4444 100%)',
      };
  const fromShiftDisplay = request.fromShift || request.shift || (isId ? 'Shift Pagi (08:00 - 17:00)' : 'Morning Shift (08:00 - 17:00)');
  const toShiftDisplay = request.toShift || (isId ? 'Shift Siang (13:00 - 21:00)' : 'Afternoon Shift (13:00 - 21:00)');

  // File icon helper
  const getFileIcon = (fileName = '') => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FilePdf size={22} weight="fill" color="var(--color-secondary, #09B2FF)" />;
    if (['png', 'jpg', 'jpeg', 'webp'].includes(ext)) return <FileImage size={22} weight="fill" color="var(--color-secondary, #09B2FF)" />;
    return <FileText size={22} weight="fill" color="var(--color-secondary, #09B2FF)" />;
  };

  // Helper to format file metadata (e.g. PDF • 2.4 MB)
  const getAttachmentMeta = (fileName = '') => {
    if (request.attachmentMeta) return request.attachmentMeta;
    const ext = (fileName.split('.').pop() || 'PDF').toUpperCase();
    const typeLabel = ext === 'DOC' || ext === 'DOCX' ? 'DOCS' : ext;
    const size = request.fileSize || request.attachmentSize || (
      ext === 'PDF' ? '2.4 MB' :
      ['JPG', 'JPEG', 'PNG', 'WEBP'].includes(ext) ? '1.8 MB' :
      ['DOC', 'DOCX'].includes(ext) ? '1.5 MB' :
      ['XLS', 'XLSX', 'CSV'].includes(ext) ? '980 KB' : '2.1 MB'
    );
    return `${typeLabel} • ${size}`;
  };

  return (
    <div
      ref={pageRef}
      className="request-detail-view-page"
      style={{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F8FAFC',
        fontFamily: 'var(--font-sans)',
        fontSize: '14px',
        color: '#1E293B',
      }}
    >
      <style>{`
        .detail-card {
          background-color: #FFFFFF;
          border-radius: 16px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
          overflow: hidden;
        }
      `}</style>

      {/* =========================================================================
          STICKY TITLE BAR (TOP APP BAR)
          ========================================================================= */}
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
          aria-label={isId ? 'Kembali ke daftar permohonan' : 'Back to request list'}
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

        <h1
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '16px',
            fontWeight: 700,
            color: '#334155',
            margin: 0,
            letterSpacing: '-0.01em',
            whiteSpace: 'nowrap',
            textAlign: 'center',
          }}
        >
          {isId ? 'Detail Permohonan' : 'Request Detail'}
        </h1>

        <div style={{ width: '36px' }} />
      </header>

      {/* =========================================================================
          SCROLLABLE PAGE CONTENT
          ========================================================================= */}
      <div
        style={{
          flex: 1,
          padding: '16px 16px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* HERO STATUS CARD (MATCHING STATUS THEME) */}
        <div
          className="detail-card"
          style={{
            padding: '20px 18px',
            background: statusTheme.heroBg,
            border: `1.5px solid ${statusTheme.borderColor}`,
            borderRadius: '16px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
          }}
        >
          {/* Top Decorative Accent Bar */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: statusTheme.topGlow,
            }}
          />

          {/* 1. Status Pill on Top */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              marginBottom: '12px',
            }}
          >
            <span
              style={{
                backgroundColor: statusTheme.pillBg,
                color: statusTheme.pillColor,
                padding: '5px 12px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 700,
                flexShrink: 0,
                boxShadow: statusTheme.pillShadow,
                letterSpacing: '0.2px',
              }}
            >
              {heroStatus}
            </span>
          </div>

          {/* 2. Label Tipe Request (e.g. Manual Attendance) */}
          <div
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#64748B',
              marginBottom: '4px',
              lineHeight: 1.4,
            }}
          >
            {currentCategory.label}
          </div>

          {/* 3. Judul Spesifik (e.g. Manual Clock In & Out / Manual Clock Out) */}
          <h2
            style={{
              margin: '0 0 6px 0',
              fontSize: '22px',
              fontWeight: 800,
              color: '#0F172A',
              lineHeight: 1.3,
              letterSpacing: '-0.3px',
            }}
          >
            {heroTitle === 'Outpatient Sick Leave' ? <>Outpatient Sick<br />Leave</> : heroTitle}
          </h2>

          {/* Metadata Chips: Date */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px',
              marginTop: '12px',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 11px',
                borderRadius: '8px',
                backgroundColor: statusTheme.metaBg,
                border: `1px solid ${statusTheme.metaBorder}`,
                color: statusTheme.metaColor,
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <CalendarBlank size={16} color={statusTheme.metaIcon} weight="bold" />
              <span>{isId ? 'Diajukan' : 'Submitted'} {request.submittedAt || '-'}</span>
            </div>
          </div>
        </div>

        {/* WORKFLOW / APPROVAL PROGRESS TRACKER */}
        <div className="detail-card" style={{ padding: '16px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
              Approval Workflow Tracker
            </h3>
          </div>

          {/* Stepper Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, paddingLeft: '4px' }}>
            {/* Step 1: Submission */}
            <div style={{ display: 'flex', gap: '12px', position: 'relative' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                    zIndex: 2,
                  }}
                >
                  <Check size={13} weight="bold" />
                </div>
                <div
                  style={{
                    width: '2px',
                    flex: 1,
                    minHeight: '36px',
                    backgroundColor: isApproved ? '#10B981' : isRejected ? '#E2E8F0' : '#CBD5E1',
                    margin: '3px 0',
                  }}
                />
              </div>

              <div style={{ paddingBottom: '16px', flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                  {isId ? 'Permohonan Terkirim' : 'Request Submitted'}
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                  {isId ? 'Diajukan oleh Karyawan' : 'Submitted by Requester'} • {request.submittedAt}
                </div>
              </div>
            </div>

            {/* Step 2: Supervisor Review */}
            <div style={{ display: 'flex', gap: '12px', position: 'relative' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: isPending ? '#FFF7ED' : isApproved ? '#10B981' : '#EF4444',
                    border: isPending ? '2px solid #F97316' : 'none',
                    color: isPending ? '#EA580C' : '#FFFFFF',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                    zIndex: 2,
                  }}
                >
                  {isPending && <HourglassHigh size={12} weight="bold" />}
                  {isApproved && <Check size={13} weight="bold" />}
                  {isRejected && <XCircle size={14} weight="bold" />}
                </div>
                <div
                  style={{
                    width: '2px',
                    flex: 1,
                    minHeight: '36px',
                    backgroundColor: isApproved ? '#10B981' : '#E2E8F0',
                    margin: '3px 0',
                  }}
                />
              </div>

              <div style={{ paddingBottom: '16px', flex: 1 }}>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: isPending ? '#EA580C' : isApproved ? '#047857' : '#B91C1C',
                  }}
                >
                  {isPending
                    ? (isId ? 'Menunggu Peninjauan Building Service' : 'Waiting for Building Service Review')
                    : isApproved
                    ? (isId ? 'Disetujui oleh Building Service' : 'Approved by Building Service')
                    : (isId ? 'Ditolak oleh Building Service' : 'Rejected by Building Service')}
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                  <span>{approverName}</span>
                  {request.approvedAt && <span> • {request.approvedAt}</span>}
                </div>
                {isPending && (
                  <div
                    style={{
                      display: 'inline-block',
                      marginTop: '6px',
                      padding: '4px 8px',
                      backgroundColor: '#FFF7ED',
                      border: '1px solid #FED7AA',
                      borderRadius: '6px',
                      fontSize: '11px',
                      color: '#C2410C',
                      fontWeight: 500,
                    }}
                  >
                    {isId
                      ? 'Dokumen sedang ditinjau oleh atasan langsung.'
                      : 'Request is currently in reviewer queue.'}
                  </div>
                )}
              </div>
            </div>

            {/* Step 3: Final Schedule Sync */}
            <div style={{ display: 'flex', gap: '12px', position: 'relative' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: isApproved ? '#10B981' : '#F1F5F9',
                    border: isApproved ? 'none' : '2px solid #E2E8F0',
                    color: isApproved ? '#FFFFFF' : '#94A3B8',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                    zIndex: 2,
                  }}
                >
                  {isApproved ? <Check size={13} weight="bold" /> : <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#CBD5E1' }} />}
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: isApproved ? '#0F172A' : '#64748B',
                  }}
                >
                  {isApproved
                    ? (isId ? 'Tersinkronisasi ke Presensi' : 'Synced to Attendance Schedule')
                    : (isId ? 'Sinkronisasi Jadwal Presensi' : 'Schedule Synchronization')}
                </div>
                <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '2px' }}>
                  {isApproved
                    ? (isId ? 'Jadwal kerja & cuti Anda telah aktif dan tercatat di sistem.' : 'Your work & leave schedule is officially updated.')
                    : (isId ? 'Akan otomatis diperbarui begitu permohonan disetujui.' : 'Will automatically update once approved.')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DETAILED INFORMATION CARD */}
        <div className="detail-card" style={{ padding: '16px' }}>
          <div style={{ marginBottom: '14px' }}>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
              Request Information
            </h3>
          </div>

          {isManualAttendance ? (
            /* =========================================================================
               REDESIGNED MANUAL ATTENDANCE INFORMATION (MATCHING THE FORM EXACTLY)
               ========================================================================= */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* 1. Schedule Date */}
              <div>
                <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600, marginBottom: '4px' }}>
                  {isId ? 'Tanggal Jadwal' : 'Schedule Date'}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 12px',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <CalendarBlank size={18} color="var(--color-secondary, #09B2FF)" weight="bold" />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                    {scheduleDateDisplay}
                  </span>
                </div>
              </div>

              {/* 2. Shift */}
              <div>
                <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600, marginBottom: '4px' }}>
                  Shift
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 12px',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <Clock size={18} color="var(--color-secondary, #09B2FF)" weight="bold" />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                    {shiftDisplay}
                  </span>
                </div>
              </div>

              {/* 3. Check In & Check Out (2-Column Grid matching Form) */}
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {/* Check In Column */}
                  <div>
                    <div
                      style={{
                        fontSize: '11.5px',
                        color: '#64748B',
                        fontWeight: 600,
                        marginBottom: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span>Check In</span>
                      {!checkInTime && (
                        <span style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 400 }}>(Optional)</span>
                      )}
                    </div>
                    <div
                      style={{
                        padding: '10px 12px',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '10px',
                        border: '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        minHeight: '44px',
                        boxSizing: 'border-box',
                      }}
                    >
                      <SignIn size={18} color="#16A34A" weight="bold" />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span
                          style={{
                            fontSize: '13px',
                            fontWeight: checkInTime ? 700 : 500,
                            color: checkInTime ? '#16A34A' : '#94A3B8',
                          }}
                        >
                          {checkInTime || '--:--'}
                        </span>
                        {!checkInTime && (
                          <span style={{ fontSize: '10px', color: '#94A3B8', marginTop: '-1px' }}>
                            {isId ? 'Tidak diisi' : 'Not filled'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Check Out Column */}
                  <div>
                    <div
                      style={{
                        fontSize: '11.5px',
                        color: '#64748B',
                        fontWeight: 600,
                        marginBottom: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span>Check Out</span>
                      {!checkOutTime && (
                        <span style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 400 }}>(Optional)</span>
                      )}
                    </div>
                    <div
                      style={{
                        padding: '10px 12px',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '10px',
                        border: '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        minHeight: '44px',
                        boxSizing: 'border-box',
                      }}
                    >
                      <SignOut size={18} color="#DC2626" weight="bold" />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span
                          style={{
                            fontSize: '13px',
                            fontWeight: checkOutTime ? 700 : 500,
                            color: checkOutTime ? '#DC2626' : '#94A3B8',
                          }}
                        >
                          {checkOutTime || '--:--'}
                        </span>
                        {!checkOutTime && (
                          <span style={{ fontSize: '10px', color: '#94A3B8', marginTop: '-1px' }}>
                            {isId ? 'Tidak diisi' : 'Not filled'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Notes */}
              <div>
                <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600, marginBottom: '4px' }}>
                  {isId ? 'Alasan / Keterangan Pengajuan' : 'Notes'}
                </div>
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    color: '#334155',
                    fontSize: '13px',
                    lineHeight: 1.5,
                  }}
                >
                  {notesDisplay}
                </div>
              </div>

              {/* Rejection Alert if rejected */}
              {request.rejectReason && (
                <div>
                  <div
                    style={{
                      backgroundColor: '#FEF2F2',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: '1px solid #FECACA',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#B91C1C',
                        fontWeight: 700,
                        fontSize: '12.5px',
                        marginBottom: '4px',
                      }}
                    >
                      <WarningCircle size={16} weight="fill" />
                      <span>{isId ? 'Alasan Penolakan dari Building Service' : 'Building Service Rejection Reason'}</span>
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#991B1B', lineHeight: 1.5 }}>
                      {request.rejectReason}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : isShiftChange ? (
            /* =========================================================================
               REDESIGNED SHIFT CHANGE INFORMATION (SEPARATING PREVIOUS & NEXT SHIFTS)
               ========================================================================= */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* 1. Schedule Date */}
              <div>
                <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600, marginBottom: '4px' }}>
                  {isId ? 'Tanggal Jadwal' : 'Schedule Date'}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 12px',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <CalendarBlank size={18} color="var(--color-secondary, #09B2FF)" weight="bold" />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                    {scheduleDateDisplay}
                  </span>
                </div>
              </div>

              {/* 2. Shift Sebelumnya (Previous Shift) */}
              <div>
                <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600, marginBottom: '4px' }}>
                  {isId ? 'Shift Sebelumnya' : 'Previous Shift'}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 12px',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <Clock size={18} color="var(--color-secondary, #09B2FF)" weight="bold" />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                    {fromShiftDisplay}
                  </span>
                </div>
              </div>

              {/* 3. Shift Selanjutnya (Next Shift) */}
              <div>
                <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600, marginBottom: '4px' }}>
                  {isId ? 'Shift Selanjutnya' : 'Next Shift'}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 12px',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <Clock size={18} color="var(--color-secondary, #09B2FF)" weight="bold" />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                    {toShiftDisplay}
                  </span>
                </div>
              </div>

              {/* 4. Notes / Reason */}
              <div>
                <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600, marginBottom: '4px' }}>
                  {isId ? 'Alasan / Keterangan Pengajuan' : 'Notes / Reason'}
                </div>
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    color: '#334155',
                    fontSize: '13px',
                    lineHeight: 1.5,
                  }}
                >
                  {notesDisplay}
                </div>
              </div>

              {/* Rejection Alert if rejected */}
              {request.rejectReason && (
                <div>
                  <div
                    style={{
                      backgroundColor: '#FEF2F2',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: '1px solid #FECACA',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#B91C1C',
                        fontWeight: 700,
                        fontSize: '12.5px',
                        marginBottom: '4px',
                      }}
                    >
                      <WarningCircle size={16} weight="fill" />
                      <span>{isId ? 'Alasan Penolakan dari Building Service' : 'Building Service Rejection Reason'}</span>
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#991B1B', lineHeight: 1.5 }}>
                      {request.rejectReason}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : isShiftSwap ? (
            /* =========================================================================
               REDESIGNED SHIFT SWAP INFORMATION (PREVIOUS SHIFT -> SWAP WITH -> NEXT SHIFT)
               ========================================================================= */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* 1. Schedule Date */}
              <div>
                <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600, marginBottom: '4px' }}>
                  {isId ? 'Tanggal Jadwal' : 'Schedule Date'}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 12px',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <CalendarBlank size={18} color="var(--color-secondary, #09B2FF)" weight="bold" />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                    {scheduleDateDisplay}
                  </span>
                </div>
              </div>

              {/* 2. Previous Shift (Shift Sebelumnya) - SEBELUM Swap Shift With */}
              <div>
                <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600, marginBottom: '4px' }}>
                  {isId ? 'Shift Sebelumnya' : 'Previous Shift'}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 12px',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <Clock size={18} color="var(--color-secondary, #09B2FF)" weight="bold" />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                    {fromShiftDisplay}
                  </span>
                </div>
              </div>

              {/* 3. Swap Shift With (Tukar Shift Dengan) */}
              <div>
                <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600, marginBottom: '4px' }}>
                  {isId ? 'Tukar Shift Dengan' : 'Swap Shift With'}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 12px',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <ArrowsLeftRight size={18} color="var(--color-secondary, #09B2FF)" weight="bold" />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                    {request.swapWith}
                  </span>
                </div>
              </div>

              {/* 4. Next Shift (Shift Selanjutnya) - diubah dari Shift Information */}
              <div>
                <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600, marginBottom: '4px' }}>
                  {isId ? 'Shift Selanjutnya' : 'Next Shift'}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 12px',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <Clock size={18} color="var(--color-secondary, #09B2FF)" weight="bold" />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                    {toShiftDisplay}
                  </span>
                </div>
              </div>

              {/* 5. Reason / Notes */}
              <div>
                <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600, marginBottom: '4px' }}>
                  {isId ? 'Alasan / Keterangan Pengajuan' : 'Notes / Reason'}
                </div>
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    fontSize: '13px',
                    color: '#334155',
                    lineHeight: 1.5,
                  }}
                >
                  {notesDisplay}
                </div>
              </div>

              {/* Rejection Alert if rejected */}
              {request.rejectReason && (
                <div>
                  <div
                    style={{
                      backgroundColor: '#FEF2F2',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: '1px solid #FECACA',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#B91C1C',
                        fontWeight: 700,
                        fontSize: '12.5px',
                        marginBottom: '4px',
                      }}
                    >
                      <WarningCircle size={16} weight="fill" />
                      <span>{isId ? 'Alasan Penolakan dari Building Service' : 'Building Service Rejection Reason'}</span>
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#991B1B', lineHeight: 1.5 }}>
                      {request.rejectReason}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : request.type === 'OVERTIME' ? (
            /* =========================================================================
               OVERTIME REQUEST INFORMATION (BKO VS STAFF OVERTIME)
               ========================================================================= */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* 1. Overtime Date */}
              <div>
                <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600, marginBottom: '4px' }}>
                  Overtime Date
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 12px',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <CalendarBlank size={18} color="var(--color-secondary, #09B2FF)" weight="bold" />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                    {scheduleDateDisplay}
                  </span>
                </div>
              </div>

              {/* 2. Shift (Selectable for BKO, auto for Staff) */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600 }}>
                    Shift
                  </span>
                  {request.subType !== 'BKO' && request.subType !== 'Overtime BKO' && request.overtimeMode !== 'OVERTIME_BKO' && (
                    <span style={{ fontSize: '11px', fontStyle: 'italic', color: '#64748B' }}>
                      (auto)
                    </span>
                  )}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 12px',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#1E293B',
                  }}
                >
                  <Clock size={18} color="var(--color-secondary, #09B2FF)" weight="bold" />
                  <span>{request.shift || 'Shift Pagi (08:00 - 17:00)'}</span>
                </div>
              </div>

              {/* Staff Overtime Specific: Start Time, End Time & Overtime Duration (auto) */}
              {(request.subType === 'Staff Overtime' || request.overtimeMode === 'OVERTIME_STAFF' || (request.startTime && request.endTime)) && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600 }}>
                      Overtime Hours & Duration
                    </span>
                    <span style={{ fontSize: '11px', fontStyle: 'italic', color: '#64748B' }}>
                      (auto)
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      backgroundColor: '#F8FAFC',
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={18} color="var(--color-secondary, #09B2FF)" weight="bold" />
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                        {request.startTime && request.endTime
                          ? `${request.startTime} - ${request.endTime}`
                          : (request.dateDisplay?.includes('•') ? request.dateDisplay.split('•')[1]?.trim() : '17:30 - 21:00')}
                      </span>
                    </div>
                    {request.duration && (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#0284C7',
                          backgroundColor: '#EAF7FF',
                          border: '1px solid #BAE6FD',
                          padding: '3px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        {request.duration}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Detailed Reason */}
              <div>
                <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600, marginBottom: '4px' }}>
                  Detailed Reason
                </div>
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    color: '#334155',
                    fontSize: '13px',
                    lineHeight: 1.5,
                  }}
                >
                  {notesDisplay}
                </div>
              </div>

              {/* Rejection Alert if rejected */}
              {request.rejectReason && (
                <div>
                  <div
                    style={{
                      backgroundColor: '#FEF2F2',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #FECACA',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#B91C1C',
                        fontWeight: 700,
                        fontSize: '12.5px',
                        marginBottom: '4px',
                      }}
                    >
                      <WarningCircle size={16} weight="fill" />
                      <span>{isId ? 'Alasan Penolakan dari Building Service' : 'Building Service Rejection Reason'}</span>
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#991B1B', lineHeight: 1.5 }}>
                      {request.rejectReason}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* =========================================================================
               DEFAULT REQUEST INFORMATION (FOR PERMIT)
               ========================================================================= */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Periode / Tanggal */}
              <div>
                <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600, marginBottom: '4px' }}>
                  {isId ? 'Tanggal Jadwal' : 'Schedule Date'}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CalendarBlank size={18} color="var(--color-secondary, #09B2FF)" weight="bold" />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                      {request.dateDisplay}
                    </span>
                  </div>
                  {request.duration && (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        backgroundColor: '#053079',
                        padding: '3px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {request.duration}
                    </span>
                  )}
                </div>
              </div>



              {/* Specific Shift (if applicable) */}
              {(request.shift || request.fromShift) && (
                <div>
                  <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600, marginBottom: '4px' }}>
                    {isId ? 'Jadwal Shift' : 'Shift Information'}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 12px',
                      backgroundColor: '#F8FAFC',
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#1E293B',
                    }}
                  >
                    <Clock size={18} color="var(--color-secondary, #09B2FF)" weight="bold" />
                    <span>
                      {request.fromShift || request.shift}
                      {request.toShift && ` → ${request.toShift}`}
                    </span>
                  </div>
                </div>
              )}

              {/* Attendance Location (if applicable) */}
              {request.location && (
                <div>
                  <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600, marginBottom: '4px' }}>
                    {isId ? 'Lokasi Presensi' : 'Attendance Location'}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 12px',
                      backgroundColor: '#F8FAFC',
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#1E293B',
                    }}
                  >
                    <MapPin size={18} color="#EF4444" weight="bold" />
                    <span>{request.location}</span>
                  </div>
                </div>
              )}

              {/* Reason / Notes */}
              <div>
                <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600, marginBottom: '4px' }}>
                  {isId ? 'Alasan / Keterangan Pengajuan' : 'Reason / Notes'}
                </div>
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    color: '#334155',
                    fontSize: '13px',
                    lineHeight: 1.5,
                  }}
                >
                  {request.reason || (isId ? 'Tidak ada catatan tambahan.' : 'No notes provided.')}
                </div>
              </div>

              {/* Rejection Alert if rejected */}
              {request.rejectReason && (
                <div>
                  <div
                    style={{
                      backgroundColor: '#FEF2F2',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #FECACA',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#B91C1C',
                        fontWeight: 700,
                        fontSize: '12.5px',
                        marginBottom: '4px',
                      }}
                    >
                      <WarningCircle size={16} weight="fill" />
                      <span>{isId ? 'Alasan Penolakan dari Building Service' : 'Building Service Rejection Reason'}</span>
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#991B1B', lineHeight: 1.5 }}>
                      {request.rejectReason}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ATTACHMENT / DOKUMEN PENDUKUNG CARD (HIDDEN FOR MANUAL_ATTENDANCE AND UNATTACHED CHANGE_SHIFT/OVERTIME) */}
        {!isManualAttendance && !(request.type === 'CHANGE_SHIFT' && !request.attachment && !request.attachmentName) && !(request.type === 'OVERTIME' && !request.attachment && !request.attachmentName) && (
          <div className="detail-card" style={{ padding: '16px' }}>
            <div style={{ marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                Supporting Documents
              </h3>
            </div>

            {request.attachment || request.attachmentName ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      backgroundColor: '#EAF7FF',
                      border: '1px solid #BAE6FD',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-secondary, #09B2FF)',
                      flexShrink: 0,
                    }}
                  >
                    {getFileIcon(request.attachment || request.attachmentName)}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#1E293B',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {request.attachment || request.attachmentName}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px', fontWeight: 500 }}>
                      {getAttachmentMeta(request.attachment || request.attachmentName)}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label={isId ? 'Lihat berkas' : 'View attachment'}
                  onClick={() => alert(isId ? `Membuka berkas: ${request.attachment || request.attachmentName}` : `Opening: ${request.attachment || request.attachmentName}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#F8FAFC',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Eye size={18} weight="bold" color="var(--color-primary, #053079)" />
                </button>
              </div>
            ) : (
              <div
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px dashed #CBD5E1',
                  backgroundColor: '#F8FAFC',
                  textAlign: 'center',
                  color: '#64748B',
                  fontSize: '12px',
                }}
              >
                {isId
                  ? 'Tidak ada dokumen lampiran yang disertakan pada permohonan ini.'
                  : 'No attachments included with this request.'}
              </div>
            )}
          </div>
        )}

        {/* PROFILES: PEMOHON & VERIFIKATOR CARD */}
        <div className="detail-card" style={{ padding: '16px' }}>
          <div style={{ marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
              Parties Involved
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Requester */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#EAF7FF',
                  border: '1px solid #BAE6FD',
                  display: 'grid',
                  placeItems: 'center',
                  color: 'var(--color-secondary, #09B2FF)',
                  flexShrink: 0,
                }}
              >
                <User size={20} weight="bold" />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                  Employee Requester
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                  {user?.name || 'Ahmad Pratama'}
                </div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>
                  {user?.role || (isId ? 'Staff Maintenance • Divisi Operasional' : 'Maintenance Staff • Operations')}
                </div>
              </div>
            </div>

            <div style={{ height: '1px', backgroundColor: '#F1F5F9' }} />

            {/* Approver / Reviewer */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#F0FDF4',
                  border: '1px solid #DCFCE7',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#16A34A',
                  flexShrink: 0,
                }}
              >
                <UserCheck size={20} weight="bold" />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                  Reviewer & Approval
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                  {approverName}
                </div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>
                  Building Service
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* =========================================================================
          CONFIRMATION MODAL: BATALKAN PERMOHONAN
          ========================================================================= */}
      {isCancelModalOpen && createPortal(
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsCancelModalOpen(false);
          }}
          style={{
            position: document.getElementById('phone-screen-container') ? 'absolute' : 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(3px)',
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            style={{
              width: '100%',
              maxWidth: '320px',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '24px 20px 20px',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#FEF2F2',
                display: 'grid',
                placeItems: 'center',
                color: '#DC2626',
              }}
            >
              <Trash size={24} weight="bold" />
            </div>

            <h3
              style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: 800,
                color: '#0F172A',
              }}
            >
              {isId ? 'Batalkan Permohonan?' : 'Cancel this Request?'}
            </h3>

            <p
              style={{
                margin: 0,
                fontSize: '12.5px',
                color: '#64748B',
                lineHeight: 1.5,
              }}
            >
              {isId
                ? 'Permohonan ini akan ditarik dari antrean peninjauan Building Service.'
                : 'This request will be retracted from Building Service review queue.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', width: '100%', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                style={{
                  minHeight: '44px',
                  backgroundColor: '#F8FAFC',
                  color: '#64748B',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {isId ? 'Kembali' : 'No, Keep'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsCancelModalOpen(false);
                  if (onCancelRequest) onCancelRequest(request.id);
                }}
                style={{
                  minHeight: '44px',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: 'none',
                }}
              >
                {isId ? 'Ya, Batalkan' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>,
        document.getElementById('phone-screen-container') || document.body
      )}
    </div>
  );
}
