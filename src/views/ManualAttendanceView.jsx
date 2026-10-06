import React, { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CaretLeft, CalendarBlank, Check, X, Clock, CalendarCheck, SignIn, SignOut } from '@phosphor-icons/react';
import { CustomDatePickerPopover } from '../components/common';

export default function ManualAttendanceView({
  onBack,
  language = 'id',
  onSubmit,
}) {
  const pageRef = useRef(null);
  const isId = language === 'id';

  // Form State
  const [scheduleDate, setScheduleDate] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [isCheckInEdited, setIsCheckInEdited] = useState(false);
  const [checkOut, setCheckOut] = useState('');
  const [notes, setNotes] = useState('');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // Known mock attendance records with prior clock-in times (YYYY-MM-DD)
  const ATTENDANCE_HISTORY_MAP = {
    '2026-09-28': { clockIn: '08:14', shift: 'Shift Pagi (08:00 - 17:00)' },
    '2026-09-27': { clockIn: '', shift: 'Tidak Ada Jadwal (Off)' },
    '2026-09-26': { clockIn: '07:48', shift: 'Shift Pagi (08:00 - 17:00)' },
    '2026-09-25': { clockIn: '', shift: 'Shift Pagi (08:00 - 17:00)' },
    '2026-09-24': { clockIn: '08:18', shift: 'Shift Pagi (08:00 - 17:00)' },
    '2026-09-23': { clockIn: '07:55', shift: 'Shift Pagi (08:00 - 17:00)' },
    '2026-09-22': { clockIn: '08:00', shift: 'Shift Pagi (08:00 - 17:00)' },
    '2026-09-21': { clockIn: '08:05', shift: 'Shift Pagi (08:00 - 17:00)' },
    '2026-10-01': { clockIn: '08:10', shift: 'Shift Pagi (08:00 - 17:00)' },
    '2026-10-02': { clockIn: '07:58', shift: 'Shift Pagi (08:00 - 17:00)' },
    '2026-10-05': { clockIn: '08:14', shift: 'Shift Pagi (08:00 - 17:00)' },
  };

  // Helper to get previous check-in time for selected date
  const getPreviousClockIn = (dateStr) => {
    if (!dateStr) return '';
    // Only return clockIn if recorded in history, otherwise empty string ''
    return ATTENDANCE_HISTORY_MAP[dateStr]?.clockIn || '';
  };

  // Auto-filled shift based on schedule date
  const getAutoShift = (dateStr) => {
    if (!dateStr) return '';
    if (ATTENDANCE_HISTORY_MAP[dateStr]?.shift) {
      return ATTENDANCE_HISTORY_MAP[dateStr].shift;
    }
    try {
      const d = new Date(dateStr);
      const day = d.getDay();
      if (day === 0 || day === 6) {
        return isId ? 'Tidak Ada Jadwal (Off)' : 'No Schedule (Off)';
      }
      return isId ? 'Shift Pagi (08:00 - 17:00)' : 'Morning Shift (08:00 - 17:00)';
    } catch {
      return isId ? 'Shift Pagi (08:00 - 17:00)' : 'Morning Shift (08:00 - 17:00)';
    }
  };

  const shiftValue = getAutoShift(scheduleDate);

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

  // Scroll to top inside container
  useLayoutEffect(() => {
    const scrollContainer = pageRef.current?.closest('.android-scroll-content');
    if (scrollContainer) scrollContainer.scrollTop = 0;
  }, []);

  // When date is selected: set date and auto-fill check in if previous check in exists
  const handleDateSelect = (selectedDateStr) => {
    setScheduleDate(selectedDateStr);
    setIsDatePickerOpen(false);
    setIsCheckInEdited(false);

    const prevClockIn = getPreviousClockIn(selectedDateStr);
    if (prevClockIn) {
      setCheckIn(prevClockIn);
    } else {
      setCheckIn('');
    }
  };

  // Time mask helper (HH:mm)
  const handleTimeInput = (setter) => (e) => {
    let val = e.target.value.replace(/[^0-9:]/g, '');
    if (val.length === 2 && !val.includes(':') && e.nativeEvent?.inputType !== 'deleteContentBackward') {
      val = val + ':';
    }
    if (val.length > 5) val = val.slice(0, 5);
    setter(val);
  };

  // Form validity: schedule date is required (*), notes is required (*), and at least one time (checkIn or checkOut)
  const isFormValid = Boolean(
    scheduleDate &&
    notes.trim().length > 0 &&
    (checkIn.trim().length > 0 || checkOut.trim().length > 0)
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
        checkIn: checkIn.trim(),
        checkOut: checkOut.trim(),
        requestedCheckIn: Boolean(checkIn.trim()) && (isCheckInEdited || !getPreviousClockIn(scheduleDate) || !checkOut.trim()),
        requestedCheckOut: Boolean(checkOut.trim()),
        scheduleDate,
        formattedDate: formatDisplayDate(scheduleDate),
        shift: shiftValue,
        notes: notes.trim(),
      });
    }
  };

  return (
    <div
      ref={pageRef}
      className="manual-attendance-page"
      style={{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        fontFamily: 'var(--font-sans)',
        fontSize: '15px',
        color: '#334155',
      }}
    >
      <style>{`
        .manual-attendance-page input::placeholder,
        .manual-attendance-page textarea::placeholder {
          font-size: 14px !important;
          color: #94A3B8 !important;
          opacity: 1 !important;
          font-weight: 400 !important;
          font-family: inherit !important;
        }
        .manual-attendance-page input::-webkit-input-placeholder,
        .manual-attendance-page textarea::-webkit-input-placeholder {
          font-size: 14px !important;
          color: #94A3B8 !important;
          opacity: 1 !important;
          font-weight: 400 !important;
          font-family: inherit !important;
        }
        .manual-attendance-page input::-moz-placeholder,
        .manual-attendance-page textarea::-moz-placeholder {
          font-size: 14px !important;
          color: #94A3B8 !important;
          opacity: 1 !important;
          font-weight: 400 !important;
          font-family: inherit !important;
        }
        .manual-attendance-page input:focus,
        .manual-attendance-page textarea:focus {
          border-color: #09B2FF !important;
          box-shadow: 0 0 0 3px rgba(9, 178, 255, 0.16) !important;
          outline: none !important;
        }
      `}</style>

      {/* =========================================================================
          STICKY HEADER APP BAR (SEAMLESS, NO BORDER BOTTOM)
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
          height: '56px',
          minHeight: '56px',
          padding: '0 16px',
          backgroundColor: '#FFFFFF',
          boxSizing: 'border-box',
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
            outline: 'none',
            borderRadius: '10px',
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
            letterSpacing: '-0.01em',
          }}
        >
          Manual Attendance
        </h1>
        <div style={{ width: '36px' }} />
      </header>

      {/* =========================================================================
          SCROLLABLE PAGE CONTENT
          URUTAN:
          1. Shift Schedule Date
          2. Shift (Auto-filled)
          3. Check In (Optional) & Check Out (Optional)
          4. Notes
          ========================================================================= */}
      <div style={{ flex: 1, padding: '20px 16px 32px' }}>
        <form
          id="manual-attendance-form"
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
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
                border: isDatePickerOpen ? '1.5px solid #09B2FF' : '1.5px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                boxShadow: isDatePickerOpen ? '0 0 0 3px rgba(9, 178, 255, 0.16)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                boxSizing: 'border-box',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'border-color 0.15s ease',
              }}
            >
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: scheduleDate ? 500 : 400,
                  color: scheduleDate ? '#334155' : '#94A3B8',
                }}
              >
                {scheduleDate ? formatDisplayDate(scheduleDate) : 'Choose date'}
              </span>
              <CalendarBlank size={20} color="#64748B" weight="regular" />
            </button>

            {/* Date Picker Popover */}
            <CustomDatePickerPopover
              isOpen={isDatePickerOpen}
              align="left"
              value={scheduleDate}
              language={language}
              onSelect={handleDateSelect}
              onClose={() => setIsDatePickerOpen(false)}
            />
          </div>

          {/* 2. Shift (Auto fill when schedule date is selected) */}
          <div>
            <label
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#334155',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Shift
            </label>
            <div
              style={{
                width: '100%',
                minHeight: '48px',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1.5px solid #E2E8F0',
                backgroundColor: '#F1F5F9',
                display: 'flex',
                alignItems: 'center',
                boxSizing: 'border-box',
              }}
            >
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: shiftValue ? 500 : 400,
                  color: shiftValue ? '#334155' : '#94A3B8',
                }}
              >
                {shiftValue || 'Auto fill when schedule date is selected'}
              </span>
            </div>
          </div>

          {/* 3. Check In (Optional) & Check Out (Optional) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {/* Check In */}
            <div>
              <label
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginBottom: '8px',
                }}
              >
                <span>Check In</span>
                <span style={{ fontWeight: 400, color: '#94A3B8', fontSize: '13px' }}>
                  (Optional)
                </span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  inputMode="numeric"
                  value={checkIn}
                  onChange={(event) => {
                    setIsCheckInEdited(true);
                    handleTimeInput(setCheckIn)(event);
                  }}
                  placeholder="--:--"
                  maxLength={5}
                  style={{
                    width: '100%',
                    minHeight: '48px',
                    padding: checkIn ? '11px 34px 11px 14px' : '11px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '14px',
                    fontWeight: checkIn ? 500 : 400,
                    color: checkIn ? '#334155' : '#94A3B8',
                    backgroundColor: '#FFFFFF',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.15s ease',
                  }}
                />
                {checkIn && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsCheckInEdited(true);
                      setCheckIn('');
                    }}
                    title={isId ? 'Kosongkan Check In' : 'Clear Check In'}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#F1F5F9',
                      border: 'none',
                      color: '#64748B',
                      display: 'grid',
                      placeItems: 'center',
                      padding: 0,
                      cursor: 'pointer',
                    }}
                  >
                    <X size={12} weight="bold" />
                  </button>
                )}
              </div>
            </div>

            {/* Check Out */}
            <div>
              <label
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginBottom: '8px',
                }}
              >
                <span>Check Out</span>
                <span style={{ fontWeight: 400, color: '#94A3B8', fontSize: '13px' }}>
                  (Optional)
                </span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  inputMode="numeric"
                  value={checkOut}
                  onChange={handleTimeInput(setCheckOut)}
                  placeholder="--:--"
                  maxLength={5}
                  style={{
                    width: '100%',
                    minHeight: '48px',
                    padding: checkOut ? '11px 34px 11px 14px' : '11px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '14px',
                    fontWeight: checkOut ? 500 : 400,
                    color: checkOut ? '#334155' : '#94A3B8',
                    backgroundColor: '#FFFFFF',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.15s ease',
                  }}
                />
                {checkOut && (
                  <button
                    type="button"
                    onClick={() => setCheckOut('')}
                    title={isId ? 'Kosongkan Check Out' : 'Clear Check Out'}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#F1F5F9',
                      border: 'none',
                      color: '#64748B',
                      display: 'grid',
                      placeItems: 'center',
                      padding: 0,
                      cursor: 'pointer',
                    }}
                  >
                    <X size={12} weight="bold" />
                  </button>
                )}
              </div>
            </div>
          </div>

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
              <span>Notes</span>
              <span style={{ color: '#EF4444', marginLeft: '4px' }}>*</span>
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Input notes"
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
          STICKY FOOTER (MATCHING PERMIT PERMISSION STYLE)
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
          form="manual-attendance-form"
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
              aria-labelledby="manual-attendance-review-title"
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
                    id="manual-attendance-review-title"
                    style={{
                      margin: 0,
                      fontSize: '16px',
                      fontWeight: 800,
                      color: '#334155',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {isId ? 'Review Presensi Manual' : 'Review Manual Attendance'}
                  </h3>
                  <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#64748B', lineHeight: 1.4 }}>
                    {isId ? 'Pastikan data pengajuan presensi manual Anda sudah benar.' : 'Please review your manual attendance details before submitting.'}
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
                    <Clock size={20} weight="fill" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--color-secondary, #09B2FF)', marginBottom: '3px' }}>
                      Manual Attendance
                    </div>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#334155' }}>
                      {checkIn && checkOut
                        ? 'Manual Clock In & Out'
                        : checkIn
                        ? 'Manual Clock In'
                        : 'Manual Clock Out'}
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1.5px dashed #CBD5E1', margin: '2px 0' }} />

                {/* Schedule Date & Shift */}
                <div>
                  <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748B', marginBottom: '3px' }}>
                    {isId ? 'Tanggal Jadwal & Shift' : 'Schedule Date & Shift'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginTop: '3px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 600, color: '#1E293B' }}>
                      <CalendarCheck size={16} color="var(--color-secondary, #09B2FF)" />
                      {formatDisplayDate(scheduleDate)}
                    </span>
                    <span style={{ backgroundColor: '#E2E8F0', color: '#334155', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, fontSize: '11px' }}>
                      {shiftValue}
                    </span>
                  </div>
                </div>

                {/* Check In & Check Out */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748B', marginBottom: '3px' }}>
                      Check In
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                      <SignIn size={16} color={checkIn ? '#16A34A' : '#94A3B8'} weight="bold" />
                      <span style={{ fontSize: '12.5px', fontWeight: 600, color: checkIn ? '#1E293B' : '#94A3B8' }}>
                        {checkIn || '-'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748B', marginBottom: '3px' }}>
                      Check Out
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                      <SignOut size={16} color={checkOut ? '#DC2626' : '#94A3B8'} weight="bold" />
                      <span style={{ fontSize: '12.5px', fontWeight: 600, color: checkOut ? '#1E293B' : '#94A3B8' }}>
                        {checkOut || '-'}
                      </span>
                    </div>
                  </div>
                </div>

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
