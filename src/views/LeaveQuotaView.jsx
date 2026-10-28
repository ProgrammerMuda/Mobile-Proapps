import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  CaretLeft,
  CalendarBlank,
  Tag,
  Hash,
  UserCircle,
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
  ArrowCounterClockwise,
  ChatText,
  XCircle,
  UsersThree,
  MagnifyingGlass,
  CaretDown,
  X,
} from '@phosphor-icons/react';
import { ADJUST_APPROVERS, ADJUST_MAX_DAYS, ADJUST_TYPES, ANNUAL_LEAVE_PERIOD, adjustEffectText, STAFF_LEAVE_QUOTAS, canAdjustForOthers, createAdjustmentEntry, dayUnit, formatQuotaDate, getQuotaSummary, getRestorableDeductions, isDeductType } from '../data/leaveQuota';
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

const initialsOf = (name) => name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();

const EmployeeAvatar = ({ name, size = 40 }) => (
  <span aria-hidden="true" style={{ width: `${size}px`, height: `${size}px`, borderRadius: '50%', backgroundColor: '#EAF7FF', border: '1px solid #BAE6FD', color: '#053079', fontSize: '13px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    {initialsOf(name)}
  </span>
);

// Bottom sheet with search; rows show name, NIP and position.
const EmployeePickerSheet = ({ staff, selectedId, onSelect, onClose, language }) => {
  const [query, setQuery] = useState('');
  const needle = query.trim().toLowerCase();
  const matches = staff.filter((employee) => !needle || `${employee.name} ${employee.nip} ${employee.position} ${employee.role}`.toLowerCase().includes(needle));

  return createPortal(
    <div
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      style={{ position: document.getElementById('phone-screen-container') ? 'absolute' : 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.55)', zIndex: 9999, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', backdropFilter: 'blur(3px)' }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quota-employee-sheet-title"
        onKeyDown={(event) => { if (event.key === 'Escape') onClose(); }}
        style={{ boxSizing: 'border-box', backgroundColor: '#FFFFFF', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '16px 20px 20px', height: '86%', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.15)' }}
      >
        <div aria-hidden="true" style={{ width: '48px', height: '4px', borderRadius: '999px', backgroundColor: '#E2E8F0', alignSelf: 'center', flexShrink: 0 }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <h3 id="quota-employee-sheet-title" style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#334155', letterSpacing: '-0.01em' }}>
              {language === 'id' ? 'Pilih Karyawan' : 'Select Employee'}
            </h3>
            <p style={{ margin: '3px 0 0', fontSize: FONT.caption, color: '#64748B', lineHeight: 1.4 }}>
              {language === 'id' ? 'Karyawan yang kuota cutinya akan disesuaikan' : 'The employee whose leave quota will be adjusted'}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label={language === 'id' ? 'Tutup' : 'Close'} style={{ border: 'none', background: '#F1F5F9', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B', flexShrink: 0 }}>
            <X size={18} weight="bold" />
          </button>
        </div>

        <div style={{ height: '44px', backgroundColor: '#F1F5F9', borderRadius: '12px', border: '1.5px solid #E2E8F0', display: 'flex', alignItems: 'center', padding: '0 12px', gap: '8px', boxSizing: 'border-box', flexShrink: 0 }}>
          <MagnifyingGlass size={18} weight="bold" color="#64748B" aria-hidden="true" style={{ flexShrink: 0 }} />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label={language === 'id' ? 'Cari karyawan' : 'Search employee'}
            placeholder={language === 'id' ? 'Cari nama, NIP, atau jabatan...' : 'Search name, NIP, or position...'}
            style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: '14px', color: '#334155', fontFamily: 'inherit' }}
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label={language === 'id' ? 'Hapus pencarian' : 'Clear search'} style={{ border: 'none', background: 'transparent', padding: '4px', color: '#94A3B8', cursor: 'pointer', display: 'flex' }}>
              <X size={15} weight="bold" />
            </button>
          )}
        </div>

        <span style={{ fontSize: FONT.caption, fontWeight: 600, color: '#64748B', padding: '0 2px' }}>
          {language === 'id' ? `${matches.length} karyawan` : `${matches.length} ${matches.length === 1 ? 'employee' : 'employees'}`}
        </span>

        <div role="listbox" aria-labelledby="quota-employee-sheet-title" style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', margin: '0 -4px', padding: '0 4px 4px' }}>
          {matches.length === 0 ? (
            <p style={{ margin: 0, padding: '24px 14px', fontSize: '13px', color: '#64748B', textAlign: 'center' }}>
              {language === 'id' ? 'Karyawan tidak ditemukan.' : 'No employee found.'}
            </p>
          ) : matches.map((employee) => {
            const selected = employee.id === selectedId;
            return (
              <button key={employee.id} type="button" role="option" aria-selected={selected} onClick={() => onSelect(employee.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: selected ? '1.5px solid #053079' : '1px solid #E2E8F0', borderRadius: '12px', backgroundColor: selected ? '#F8FAFC' : '#FFFFFF', fontFamily: 'inherit', textAlign: 'left', cursor: 'pointer', boxSizing: 'border-box', flexShrink: 0 }}>
                <EmployeeAvatar name={employee.name} />
                <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '14px', fontWeight: selected ? 700 : 600, color: selected ? '#053079' : '#334155' }}>{employee.name}</span>
                  <span style={{ fontSize: FONT.caption, color: '#64748B' }}>NIP {employee.nip}</span>
                  <span style={{ fontSize: FONT.caption, color: '#64748B' }}>{employee.position} · {employee.role}</span>
                </span>
                <span aria-hidden="true" style={{ width: '20px', height: '20px', borderRadius: '50%', border: selected ? 'none' : '2px solid #CBD5E1', backgroundColor: selected ? '#053079' : 'transparent', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxSizing: 'border-box' }}>
                  {selected && <Check size={12} weight="bold" />}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>,
    document.getElementById('phone-screen-container') || document.body
  );
};

// Select-style field; the chosen employee's details and balance show once picked.
const EmployeeSelectField = ({ staff, selected, onSelect, language }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button type="button" id="quota-employee" onClick={() => setIsOpen(true)} aria-haspopup="dialog" style={{ width: '100%', minHeight: '48px', padding: selected ? '10px 12px' : '11px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: selected ? '#334155' : '#94A3B8', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', textAlign: 'left', boxSizing: 'border-box', fontFamily: 'inherit' }}>
        {selected ? (
          <>
            <EmployeeAvatar name={selected.name} size={36} />
            <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>{selected.name}</span>
              <span style={{ fontSize: FONT.caption, color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>NIP {selected.nip} · {selected.position}</span>
            </span>
          </>
        ) : (
          <>
            <UserCircle size={20} color="#94A3B8" aria-hidden="true" style={{ flexShrink: 0 }} />
            <span style={{ flex: 1 }}>{language === 'id' ? 'Pilih karyawan' : 'Select employee'}</span>
          </>
        )}
        <CaretDown size={18} color="#64748B" aria-hidden="true" style={{ flexShrink: 0 }} />
      </button>
      {selected && (
        <p style={{ margin: '6px 0 0', fontSize: FONT.caption, color: selected.remaining <= 2 ? '#C2410C' : '#64748B', lineHeight: 1.4 }}>
          {language === 'id' ? `Sisa kuota cuti tahunan: ${selected.remaining} hari` : `Annual leave left: ${selected.remaining} ${dayUnit(selected.remaining, language)}`}
        </p>
      )}
      {isOpen && (
        <EmployeePickerSheet
          staff={staff}
          selectedId={selected?.id}
          language={language}
          onClose={() => setIsOpen(false)}
          onSelect={(id) => { onSelect(id); setIsOpen(false); }}
        />
      )}
    </>
  );
};

const AdjustPage = ({ ownBalance, ownRestorable, canRequestForOthers, autoVerified, staff, onBack, onSubmit, language }) => {
  const [requestFor, setRequestFor] = useState('SELF');
  const [employeeId, setEmployeeId] = useState(null);
  const [type, setType] = useState('ADD');
  const [restoreId, setRestoreId] = useState(null);
  // Raw text so the field can be cleared while typing; clamped on blur.
  const [daysInput, setDaysInput] = useState('1');
  const [reason, setReason] = useState('');

  // Balance and restorable deductions follow whoever the request is for.
  const isForOther = requestFor === 'OTHER';
  const employee = isForOther ? staff.find((item) => item.id === employeeId) : null;
  const targetReady = !isForOther || Boolean(employee);
  const currentBalance = employee ? employee.remaining : ownBalance;
  const restorable = employee ? employee.deductions : ownRestorable;

  const handleTargetChange = (nextFor, nextEmployeeId) => {
    setRequestFor(nextFor);
    setEmployeeId(nextEmployeeId);
    setRestoreId(null);
  };

  const isRestore = type === 'RESTORE';
  const restoreTarget = isRestore ? restorable.find((entry) => entry.id === restoreId) : null;
  const isDeduct = isDeductType(type);
  // A deduction cannot take the balance below zero.
  const maxDays = isDeduct ? Math.min(ADJUST_MAX_DAYS, currentBalance) : ADJUST_MAX_DAYS;
  const typedDays = Math.max(1, Math.min(maxDays, Number(daysInput) || 1));
  // A restore gives back exactly what the chosen deduction took.
  const days = isRestore ? (restoreTarget?.days ?? 0) : typedDays;
  const setDays = (update) => setDaysInput(String(update(typedDays)));
  const sign = isDeduct ? '−' : '+';
  const newBalance = isDeduct ? currentBalance - days : currentBalance + days;
  const isValid = targetReady && reason.trim().length >= 10 && (isRestore ? Boolean(restoreTarget) : maxDays >= 1);

  const handleDaysInput = (event) => {
    const digits = event.target.value.replace(/\D/g, '').replace(/^0+/, '').slice(0, 2);
    setDaysInput(digits === '' ? '' : String(Math.min(maxDays, Number(digits))));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isValid) return;
    const restoreSource = restoreTarget && { id: restoreTarget.id, type: restoreTarget.type, days: restoreTarget.days, date: restoreTarget.date, title: restoreTarget.title };
    onSubmit({ type, days, reason: reason.trim(), restoreSource }, employee);
  };

  const requestForOptions = [
    { id: 'SELF', Icon: UserCircle, label: language === 'id' ? 'Diri sendiri' : 'Myself' },
    { id: 'OTHER', Icon: UsersThree, label: language === 'id' ? 'Karyawan lain' : 'Another employee' },
  ];

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
        {canRequestForOthers && (
          <fieldset style={{ padding: 0, margin: 0, border: 'none', minWidth: 0 }}>
            <legend style={{ ...LABEL_STYLE, padding: 0 }}>
              {language === 'id' ? 'Ajukan untuk' : 'Request for'}<Required />
            </legend>
            <div role="radiogroup" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {requestForOptions.map(({ id, Icon, label }) => {
                const selected = requestFor === id;
                return (
                  <button key={id} type="button" role="radio" aria-checked={selected} onClick={() => handleTargetChange(id, null)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', border: selected ? '1.5px solid #053079' : '1px solid #E2E8F0', borderRadius: '12px', backgroundColor: selected ? '#F8FAFC' : '#FFFFFF', boxShadow: selected ? '0 2px 8px rgba(5, 48, 121, 0.08)' : 'none', color: selected ? '#053079' : '#334155', fontFamily: 'inherit', fontSize: '14px', fontWeight: selected ? 700 : 500, textAlign: 'left', cursor: 'pointer', boxSizing: 'border-box', transition: 'all 0.15s ease' }}>
                    <Icon size={20} weight={selected ? 'fill' : 'regular'} color={selected ? '#053079' : '#64748B'} aria-hidden="true" />
                    {label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {isForOther && (
          <div>
            <label htmlFor="quota-employee" style={LABEL_STYLE}>
              {language === 'id' ? 'Karyawan' : 'Employee'}<Required />
            </label>
            <EmployeeSelectField staff={staff} selected={employee} onSelect={(id) => handleTargetChange('OTHER', id)} language={language} />
          </div>
        )}

        {targetReady && (
        <>
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

        {isRestore && (
          <fieldset style={{ padding: 0, margin: 0, border: 'none', minWidth: 0 }}>
            <legend style={{ ...LABEL_STYLE, padding: 0 }}>
              {language === 'id' ? 'Pemotongan yang dikembalikan' : 'Deduction to restore'}<Required />
            </legend>
            {restorable.length === 0 ? (
              <p style={{ margin: 0, padding: '14px', borderRadius: '12px', border: '1px dashed #CBD5E1', backgroundColor: '#F8FAFC', fontSize: '13px', color: '#64748B', lineHeight: 1.5, textAlign: 'center' }}>
                {language === 'id' ? 'Tidak ada pemotongan yang bisa dikembalikan.' : 'There are no deductions to restore.'}
              </p>
            ) : (
              <div role="radiogroup" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {restorable.map((entry) => {
                  const selected = restoreId === entry.id;
                  const { Icon, label, bg, border, color } = TYPE_STYLES[entry.type];
                  return (
                    <button key={entry.id} type="button" role="radio" aria-checked={selected} onClick={() => setRestoreId(entry.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', border: selected ? '1.5px solid #053079' : '1px solid #E2E8F0', borderRadius: '12px', backgroundColor: selected ? '#F8FAFC' : '#FFFFFF', boxShadow: selected ? '0 2px 8px rgba(5, 48, 121, 0.08)' : 'none', color: '#334155', fontFamily: 'inherit', textAlign: 'left', cursor: 'pointer', boxSizing: 'border-box', transition: 'all 0.15s ease' }}>
                      <span aria-hidden="true" style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: bg, border: `1px solid ${border}`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={18} />
                      </span>
                      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '14px', fontWeight: selected ? 700 : 600, color: selected ? '#053079' : '#334155', lineHeight: 1.35 }}>{entry.title[language] || entry.title.en}</span>
                        <span style={{ fontSize: FONT.caption, color: '#64748B' }}>{label[language] || label.en} · {formatQuotaDate(entry.date, language)}</span>
                      </span>
                      <span style={{ flexShrink: 0, fontSize: '13px', fontWeight: 700, color: '#B91C1C', whiteSpace: 'nowrap' }}>−{entry.days} {dayUnit(entry.days, language)}</span>
                      <span aria-hidden="true" style={{ width: '20px', height: '20px', borderRadius: '50%', border: selected ? 'none' : '2px solid #CBD5E1', backgroundColor: selected ? '#053079' : 'transparent', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxSizing: 'border-box' }}>
                        {selected && <Check size={12} weight="bold" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </fieldset>
        )}

        {!isRestore && (
        <div>
          <label htmlFor="quota-days" style={LABEL_STYLE}>
            {language === 'id' ? 'Jumlah hari' : 'Number of days'}<Required />
          </label>
          <div className="quota-days-box" style={{ display: 'flex', alignItems: 'center', minHeight: '44px', border: '1px solid #CBD5E1', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
            <button type="button" aria-label={language === 'id' ? 'Kurangi hari' : 'Decrease days'} disabled={typedDays <= 1} onClick={() => setDays((value) => Math.max(1, value - 1))} style={stepButton(typedDays <= 1)}>
              <Minus size={18} aria-hidden="true" />
            </button>
            <input id="quota-days" className="quota-days-input" type="text" inputMode="numeric" value={daysInput} onChange={handleDaysInput} onFocus={(event) => event.target.select()} onBlur={() => setDaysInput(String(typedDays))} style={{ flex: 1, minWidth: 0, height: '44px', padding: 0, border: 'none', outline: 'none', textAlign: 'center', fontSize: '14px', fontWeight: 700, color: '#334155', backgroundColor: 'transparent', fontFamily: 'inherit' }} />
            <button type="button" aria-label={language === 'id' ? 'Tambah hari' : 'Increase days'} disabled={typedDays >= maxDays} onClick={() => setDays((value) => Math.min(maxDays, value + 1))} style={stepButton(typedDays >= maxDays)}>
              <Plus size={18} aria-hidden="true" />
            </button>
            <span style={{ alignSelf: 'stretch', display: 'flex', alignItems: 'center', padding: '0 14px', borderLeft: '1px solid #CBD5E1', backgroundColor: '#F1F5F9', fontSize: '14px', fontWeight: 500, color: '#64748B' }}>{dayUnit(days, language)}</span>
          </div>
          <p style={{ margin: '6px 0 0', fontSize: FONT.caption, color: isDeduct && maxDays < 1 ? '#B91C1C' : '#64748B', lineHeight: 1.4 }}>
            {isDeduct && maxDays < 1
              ? (language === 'id' ? 'Saldo kuota sudah 0, tidak ada yang bisa dikurangi.' : 'Your balance is 0, so there is nothing to deduct.')
              : isDeduct
              ? (language === 'id' ? `Hari penuh, 1 sampai ${maxDays} (sisa saldo Anda).` : `Whole days, 1 to ${maxDays} (your remaining balance).`)
              : (language === 'id' ? `Hari penuh, 1 sampai ${ADJUST_MAX_DAYS}.` : `Whole days, 1 to ${ADJUST_MAX_DAYS}.`)}
          </p>
        </div>
        )}

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
              <dt style={{ fontSize: FONT.caption, fontWeight: 500, color: '#64748B' }}>
                {employee ? (language === 'id' ? `Saldo ${employee.name.split(' ')[0]}` : `${employee.name.split(' ')[0]}'s balance`) : (language === 'id' ? 'Saldo saat ini' : 'Current balance')}
              </dt>
              <dd style={{ margin: 0, display: 'flex', alignItems: 'baseline', gap: '4px', color: '#334155' }}>
                <strong style={{ fontSize: '1.25rem', fontWeight: 800 }}>{currentBalance}</strong>
                <span style={{ fontSize: FONT.caption, fontWeight: 600, color: '#64748B' }}>{dayUnit(currentBalance, language)}</span>
              </dd>
            </div>
            <div aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
              <span style={{ padding: '1px 8px', borderRadius: '999px', fontSize: FONT.caption, fontWeight: 700, backgroundColor: isDeduct ? '#FEE2E2' : '#DCFCE7', color: isDeduct ? '#B91C1C' : '#15803D' }}>{sign}{days}</span>
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
                const isDone = autoVerified && index === 0;
                const note = isDone ? (language === 'id' ? 'Terverifikasi otomatis oleh Anda' : 'Verified automatically by you') : null;
                return (
                  <li key={approver.initials} style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span aria-hidden="true" style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: isDone ? '#DCFCE7' : '#EAF7FF', border: `1px solid ${isDone ? '#BBF7D0' : '#BAE6FD'}`, color: isDone ? '#15803D' : '#053079', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {isDone ? <Check size={16} weight="bold" /> : approver.initials}
                      </span>
                      {!isLast && <span aria-hidden="true" style={{ width: '2px', flex: 1, minHeight: '12px', backgroundColor: isDone ? '#BBF7D0' : '#E2E8F0' }} />}
                    </div>
                    <div style={{ paddingBottom: isLast ? 0 : '12px', display: 'flex', flexDirection: 'column', gap: '1px', paddingTop: '2px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>{approver.name[language] || approver.name.en}</span>
                      <span style={{ fontSize: FONT.caption, color: '#64748B' }}>{approver.step[language] || approver.step.en}</span>
                      {note && <span style={{ fontSize: FONT.caption, fontWeight: 600, color: '#15803D' }}>{note}</span>}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
        </>
        )}
      </form>
    </PermitPermissionView>
  );
};

// Mirrors the Request Permission success sheet.
const SubmittedSheet = ({ requestRef, forEmployee, autoVerified, onClose, onViewDetail, language }) => createPortal(
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
          {(() => {
            const who = forEmployee || (language === 'id' ? 'Anda' : 'you');
            const flow = autoVerified
              ? (language === 'id' ? 'sudah terverifikasi dan menunggu persetujuan Building Management' : 'is already verified and waiting for Building Management approval')
              : (language === 'id' ? 'menunggu persetujuan HR atau Building Service, lalu Building Management' : 'is waiting for approval from HR or Building Service, then Building Management');
            if (forEmployee) return language === 'id' ? `Permohonan ${requestRef} untuk ${forEmployee} ${flow}. Saldo ${forEmployee} berubah setelah disetujui.` : `Request ${requestRef} for ${forEmployee} ${flow}. ${forEmployee}'s balance changes once it is approved.`;
            return language === 'id' ? `Permohonan penyesuaian kuota ${requestRef} ${flow}. Saldo ${who} berubah setelah disetujui.` : `Quota adjustment request ${requestRef} ${flow}. Your balance changes once it is approved.`;
          })()}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
        {onViewDetail && (
          <button type="button" autoFocus onClick={onViewDetail} style={{ width: '100%', minHeight: '48px', backgroundColor: '#053079', color: '#FFFFFF', border: 'none', borderRadius: '12px', padding: '12px', fontSize: '14px', fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer' }}>
            {language === 'id' ? 'Lihat Detail Permohonan' : 'View Detail Request'}
          </button>
        )}
        <button type="button" autoFocus={!onViewDetail} onClick={onClose} style={onViewDetail
          ? { width: '100%', minHeight: '44px', backgroundColor: '#FFFFFF', color: '#64748B', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '10px', fontSize: '13.5px', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer' }
          : { width: '100%', minHeight: '48px', backgroundColor: '#053079', color: '#FFFFFF', border: 'none', borderRadius: '12px', padding: '12px', fontSize: '14px', fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer' }}>
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

export const RestoreSourceValue = ({ source, language }) => (
  <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
    <span>{source.title[language] || source.title.en}</span>
    <span style={{ fontSize: FONT.caption, fontWeight: 500, color: '#64748B' }}>
      {formatQuotaDate(source.date, language)} · <span style={{ color: '#B91C1C', fontWeight: 600 }}>−{source.days} {dayUnit(source.days, language)}</span>
    </span>
  </span>
);

export const BalanceTrio = ({ before, after, beforeLabel, afterLabel, sign, days, isAddition }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '8px' }}>
    <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', textAlign: 'center' }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#94A3B8', lineHeight: 1.2 }}>{before}</div>
      <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', marginTop: '2px' }}>{beforeLabel}</div>
    </div>
    <span aria-label={`${sign}${days}`} style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, backgroundColor: isAddition ? '#DCFCE7' : '#FEE2E2', color: isAddition ? '#15803D' : '#B91C1C', border: `2px solid ${isAddition ? '#BBF7D0' : '#FECACA'}` }}>
      {sign}{days}
    </span>
    <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: '#EAF7FF', border: '1px solid #BAE6FD', textAlign: 'center' }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#053079', lineHeight: 1.2 }}>{after}</div>
      <div style={{ fontSize: '11px', fontWeight: 600, color: '#0369A1', marginTop: '2px' }}>{afterLabel}</div>
    </div>
  </div>
);

const QuotaHistoryDetail = ({ row, currentBalance, onBack, language }) => {
  const pageRef = useRef(null);

  useLayoutEffect(() => {
    const scrollContainer = pageRef.current?.closest('.android-scroll-content');
    if (scrollContainer) scrollContainer.scrollTop = 0;
  }, []);

  const isAddition = row.kind === 'ADDITION';
  const isApproved = row.status === 'APPROVED';
  const isPending = row.status === 'PENDING';
  const sign = isAddition ? '+' : '−';
  const delta = isAddition ? row.days : -row.days;
  const heroDaysColor = isApproved ? (isAddition ? '#86EFAC' : '#FCA5A5') : 'rgba(255, 255, 255, 0.7)';
  // Approved rows show the real before/after; pending rows project from today's balance.
  const balancePair = isApproved
    ? { before: row.balanceAfter - delta, after: row.balanceAfter, beforeLabel: language === 'id' ? 'Sebelum' : 'Before', afterLabel: language === 'id' ? 'Sesudah' : 'After' }
    : isPending
    ? { before: currentBalance, after: currentBalance + delta, beforeLabel: language === 'id' ? 'Saldo saat ini' : 'Current balance', afterLabel: language === 'id' ? 'Jika disetujui' : 'If approved' }
    : null;
  const adjustMeta = ADJUST_TYPES.find((item) => item.id === row.adjustType);
  const { Icon: TypeIcon, label: typeLabel } = TYPE_STYLES[row.type];
  const cardStyle = { backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)', padding: '16px' };
  const cardTitle = { margin: 0, fontSize: '14px', fontWeight: 700, color: '#334155' };
  const heroPill = { display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '999px', backgroundColor: 'rgba(255, 255, 255, 0.16)', border: '1px solid rgba(255, 255, 255, 0.25)', fontSize: '11px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.2px' };

  const infoRows = [
    { Icon: Tag, label: language === 'id' ? 'Tipe' : 'Type', value: typeLabel[language] || typeLabel.en },
    adjustMeta && { Icon: Scales, label: language === 'id' ? 'Jenis penyesuaian' : 'Adjustment type', value: adjustMeta.label[language] || adjustMeta.label.en },
    { Icon: CalendarBlank, label: language === 'id' ? 'Tanggal' : 'Date', value: formatQuotaDate(row.date, language) },
    row.requestRef && { Icon: Hash, label: language === 'id' ? 'Nomor permohonan' : 'Request number', value: <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', color: '#6D28D9' }}>{row.requestRef}</span> },
    row.submittedBy && { Icon: UserCircle, label: language === 'id' ? 'Diajukan oleh' : 'Submitted by', value: row.submittedBy },
    row.restoreSource && { Icon: ArrowCounterClockwise, label: language === 'id' ? 'Pemotongan yang dikembalikan' : 'Restored deduction', value: <RestoreSourceValue source={row.restoreSource} language={language} /> },
    row.reason && { Icon: ChatText, label: language === 'id' ? 'Catatan' : 'Notes', value: row.reason },
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
            {isPending && (
              <span style={{ ...heroPill, backgroundColor: '#FFF7ED', border: '1px solid #FED7AA', color: '#C2410C' }}>
                <Hourglass size={12} weight="fill" aria-hidden="true" />
                {language === 'id' ? 'Menunggu Persetujuan' : 'Waiting Approval'}
              </span>
            )}
            {row.status === 'REJECTED' && (
              <span style={{ ...heroPill, backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C' }}>
                <XCircle size={12} weight="fill" aria-hidden="true" />
                {language === 'id' ? 'Ditolak' : 'Rejected'}
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
          {balancePair ? (
            <BalanceTrio {...balancePair} sign={sign} days={row.days} isAddition={isAddition} />
          ) : (
            <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: '12px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', fontSize: FONT.caption, lineHeight: 1.45 }}>
              <XCircle size={16} weight="fill" aria-hidden="true" style={{ flexShrink: 0 }} />
              {language === 'id' ? 'Permohonan ditolak, saldo tidak berubah.' : 'The request was rejected, so the balance did not change.'}
            </p>
          )}
          {adjustMeta && row.status !== 'REJECTED' && (
            <p style={{ margin: '10px 0 0', fontSize: FONT.caption, color: '#64748B', lineHeight: 1.45 }}>{adjustEffectText(row.adjustType, row.days, language)}</p>
          )}
          {isPending && (
            <p style={{ margin: '10px 0 0', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: '10px', backgroundColor: '#FFF7ED', border: '1px solid #FED7AA', color: '#C2410C', fontSize: FONT.caption, lineHeight: 1.45 }}>
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
                const currentStep = row.approvalStep || 1;
                const isDone = index + 1 < currentStep;
                const isCurrent = index + 1 === currentStep;
                const tone = isDone ? { bg: '#DCFCE7', border: '#BBF7D0', color: '#15803D' } : isCurrent ? { bg: '#FFF7ED', border: '#FED7AA', color: '#C2410C' } : { bg: '#F1F5F9', border: '#E2E8F0', color: '#64748B' };
                const status = isDone
                  ? `${language === 'id' ? 'Diverifikasi oleh' : 'Verified by'} ${row.verifiedBy || '-'}`
                  : isCurrent ? (language === 'id' ? 'Menunggu persetujuan' : 'Waiting for approval') : (language === 'id' ? 'Belum dimulai' : 'Not started');
                return (
                  <li key={approver.initials} style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span aria-hidden="true" style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: tone.bg, border: `1px solid ${tone.border}`, color: tone.color, fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {isDone ? <Check size={16} weight="bold" /> : approver.initials}
                      </span>
                      {!isLast && <span aria-hidden="true" style={{ width: '2px', flex: 1, minHeight: '12px', backgroundColor: isDone ? '#BBF7D0' : '#E2E8F0' }} />}
                    </div>
                    <div style={{ paddingBottom: isLast ? 0 : '12px', paddingTop: '2px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>{approver.name[language] || approver.name.en}</span>
                      <span style={{ fontSize: FONT.caption, color: '#64748B' }}>{approver.step[language] || approver.step.en}</span>
                      <span style={{ fontSize: FONT.caption, fontWeight: 600, color: tone.color }}>{status}</span>
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

export const LeaveQuotaView = ({ ledger, onAddAdjustment, onBack, userName = 'Employee', roleCode, userRole, language = 'en' }) => {
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

  // On-behalf requests only reach the approval list; they never touch the requester's own ledger.
  const handleSubmit = (payload, employee) => {
    const verifiedBy = canAdjustForOthers(roleCode) ? `${userName} (${roleCode === 'HR' ? 'HR' : 'Building Service'})` : null;
    const entry = createAdjustmentEntry({ ...payload, requestedBy: userName, requestedByRole: userRole, verifiedBy });
    onAddAdjustment(entry, employee);
    setIsAdjustOpen(false);
    setSubmittedEntry({ ...entry, forEmployee: employee?.name || null });
  };

  const selectedRow = rows.find((row) => row.id === selectedId);
  if (selectedRow) {
    return <QuotaHistoryDetail row={selectedRow} currentBalance={getQuotaSummary(ledger).remaining} language={language} onBack={() => setSelectedId(null)} />;
  }

  if (isAdjustOpen) {
    return (
      <AdjustPage
        language={language}
        ownBalance={getQuotaSummary(ledger).remaining}
        ownRestorable={getRestorableDeductions(ledger)}
        canRequestForOthers={canAdjustForOthers(roleCode)}
        autoVerified={canAdjustForOthers(roleCode)}
        staff={STAFF_LEAVE_QUOTAS.filter((employee) => employee.name !== userName)}
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

      {/* Same footer and button as "Apply Request Permission" */}
      <div style={{ position: 'sticky', bottom: 0, left: 0, right: 0, zIndex: 35, padding: '12px 16px 14px 16px', backgroundColor: '#FFFFFF', boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.05)', borderTop: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <button type="button" onClick={() => setIsAdjustOpen(true)} style={{ width: '100%', height: '52px', backgroundColor: '#053079', color: '#FFFFFF', border: 'none', borderRadius: '16px', fontSize: '0.9375rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', boxShadow: 'none', letterSpacing: '-0.01em', fontFamily: 'inherit', transition: 'transform 0.1s ease' }}>
          <Plus size={20} weight="bold" aria-hidden="true" />
          <span>{language === 'id' ? 'Ajukan Penyesuaian Kuota' : 'Request Quota Adjustment'}</span>
        </button>
      </div>

      {submittedEntry && (
        <SubmittedSheet
          requestRef={submittedEntry.requestRef}
          forEmployee={submittedEntry.forEmployee}
          autoVerified={Boolean(submittedEntry.verifiedBy)}
          language={language}
          onClose={() => setSubmittedEntry(null)}
          onViewDetail={submittedEntry.forEmployee ? null : () => {
            setSelectedId(submittedEntry.id);
            setSubmittedEntry(null);
          }}
        />
      )}
    </div>
  );
};

export default LeaveQuotaView;
