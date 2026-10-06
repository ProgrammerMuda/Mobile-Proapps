import React, { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CaretLeft, CalendarBlank, Check, X, ArrowsLeftRight, Clock, CaretDown, Info, CalendarCheck, UserSwitch, MagnifyingGlass } from '@phosphor-icons/react';
import { CustomDatePickerPopover } from '../components/common';

const SHIFT_OPTIONS = [
  'Shift Pagi (08:00 - 17:00)',
  'Shift Siang (13:00 - 21:00)',
  'Shift Malam (20:00 - 05:00)',
  'Shift Normal (08:30 - 17:30)',
  'Libur Reguler (Day Off)',
];

const EMPLOYEE_OPTIONS = [
  // Shift Siang (13:00 - 21:00)
  { id: 'emp-1', name: 'Dimas Prasetyo', role: 'Engineering', shift: 'Shift Siang (13:00 - 21:00)' },
  { id: 'emp-2', name: 'Agus Setiawan', role: 'Security', shift: 'Shift Siang (13:00 - 21:00)' },
  { id: 'emp-3', name: 'Siti Rahma', role: 'Housekeeping', shift: 'Shift Siang (13:00 - 21:00)' },
  { id: 'emp-4', name: 'Bayu Pratama', role: 'BM', shift: 'Shift Siang (13:00 - 21:00)' },
  { id: 'emp-1a', name: 'Yusuf Maulana', role: 'Engineering', shift: 'Shift Siang (13:00 - 21:00)' },
  { id: 'emp-2a', name: 'Taufik Hidayat', role: 'Security', shift: 'Shift Siang (13:00 - 21:00)' },
  { id: 'emp-3a', name: 'Ratna Sari', role: 'Housekeeping', shift: 'Shift Siang (13:00 - 21:00)' },

  // Shift Malam (20:00 - 05:00)
  { id: 'emp-5', name: 'Budi Santoso', role: 'Engineering', shift: 'Shift Malam (20:00 - 05:00)' },
  { id: 'emp-6', name: 'Rudi Hartono', role: 'Security', shift: 'Shift Malam (20:00 - 05:00)' },
  { id: 'emp-7', name: 'Farhan Maulana', role: 'Housekeeping', shift: 'Shift Malam (20:00 - 05:00)' },
  { id: 'emp-8', name: 'Hendra Wijaya', role: 'BM', shift: 'Shift Malam (20:00 - 05:00)' },
  { id: 'emp-5a', name: 'Rahmat Dani', role: 'Engineering', shift: 'Shift Malam (20:00 - 05:00)' },
  { id: 'emp-6a', name: 'Ilham Saputra', role: 'Security', shift: 'Shift Malam (20:00 - 05:00)' },

  // Shift Pagi (08:00 - 17:00)
  { id: 'emp-9', name: 'Dewi Lestari', role: 'Engineering', shift: 'Shift Pagi (08:00 - 17:00)' },
  { id: 'emp-10', name: 'Joko Susilo', role: 'Security', shift: 'Shift Pagi (08:00 - 17:00)' },
  { id: 'emp-11', name: 'Sri Wahyuni', role: 'Housekeeping', shift: 'Shift Pagi (08:00 - 17:00)' },
  { id: 'emp-12', name: 'Anisa Putri', role: 'BM', shift: 'Shift Pagi (08:00 - 17:00)' },
  { id: 'emp-9a', name: 'Panji Gumilang', role: 'BM', shift: 'Shift Pagi (08:00 - 17:00)' },
  { id: 'emp-10a', name: 'Nadia Salsabila', role: 'Customer Service', shift: 'Shift Pagi (08:00 - 17:00)' },

  // Shift Normal (08:30 - 17:30)
  { id: 'emp-13', name: 'Rizky Ramadhan', role: 'Engineering', shift: 'Shift Normal (08:30 - 17:30)' },
  { id: 'emp-14', name: 'Eko Prasetya', role: 'Security', shift: 'Shift Normal (08:30 - 17:30)' },
  { id: 'emp-15', name: 'Maya Indah', role: 'Housekeeping', shift: 'Shift Normal (08:30 - 17:30)' },
  { id: 'emp-16', name: 'Citra Kirana', role: 'BM', shift: 'Shift Normal (08:30 - 17:30)' },

  // Libur Reguler (Day Off) - Rekan yang siap menerima Shift Transfer
  { id: 'emp-17', name: 'Dedi Suryadi', role: 'Engineering', shift: 'Libur Reguler (Day Off)' },
  { id: 'emp-18', name: 'Ahmad Fauzi', role: 'Security', shift: 'Libur Reguler (Day Off)' },
  { id: 'emp-19', name: 'Rina Melati', role: 'Housekeeping', shift: 'Libur Reguler (Day Off)' },
  { id: 'emp-20', name: 'Doni Irawan', role: 'BM', shift: 'Libur Reguler (Day Off)' },
  { id: 'emp-21', name: 'Fikri Ramadhani', role: 'Engineering', shift: 'Libur Reguler (Day Off)' },
  { id: 'emp-22', name: 'Sari Indrayani', role: 'Customer Service', shift: 'Libur Reguler (Day Off)' },
  { id: 'emp-23', name: 'Wahyu Hidayat', role: 'Engineering', shift: 'Libur Reguler (Day Off)' },
  { id: 'emp-24', name: 'Siti Aminah', role: 'Housekeeping', shift: 'Libur Reguler (Day Off)' },
  { id: 'emp-25', name: 'Bambang Suherman', role: 'Security', shift: 'Libur Reguler (Day Off)' },
  { id: 'emp-26', name: 'Linda Permata', role: 'Tenant Relation', shift: 'Libur Reguler (Day Off)' },
  { id: 'emp-27', name: 'Bagus Prasetya', role: 'BM', shift: 'Libur Reguler (Day Off)' },
  { id: 'emp-28', name: 'Nurul Hidayati', role: 'Finance', shift: 'Libur Reguler (Day Off)' },
  { id: 'emp-29', name: 'Tri Wibowo', role: 'Engineering', shift: 'Libur Reguler (Day Off)' },
  { id: 'emp-30', name: 'Maya Safitri', role: 'Customer Service', shift: 'Libur Reguler (Day Off)' },
];

export default function ChangeShiftView({
  onBack,
  language = 'id',
  onSubmit,
}) {
  const pageRef = useRef(null);
  const isId = language === 'id';

  // Mode: 'CHANGE_SHIFT' (Ganti Shift Mandiri) vs 'CHANGE_SHIFT_SWAP' (Tukar Shift Rekan)
  const [shiftMode, setShiftMode] = useState('CHANGE_SHIFT');

  // Form State
  const [scheduleDate, setScheduleDate] = useState('');
  const [currentShift, setCurrentShift] = useState('');
  const [targetShift, setTargetShift] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [notes, setNotes] = useState('');

  // UI state
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isEmployeePickerOpen, setIsEmployeePickerOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState('TRANSFER'); // 'TRANSFER' | 'SWAP'
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState('');

  // Scroll to top
  useLayoutEffect(() => {
    const scrollContainer = pageRef.current?.closest('.android-scroll-content');
    if (scrollContainer) scrollContainer.scrollTop = 0;
  }, []);

  // Initials generator for avatars
  const getInitials = (name = '') => {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return 'EM';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Format date display (e.g. 28 Sep 2026)
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parts[0];
        const monthIndex = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const monthsId = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const m = isId ? monthsId[monthIndex] : monthsEn[monthIndex];
        return `${day} ${m} ${year}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  // Today (YYYY-MM-DD) — past dates cannot be selected
  const todayStr = (() => {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
  })();

  const handleDateSelect = (selectedDateStr) => {
    if (selectedDateStr < todayStr) return;
    setScheduleDate(selectedDateStr);
    setIsDatePickerOpen(false);
    setTargetShift('');
    setEmployeeName('');

    // Auto-detect weekday vs weekend shift
    try {
      const d = new Date(selectedDateStr);
      const day = d.getDay();
      if (day === 0 || day === 6) {
        setCurrentShift('Libur Reguler (Day Off)');
      } else {
        setCurrentShift('Shift Pagi (08:00 - 17:00)');
      }
    } catch {
      setCurrentShift('Shift Pagi (08:00 - 17:00)');
    }
  };

  const handleModeChange = (mode) => {
    setShiftMode(mode);
    setTargetShift('');
    setEmployeeName('');
  };

  // Available employees for the selected swap target shift
  const availableEmployees = targetShift
    ? EMPLOYEE_OPTIONS.filter((emp) => emp.shift === targetShift)
    : [];

  // Available off-duty employees for shift transfer
  const offEmployees = EMPLOYEE_OPTIONS.filter((emp) => emp.shift === 'Libur Reguler (Day Off)');

  // Current active employee list for the picker modal
  const activeEmployeesList = pickerMode === 'SWAP' ? availableEmployees : offEmployees;

  // Filtered employees for search modal
  const filteredEmployees = activeEmployeesList.filter((emp) => {
    if (!employeeSearchQuery.trim()) return true;
    const q = employeeSearchQuery.toLowerCase().trim();
    return emp.name.toLowerCase().includes(q) || emp.role.toLowerCase().includes(q);
  });

  // Form Validity
  const isFormValid = Boolean(
    scheduleDate &&
    notes.trim().length > 0 &&
    (shiftMode === 'CHANGE_SHIFT'
      ? targetShift && targetShift !== currentShift
      : shiftMode === 'CHANGE_SHIFT_SWAP'
      ? targetShift && employeeName.trim().length > 0 && currentShift && currentShift !== 'Libur Reguler (Day Off)'
      : employeeName.trim().length > 0 && currentShift && currentShift !== 'Libur Reguler (Day Off)')
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsReviewOpen(true);
  };

  const handleConfirmSubmit = () => {
    setIsReviewOpen(false);
    if (onSubmit) {
      onSubmit({
        mode: shiftMode,
        scheduleDate,
        formattedDate: formatDisplayDate(scheduleDate),
        fromShift: currentShift,
        toShift: shiftMode === 'CHANGE_SHIFT_TRANSFER' ? currentShift : targetShift,
        partnerName: shiftMode === 'CHANGE_SHIFT' ? null : employeeName,
        partnerShift: shiftMode === 'CHANGE_SHIFT_SWAP'
          ? targetShift
          : shiftMode === 'CHANGE_SHIFT_TRANSFER'
          ? 'Libur Reguler (Day Off)'
          : null,
        notes: notes.trim(),
      });
    }
  };

  return (
    <div
      ref={pageRef}
      className="change-shift-page"
      style={{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        fontFamily: 'var(--font-sans)',
        fontSize: '16px',
        color: '#334155',
      }}
    >
      <style>{`
        .change-shift-page input::placeholder,
        .change-shift-page textarea::placeholder {
          font-size: 14px !important;
          color: #94A3B8 !important;
          opacity: 1 !important;
          font-weight: 400 !important;
          font-family: inherit !important;
        }
        .change-shift-page input:focus,
        .change-shift-page select:focus,
        .change-shift-page textarea:focus {
          border-color: #09B2FF !important;
          box-shadow: 0 0 0 3px rgba(9, 178, 255, 0.16) !important;
          outline: none !important;
        }
        .change-shift-page select:disabled,
        .change-shift-page input:disabled {
          background-color: #F8FAFC !important;
          border-color: #E2E8F0 !important;
          color: #94A3B8 !important;
          -webkit-text-fill-color: #94A3B8 !important;
          opacity: 1 !important;
          cursor: not-allowed !important;
        }
      `}</style>

      {/* =========================================================================
          STICKY HEADER APP BAR (MATCHING PERMIT PERMISSION EXACTLY)
          ========================================================================= */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          display: 'grid',
          gridTemplateColumns: '36px minmax(0, 1fr) 36px',
          alignItems: 'center',
          gap: '8px',
          minHeight: '56px',
          padding: '0 16px',
          backgroundColor: '#FFFFFF',
        }}
      >
        <button
          type="button"
          onClick={onBack}
          aria-label={isId ? 'Kembali ke daftar request' : 'Back to request list'}
          style={{
            display: 'grid',
            placeItems: 'center',
            width: '36px',
            height: '36px',
            padding: 0,
            border: 'none',
            borderRadius: '8px',
            background: 'transparent',
            color: '#334155',
            cursor: 'pointer',
          }}
        >
          <CaretLeft size={22} weight="bold" />
        </button>
        <h1
          style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: 700,
            textAlign: 'center',
            color: '#334155',
          }}
        >
          Change Shift
        </h1>
        <div style={{ width: '36px' }} />
      </header>

      {/* =========================================================================
          SCROLLABLE FORM CONTENT
          ========================================================================= */}
      <div style={{ flex: 1, padding: '16px 16px 32px' }}>
        {/* SEGMENTED TAB TOGGLE: CHANGE SHIFT VS CHANGE SHIFT SWAP VS SHIFT TRANSFER */}
        <div
          style={{
            backgroundColor: '#F1F5F9',
            padding: '4px',
            borderRadius: '12px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '4px',
            marginBottom: '16px',
          }}
        >
          <button
            type="button"
            onClick={() => handleModeChange('CHANGE_SHIFT')}
            style={{
              padding: '8px 4px',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: shiftMode === 'CHANGE_SHIFT' ? '#FFFFFF' : 'transparent',
              color: shiftMode === 'CHANGE_SHIFT' ? '#053079' : '#64748B',
              fontSize: '12px',
              fontWeight: shiftMode === 'CHANGE_SHIFT' ? 700 : 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              boxShadow: shiftMode === 'CHANGE_SHIFT' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
          >
            <Clock size={15} weight={shiftMode === 'CHANGE_SHIFT' ? 'bold' : 'regular'} />
            <span>Shift Change</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('CHANGE_SHIFT_SWAP')}
            style={{
              padding: '8px 4px',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: shiftMode === 'CHANGE_SHIFT_SWAP' ? '#FFFFFF' : 'transparent',
              color: shiftMode === 'CHANGE_SHIFT_SWAP' ? '#053079' : '#64748B',
              fontSize: '12px',
              fontWeight: shiftMode === 'CHANGE_SHIFT_SWAP' ? 700 : 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              boxShadow: shiftMode === 'CHANGE_SHIFT_SWAP' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
          >
            <ArrowsLeftRight size={15} weight={shiftMode === 'CHANGE_SHIFT_SWAP' ? 'bold' : 'regular'} />
            <span>Shift Swap</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('CHANGE_SHIFT_TRANSFER')}
            style={{
              padding: '8px 4px',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: shiftMode === 'CHANGE_SHIFT_TRANSFER' ? '#FFFFFF' : 'transparent',
              color: shiftMode === 'CHANGE_SHIFT_TRANSFER' ? '#053079' : '#64748B',
              fontSize: '12px',
              fontWeight: shiftMode === 'CHANGE_SHIFT_TRANSFER' ? 700 : 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              boxShadow: shiftMode === 'CHANGE_SHIFT_TRANSFER' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
          >
            <UserSwitch size={15} weight={shiftMode === 'CHANGE_SHIFT_TRANSFER' ? 'bold' : 'regular'} />
            <span>Shift Transfer</span>
          </button>
        </div>

        {/* INFO NOTICE BANNER */}
        <div
          style={{
            backgroundColor: '#EAF7FF',
            border: '1px solid #BAE6FD',
            borderRadius: '12px',
            padding: '10px 14px',
            marginBottom: '20px',
            fontSize: '12px',
            color: '#0369A1',
            lineHeight: 1.45,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
          }}
        >
          <Info size={18} weight="fill" color="#0284C7" style={{ flexShrink: 0, marginTop: '-1px' }} />
          <span>
          {shiftMode === 'CHANGE_SHIFT'
            ? (isId
              ? 'Ganti jadwal shift kerja Anda sendiri ke jam shift lain pada tanggal yang dipilih.'
              : 'Change your personal scheduled shift to another shift time on the selected date.')
            : shiftMode === 'CHANGE_SHIFT_SWAP'
            ? (isId
              ? 'Tukar jadwal shift Anda secara timbal-balik dengan rekan kerja yang sama-sama aktif.'
              : 'Swap your work shift reciprocally with an on-duty employee on the selected date.')
            : (isId
              ? 'Pindahkan jadwal shift kerja Anda ke rekan kerja yang sedang libur/off pada tanggal yang dipilih.'
              : 'Transfer your scheduled work shift to an off-duty employee on the selected date.')}
          </span>
        </div>

        <form
          id="change-shift-form"
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          {/* 1. Shift Schedule Date */}
          <div style={{ position: 'relative' }}>
            <label
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <span>{isId ? 'Tanggal Jadwal' : 'Schedule Date'}</span>
              <span style={{ color: '#EF4444', marginLeft: '4px' }}>*</span>
            </label>

            <button
              type="button"
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              style={{
                width: '100%',
                minHeight: '48px',
                padding: '11px 14px',
                borderRadius: '12px',
                border: '1.5px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: scheduleDate ? '#334155' : '#94A3B8',
                fontSize: '14px',
                fontWeight: scheduleDate ? 500 : 400,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                textAlign: 'left',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                transition: 'border-color 0.15s ease',
              }}
            >
              <span>{scheduleDate ? formatDisplayDate(scheduleDate) : (isId ? 'Pilih tanggal jadwal' : 'Select schedule date')}</span>
              <CalendarBlank size={18} color="var(--color-secondary, #09B2FF)" weight="bold" />
            </button>

            {isDatePickerOpen && (
              <CustomDatePickerPopover
                isOpen={isDatePickerOpen}
                value={scheduleDate}
                minDate={todayStr}
                language={language}
                onSelect={handleDateSelect}
                onClose={() => setIsDatePickerOpen(false)}
              />
            )}
          </div>

          {/* 2. Current Shift (Auto-filled) */}
          <div>
            <label
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <span>
                {shiftMode === 'CHANGE_SHIFT_TRANSFER'
                  ? (isId ? 'Shift yang Mau Ditransfer' : 'Shift to Transfer')
                  : shiftMode === 'CHANGE_SHIFT_SWAP'
                  ? (isId ? 'Shift Anda Saat Ini' : 'Your Current Shift')
                  : (isId ? 'Shift Saat Ini' : 'Current Shift')}
              </span>
              <span style={{ color: '#EF4444', marginLeft: '4px' }}>*</span>
            </label>
            <div
              style={{
                width: '100%',
                minHeight: '48px',
                padding: '11px 14px',
                borderRadius: '12px',
                border: '1.5px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                color: currentShift ? '#334155' : '#94A3B8',
                fontSize: '14px',
                fontWeight: currentShift ? 500 : 400,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxSizing: 'border-box',
              }}
            >
              <Clock size={18} color={currentShift ? 'var(--color-secondary, #09B2FF)' : '#94A3B8'} weight="bold" />
              <span>
                {currentShift || (isId ? 'Pilih tanggal jadwal terlebih dahulu' : 'Select schedule date first')}
              </span>
            </div>
            {(shiftMode === 'CHANGE_SHIFT_TRANSFER' || shiftMode === 'CHANGE_SHIFT_SWAP') && scheduleDate && currentShift === 'Libur Reguler (Day Off)' && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '8px',
                  padding: '8px 12px',
                  backgroundColor: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  borderRadius: '10px',
                  fontSize: '12px',
                  color: '#B45309',
                  fontWeight: 500,
                }}
              >
                <Info size={16} weight="fill" color="#D97706" style={{ flexShrink: 0 }} />
                <span>
                  {shiftMode === 'CHANGE_SHIFT_SWAP'
                    ? (isId
                        ? 'Anda berstatus Libur / Off pada tanggal ini, tukar shift memerlukan shift kerja aktif.'
                        : 'You are off on this date, swapping shifts requires an active work shift.')
                    : (isId
                        ? 'Anda berstatus Libur / Off pada tanggal ini, tidak ada shift aktif yang bisa ditransfer.'
                        : 'You are off on this date, there is no active shift to transfer.')}
                </span>
              </div>
            )}
          </div>

          {/* 3. Conditional Fields based on Shift Mode */}
          {shiftMode === 'CHANGE_SHIFT' ? (
            /* MODE: INDIVIDUAL CHANGE SHIFT */
            <div>
              <label
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <span>{isId ? 'Pilih Shift Baru' : 'New Target Shift'}</span>
                <span style={{ color: '#EF4444', marginLeft: '4px' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={targetShift}
                  disabled={!scheduleDate}
                  onChange={(e) => setTargetShift(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '48px',
                    padding: '11px 36px 11px 14px',
                    borderRadius: '12px',
                    border: !scheduleDate ? '1.5px solid #E2E8F0' : '1.5px solid #CBD5E1',
                    fontSize: '14px',
                    fontWeight: targetShift && scheduleDate ? 500 : 400,
                    color: targetShift && scheduleDate ? '#334155' : '#94A3B8',
                    backgroundColor: !scheduleDate ? '#F8FAFC' : '#FFFFFF',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: !scheduleDate ? 'not-allowed' : 'pointer',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                >
                  <option value="" disabled>
                    {!scheduleDate
                      ? (isId ? 'Pilih tanggal jadwal terlebih dahulu' : 'Select schedule date first')
                      : (isId ? 'Pilih shift tujuan baru' : 'Select target shift')}
                  </option>
                  {SHIFT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} disabled={opt === currentShift}>
                      {opt} {opt === currentShift ? (isId ? '(Shift saat ini)' : '(Current shift)') : ''}
                    </option>
                  ))}
                </select>
                <CaretDown
                  size={18}
                  color={!scheduleDate ? '#94A3B8' : '#64748B'}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </div>
          ) : shiftMode === 'CHANGE_SHIFT_SWAP' ? (
            /* MODE: CHANGE SHIFT SWAP (SWAP WITH EMPLOYEE) */
            <>
              {/* 1. Shift yang Mau Ditukar / Shift to Swap */}
              <div>
                <label
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '8px',
                  }}
                >
                  <span>{isId ? 'Shift yang Mau Ditukar' : 'Shift to Swap'}</span>
                  <span style={{ color: '#EF4444', marginLeft: '4px' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={targetShift}
                    disabled={!scheduleDate || currentShift === 'Libur Reguler (Day Off)'}
                    onChange={(e) => {
                      setTargetShift(e.target.value);
                      setEmployeeName('');
                    }}
                    style={{
                      width: '100%',
                      minHeight: '48px',
                      padding: '11px 36px 11px 14px',
                      borderRadius: '12px',
                      border: !scheduleDate || currentShift === 'Libur Reguler (Day Off)' ? '1.5px solid #E2E8F0' : '1.5px solid #CBD5E1',
                      fontSize: '14px',
                      fontWeight: targetShift && scheduleDate && currentShift !== 'Libur Reguler (Day Off)' ? 500 : 400,
                      color: targetShift && scheduleDate && currentShift !== 'Libur Reguler (Day Off)' ? '#334155' : '#94A3B8',
                      backgroundColor: !scheduleDate || currentShift === 'Libur Reguler (Day Off)' ? '#F8FAFC' : '#FFFFFF',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      cursor: !scheduleDate || currentShift === 'Libur Reguler (Day Off)' ? 'not-allowed' : 'pointer',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }}
                  >
                    <option value="" disabled>
                      {!scheduleDate
                        ? (isId ? 'Pilih tanggal jadwal terlebih dahulu' : 'Select schedule date first')
                        : currentShift === 'Libur Reguler (Day Off)'
                        ? (isId ? 'Tidak ada shift aktif untuk ditukar' : 'No active shift to swap')
                        : (isId ? 'Pilih shift yang mau ditukar' : 'Select shift to swap')}
                    </option>
                    {SHIFT_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} disabled={opt === currentShift}>
                        {opt} {opt === currentShift ? (isId ? '(Shift Anda saat ini)' : '(Your current shift)') : ''}
                      </option>
                    ))}
                  </select>
                  <CaretDown
                    size={18}
                    color={!scheduleDate || currentShift === 'Libur Reguler (Day Off)' ? '#94A3B8' : '#64748B'}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                    }}
                  />
                </div>
              </div>

              {/* 2. Karyawan / Employee yang Berada di Shift Tersebut */}
              <div>
                <label
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '8px',
                  }}
                >
                  <span>{isId ? 'Karyawan yang Diajak Tukar' : 'Employee to Swap'}</span>
                  <span style={{ color: '#EF4444', marginLeft: '4px' }}>*</span>
                </label>
                <button
                  type="button"
                  disabled={!scheduleDate || currentShift === 'Libur Reguler (Day Off)' || !targetShift}
                  onClick={() => {
                    setPickerMode('SWAP');
                    setEmployeeSearchQuery('');
                    setIsEmployeePickerOpen(true);
                  }}
                  style={{
                    width: '100%',
                    minHeight: '48px',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    border: !scheduleDate || currentShift === 'Libur Reguler (Day Off)' || !targetShift ? '1.5px solid #E2E8F0' : '1.5px solid #CBD5E1',
                    backgroundColor: !scheduleDate || currentShift === 'Libur Reguler (Day Off)' || !targetShift ? '#F8FAFC' : '#FFFFFF',
                    color: employeeName && scheduleDate && currentShift !== 'Libur Reguler (Day Off)' && targetShift ? '#334155' : '#94A3B8',
                    fontSize: '14px',
                    fontWeight: employeeName && scheduleDate && currentShift !== 'Libur Reguler (Day Off)' && targetShift ? 500 : 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: !scheduleDate || currentShift === 'Libur Reguler (Day Off)' || !targetShift ? 'not-allowed' : 'pointer',
                    textAlign: 'left',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, overflow: 'hidden' }}>
                    <ArrowsLeftRight size={18} color={employeeName && targetShift ? 'var(--color-secondary, #09B2FF)' : '#94A3B8'} weight="bold" />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {!scheduleDate
                        ? (isId ? 'Pilih tanggal jadwal terlebih dahulu' : 'Select schedule date first')
                        : currentShift === 'Libur Reguler (Day Off)'
                        ? (isId ? 'Tidak ada shift aktif untuk ditukar' : 'No active shift to swap')
                        : !targetShift
                        ? (isId ? 'Pilih shift yang mau ditukar terlebih dahulu' : 'Select shift to swap first')
                        : employeeName || (isId ? 'Pilih karyawan yang diajak tukar...' : 'Select employee to swap...')}
                    </span>
                  </div>
                  <CaretDown
                    size={18}
                    color={!scheduleDate || currentShift === 'Libur Reguler (Day Off)' || !targetShift ? '#94A3B8' : '#64748B'}
                    style={{ flexShrink: 0 }}
                  />
                </button>
              </div>
            </>
          ) : (
            /* MODE: CHANGE SHIFT TRANSFER (TRANSFER TO OFF-DUTY EMPLOYEE) */
            <div>
              <label
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <span>Transfer To</span>
                <span style={{ color: '#EF4444', marginLeft: '4px' }}>*</span>
              </label>

              <button
                type="button"
                disabled={!scheduleDate || currentShift === 'Libur Reguler (Day Off)'}
                onClick={() => {
                  setPickerMode('TRANSFER');
                  setEmployeeSearchQuery('');
                  setIsEmployeePickerOpen(true);
                }}
                style={{
                  width: '100%',
                  minHeight: '48px',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: !scheduleDate || currentShift === 'Libur Reguler (Day Off)' ? '1.5px solid #E2E8F0' : '1.5px solid #CBD5E1',
                  backgroundColor: !scheduleDate || currentShift === 'Libur Reguler (Day Off)' ? '#F8FAFC' : '#FFFFFF',
                  color: employeeName ? '#334155' : '#94A3B8',
                  fontSize: '14px',
                  fontWeight: employeeName ? 500 : 400,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: !scheduleDate || currentShift === 'Libur Reguler (Day Off)' ? 'not-allowed' : 'pointer',
                  textAlign: 'left',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, overflow: 'hidden' }}>
                  <UserSwitch size={18} color={employeeName ? 'var(--color-secondary, #09B2FF)' : '#94A3B8'} weight="bold" />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {!scheduleDate
                      ? (isId ? 'Pilih tanggal jadwal terlebih dahulu' : 'Select schedule date first')
                      : currentShift === 'Libur Reguler (Day Off)'
                      ? (isId ? 'Tidak ada shift aktif untuk ditransfer' : 'No active shift to transfer')
                      : employeeName || (isId ? 'Pilih rekan yang sedang libur/off...' : 'Select off-duty employee...')}
                  </span>
                </div>
                <CaretDown
                  size={18}
                  color={!scheduleDate || currentShift === 'Libur Reguler (Day Off)' ? '#94A3B8' : '#64748B'}
                  style={{ flexShrink: 0 }}
                />
              </button>

              {scheduleDate && currentShift !== 'Libur Reguler (Day Off)' && (
                <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '6px' }}>
                  {isId
                    ? '* Menampilkan daftar rekan kerja yang tidak memiliki jadwal kerja (Off/Libur) pada tanggal ini.'
                    : '* Showing employees who have no scheduled shift (Off) on this date.'}
                </div>
              )}
            </div>
          )}

          {/* 4. Notes */}
          <div>
            <label
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <span>{isId ? 'Alasan / Catatan Pengajuan' : 'Notes / Reason'}</span>
              <span style={{ color: '#EF4444', marginLeft: '4px' }}>*</span>
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isId ? 'Jelaskan alasan pengajuan perubahan shift' : 'Explain the reason for the shift change'}
              style={{
                width: '100%',
                minHeight: '110px',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1.5px solid #CBD5E1',
                fontSize: '14px',
                fontWeight: 500,
                color: '#334155',
                backgroundColor: '#FFFFFF',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                resize: 'none',
                lineHeight: 1.5,
                transition: 'border-color 0.15s ease',
              }}
            />
          </div>
        </form>
      </div>

      {/* =========================================================================
          STICKY FOOTER (MATCHING PERMIT PERMISSION EXACTLY)
          ========================================================================= */}
      <footer
        style={{
          position: 'sticky',
          bottom: 0,
          zIndex: 35,
          backgroundColor: '#FFFFFF',
          padding: '12px 16px 16px 16px',
          borderTop: '1px solid #F1F5F9',
          boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.05)',
        }}
      >
        <button
          type="submit"
          form="change-shift-form"
          disabled={!isFormValid}
          style={{
            width: '100%',
            minHeight: '48px',
            backgroundColor: isFormValid ? '#053079' : '#E2E8F0',
            color: isFormValid ? '#FFFFFF' : '#94A3B8',
            border: 'none',
            borderRadius: '12px',
            padding: '12px',
            fontSize: '0.9375rem',
            fontWeight: 700,
            cursor: isFormValid ? 'pointer' : 'not-allowed',
            boxShadow: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
        >
          {isId ? 'Kirim Permohonan Sekarang' : 'Submit Request Now'}
        </button>
      </footer>

      {/* =========================================================================
          CONFIRMATION / REVIEW MODAL (MATCHING PERMIT PERMISSION EXACTLY)
          ========================================================================= */}
      {isReviewOpen &&
        createPortal(
          <div
            role="presentation"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsReviewOpen(false);
            }}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.55)',
              zIndex: 99999,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              backdropFilter: 'blur(3px)',
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="change-shift-review-title"
              style={{
                boxSizing: 'border-box',
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                padding: '16px 20px 24px',
                maxHeight: '88%',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
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

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <h3
                    id="change-shift-review-title"
                    style={{
                      margin: 0,
                      fontSize: '16px',
                      fontWeight: 800,
                      color: '#334155',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {shiftMode === 'CHANGE_SHIFT_TRANSFER'
                      ? (isId ? 'Review Transfer Shift' : 'Review Shift Transfer')
                      : shiftMode === 'CHANGE_SHIFT_SWAP'
                      ? (isId ? 'Review Tukar Shift' : 'Review Shift Swap')
                      : (isId ? 'Review Ubah Shift' : 'Review Shift Change')}
                  </h3>
                  <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#64748B', lineHeight: 1.4 }}>
                    {shiftMode === 'CHANGE_SHIFT_TRANSFER'
                      ? (isId ? 'Pastikan detail transfer shift Anda sudah benar.' : 'Please review your shift transfer details before submitting.')
                      : shiftMode === 'CHANGE_SHIFT_SWAP'
                      ? (isId ? 'Pastikan detail tukar shift Anda sudah benar.' : 'Please review your shift swap details before submitting.')
                      : (isId ? 'Pastikan detail perubahan shift Anda sudah benar.' : 'Please review your shift change details before submitting.')}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={isId ? 'Tutup review' : 'Close review'}
                  onClick={() => setIsReviewOpen(false)}
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
                    flexShrink: 0,
                  }}
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              {/* Details Box */}
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '14px',
                  border: '1px solid #E2E8F0',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {/* Category / Type Row with Icon Box */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: '#EAF7FF',
                      border: '1px solid #BAE6FD',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-secondary, #09B2FF)',
                      flexShrink: 0,
                    }}
                  >
                    {shiftMode === 'CHANGE_SHIFT_TRANSFER' ? (
                      <UserSwitch size={20} weight="fill" />
                    ) : shiftMode === 'CHANGE_SHIFT_SWAP' ? (
                      <ArrowsLeftRight size={20} weight="fill" />
                    ) : (
                      <Clock size={20} weight="fill" />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--color-secondary, #09B2FF)', marginBottom: '3px' }}>
                      Change Shift
                    </div>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#334155' }}>
                      {shiftMode === 'CHANGE_SHIFT_TRANSFER'
                        ? (isId ? 'Transfer Shift (Shift Transfer)' : 'Shift Transfer')
                        : shiftMode === 'CHANGE_SHIFT_SWAP'
                        ? (isId ? 'Tukar Shift (Shift Swap)' : 'Shift Swap')
                        : (isId ? 'Ubah Shift (Shift Change)' : 'Shift Change')}
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1.5px dashed #CBD5E1', margin: '2px 0' }} />

                {/* Schedule Date */}
                <div>
                  <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748B', marginBottom: '3px' }}>
                    {isId ? 'Tanggal Jadwal' : 'Schedule Date'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                    <CalendarCheck size={16} color="var(--color-secondary, #09B2FF)" />
                    <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#1E293B' }}>
                      {formatDisplayDate(scheduleDate)}
                    </span>
                  </div>
                </div>

                {shiftMode === 'CHANGE_SHIFT' ? (
                  <>
                    {/* Previous Shift */}
                    <div>
                      <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748B', marginBottom: '3px' }}>
                        {isId ? 'Shift Sebelumnya' : 'Previous Shift'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                        <Clock size={16} color="var(--color-secondary, #09B2FF)" weight="bold" />
                        <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#1E293B' }}>
                          {currentShift}
                        </span>
                      </div>
                    </div>

                    {/* Next Shift */}
                    <div>
                      <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748B', marginBottom: '3px' }}>
                        {isId ? 'Shift Selanjutnya' : 'Next Shift'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                        <Clock size={16} color="var(--color-secondary, #09B2FF)" weight="bold" />
                        <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#1E293B' }}>
                          {targetShift}
                        </span>
                      </div>
                    </div>
                  </>
                ) : shiftMode === 'CHANGE_SHIFT_SWAP' ? (
                  <>
                    {/* 1. Previous Shift (Shift Sebelumnya) */}
                    <div>
                      <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748B', marginBottom: '3px' }}>
                        {isId ? 'Shift Sebelumnya' : 'Previous Shift'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                        <Clock size={16} color="var(--color-secondary, #09B2FF)" weight="bold" />
                        <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#1E293B' }}>
                          {currentShift}
                        </span>
                      </div>
                    </div>

                    {/* 2. Swap Shift With (Tukar Shift Dengan) */}
                    <div>
                      <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748B', marginBottom: '3px' }}>
                        {isId ? 'Tukar Shift Dengan' : 'Swap Shift With'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                        <ArrowsLeftRight size={16} color="var(--color-secondary, #09B2FF)" weight="bold" />
                        <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#1E293B' }}>
                          {employeeName}
                        </span>
                      </div>
                    </div>

                    {/* 3. Next Shift (Shift Selanjutnya) */}
                    <div>
                      <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748B', marginBottom: '3px' }}>
                        {isId ? 'Shift Selanjutnya' : 'Next Shift'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                        <Clock size={16} color="var(--color-secondary, #09B2FF)" weight="bold" />
                        <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#1E293B' }}>
                          {targetShift}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* 1. Shift yang Ditransfer */}
                    <div>
                      <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748B', marginBottom: '3px' }}>
                        {isId ? 'Shift yang Ditransfer' : 'Transferred Shift'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                        <Clock size={16} color="var(--color-secondary, #09B2FF)" weight="bold" />
                        <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#1E293B' }}>
                          {currentShift}
                        </span>
                      </div>
                    </div>

                    {/* 2. Ditransfer Kepada */}
                    <div>
                      <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748B', marginBottom: '3px' }}>
                        Transfer To
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                        <UserSwitch size={16} color="var(--color-secondary, #09B2FF)" weight="bold" />
                        <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#1E293B' }}>
                          {employeeName}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* Reason / Notes */}
                <div>
                  <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748B', marginBottom: '3px' }}>
                    {isId ? 'Alasan / Keterangan' : 'Reason / Notes'}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#1E293B', marginTop: '3px', lineHeight: 1.45, fontWeight: 500 }}>
                    {notes || (isId ? 'Tidak ada catatan tambahan.' : 'No additional notes.')}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Left (Edit Request) and Right (Confirm) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setIsReviewOpen(false)}
                  style={{
                    width: '100%',
                    minHeight: '48px',
                    backgroundColor: '#FFFFFF',
                    color: '#334155',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Edit Request
                </button>

                <button
                  type="button"
                  onClick={handleConfirmSubmit}
                  style={{
                    width: '100%',
                    minHeight: '48px',
                    backgroundColor: '#053079',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: 'none',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <Check size={18} weight="bold" />
                  <span>Confirm</span>
                </button>
              </div>
            </div>
          </div>,
          document.getElementById('phone-screen-container') || document.body
        )}

      {/* =========================================================================
          SEARCHABLE EMPLOYEE PICKER BOTTOM SHEET (TRANSFER TO)
          ========================================================================= */}
      {isEmployeePickerOpen &&
        createPortal(
          <div
            role="presentation"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsEmployeePickerOpen(false);
            }}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.55)',
              zIndex: 99999,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              backdropFilter: 'blur(3px)',
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="employee-picker-title"
              style={{
                boxSizing: 'border-box',
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                padding: '16px 20px 24px',
                maxHeight: '86%',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
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

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <h3
                    id="employee-picker-title"
                    style={{
                      margin: 0,
                      fontSize: '16px',
                      fontWeight: 800,
                      color: '#334155',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {pickerMode === 'SWAP'
                      ? (isId ? 'Karyawan yang Diajak Tukar' : 'Employee to Swap')
                      : 'Transfer To'}
                  </h3>
                  <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#64748B', lineHeight: 1.4 }}>
                    {pickerMode === 'SWAP'
                      ? (isId
                          ? `Pilih rekan kerja pada ${targetShift || 'shift yang dipilih'}`
                          : `Select employee currently on ${targetShift || 'selected shift'}`)
                      : (isId
                          ? 'Pilih rekan kerja yang sedang libur/off untuk menerima shift'
                          : 'Select an off-duty employee to receive your shift')}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={isId ? 'Tutup pilihan rekan' : 'Close employee picker'}
                  onClick={() => setIsEmployeePickerOpen(false)}
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
                    flexShrink: 0,
                  }}
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              {/* Search Bar Input */}
              <div
                style={{
                  height: '44px',
                  backgroundColor: '#F1F5F9',
                  borderRadius: '12px',
                  border: '1.5px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 12px',
                  gap: '8px',
                  boxSizing: 'border-box',
                }}
              >
                <MagnifyingGlass size={18} weight="bold" color="#64748B" style={{ flexShrink: 0 }} />
                <input
                  type="text"
                  autoFocus
                  value={employeeSearchQuery}
                  onChange={(e) => setEmployeeSearchQuery(e.target.value)}
                  placeholder={isId ? 'Cari nama atau divisi rekan...' : 'Search employee by name or role...'}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '13.5px',
                    color: '#1E293B',
                    fontFamily: 'inherit',
                  }}
                />
                {employeeSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setEmployeeSearchQuery('')}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      padding: '4px',
                      color: '#94A3B8',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <X size={15} weight="bold" />
                  </button>
                )}
              </div>

              {/* Counter & Clear option */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748B' }}>
                  {pickerMode === 'SWAP'
                    ? (isId
                        ? `${filteredEmployees.length} Rekan Tersedia pada Shift Ini`
                        : `${filteredEmployees.length} Employees Available on this Shift`)
                    : (isId
                        ? `${filteredEmployees.length} Rekan Tersedia (Off/Libur)`
                        : `${filteredEmployees.length} Employees Available (Off)`)}
                </span>
                {employeeName && (
                  <button
                    type="button"
                    onClick={() => {
                      setEmployeeName('');
                      setIsEmployeePickerOpen(false);
                    }}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: '#EF4444',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    {isId ? 'Hapus Pilihan' : 'Clear Selection'}
                  </button>
                )}
              </div>

              {/* Scrollable Employees List */}
              <div
                style={{
                  maxHeight: '320px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  paddingRight: '2px',
                }}
              >
                {filteredEmployees.length === 0 ? (
                  <div
                    style={{
                      padding: '36px 16px',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#94A3B8',
                    }}
                  >
                    <MagnifyingGlass size={36} weight="light" color="#CBD5E1" />
                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#475569' }}>
                      {isId ? 'Tidak ada rekan yang cocok' : 'No matching employees'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                      {isId ? 'Coba cari dengan kata kunci nama atau divisi lain' : 'Try searching with another name or role'}
                    </div>
                  </div>
                ) : (
                  filteredEmployees.map((emp) => {
                    const displayVal = `${emp.name} (${emp.role})`;
                    const isSelected = employeeName === displayVal;
                    const shiftTagLabel = pickerMode === 'SWAP' ? emp.shift.split(' (')[0] : 'Day Off';

                    return (
                      <button
                        key={emp.id}
                        type="button"
                        onClick={() => {
                          setEmployeeName(displayVal);
                          setIsEmployeePickerOpen(false);
                          setEmployeeSearchQuery('');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px 14px',
                          borderRadius: '12px',
                          border: isSelected ? '1.5px solid #09B2FF' : '1px solid #E2E8F0',
                          backgroundColor: isSelected ? '#F0F9FF' : '#FFFFFF',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s ease',
                          boxShadow: 'none',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box',
                        }}
                      >
                        {/* Info: Name & Role subtext */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: '13.5px',
                              fontWeight: 700,
                              color: '#1E293B',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {emp.name}
                          </div>
                          <div
                            style={{
                              fontSize: '12px',
                              fontWeight: 500,
                              color: '#64748B',
                              marginTop: '2px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {emp.role}
                          </div>
                        </div>

                        {/* Right: Shift Tag + Radio Button */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              color: pickerMode === 'SWAP' ? '#0369A1' : '#475569',
                              backgroundColor: pickerMode === 'SWAP' ? '#E0F2FE' : '#F1F5F9',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              border: pickerMode === 'SWAP' ? '1px solid #BAE6FD' : '1px solid #E2E8F0',
                            }}
                          >
                            {shiftTagLabel}
                          </span>

                          <div
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              border: isSelected ? 'none' : '1.5px solid #CBD5E1',
                              backgroundColor: isSelected ? '#053079' : 'transparent',
                              color: '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {isSelected && <Check size={13} weight="bold" />}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>,
          document.getElementById('phone-screen-container') || document.body
        )}
    </div>
  );
}
