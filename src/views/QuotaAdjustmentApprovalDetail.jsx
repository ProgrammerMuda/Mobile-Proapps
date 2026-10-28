import React, { useLayoutEffect, useRef } from 'react';
import {
  CaretLeft,
  Check,
  CheckCircle,
  X,
  XCircle,
  Scales,
  CalendarBlank,
  Hash,
  ChatText,
  Hourglass,
  UserCheck,
} from '@phosphor-icons/react';
import { ADJUST_APPROVERS, ADJUST_TYPES, dayUnit } from '../data/leaveQuota';

const CAPTION = '12px';

const InfoRow = ({ Icon, label, children, isLast }) => (
  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 0', borderBottom: isLast ? 'none' : '1px solid #F1F5F9' }}>
    <span aria-hidden="true" style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#EAF7FF', color: '#09B2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={18} weight="bold" />
    </span>
    <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span style={{ fontSize: CAPTION, fontWeight: 500, color: '#64748B' }}>{label}</span>
      <span style={{ fontSize: '14px', fontWeight: 600, color: '#334155', lineHeight: 1.45, overflowWrap: 'anywhere' }}>{children}</span>
    </div>
  </li>
);

// Step state for the two-level flow: step 1 HR / Building Service, step 2 Building Management.
const getStepState = (request, index) => {
  const step = index + 1;
  if (request.status === 'APPROVED') return 'done';
  if (request.status === 'REJECTED') {
    const rejectedAt = request.approvalStep || 1;
    if (step < rejectedAt) return 'done';
    return step === rejectedAt ? 'rejected' : 'skipped';
  }
  if (step < request.approvalStep) return 'done';
  return step === request.approvalStep ? 'current' : 'upcoming';
};

const STEP_STYLE = {
  done: { bg: '#DCFCE7', border: '#BBF7D0', color: '#15803D' },
  current: { bg: '#FFF7ED', border: '#FED7AA', color: '#C2410C' },
  rejected: { bg: '#FEE2E2', border: '#FECACA', color: '#B91C1C' },
  upcoming: { bg: '#F1F5F9', border: '#E2E8F0', color: '#64748B' },
  skipped: { bg: '#F1F5F9', border: '#E2E8F0', color: '#94A3B8' },
};

export const QuotaAdjustmentApprovalDetail = ({ request, language, onBack, onApprove, onReject }) => {
  const pageRef = useRef(null);
  const isId = language === 'id';

  useLayoutEffect(() => {
    const scrollContainer = pageRef.current?.closest('.android-scroll-content');
    if (scrollContainer) scrollContainer.scrollTop = 0;
  }, []);

  const adjustType = ADJUST_TYPES.find((item) => item.id === request.adjustType) || ADJUST_TYPES[0];
  const isPending = request.status === 'PENDING';
  const newBalance = request.currentBalance + request.days;
  const isFinalStep = request.approvalStep === ADJUST_APPROVERS.length;
  const cardStyle = { backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)', padding: '16px' };
  const cardTitle = { margin: 0, fontSize: '14px', fontWeight: 700, color: '#334155' };
  const heroPill = { display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2px' };
  const statusPill = request.status === 'APPROVED'
    ? { bg: '#16A34A', label: isId ? 'Disetujui' : 'Approved' }
    : request.status === 'REJECTED'
    ? { bg: '#DC2626', label: isId ? 'Ditolak' : 'Rejected' }
    : { bg: '#F97316', label: 'Waiting Approval' };

  const stepNote = (state, index) => {
    if (state === 'done') {
      if (index === 0 && request.verifiedBy) return `${isId ? 'Diverifikasi oleh' : 'Verified by'} ${request.verifiedBy}${request.verifiedAt ? ` · ${request.verifiedAt}` : ''}`;
      return isId ? 'Disetujui' : 'Approved';
    }
    if (state === 'current') return isId ? 'Menunggu persetujuan' : 'Waiting for approval';
    if (state === 'rejected') return `${isId ? 'Ditolak oleh' : 'Rejected by'} ${request.rejectedByName || '-'}`;
    if (state === 'skipped') return isId ? 'Tidak dilanjutkan' : 'Not reached';
    return isId ? 'Belum dimulai' : 'Not started';
  };

  const infoRows = [
    { Icon: Hash, label: isId ? 'Nomor permohonan' : 'Request number', value: <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', color: '#6D28D9' }}>{request.requestRef}</span> },
    { Icon: Scales, label: isId ? 'Jenis penyesuaian' : 'Adjustment type', value: adjustType.label[language] || adjustType.label.en },
    { Icon: CalendarBlank, label: isId ? 'Diajukan' : 'Submitted', value: request.submittedAt },
    { Icon: ChatText, label: isId ? 'Catatan' : 'Notes', value: request.reason },
  ];

  return (
    <div ref={pageRef} style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC', fontFamily: 'var(--font-sans)', fontSize: '14px', color: '#334155' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 40, backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '0 16px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
        <button type="button" onClick={onBack} aria-label={isId ? 'Kembali ke daftar approval' : 'Back to approval list'} style={{ border: 'none', background: 'transparent', color: '#334155', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
          <CaretLeft size={22} weight="bold" />
        </button>
        <h1 style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: '16px', fontWeight: 700, color: '#334155', margin: 0, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
          {isId ? 'Detail Penyesuaian Kuota' : 'Quota Adjustment Detail'}
        </h1>
        <div style={{ width: '36px' }} />
      </header>

      <div style={{ flex: 1, padding: '16px 16px 32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <section style={{ background: 'linear-gradient(135deg, #053079 0%, #0344A8 55%, #0284C7 100%)', borderRadius: '16px', padding: '18px 16px', color: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', overflow: 'hidden' }}>
          <Scales aria-hidden="true" size={120} weight="fill" style={{ position: 'absolute', right: '-18px', top: '-14px', color: 'rgba(255, 255, 255, 0.08)' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', position: 'relative' }}>
            <span style={{ ...heroPill, backgroundColor: 'rgba(255, 255, 255, 0.16)', border: '1px solid rgba(255, 255, 255, 0.25)', color: '#FFFFFF' }}>
              <Scales size={12} weight="bold" aria-hidden="true" />
              {isId ? 'Penyesuaian Kuota' : 'Quota Adjustment'}
            </span>
            <span style={{ ...heroPill, backgroundColor: statusPill.bg, color: '#FFFFFF' }}>{statusPill.label}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
            {request.avatar ? (
              <img src={request.avatar} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255, 255, 255, 0.4)' }} />
            ) : (
              <span aria-hidden="true" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800 }}>
                {request.employeeName.split(' ').map((part) => part[0]).slice(0, 2).join('')}
              </span>
            )}
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '15px', fontWeight: 700 }}>{request.employeeName}</div>
              <div style={{ fontSize: CAPTION, color: 'rgba(255, 255, 255, 0.8)' }}>{request.employeeRole}</div>
            </div>
          </div>

          <p style={{ margin: 0, display: 'flex', alignItems: 'baseline', gap: '6px', color: '#86EFAC', position: 'relative' }}>
            <strong style={{ fontSize: '40px', lineHeight: 1, fontWeight: 800, letterSpacing: '-1px' }}>+{request.days}</strong>
            <span style={{ fontSize: '15px', fontWeight: 600 }}>{dayUnit(request.days, language)}</span>
            <span style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255, 255, 255, 0.85)' }}>· {adjustType.label[language] || adjustType.label.en}</span>
          </p>
        </section>

        <section style={cardStyle}>
          <h3 style={{ ...cardTitle, marginBottom: '12px' }}>{isId ? 'Dampak ke Saldo' : 'Balance Impact'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '8px' }}>
            <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#94A3B8', lineHeight: 1.2 }}>{request.currentBalance}</div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', marginTop: '2px' }}>{isId ? 'Saldo saat diajukan' : 'Balance at request'}</div>
            </div>
            <span aria-label={`+${request.days}`} style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, backgroundColor: '#DCFCE7', color: '#15803D', border: '2px solid #BBF7D0' }}>
              +{request.days}
            </span>
            <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: '#EAF7FF', border: '1px solid #BAE6FD', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#053079', lineHeight: 1.2 }}>{newBalance}</div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#0369A1', marginTop: '2px' }}>{isId ? 'Setelah disetujui' : 'After approval'}</div>
            </div>
          </div>
        </section>

        <section style={{ ...cardStyle, paddingBottom: '4px' }}>
          <h3 style={{ ...cardTitle, marginBottom: '2px' }}>{isId ? 'Informasi' : 'Information'}</h3>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {infoRows.map((item, index) => (
              <InfoRow key={item.label} Icon={item.Icon} label={item.label} isLast={index === infoRows.length - 1}>{item.value}</InfoRow>
            ))}
          </ul>
        </section>

        <section style={cardStyle}>
          <h3 style={{ ...cardTitle, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <UserCheck size={18} color="#09B2FF" aria-hidden="true" />
            {isId ? 'Alur Persetujuan' : 'Approval Flow'}
          </h3>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
            {ADJUST_APPROVERS.map((approver, index) => {
              const isLast = index === ADJUST_APPROVERS.length - 1;
              const state = getStepState(request, index);
              const tone = STEP_STYLE[state];
              const StateIcon = state === 'done' ? CheckCircle : state === 'rejected' ? XCircle : state === 'current' ? Hourglass : null;
              return (
                <li key={approver.initials} style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span aria-hidden="true" style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: tone.bg, border: `1px solid ${tone.border}`, color: tone.color, fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {StateIcon ? <StateIcon size={16} weight="fill" /> : approver.initials}
                    </span>
                    {!isLast && <span aria-hidden="true" style={{ width: '2px', flex: 1, minHeight: '12px', backgroundColor: state === 'done' ? '#BBF7D0' : '#E2E8F0' }} />}
                  </div>
                  <div style={{ paddingBottom: isLast ? 0 : '14px', paddingTop: '2px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>{approver.name[language] || approver.name.en}</span>
                    <span style={{ fontSize: CAPTION, color: '#64748B' }}>{approver.step[language] || approver.step.en}</span>
                    <span style={{ fontSize: CAPTION, fontWeight: 600, color: tone.color }}>{stepNote(state, index)}</span>
                  </div>
                </li>
              );
            })}
          </ol>
          {request.status === 'REJECTED' && request.rejectReason && (
            <p style={{ margin: '12px 0 0', padding: '10px 12px', borderRadius: '10px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', fontSize: CAPTION, color: '#B91C1C', lineHeight: 1.5 }}>
              {request.rejectReason}
            </p>
          )}
        </section>
      </div>

      {isPending && (
        <div style={{ position: 'sticky', bottom: 0, backgroundColor: '#FFFFFF', padding: '12px 16px 14px', borderTop: '1px solid #E2E8F0', boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.05)', display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '10px', zIndex: 40, boxSizing: 'border-box' }}>
          <button type="button" onClick={() => onReject(request)} style={{ height: '46px', borderRadius: '12px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', color: '#DC2626', fontSize: '14px', fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <X size={18} weight="bold" />
            <span>{isId ? 'Tolak' : 'Reject'}</span>
          </button>
          <button type="button" onClick={() => onApprove(request.id)} style={{ height: '46px', borderRadius: '12px', border: 'none', backgroundColor: '#16A34A', color: '#FFFFFF', fontSize: '14px', fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.2)' }}>
            <Check size={18} weight="bold" />
            <span>{isFinalStep ? (isId ? 'Setujui' : 'Approve') : (isId ? 'Verifikasi & Teruskan' : 'Verify & Forward')}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default QuotaAdjustmentApprovalDetail;
