import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import successCheck from '../assets/illustrations/success-check.png';
import confirmation from '../assets/illustrations/confirmation.png';
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
  CalendarBlank,
  Users,
  Paperclip,
  Check,
} from '@phosphor-icons/react';
import { useLanguage } from '../context/LanguageContext';
import { matchesRequestDate } from '../utils/requestDates';
import { getRequestDisplayTitle } from '../utils/requestCategories';
import RequestPermissionDetailView from './RequestPermissionDetailView';

const REQUEST_FONT = { body: '16px', heading: '16px', caption: '12px' };

const REQUEST_TYPE_OPTIONS = [
  { id: 'PERMIT', label: 'Permit Permission', icon: FileText },
  { id: 'MANUAL_ATTENDANCE', label: 'Manual Attendance', icon: Clock },
  { id: 'OVERTIME', label: 'Overtime', icon: ClockCountdown },
  { id: 'CHANGE_SHIFT', label: 'Change Shift', icon: ArrowsLeftRight },
];


export const RequestApprovalView = ({ onBack, user, teamApprovals, setTeamApprovals }) => {
  const { language } = useLanguage();

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [tempStatusFilter, setTempStatusFilter] = useState('ALL');
  const [tempTypeFilter, setTempTypeFilter] = useState('ALL');
  const [tempDateFilter, setTempDateFilter] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const hasActiveFilter = statusFilter !== 'ALL' || typeFilter !== 'ALL' || !!dateFilter;
  const activeFiltersCount = (statusFilter !== 'ALL' ? 1 : 0) + (typeFilter !== 'ALL' ? 1 : 0) + (dateFilter ? 1 : 0);

  const [selectedDetail, setSelectedDetail] = useState(null);
  const [rejectModalItem, setRejectModalItem] = useState(null);
  const [rejectReasonInput, setRejectReasonInput] = useState('');
  const [completedRequest, setCompletedRequest] = useState(null);
  const [approveModalItem, setApproveModalItem] = useState(null);

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


  const handleConfirmApprove = () => {
    if (!approveModalItem || approveModalItem.status !== 'PENDING') return;
    const id = approveModalItem.id;
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
    setCompletedRequest({ ...approveModalItem, status: 'APPROVED' });
    setApproveModalItem(null);
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
              approver: user?.name || 'Andi Santoso',
              rejectedByName: user?.name || 'Andi Santoso',
              rejectedByRole: user?.role || user?.unitOrDept || 'Building Service',
              rejectReason: rejectReasonInput.trim() || 'Ditolak oleh atasan.',
              rejectedAt: 'Hari ini • Baru saja',
            }
          : item
      )
    );
    setCompletedRequest({ ...rejectModalItem, status: 'REJECTED' });
    setRejectModalItem(null);
    if (selectedDetail && selectedDetail.id === rejectModalItem.id) {
      setSelectedDetail(null);
    }
  };

  const filteredApprovals = teamApprovals.filter((item) => {
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    if (typeFilter !== 'ALL' && item.type !== typeFilter) return false;
    if (dateFilter && !((item.date && item.date === dateFilter) || matchesRequestDate(item.dateDisplay, dateFilter))) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.employeeName.toLowerCase().includes(q);
      const matchRole = item.employeeRole.toLowerCase().includes(q);
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchType = item.subType.toLowerCase().includes(q);
      const matchReason = item.reason.toLowerCase().includes(q);
      const matchId = item.id.toLowerCase().includes(q);
      if (!matchName && !matchRole && !matchTitle && !matchType && !matchReason && !matchId) return false;
    }
    return true;
  });

  if (selectedDetail) {
    return (
      <>
        <RequestPermissionDetailView
          request={selectedDetail}
          user={user}
          language={language}
          onBack={() => setSelectedDetail(null)}
          onApprove={(id) => setApproveModalItem(teamApprovals.find((item) => item.id === id))}
          onReject={(item) => handleOpenReject(item)}
        />
        {approveModalItem && createPortal(
          <div
            onClick={(event) => {
              if (event.target === event.currentTarget) setApproveModalItem(null);
            }}
            style={{ position: document.getElementById('phone-screen-container') ? 'absolute' : 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.55)', zIndex: 9999, display: 'flex', alignItems: 'flex-end', backdropFilter: 'blur(3px)' }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirm-approval-title"
              aria-describedby="confirm-approval-description"
              onKeyDown={(event) => {
                if (event.key === 'Escape') setApproveModalItem(null);
                if (event.key === 'Tab') {
                  const buttons = event.currentTarget.querySelectorAll('button');
                  const first = buttons[0];
                  const last = buttons[buttons.length - 1];
                  if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                  } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                  }
                }
              }}
              style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#FFFFFF', borderRadius: '24px 24px 0 0', padding: '16px 20px 24px', maxHeight: '90%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <div aria-hidden="true" style={{ width: '48px', height: '4px', borderRadius: '999px', backgroundColor: '#E2E8F0', alignSelf: 'center' }} />
              <img src={confirmation} alt="" style={{ width: '100%', height: 'auto', display: 'block', flexShrink: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <h3 id="confirm-approval-title" style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#334155' }}>Approve this request?</h3>
                <p id="confirm-approval-description" style={{ margin: 0, fontSize: '14px', color: '#64748B', lineHeight: 1.5, textAlign: 'center' }}>
                  Are you sure you want to approve {approveModalItem.employeeName}’s {approveModalItem.title} request?
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '10px' }}>
                <button autoFocus type="button" onClick={() => setApproveModalItem(null)} style={{ height: '44px', borderRadius: 'var(--radius-sm)', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#475569', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'none' }}>Cancel</button>
                <button type="button" onClick={handleConfirmApprove} style={{ minHeight: '46px', borderRadius: '12px', border: 'none', backgroundColor: '#16A34A', color: '#FFFFFF', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: 'none' }}>Yes, Approve</button>
              </div>
            </div>
          </div>,
          document.getElementById('phone-screen-container') || document.body
        )}
        {/* Reject Confirmation Modal in Detail Mode */}
        {rejectModalItem && createPortal(
          <div
            style={{
              position: document.getElementById('phone-screen-container') ? 'absolute' : 'fixed',
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
                maxHeight: '80%',
                boxSizing: 'border-box',
                overflowY: 'auto',
                boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.2)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

                  <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#334155' }}>
                    {language === 'id' ? 'Tolak Permohonan' : 'Reject Request'}
                  </h3>
                </div>
                <button
                  type="button"
                  aria-label={language === 'id' ? 'Tutup' : 'Close'}
                  onClick={() => setRejectModalItem(null)}
                  style={{ border: 'none', backgroundColor: '#F1F5F9', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' }}
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '0 0 14px 0', lineHeight: 1.5 }}>
                {language === 'id'
                  ? `Berikan alasan penolakan untuk permohonan ${rejectModalItem.title} dari ${rejectModalItem.employeeName}:`
                  : `Provide a rejection reason for ${rejectModalItem.title} from ${rejectModalItem.employeeName}:`}
              </p>

              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#334155',
                    marginBottom: '6px',
                  }}
                >
                  {language === 'id' ? 'Alasan Penolakan' : 'Rejection Reason'}
                </label>
                <textarea
                className="approval-rejection-reason"
                  rows={3}
                  value={rejectReasonInput}
                  onChange={(e) => setRejectReasonInput(e.target.value)}
                  placeholder={
                    language === 'id'
                      ? 'Contoh: Jadwal operasional sedang padat, kuota cuti habis...'
                      : 'e.g. Schedule is at capacity, quota exhausted...'
                  }
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
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
                    boxShadow: 'none',
                  }}
                >
                  {language === 'id' ? 'Konfirmasi Tolak' : 'Confirm Reject'}
                </button>
              </div>
            </div>
          </div>,
        document.getElementById('phone-screen-container') || document.body
        )}
      </>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        backgroundColor: '#F8FAFC',
        color: '#334155',
        fontFamily: 'Inter, -apple-system, sans-serif',
      }}
    >
      {/* Sticky Header with Title and Search/Filter Bar */}
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
              fontSize: REQUEST_FONT.heading,
              fontWeight: 700,
              color: '#334155',
              margin: 0,
              letterSpacing: '-0.01em',
              width: 'calc(100% - 72px)',
              lineHeight: 1.2,
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <span>{language === 'id' ? 'Approval Request' : 'Approval Request'}</span>
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
              gap: '8px',
              boxSizing: 'border-box',
            }}
          >
            <MagnifyingGlass size={18} weight="bold" color="#64748B" style={{ flexShrink: 0 }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'id' ? 'Cari nama, jenis, atau alasan...' : 'Find employee, type, reason...'}
              style={{
                flex: 1,
                minWidth: 0,
                width: '100%',
                border: 'none',
                padding: 0,
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: REQUEST_FONT.body,
                color: '#334155',
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

          {/* Filter Button (Square Rounded with 3-lines SVG) */}
          <button
            type="button"
            onClick={() => {
              setTempStatusFilter(statusFilter);
              setTempTypeFilter(typeFilter);
              setTempDateFilter(dateFilter);
              setIsFilterModalOpen(true);
            }}
            aria-label="Filter"
            aria-haspopup="dialog"
            aria-expanded={isFilterModalOpen}
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
                  fontSize: REQUEST_FONT.caption,
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
      </header>

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
            {hasActiveFilter && (
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('ALL');
                  setTypeFilter('ALL');
                  setDateFilter('');
                  setSearchQuery('');
                }}
                style={{
                  marginTop: '12px',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#053079',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {language === 'id' ? 'Reset Filter' : 'Reset Filter'}
              </button>
            )}
          </div>
        ) : (
          (() => {
            const renderCard = (item) => {
            const isApproved = item.status === 'APPROVED';
            const isPending = item.status === 'PENDING';
            const isShiftTransfer = item.type === 'CHANGE_SHIFT' && (item.title === 'Shift Transfer' || item.subType?.toLowerCase().includes('transfer') || Boolean(item.transferTo));
            const isShiftSwap = item.type === 'CHANGE_SHIFT' && !isShiftTransfer && Boolean(item.swapWith);
            const isShiftRequest = item.type === 'CHANGE_SHIFT' && Boolean(item.toShift);
            const displayTitle = getRequestDisplayTitle(item, language);
            const typeOption = REQUEST_TYPE_OPTIONS.find((opt) => opt.id === item.type) || REQUEST_TYPE_OPTIONS[0];
            const TypeIcon = typeOption.icon;
            const accent = { color: '#09B2FF', bg: '#EAF7FF' };

            return (
              <article
                key={item.id}
                className="permission-request-card"
                role="button"
                tabIndex={0}
                aria-label={`View details: ${displayTitle || item.title}`}
                onClick={() => setSelectedDetail(item)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setSelectedDetail(item);
                  }
                }}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                }}
              >
                {/* Row 1: Requester name + status pill */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        margin: '0 0 4px',
                        fontSize: '17px',
                        lineHeight: 1.25,
                        fontWeight: 800,
                        color: '#053079',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        letterSpacing: '-0.3px',
                      }}
                    >
                      {item.employeeName}
                    </h3>
                    <p style={{ margin: 0, fontSize: REQUEST_FONT.caption, fontWeight: 600, color: '#475569', lineHeight: 1.4 }}>
                      {item.employeeRole}
                    </p>
                  </div>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      flexShrink: 0,
                      padding: '5px 9px',
                      borderRadius: '999px',
                      fontSize: REQUEST_FONT.caption,
                      fontWeight: 700,
                      backgroundColor: isApproved ? '#16A34A' : isPending ? '#F97316' : '#DC2626',
                      color: '#FFFFFF',
                    }}
                  >
                    {isApproved ? 'Approved' : isPending ? 'Waiting Approval' : 'Rejected'}
                  </span>
                </div>

                {/* Row 2: Request type chip + title + details */}
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: '14px',
                    padding: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '3px 9px 3px 6px',
                        borderRadius: '999px',
                        backgroundColor: accent.bg,
                        color: accent.color,
                        fontSize: '11px',
                        fontWeight: 700,
                      }}
                    >
                      <TypeIcon size={13} weight="fill" />
                      {typeOption.label}
                    </span>
                    <span style={{ fontSize: REQUEST_FONT.caption, color: '#94A3B8', lineHeight: 1.4, whiteSpace: 'nowrap' }}>
                      Created: {item.submittedAt.split(' • ')[0]}
                    </span>
                  </div>
                  <h4
                    style={{
                      margin: '0 0 4px',
                      fontSize: REQUEST_FONT.body,
                      fontWeight: 700,
                      color: '#1E293B',
                      lineHeight: 1.4,
                    }}
                  >
                    {displayTitle || item.title}
                  </h4>
                  {isShiftSwap && (
                    <p style={{ margin: '0 0 4px', fontSize: REQUEST_FONT.caption, fontWeight: 600, color: '#334155', lineHeight: 1.5 }}>
                      Swap with {item.swapWith}
                    </p>
                  )}
                  {isShiftTransfer && (item.transferTo || item.swapWith) && (
                    <p style={{ margin: '0 0 4px', fontSize: REQUEST_FONT.caption, fontWeight: 600, color: '#334155', lineHeight: 1.5 }}>
                      Transfer to {item.transferTo || item.swapWith}
                    </p>
                  )}
                  <p
                    style={{
                      margin: 0,
                      fontSize: REQUEST_FONT.caption,
                      color: '#64748B',
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {item.reason}
                  </p>
                </div>

                {/* Row 3: Date & duration / target shift chips */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: isShiftRequest ? 'nowrap' : 'wrap',
                    gap: '8px',
                    fontSize: REQUEST_FONT.caption,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      flex: isShiftRequest ? '0 0 auto' : '1 1 160px',
                      minWidth: 0,
                    }}
                  >
                    <CalendarCheck size={18} color="#09B2FF" style={{ flexShrink: 0 }} />
                    <span
                      style={{
                        fontWeight: 600,
                        color: '#334155',
                        lineHeight: 1.5,
                        whiteSpace: isShiftRequest ? 'nowrap' : 'normal',
                      }}
                    >
                      {item.dateDisplay}
                    </span>
                  </div>
                  <span
                    title={isShiftRequest ? item.toShift : undefined}
                    style={{
                      backgroundColor: '#F1F5F9',
                      color: '#64748B',
                      padding: '3px 7px',
                      borderRadius: '4px',
                      fontWeight: 600,
                      minWidth: 0,
                      marginLeft: isShiftRequest ? 'auto' : 0,
                      overflow: isShiftRequest ? 'hidden' : 'visible',
                      textOverflow: isShiftRequest ? 'ellipsis' : 'clip',
                      whiteSpace: isShiftRequest ? 'nowrap' : 'normal',
                    }}
                  >
                    {isShiftRequest ? item.toShift : item.duration}
                  </span>
                </div>
              </article>
            );
            };

            const needActionItems = filteredApprovals.filter((r) => r.status === 'PENDING');
            const historyItems = filteredApprovals.filter((r) => r.status !== 'PENDING');

            const renderSectionHeader = (title, count, highlight) => (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 2px 0' }}>
                <h2 style={{ margin: 0, fontSize: REQUEST_FONT.body, fontWeight: 700, color: '#334155', lineHeight: 1.3 }}>{title}</h2>
                <span
                  style={{
                    minWidth: '22px',
                    height: '22px',
                    padding: '0 7px',
                    boxSizing: 'border-box',
                    borderRadius: '999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700,
                    backgroundColor: highlight ? '#FFEDD5' : '#E2E8F0',
                    color: highlight ? '#C2410C' : '#64748B',
                  }}
                >
                  {count}
                </span>
              </div>
            );

            return (
              <>
                {needActionItems.length > 0 && (
                  <>
                    {renderSectionHeader('Need Action', needActionItems.length, true)}
                    {needActionItems.map(renderCard)}
                  </>
                )}
                {historyItems.length > 0 && (
                  <>
                    <div style={{ marginTop: needActionItems.length > 0 ? '8px' : 0 }}>
                      {renderSectionHeader('Approval History', historyItems.length, false)}
                    </div>
                    {historyItems.map(renderCard)}
                  </>
                )}
              </>
            );
          })()
        )}
      </div>

      {completedRequest && createPortal(
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setCompletedRequest(null);
          }}
          style={{
            position: document.getElementById('phone-screen-container') ? 'absolute' : 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.55)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            backdropFilter: 'blur(3px)',
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="approval-success-sheet-title"
            onKeyDown={(event) => {
              if (event.key === 'Escape') setCompletedRequest(null);
              if (event.key === 'Tab') {
                const buttons = event.currentTarget.querySelectorAll('button');
                const first = buttons[0];
                const last = buttons[buttons.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                  event.preventDefault();
                  last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                  event.preventDefault();
                  first.focus();
                }
              }
            }}
            style={{
              boxSizing: 'border-box',
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              padding: '16px 20px 24px',
              maxHeight: '90%',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.15)',
            }}
          >
            {/* Handle Bar */}
            <div
              aria-hidden="true"
              style={{
                width: '48px',
                height: '4px',
                borderRadius: '999px',
                backgroundColor: '#E2E8F0',
                alignSelf: 'center',
                flexShrink: 0,
              }}
            />

            {/* 3D Success Illustration (Mentok ke padding container) */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '4px 0 2px 0' }}>
              <img
                src={successCheck}
                alt=""
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
            </div>

            {/* Header Content */}
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <h3
                id="approval-success-sheet-title"
                style={{
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#334155',
                  margin: 0,
                  letterSpacing: '-0.01em',
                }}
              >
                {completedRequest.status === 'APPROVED' ? 'Request approved' : language === 'id' ? 'Permohonan berhasil ditolak' : 'Request rejected'}
              </h3>
              <p
                style={{
                  fontSize: '13px',
                  color: '#64748B',
                  margin: 0,
                  lineHeight: 1.5,
                  maxWidth: '320px',
                }}
              >
                {completedRequest.status === 'APPROVED'
                  ? `${completedRequest.employeeName}’s request has been approved. You can review the updated status in the request details.`
                  : language === 'id'
                  ? `Permohonan ${completedRequest.employeeName} telah ditolak. Alasan penolakan tersimpan di detail permohonan.`
                  : `${completedRequest.employeeName}’s request has been rejected. The rejection reason is saved in the request details.`}
              </p>
            </div>

            {/* Actions: View Detail & Close */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              <button
                autoFocus
                type="button"
                onClick={() => {
                  setCompletedRequest(null);
                  setSelectedDetail(teamApprovals.find((item) => item.id === completedRequest.id));
                }}
                style={{
                  width: '100%',
                  minHeight: '48px',
                  backgroundColor: '#053079',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: 'none',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <FileText size={18} weight="bold" />
                <span>{completedRequest.status !== 'APPROVED' && language === 'id' ? 'Lihat Detail Permohonan' : 'View Request Details'}</span>
              </button>

              <button
                type="button"
                onClick={() => setCompletedRequest(null)}
                style={{
                  width: '100%',
                  minHeight: '44px',
                  backgroundColor: '#FFFFFF',
                  color: '#64748B',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '10px',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {completedRequest.status !== 'APPROVED' && language === 'id' ? 'Kembali ke Daftar Approval' : 'Back to Approval List'}
              </button>
            </div>
          </div>
        </div>,
        document.getElementById('phone-screen-container') || document.body
      )}

      {/* =========================================================================
          MODAL: REJECT CONFIRMATION BOTTOM SHEET
          ========================================================================= */}
      {rejectModalItem && createPortal(
        <div
          style={{
            position: document.getElementById('phone-screen-container') ? 'absolute' : 'fixed',
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
              maxHeight: '80%',
                boxSizing: 'border-box',
              overflowY: 'auto',
              boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

                <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#334155' }}>
                  {language === 'id' ? 'Tolak Permohonan' : 'Reject Request'}
                </h3>
              </div>
                <button
                  type="button"
                  aria-label={language === 'id' ? 'Tutup' : 'Close'}
                  onClick={() => setRejectModalItem(null)}
                  style={{ border: 'none', backgroundColor: '#F1F5F9', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' }}
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
                className="approval-rejection-reason"
                rows={3}
                value={rejectReasonInput}
                onChange={(e) => setRejectReasonInput(e.target.value)}
                placeholder={
                  language === 'id'
                    ? 'Tuliskan alasan penolakan untuk karyawan (opsional)...'
                    : 'Enter rejection reason (optional)...'
                }
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
                  boxShadow: 'none',
                }}
              >
                {language === 'id' ? 'Konfirmasi Tolak' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>,
        document.getElementById('phone-screen-container') || document.body
      )}

      {/* =========================================================================
          FILTER MODAL (BOTTOM SHEET)
          ========================================================================= */}
      {isFilterModalOpen && createPortal(
        <div
          style={{
            position: document.getElementById('phone-screen-container') ? 'absolute' : 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'flex-end',
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) setIsFilterModalOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="approval-filter-title"
            onKeyDown={(event) => {
              if (event.key === 'Escape') setIsFilterModalOpen(false);
              if (event.key === 'Tab') {
                const controls = event.currentTarget.querySelectorAll('button, input');
                const first = controls[0];
                const last = controls[controls.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                  event.preventDefault();
                  last?.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                  event.preventDefault();
                  first?.focus();
                }
              }
            }}
            style={{
              width: '100%',
              maxHeight: '92%',
              overflowY: 'auto',
              boxSizing: 'border-box',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px 24px 0 0',
              padding: '16px 16px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '22px',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: '60px',
                height: '5px',
                borderRadius: '999px',
                backgroundColor: '#F1F5F9',
                alignSelf: 'center',
                flexShrink: 0,
              }}
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <h3
                id="approval-filter-title"
                style={{
                  margin: 0,
                  fontSize: REQUEST_FONT.heading,
                  fontWeight: 700,
                  color: '#334155',
                }}
              >
                {language === 'id' ? 'Filter Approval' : 'Filter Approval'}
              </h3>
              <button
                type="button"
                autoFocus
                onClick={() => {
                  setTempStatusFilter('ALL');
                  setTempTypeFilter('ALL');
                  setTempDateFilter('');
                }}
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: '6px 0 6px 8px',
                  fontFamily: 'inherit',
                  fontSize: REQUEST_FONT.body,
                  fontWeight: 500,
                  color: '#88929D',
                  cursor: 'pointer',
                }}
              >
                Reset
              </button>
            </div>

            {[
              {
                title: language === 'id' ? 'Status Approval' : 'Approval Status',
                value: tempStatusFilter,
                onChange: setTempStatusFilter,
                options: [
                  { id: 'PENDING', label: language === 'id' ? 'Perlu Review' : 'Need Review' },
                  { id: 'APPROVED', label: language === 'id' ? 'Disetujui' : 'Approved' },
                  { id: 'REJECTED', label: language === 'id' ? 'Ditolak' : 'Rejected' },
                ],
              },
              {
                title: language === 'id' ? 'Filter berdasarkan Tipe Request' : 'Filter by Request Type',
                value: tempTypeFilter,
                onChange: setTempTypeFilter,
                options: [
                  { id: 'PERMIT', label: language === 'id' ? 'Izin / Cuti' : 'Permit' },
                  { id: 'MANUAL_ATTENDANCE', label: language === 'id' ? 'Presensi Manual' : 'Manual Attendance' },
                  { id: 'OVERTIME', label: language === 'id' ? 'Lembur' : 'Overtime' },
                  { id: 'CHANGE_SHIFT', label: language === 'id' ? 'Tukar Shift' : 'Change Shift' },
                ],
              },
            ].map((group) => (
              <fieldset
                key={group.title}
                style={{
                  padding: 0,
                  margin: 0,
                  border: 'none',
                  minWidth: 0,
                }}
              >
                <legend
                  style={{
                    padding: 0,
                    marginBottom: '10px',
                    fontSize: REQUEST_FONT.body,
                    fontWeight: 500,
                    color: '#334155',
                  }}
                >
                  {group.title}
                </legend>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {group.options.map((option) => {
                    const selected = group.value === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => group.onChange(selected ? 'ALL' : option.id)}
                        style={{
                          minHeight: '34px',
                          padding: '6px 12px',
                          border: `1px solid ${selected ? '#053079' : '#E2E8F0'}`,
                          borderRadius: '10px',
                          backgroundColor: selected ? '#EAF7FF' : '#FFFFFF',
                          color: selected ? '#053079' : '#64748B',
                          fontFamily: 'inherit',
                          fontSize: '12px',
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label
                htmlFor="approval-filter-date"
                style={{ fontSize: REQUEST_FONT.body, fontWeight: 500, color: '#334155' }}
              >
                {language === 'id' ? 'Tanggal' : 'Date'}
              </label>
              <div
                style={{
                  position: 'relative',
                  minHeight: '44px',
                  border: '1px solid #DDE2E7',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 14px',
                }}
              >
                <span
                  aria-hidden="true"
                  style={{ fontSize: REQUEST_FONT.body, color: tempDateFilter ? '#334155' : '#A8B2BD' }}
                >
                  {tempDateFilter
                    ? new Date(`${tempDateFilter}T00:00:00`).toLocaleDateString(
                        language === 'id' ? 'id-ID' : 'en-GB',
                        { day: 'numeric', month: 'short', year: 'numeric' }
                      )
                    : (language === 'id' ? 'Pilih tanggal' : 'Choose date')}
                </span>
                <CalendarBlank
                  aria-hidden="true"
                  size={20}
                  color="#88929D"
                  style={{ marginLeft: 'auto' }}
                />
                <input
                  id="approval-filter-date"
                  type="date"
                  value={tempDateFilter}
                  onChange={(event) => setTempDateFilter(event.target.value)}
                  onClick={(event) => {
                    try {
                      event.currentTarget.showPicker?.();
                    } catch {
                      /* Native input remains keyboard accessible. */
                    }
                  }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    boxSizing: 'border-box',
                    fontSize: REQUEST_FONT.body,
                    opacity: 0,
                    cursor: 'pointer',
                  }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setStatusFilter(tempStatusFilter);
                setTypeFilter(tempTypeFilter);
                setDateFilter(tempDateFilter);
                setIsFilterModalOpen(false);
              }}
              style={{
                width: '100%',
                minHeight: '48px',
                padding: '12px',
                border: 'none',
                borderRadius: '12px',
                backgroundColor: '#053079',
                color: '#FFFFFF',
                fontFamily: 'inherit',
                fontSize: REQUEST_FONT.body,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Filter
            </button>
          </div>
        </div>,
        document.getElementById('phone-screen-container') || document.body
      )}
    </div>
  );
};

export default RequestApprovalView;
