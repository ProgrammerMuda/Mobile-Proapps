import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  CaretLeft,
  CalendarBlank,
  Tag,
  Hash,
  UserCircle,
  PencilSimpleLine,
  ArrowsClockwise,
  Briefcase,
  CalendarCheck,
  CalendarStar,
  Scales,
  Hourglass,
  Minus,
  Plus,
  Check,
  UserCheck,
  ArrowRight,
} from '@phosphor-icons/react';
import { ADJUST_APPROVERS, ADJUST_MAX_DAYS, ADJUST_TYPES, ANNUAL_LEAVE_PERIOD, createAdjustmentEntry, dayUnit, formatQuotaDate, getQuotaSummary } from '../data/leaveQuota';
import PermitPermissionView from './PermitPermissionView';
import successCheck from '../assets/illustrations/success-check.png';
import { QuotaSummaryCard } from './AnnualLeaveQuota';

const FONT = { body: '16px', heading: '16px', caption: '12px' };

const TYPE_STYLES = {
  ENTITLEMENT: { Icon: CalendarCheck, label: { id: 'Hak Cuti', en: 'Entitlement' }, bg: '#EFF6FF', border: '#BFDBFE', color: '#1E40AF' },
  CARRY_OVER: { Icon: ArrowsClockwise, label: { id: 'Sisa Tahun Lalu', en: 'Carry-over' }, bg: '#ECFDF5', border: '#A7F3D0', color: '#047857' },
  LEAVE_TAKEN: { Icon: Briefcase, label: { id: 'Cuti Diambil', en: 'Leave taken' }, bg: '#F1F5F9', border: '#E2E8F0', color: '#475569' },
  COLLECTIVE: { Icon: CalendarStar, label: { id: 'Cuti Bersama', en: 'Collective leave' }, bg: '#FFFBEB', border: '#FDE68A', color: '#B45309' },
  ADJUSTMENT: { Icon: Scales, label: { id: 'Penyesuaian', en: 'Adjustment' }, bg: '#F5F3FF', border: '#DDD6FE', color: '#6D28D9' },
};

const TypeBadge = ({ type, language }) => {
  const { Icon, label, bg, border, color } = TYPE_STYLES[type];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '999px', backgroundColor: bg, border: `1px solid ${border}`, color, fontSize: FONT.caption, fontWeight: 600, whiteSpace: 'nowrap' }}>
      <Icon size={14} aria-hidden="true" />
      {label[language] || label.en}
    </span>
  );
};

const StatusBadge = ({ status, language }) => {
  const map = {
    PENDING: { bg: '#FFF7ED', fg: '#C2410C', label: language === 'id' ? 'Menunggu Persetujuan' : 'Waiting Approval' },
    REJECTED: { bg: '#FEF2F2', fg: '#B91C1C', label: language === 'id' ? 'Ditolak' : 'Rejected' },
  };
  const style = map[status];
  if (!style) return null;
  return (
    <span style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '999px', backgroundColor: style.bg, color: style.fg, fontSize: FONT.caption, fontWeight: 600 }}>
      {status === 'PENDING' && <Hourglass size={12} weight="fill" aria-hidden="true" />}
      {style.label}
    </span>
  );
};

const LABEL_STYLE = { fontSize: '14px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' };
const Required = () => <span style={{ color: '#EF4444', marginLeft: '4px' }}>*</span>;

const AdjustPage = ({ currentBalance, onBack, onSubmit, language }) => {
  const [type, setType] = useState('ADD');
  const [days, setDays] = useState(1);
  const [reason, setReason] = useState('');

  const newBalance = currentBalance + days;
  const isValid = reason.trim().length >= 10;

  const handleDaysInput = (event) => {
    const digits = event.target.value.replace(/\D/g, '');
    if (digits === '') return setDays(1);
    setDays(Math.min(ADJUST_MAX_DAYS, Math.max(1, Number(digits))));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isValid) onSubmit({ type, days, reason: reason.trim() });
  };

  const stepButton = (disabled) => ({ width: '44px', height: '44px', border: 'none', background: 'transparent', color: disabled ? '#CBD5E1' : '#334155', cursor: disabled ? 'default' : 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 });

  return (
    <PermitPermissionView
      language={language}
      title={language === 'id' ? 'Penyesuaian Kuota' : 'Quota Adjustment'}
      backLabel={language === 'id' ? 'Kembali ke riwayat kuota' : 'Back to quota history'}
      onBack={onBack}
      footer={
        <button type="submit" form="quota-adjust-form" disabled={!isValid} style={{ width: '100%', minHeight: '48px', backgroundColor: isValid ? '#053079' : '#E2E8F0', color: isValid ? '#FFFFFF' : '#94A3B8', border: 'none', borderRadius: '12px', padding: '12px', fontSize: '0.9375rem', fontWeight: 700, cursor: isValid ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>
          {language === 'id' ? 'Kirim Permohonan' : 'Submit Request'}
        </button>
      }
    >
      <style>{`
        #quota-adjust-form .quota-days-box:focus-within {
          border-color: #09B2FF !important;
          box-shadow: 0 0 0 3px rgba(9, 178, 255, 0.16) !important;
        }
        #quota-adjust-form .quota-days-input:focus {
          box-shadow: none !important;
          border-color: transparent !important;
        }
      `}</style>
      <form id="quota-adjust-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <fieldset style={{ padding: 0, margin: 0, border: 'none', minWidth: 0 }}>
          <legend style={{ ...LABEL_STYLE, padding: 0 }}>
            {language === 'id' ? 'Jenis' : 'Type'}<Required />
          </legend>
          <div role="radiogroup" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {ADJUST_TYPES.map((item) => {
              const selected = type === item.id;
              return (
                <button key={item.id} type="button" role="radio" aria-checked={selected} onClick={() => setType(item.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '14px 16px', border: selected ? '1.5px solid #053079' : '1px solid #E2E8F0', borderRadius: '12px', backgroundColor: selected ? '#F8FAFC' : '#FFFFFF', boxShadow: selected ? '0 2px 8px rgba(5, 48, 121, 0.08)' : 'none', color: '#334155', fontFamily: 'inherit', textAlign: 'left', cursor: 'pointer', boxSizing: 'border-box', transition: 'all 0.15s ease' }}>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                    <span style={{ fontSize: '14px', fontWeight: selected ? 700 : 500, color: selected ? '#053079' : '#334155' }}>{item.label[language] || item.label.en}</span>
                    <span style={{ fontSize: FONT.caption, color: '#64748B', lineHeight: 1.4 }}>{item.hint[language] || item.hint.en}</span>
                  </span>
                  <span aria-hidden="true" style={{ width: '20px', height: '20px', borderRadius: '50%', border: selected ? 'none' : '2px solid #CBD5E1', backgroundColor: selected ? '#053079' : 'transparent', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxSizing: 'border-box' }}>
                    {selected && <Check size={12} weight="bold" />}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div>
          <label htmlFor="quota-days" style={LABEL_STYLE}>
            {language === 'id' ? 'Jumlah hari' : 'Number of days'}<Required />
          </label>
          <div className="quota-days-box" style={{ display: 'flex', alignItems: 'center', minHeight: '44px', border: '1px solid #CBD5E1', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
            <button type="button" aria-label={language === 'id' ? 'Kurangi hari' : 'Decrease days'} disabled={days <= 1} onClick={() => setDays((value) => Math.max(1, value - 1))} style={stepButton(days <= 1)}>
              <Minus size={18} aria-hidden="true" />
            </button>
            <input id="quota-days" className="quota-days-input" type="text" inputMode="numeric" value={days} onChange={handleDaysInput} style={{ flex: 1, minWidth: 0, height: '44px', padding: 0, border: 'none', outline: 'none', textAlign: 'center', fontSize: '14px', fontWeight: 700, color: '#334155', backgroundColor: 'transparent', fontFamily: 'inherit' }} />
            <button type="button" aria-label={language === 'id' ? 'Tambah hari' : 'Increase days'} disabled={days >= ADJUST_MAX_DAYS} onClick={() => setDays((value) => Math.min(ADJUST_MAX_DAYS, value + 1))} style={stepButton(days >= ADJUST_MAX_DAYS)}>
              <Plus size={18} aria-hidden="true" />
            </button>
            <span style={{ alignSelf: 'stretch', display: 'flex', alignItems: 'center', padding: '0 14px', borderLeft: '1px solid #CBD5E1', backgroundColor: '#F1F5F9', fontSize: '14px', fontWeight: 500, color: '#64748B' }}>{dayUnit(days, language)}</span>
          </div>
          <p style={{ margin: '6px 0 0', fontSize: FONT.caption, color: '#64748B', lineHeight: 1.4 }}>
            {language === 'id' ? `Hari penuh, 1 sampai ${ADJUST_MAX_DAYS}.` : `Whole days, 1 to ${ADJUST_MAX_DAYS}.`}
          </p>
        </div>

        <div>
          <label htmlFor="quota-adjust-reason" style={LABEL_STYLE}>
            {language === 'id' ? 'Catatan' : 'Notes'}<Required />
          </label>
          <textarea
            id="quota-adjust-reason"
            rows={4}
            required
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder={language === 'id' ? 'Mengapa penyesuaian ini diperlukan? Cantumkan nomor tiket atau memo persetujuan jika ada.' : 'Why is this adjustment needed? Include the ticket number or approval memo if there is one.'}
            style={{ width: '100%', boxSizing: 'border-box', padding: '11px 12px', border: '1px solid #CBD5E1', borderRadius: '10px', fontSize: '14px', fontWeight: reason ? 500 : 400, color: '#334155', outline: 'none', backgroundColor: '#FFFFFF', fontFamily: 'inherit', resize: 'vertical' }}
          />
        </div>

        <section aria-labelledby="quota-adjust-summary" style={{ border: '1px solid #E2E8F0', borderRadius: '12px', backgroundColor: '#FFFFFF', overflow: 'hidden' }}>
          <h2 id="quota-adjust-summary" style={{ margin: 0, padding: '12px 14px', fontSize: '14px', fontWeight: 700, color: '#334155', backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
            {language === 'id' ? 'Ringkasan' : 'Summary'}
          </h2>

          <dl style={{ margin: 0, padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <dt style={{ fontSize: FONT.caption, fontWeight: 500, color: '#64748B' }}>{language === 'id' ? 'Saldo saat ini' : 'Current balance'}</dt>
              <dd style={{ margin: 0, display: 'flex', alignItems: 'baseline', gap: '4px', color: '#334155' }}>
                <strong style={{ fontSize: '1.25rem', fontWeight: 800 }}>{currentBalance}</strong>
                <span style={{ fontSize: FONT.caption, fontWeight: 600, color: '#64748B' }}>{dayUnit(currentBalance, language)}</span>
              </dd>
            </div>
            <div aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
              <span style={{ padding: '1px 8px', borderRadius: '999px', fontSize: FONT.caption, fontWeight: 700, backgroundColor: '#DCFCE7', color: '#15803D' }}>+{days}</span>
              <ArrowRight size={16} color="#94A3B8" />
            </div>
            <div style={{ flex: 1, textAlign: 'right' }}>
              <dt style={{ fontSize: FONT.caption, fontWeight: 500, color: '#64748B' }}>{language === 'id' ? 'Saldo baru' : 'New balance'}</dt>
              <dd style={{ margin: 0, display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '4px', color: '#053079' }}>
                <strong style={{ fontSize: '1.25rem', fontWeight: 800 }}>{newBalance}</strong>
                <span style={{ fontSize: FONT.caption, fontWeight: 600, color: '#64748B' }}>{dayUnit(newBalance, language)}</span>
              </dd>
            </div>
          </dl>

          <div style={{ padding: '12px 14px 14px', borderTop: '1px solid #F1F5F9' }}>
            <h3 style={{ margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: FONT.caption, fontWeight: 600, color: '#64748B' }}>
              <UserCheck size={16} color="#09B2FF" aria-hidden="true" />
              {language === 'id' ? 'Alur Persetujuan' : 'Approval Flow'}
            </h3>
            <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
              {ADJUST_APPROVERS.map((approver, index) => {
                const isLast = index === ADJUST_APPROVERS.length - 1;
                return (
                  <li key={approver.initials} style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span aria-hidden="true" style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#EAF7FF', border: '1px solid #BAE6FD', color: '#053079', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{approver.initials}</span>
                      {!isLast && <span aria-hidden="true" style={{ width: '2px', flex: 1, minHeight: '12px', backgroundColor: '#E2E8F0' }} />}
                    </div>
                    <div style={{ paddingBottom: isLast ? 0 : '12px', display: 'flex', flexDirection: 'column', gap: '1px', paddingTop: '2px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>{approver.name[language] || approver.name.en}</span>
                      <span style={{ fontSize: FONT.caption, color: '#64748B' }}>{approver.step[language] || approver.step.en}</span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      </form>
    </PermitPermissionView>
  );
};

// Mirrors the Request Permission success sheet.
const SubmittedSheet = ({ requestRef, onClose, onViewDetail, language }) => createPortal(
  <div
    onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    style={{ position: document.getElementById('phone-screen-container') ? 'absolute' : 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.55)', zIndex: 9999, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', backdropFilter: 'blur(3px)' }}
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quota-submitted-title"
      onKeyDown={(event) => { if (event.key === 'Escape') onClose(); }}
      style={{ boxSizing: 'border-box', backgroundColor: '#FFFFFF', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '16px 20px 24px', maxHeight: '90%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.15)' }}
    >
      <div aria-hidden="true" style={{ width: '48px', height: '4px', borderRadius: '999px', backgroundColor: '#E2E8F0', alignSelf: 'center', flexShrink: 0 }} />

      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '4px 0 2px 0' }}>
        <img src={successCheck} alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
      </div>

      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
        <h3 id="quota-submitted-title" style={{ fontSize: '18px', fontWeight: 800, color: '#334155', margin: 0, letterSpacing: '-0.01em' }}>
          {language === 'id' ? 'Permohonan Berhasil Dikirim!' : 'Request Successfully Submitted!'}
        </h3>
        <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: 1.5, maxWidth: '320px' }}>
          {language === 'id'
            ? `Permohonan penyesuaian kuota ${requestRef} menunggu persetujuan HR atau Building Service, lalu Building Management. Saldo berubah setelah disetujui.`
            : `Quota adjustment request ${requestRef} is waiting for approval from HR or Building Service, then Building Management. Your balance changes once it is approved.`}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
        <button type="button" autoFocus onClick={onViewDetail} style={{ width: '100%', minHeight: '48px', backgroundColor: '#053079', color: '#FFFFFF', border: 'none', borderRadius: '12px', padding: '12px', fontSize: '14px', fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer' }}>
          {language === 'id' ? 'Lihat Detail Permohonan' : 'View Detail Request'}
        </button>
        <button type="button" onClick={onClose} style={{ width: '100%', minHeight: '44px', backgroundColor: '#FFFFFF', color: '#64748B', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '10px', fontSize: '13.5px', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer' }}>
          {language === 'id' ? 'Kembali ke Riwayat Kuota' : 'Back to Quota History'}
        </button>
      </div>
    </div>
  </div>,
  document.getElementById('phone-screen-container') || document.body
);

const InfoRow = ({ Icon, label, children, isLast }) => (
  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 0', borderBottom: isLast ? 'none' : '1px solid #F1F5F9' }}>
    <span aria-hidden="true" style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#EAF7FF', color: '#09B2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={18} weight="bold" />
    </span>
    <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span style={{ fontSize: FONT.caption, fontWeight: 500, color: '#64748B' }}>{label}</span>
      <span style={{ fontSize: '14px', fontWeight: 600, color: '#334155', lineHeight: 1.45, overflowWrap: 'anywhere' }}>{children}</span>
    </div>
  </li>
);

const QuotaHistoryDetail = ({ row, onBack, language }) => {
  const pageRef = useRef(null);

  useLayoutEffect(() => {
    const scrollContainer = pageRef.current?.closest('.android-scroll-content');
    if (scrollContainer) scrollContainer.scrollTop = 0;
  }, []);

  const isAddition = row.kind === 'ADDITION';
  const isApproved = row.status === 'APPROVED';
  const sign = isAddition ? '+' : '−';
  const heroDaysColor = isApproved ? (isAddition ? '#86EFAC' : '#FCA5A5') : 'rgba(255, 255, 255, 0.7)';
  const balanceBefore = row.balanceAfter != null ? row.balanceAfter - (isAddition ? row.days : -row.days) : null;
  const { Icon: TypeIcon, label: typeLabel } = TYPE_STYLES[row.type];
  const cardStyle = { backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)', padding: '16px' };
  const cardTitle = { margin: 0, fontSize: '14px', fontWeight: 700, color: '#334155' };
  const heroPill = { display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '999px', backgroundColor: 'rgba(255, 255, 255, 0.16)', border: '1px solid rgba(255, 255, 255, 0.25)', fontSize: '11px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.2px' };

  const infoRows = [
    { Icon: Tag, label: language === 'id' ? 'Tipe' : 'Type', value: typeLabel[language] || typeLabel.en },
    { Icon: CalendarBlank, label: language === 'id' ? 'Tanggal' : 'Date', value: formatQuotaDate(row.date, language) },
    row.requestRef && { Icon: Hash, label: language === 'id' ? 'Nomor permohonan' : 'Request number', value: <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', color: '#6D28D9' }}>{row.requestRef}</span> },
    { Icon: UserCircle, label: language === 'id' ? 'Sumber' : 'Source', value: row.actor[language] || row.actor.en },
  ].filter(Boolean);

  return (
    <div ref={pageRef} style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC', fontFamily: 'var(--font-sans)', fontSize: '14px', color: '#334155' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 40, backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '0 16px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
        <button type="button" onClick={onBack} aria-label={language === 'id' ? 'Kembali ke riwayat kuota' : 'Back to quota history'} style={{ border: 'none', background: 'transparent', color: '#334155', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
          <CaretLeft size={22} weight="bold" />
        </button>
        <h1 style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: '16px', fontWeight: 700, color: '#334155', margin: 0, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
          {language === 'id' ? 'Detail Riwayat Kuota' : 'Quota History Detail'}
        </h1>
        <div style={{ width: '36px' }} />
      </header>

      <div style={{ flex: 1, padding: '16px 16px 32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <section style={{ background: 'linear-gradient(135deg, #053079 0%, #0344A8 55%, #0284C7 100%)', borderRadius: '16px', padding: '18px 16px', color: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', overflow: 'hidden' }}>
          <TypeIcon aria-hidden="true" size={120} weight="fill" style={{ position: 'absolute', right: '-18px', top: '-14px', color: 'rgba(255, 255, 255, 0.08)' }} />
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px', position: 'relative' }}>
            <span style={heroPill}>
              <TypeIcon size={12} weight="bold" aria-hidden="true" />
              {typeLabel[language] || typeLabel.en}
            </span>
            {row.status === 'PENDING' && (
              <span style={{ ...heroPill, backgroundColor: '#FFF7ED', border: '1px solid #FED7AA', color: '#C2410C' }}>
                <Hourglass size={12} weight="fill" aria-hidden="true" />
                {language === 'id' ? 'Menunggu Persetujuan' : 'Waiting Approval'}
              </span>
            )}
          </div>

          <p style={{ margin: 0, display: 'flex', alignItems: 'baseline', gap: '6px', color: heroDaysColor, position: 'relative' }}>
            <strong style={{ fontSize: '40px', lineHeight: 1, fontWeight: 800, letterSpacing: '-1px' }}>{sign}{row.days}</strong>
            <span style={{ fontSize: '15px', fontWeight: 600 }}>{dayUnit(row.days, language)}</span>
          </p>

          <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#FFFFFF', lineHeight: 1.5, position: 'relative' }}>{row.title[language] || row.title.en}</h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.18)', fontSize: '12px', fontWeight: 500, color: 'rgba(255, 255, 255, 0.85)', position: 'relative' }}>
            <CalendarBlank size={14} weight="bold" color="#38BDF8" aria-hidden="true" />
            {formatQuotaDate(row.date, language)}
          </div>
        </section>

        <section style={cardStyle}>
          <h3 style={{ ...cardTitle, marginBottom: '12px' }}>{language === 'id' ? 'Perubahan Saldo' : 'Balance Change'}</h3>
          {balanceBefore != null ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '8px' }}>
              <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#94A3B8', lineHeight: 1.2 }}>{balanceBefore}</div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', marginTop: '2px' }}>{language === 'id' ? 'Sebelum' : 'Before'}</div>
              </div>
              <span aria-label={`${sign}${row.days}`} style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, backgroundColor: isAddition ? '#DCFCE7' : '#FEE2E2', color: isAddition ? '#15803D' : '#B91C1C', border: `2px solid ${isAddition ? '#BBF7D0' : '#FECACA'}` }}>
                {sign}{row.days}
              </span>
              <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: '#EAF7FF', border: '1px solid #BAE6FD', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#053079', lineHeight: 1.2 }}>{row.balanceAfter}</div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#0369A1', marginTop: '2px' }}>{language === 'id' ? 'Sesudah' : 'After'}</div>
              </div>
            </div>
          ) : (
            <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: '12px', backgroundColor: '#FFF7ED', border: '1px solid #FED7AA', color: '#C2410C', fontSize: FONT.caption, lineHeight: 1.45 }}>
              <Hourglass size={16} weight="fill" aria-hidden="true" style={{ flexShrink: 0 }} />
              {language === 'id' ? 'Saldo belum berubah. Saldo diperbarui setelah permohonan disetujui.' : 'The balance has not changed yet. It updates once the request is approved.'}
            </p>
          )}
        </section>

        <section style={{ ...cardStyle, paddingBottom: '4px' }}>
          <h3 style={{ ...cardTitle, marginBottom: '2px' }}>{language === 'id' ? 'Informasi' : 'Information'}</h3>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {infoRows.map((item, index) => (
              <InfoRow key={item.label} Icon={item.Icon} label={item.label} isLast={index === infoRows.length - 1}>{item.value}</InfoRow>
            ))}
          </ul>
        </section>

        {row.status === 'PENDING' && (
          <section style={cardStyle}>
            <h3 style={{ ...cardTitle, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <UserCheck size={18} color="#09B2FF" aria-hidden="true" />
              {language === 'id' ? 'Alur Persetujuan' : 'Approval Flow'}
            </h3>
            <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
              {ADJUST_APPROVERS.map((approver, index) => {
                const isLast = index === ADJUST_APPROVERS.length - 1;
                const isCurrent = index === 0;
                return (
                  <li key={approver.initials} style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span aria-hidden="true" style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: isCurrent ? '#FFF7ED' : '#F1F5F9', border: `1px solid ${isCurrent ? '#FED7AA' : '#E2E8F0'}`, color: isCurrent ? '#C2410C' : '#64748B', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{approver.initials}</span>
                      {!isLast && <span aria-hidden="true" style={{ width: '2px', flex: 1, minHeight: '12px', backgroundColor: '#E2E8F0' }} />}
                    </div>
                    <div style={{ paddingBottom: isLast ? 0 : '12px', paddingTop: '2px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>{approver.name[language] || approver.name.en}</span>
                      <span style={{ fontSize: FONT.caption, color: isCurrent ? '#C2410C' : '#64748B' }}>
                        {approver.step[language] || approver.step.en} · {isCurrent ? (language === 'id' ? 'Menunggu persetujuan' : 'Waiting for approval') : (language === 'id' ? 'Belum dimulai' : 'Not started')}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        )}
      </div>
    </div>
  );
};

export const LeaveQuotaView = ({ ledger, onAddAdjustment, onBack, userName = 'Employee', language = 'en' }) => {
  const [filter, setFilter] = useState('ALL');
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [submittedEntry, setSubmittedEntry] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  // Running balance is derived oldest-first so every approved row shows its balance after the change.
  const rows = useMemo(() => {
    const chronological = [...ledger].reverse();
    return chronological
      .map((entry, index) => {
        if (entry.status !== 'APPROVED') return { ...entry, balanceAfter: null };
        const balanceAfter = chronological
          .slice(0, index + 1)
          .filter((item) => item.status === 'APPROVED')
          .reduce((sum, item) => sum + (item.kind === 'ADDITION' ? item.days : -item.days), 0);
        return { ...entry, balanceAfter };
      })
      .reverse();
  }, [ledger]);

  const visible = rows.filter((row) => filter === 'ALL' || row.kind === filter);
  const filters = [
    { id: 'ALL', label: language === 'id' ? 'Semua' : 'All' },
    { id: 'ADDITION', label: language === 'id' ? 'Penambahan' : 'Additions' },
    { id: 'DEDUCTION', label: language === 'id' ? 'Pemotongan' : 'Deductions' },
  ];

  const handleSubmit = (payload) => {
    const entry = createAdjustmentEntry({ ...payload, requestedBy: userName });
    onAddAdjustment(entry);
    setIsAdjustOpen(false);
    setSubmittedEntry(entry);
  };

  const selectedRow = rows.find((row) => row.id === selectedId);
  if (selectedRow) {
    return <QuotaHistoryDetail row={selectedRow} language={language} onBack={() => setSelectedId(null)} />;
  }

  if (isAdjustOpen) {
    return (
      <AdjustPage
        language={language}
        currentBalance={getQuotaSummary(ledger).remaining}
        onBack={() => setIsAdjustOpen(false)}
        onSubmit={handleSubmit}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', backgroundColor: '#F1F5F9', color: '#334155', fontFamily: 'Inter, -apple-system, sans-serif', fontSize: FONT.body }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 40, backgroundColor: '#FFFFFF', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '36px', boxSizing: 'border-box' }}>
        <button type="button" onClick={onBack} aria-label={language === 'id' ? 'Kembali' : 'Back'} style={{ border: 'none', background: 'transparent', color: '#334155', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
          <CaretLeft size={22} weight="bold" />
        </button>
        <h1 style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', margin: 0, fontSize: FONT.heading, fontWeight: 700, color: '#334155', letterSpacing: '-0.01em', width: 'calc(100% - 72px)', textAlign: 'center', lineHeight: 1.2 }}>
          {language === 'id' ? 'Kuota Cuti' : 'Leave Quota'}
        </h1>
        <div style={{ width: '36px' }} />
      </header>

      <section aria-label={language === 'id' ? 'Ringkasan kuota' : 'Quota summary'} style={{ padding: '12px 16px 16px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ marginBottom: '10px' }}>
          <h2 style={{ margin: '0 0 3px', fontSize: FONT.body, fontWeight: 700, color: '#334155' }}>
            {language === 'id' ? 'Kuota Cuti Tahunan' : 'Annual Leave Quota'}
          </h2>
          <p style={{ margin: 0, fontSize: FONT.caption, color: '#64748B', lineHeight: 1.4 }}>
            {language === 'id' ? 'Periode' : 'Period'} {formatQuotaDate(ANNUAL_LEAVE_PERIOD.start, language)} – {formatQuotaDate(ANNUAL_LEAVE_PERIOD.end, language)}
          </p>
        </div>
        <QuotaSummaryCard ledger={ledger} language={language} />
      </section>

      <h2 style={{ margin: 0, padding: '16px 16px 0', fontSize: FONT.body, fontWeight: 700, color: '#334155' }}>
        {language === 'id' ? 'Riwayat Kuota' : 'Quota History'}
      </h2>

      <div role="group" aria-label={language === 'id' ? 'Filter riwayat' : 'History filter'} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '12px 16px 0' }}>
        {filters.map((item) => {
          const selected = filter === item.id;
          return (
            <button key={item.id} type="button" aria-pressed={selected} onClick={() => setFilter(item.id)} style={{ minHeight: '34px', padding: '6px 12px', border: `1px solid ${selected ? '#053079' : '#E2E8F0'}`, borderRadius: '10px', backgroundColor: selected ? '#EAF7FF' : '#FFFFFF', color: selected ? '#053079' : '#64748B', fontFamily: 'inherit', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>
              {item.label}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p style={{ margin: '32px 16px', textAlign: 'center', fontSize: '14px', color: '#64748B', flex: 1 }}>
          {language === 'id' ? 'Belum ada riwayat.' : 'No history yet.'}
        </p>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: '12px 16px 16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
          {visible.map((row) => {
            const isAddition = row.kind === 'ADDITION';
            const daysColor = row.status === 'APPROVED' ? (isAddition ? '#15803D' : '#B91C1C') : '#94A3B8';
            return (
              <li key={row.id}>
                <button type="button" onClick={() => setSelectedId(row.id)} className="quota-history-card" style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '12px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left', fontFamily: 'inherit', color: 'inherit', cursor: 'pointer', boxSizing: 'border-box' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <TypeBadge type={row.type} language={language} />
                    <strong style={{ fontSize: FONT.body, fontWeight: 700, color: daysColor }}>
                      {isAddition ? '+' : '−'}{row.days} <span style={{ fontSize: FONT.caption, fontWeight: 600 }}>{dayUnit(row.days, language)}</span>
                    </strong>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#334155', lineHeight: 1.45 }}>{row.title[language] || row.title.en}</span>
                    {row.requestRef && (
                      <span style={{ fontSize: FONT.caption, fontWeight: 600, color: '#6D28D9', lineHeight: 1.4 }}>
                        {language === 'id' ? 'Dari permohonan penyesuaian' : 'From adjustment request'}{' '}
                        <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', textDecoration: 'underline' }}>{row.requestRef}</span>
                      </span>
                    )}
                    <span style={{ fontSize: FONT.caption, color: '#64748B', lineHeight: 1.4 }}>{row.actor[language] || row.actor.en}</span>
                    <StatusBadge status={row.status} language={language} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', paddingTop: '8px', borderTop: '1px solid #F1F5F9', fontSize: FONT.caption, color: '#64748B' }}>
                    <span>{formatQuotaDate(row.date, language)}</span>
                    {row.balanceAfter != null && (
                      <span>
                        {language === 'id' ? 'Saldo' : 'Balance'} <strong style={{ fontSize: FONT.body, fontWeight: 700, color: '#334155' }}>{row.balanceAfter}</strong>
                      </span>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div style={{ position: 'sticky', bottom: 0, zIndex: 30, padding: '12px 16px 16px', backgroundColor: '#FFFFFF', borderTop: '1px solid #E2E8F0' }}>
        <button type="button" onClick={() => setIsAdjustOpen(true)} style={{ width: '100%', minHeight: '48px', padding: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: 'none', borderRadius: '12px', backgroundColor: '#053079', color: '#FFFFFF', fontFamily: 'inherit', fontSize: FONT.body, fontWeight: 600, cursor: 'pointer' }}>
          <PencilSimpleLine size={20} aria-hidden="true" />
          {language === 'id' ? 'Ajukan Penyesuaian Kuota' : 'Request Quota Adjustment'}
        </button>
      </div>

      {submittedEntry && (
        <SubmittedSheet
          requestRef={submittedEntry.requestRef}
          language={language}
          onClose={() => setSubmittedEntry(null)}
          onViewDetail={() => {
            setSelectedId(submittedEntry.id);
            setSubmittedEntry(null);
          }}
        />
      )}
    </div>
  );
};

export default LeaveQuotaView;
