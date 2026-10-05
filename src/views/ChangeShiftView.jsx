import React, { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CaretLeft, CalendarBlank, Check, X, ArrowsLeftRight, Clock, CaretDown, Info, CalendarCheck } from '@phosphor-icons/react';
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

  // Shift Malam (20:00 - 05:00)
  { id: 'emp-5', name: 'Budi Santoso', role: 'Engineering', shift: 'Shift Malam (20:00 - 05:00)' },
  { id: 'emp-6', name: 'Rudi Hartono', role: 'Security', shift: 'Shift Malam (20:00 - 05:00)' },
  { id: 'emp-7', name: 'Farhan Maulana', role: 'Housekeeping', shift: 'Shift Malam (20:00 - 05:00)' },
  { id: 'emp-8', name: 'Hendra Wijaya', role: 'BM', shift: 'Shift Malam (20:00 - 05:00)' },

  // Shift Pagi (08:00 - 17:00)
  { id: 'emp-9', name: 'Dewi Lestari', role: 'Engineering', shift: 'Shift Pagi (08:00 - 17:00)' },
  { id: 'emp-10', name: 'Joko Susilo', role: 'Security', shift: 'Shift Pagi (08:00 - 17:00)' },
  { id: 'emp-11', name: 'Sri Wahyuni', role: 'Housekeeping', shift: 'Shift Pagi (08:00 - 17:00)' },
  { id: 'emp-12', name: 'Anisa Putri', role: 'BM', shift: 'Shift Pagi (08:00 - 17:00)' },

  // Shift Normal (08:30 - 17:30)
  { id: 'emp-13', name: 'Rizky Ramadhan', role: 'Engineering', shift: 'Shift Normal (08:30 - 17:30)' },
  { id: 'emp-14', name: 'Eko Prasetya', role: 'Security', shift: 'Shift Normal (08:30 - 17:30)' },
  { id: 'emp-15', name: 'Maya Indah', role: 'Housekeeping', shift: 'Shift Normal (08:30 - 17:30)' },
  { id: 'emp-16', name: 'Citra Kirana', role: 'BM', shift: 'Shift Normal (08:30 - 17:30)' },

  // Libur Reguler (Day Off)
  { id: 'emp-17', name: 'Dedi Suryadi', role: 'Engineering', shift: 'Libur Reguler (Day Off)' },
  { id: 'emp-18', name: 'Ahmad Fauzi', role: 'Security', shift: 'Libur Reguler (Day Off)' },
  { id: 'emp-19', name: 'Rina Melati', role: 'Housekeeping', shift: 'Libur Reguler (Day Off)' },
  { id: 'emp-20', name: 'Doni Irawan', role: 'BM', shift: 'Libur Reguler (Day Off)' },
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

  // Scroll to top
  useLayoutEffect(() => {
    const scrollContainer = pageRef.current?.closest('.android-scroll-content');
    if (scrollContainer) scrollContainer.scrollTop = 0;
  }, []);

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

  // Form Validity
  const isFormValid = Boolean(
    scheduleDate &&
    notes.trim().length > 0 &&
    (shiftMode === 'CHANGE_SHIFT'
      ? targetShift && targetShift !== currentShift
      : targetShift && employeeName.trim().length > 0)
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
        toShift: targetShift,
        partnerName: shiftMode === 'CHANGE_SHIFT_SWAP' ? employeeName : null,
        partnerShift: shiftMode === 'CHANGE_SHIFT_SWAP' ? targetShift : null,
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
        {/* SEGMENTED TAB TOGGLE: CHANGE SHIFT VS CHANGE SHIFT SWAP */}
        <div
          style={{
            backgroundColor: '#F1F5F9',
            padding: '4px',
            borderRadius: '12px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4px',
            marginBottom: '16px',
          }}
        >
          <button
            type="button"
            onClick={() => handleModeChange('CHANGE_SHIFT')}
            style={{
              padding: '9px 12px',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: shiftMode === 'CHANGE_SHIFT' ? '#FFFFFF' : 'transparent',
              color: shiftMode === 'CHANGE_SHIFT' ? '#053079' : '#64748B',
              fontSize: '13px',
              fontWeight: shiftMode === 'CHANGE_SHIFT' ? 700 : 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: shiftMode === 'CHANGE_SHIFT' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <Clock size={16} weight={shiftMode === 'CHANGE_SHIFT' ? 'bold' : 'regular'} />
            <span>Shift Change</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('CHANGE_SHIFT_SWAP')}
            style={{
              padding: '9px 12px',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: shiftMode === 'CHANGE_SHIFT_SWAP' ? '#FFFFFF' : 'transparent',
              color: shiftMode === 'CHANGE_SHIFT_SWAP' ? '#053079' : '#64748B',
              fontSize: '13px',
              fontWeight: shiftMode === 'CHANGE_SHIFT_SWAP' ? 700 : 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: shiftMode === 'CHANGE_SHIFT_SWAP' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <ArrowsLeftRight size={16} weight={shiftMode === 'CHANGE_SHIFT_SWAP' ? 'bold' : 'regular'} />
            <span>Shift Swap</span>
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
            : (isId
              ? 'Tukar jadwal shift Anda secara timbal-balik dengan karyawan satu divisi.'
              : 'Swap your work shift reciprocally with an employee in your department.')}
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
              <span>{shiftMode === 'CHANGE_SHIFT_SWAP' ? (isId ? 'Shift Anda Saat Ini' : 'Your Current Shift') : (isId ? 'Shift Saat Ini' : 'Current Shift')}</span>
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
                  onChange={(e) => setTargetShift(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '48px',
                    padding: '11px 36px 11px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '14px',
                    fontWeight: targetShift ? 500 : 400,
                    color: targetShift ? '#334155' : '#94A3B8',
                    backgroundColor: '#FFFFFF',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                >
                  <option value="" disabled>
                    {isId ? 'Pilih shift tujuan baru' : 'Select target shift'}
                  </option>
                  {SHIFT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} disabled={opt === currentShift}>
                      {opt} {opt === currentShift ? (isId ? '(Shift saat ini)' : '(Current shift)') : ''}
                    </option>
                  ))}
                </select>
                <CaretDown
                  size={18}
                  color="#64748B"
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
          ) : (
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
                    disabled={!scheduleDate}
                    onChange={(e) => {
                      setTargetShift(e.target.value);
                      setEmployeeName('');
                    }}
                    style={{
                      width: '100%',
                      minHeight: '48px',
                      padding: '11px 36px 11px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '14px',
                      fontWeight: targetShift ? 500 : 400,
                      color: targetShift ? '#334155' : '#94A3B8',
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
                    color="#64748B"
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
                <div style={{ position: 'relative' }}>
                  <select
                    value={employeeName}
                    disabled={!targetShift}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: '48px',
                      padding: '11px 36px 11px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '14px',
                      fontWeight: employeeName ? 500 : 400,
                      color: employeeName ? '#334155' : '#94A3B8',
                      backgroundColor: !targetShift ? '#F8FAFC' : '#FFFFFF',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      cursor: !targetShift ? 'not-allowed' : 'pointer',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }}
                  >
                    <option value="" disabled>
                      {!targetShift
                        ? (isId ? 'Pilih shift yang mau ditukar terlebih dahulu' : 'Select shift to swap first')
                        : (isId ? 'Pilih karyawan yang diajak tukar' : 'Select employee to swap')}
                    </option>
                    {availableEmployees.map((emp) => {
                      const displayVal = `${emp.name} (${emp.role})`;
                      return (
                        <option key={emp.id} value={displayVal}>
                          {displayVal}
                        </option>
                      );
                    })}
                  </select>
                  <CaretDown
                    size={18}
                    color="#64748B"
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
            </>
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
                    {shiftMode === 'CHANGE_SHIFT_SWAP'
                      ? (isId ? 'Review Tukar Shift' : 'Review Shift Swap')
                      : (isId ? 'Review Ubah Shift' : 'Review Shift Change')}
                  </h3>
                  <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#64748B', lineHeight: 1.4 }}>
                    {shiftMode === 'CHANGE_SHIFT_SWAP'
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
                    <ArrowsLeftRight size={20} weight="fill" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--color-secondary, #09B2FF)', marginBottom: '3px' }}>
                      Change Shift
                    </div>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#334155' }}>
                      {shiftMode === 'CHANGE_SHIFT_SWAP'
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
                ) : (
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
    </div>
  );
}
