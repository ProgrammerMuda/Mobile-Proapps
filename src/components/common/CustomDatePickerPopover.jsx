import React, { useState, useEffect } from 'react';
import { CaretLeft, CaretRight, CaretDown, CaretUp } from '@phosphor-icons/react';

const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_NAMES_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const SHORT_MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const SHORT_MONTHS_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export const CustomDatePickerPopover = ({
  isOpen,
  align = 'left',
  value,
  minDate,
  onSelect,
  onClose,
  language = 'id',
}) => {
  const [viewDate, setViewDate] = useState(() => {
    if (value && value.includes('-')) {
      const parts = value.split('-');
      if (parts.length === 3) {
        return { year: parseInt(parts[0], 10), month: parseInt(parts[1], 10) - 1 };
      }
    }
    const today = new Date();
    return { year: today.getFullYear(), month: today.getMonth() };
  });

  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowMonthYearPicker(false);
      if (value && value.includes('-')) {
        const parts = value.split('-');
        if (parts.length === 3) {
          setViewDate({ year: parseInt(parts[0], 10), month: parseInt(parts[1], 10) - 1 });
          return;
        }
      }
      const today = new Date();
      setViewDate({ year: today.getFullYear(), month: today.getMonth() });
    }
  }, [isOpen, value]);

  if (!isOpen) return null;

  const currentYear = viewDate.year;
  const currentMonth = viewDate.month;

  let minYear = null;
  let minMonth = null;
  if (minDate && minDate.includes('-')) {
    const parts = minDate.split('-');
    if (parts.length === 3) {
      minYear = parseInt(parts[0], 10);
      minMonth = parseInt(parts[1], 10) - 1;
    }
  }

  const isPrevDisabled = minYear !== null && (currentYear < minYear || (currentYear === minYear && currentMonth <= minMonth));

  const monthNames = language === 'id' ? MONTH_NAMES_ID : MONTH_NAMES_EN;
  const shortMonths = language === 'id' ? SHORT_MONTHS_ID : SHORT_MONTHS_EN;
  const monthName = monthNames[currentMonth];

  const handlePrevMonth = () => {
    if (isPrevDisabled) return;
    setViewDate((prev) => {
      const y = prev.month === 0 ? prev.year - 1 : prev.year;
      const m = prev.month === 0 ? 11 : prev.month - 1;
      return { year: y, month: m };
    });
  };

  const handleNextMonth = () => {
    setViewDate((prev) => {
      const y = prev.month === 11 ? prev.year + 1 : prev.year;
      const m = prev.month === 11 ? 0 : prev.month + 1;
      return { year: y, month: m };
    });
  };

  // Build calendar grid
  // Days of week: Monday=0, Tuesday=1, ..., Sunday=6 (Matches M T W T F S S in reference)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const dayOfWeek = firstDayOfMonth.getDay(); // 0 is Sun, 1 is Mon...
  const leadingBlankCount = (dayOfWeek + 6) % 7; // ISO week: Monday is 0

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const calendarDays = [];

  // 1. Leading blank days (matching screenshot where top-left days before 1st are blank)
  for (let i = 0; i < leadingBlankCount; i++) {
    calendarDays.push({
      key: `blank-${i}`,
      isBlank: true,
    });
  }

  // 2. Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isDisabled = minDate ? dateString < minDate : false;
    const isSelected = value === dateString;

    calendarDays.push({
      key: `curr-${d}`,
      dayNumber: d,
      dateString,
      isCurrentMonth: true,
      isDisabled,
      isSelected,
    });
  }

  // 3. Trailing next month days (light grey numbers at the bottom, matching screenshot)
  const totalCells = calendarDays.length;
  const rowsNeeded = Math.ceil(totalCells / 7);
  const targetCells = rowsNeeded * 7;
  const trailingCount = targetCells - totalCells;

  for (let d = 1; d <= trailingCount; d++) {
    const nextMonthObj = new Date(currentYear, currentMonth + 1, d);
    const dateString = `${nextMonthObj.getFullYear()}-${String(nextMonthObj.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isDisabled = minDate ? dateString < minDate : false;

    calendarDays.push({
      key: `next-${d}`,
      dayNumber: d,
      dateString,
      isCurrentMonth: false,
      isNextMonth: true,
      isDisabled,
    });
  }

  return (
    <>
      {/* Invisible backdrop to close popover when tapping outside */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 60,
          background: 'transparent',
        }}
      />

      {/* Popover Card directly underneath the input */}
      <div
        role="dialog"
        aria-modal="false"
        style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          [align === 'right' ? 'right' : 'left']: 0,
          width: '304px',
          maxWidth: 'calc(100vw - 32px)',
          zIndex: 70,
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '16px 14px 12px',
          boxShadow: '0 12px 30px -4px rgba(15, 23, 42, 0.18), 0 4px 10px -2px rgba(15, 23, 42, 0.08)',
          border: '1px solid #E2E8F0',
          boxSizing: 'border-box',
          animation: 'datePickerPopoverSlide 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
          userSelect: 'none',
        }}
      >
        <style>{`
          @keyframes datePickerPopoverSlide {
            from {
              opacity: 0;
              transform: translateY(-6px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>

        {/* Header: Month & Year + Chevrons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '14px',
          }}
        >
          {/* Month Year toggle button */}
          <button
            type="button"
            onClick={() => setShowMonthYearPicker(!showMonthYearPicker)}
            style={{
              background: 'none',
              border: 'none',
              padding: '4px 6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              borderRadius: '8px',
              color: '#334155',
            }}
          >
            <span style={{ fontSize: '16px', fontWeight: 600, color: '#334155', letterSpacing: '-0.2px' }}>
              {monthName} {currentYear}
            </span>
            {showMonthYearPicker ? (
              <CaretUp size={14} weight="bold" color="#64748B" />
            ) : (
              <CaretDown size={14} weight="bold" color="#64748B" />
            )}
          </button>

          {/* Navigation Arrows */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <button
              type="button"
              disabled={isPrevDisabled}
              onClick={handlePrevMonth}
              aria-label="Previous Month"
              style={{
                width: '30px',
                height: '30px',
                background: 'none',
                border: 'none',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isPrevDisabled ? 'not-allowed' : 'pointer',
                color: isPrevDisabled ? '#CBD5E1' : '#64748B',
                opacity: isPrevDisabled ? 0.35 : 1,
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!isPrevDisabled) e.currentTarget.style.backgroundColor = '#F1F5F9';
              }}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <CaretLeft size={16} weight="bold" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="Next Month"
              style={{
                width: '30px',
                height: '30px',
                background: 'none',
                border: 'none',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748B',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <CaretRight size={16} weight="bold" />
            </button>
          </div>
        </div>

        {/* View Mode: Month/Year Selector or Calendar Grid */}
        {showMonthYearPicker ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Year selector bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
              <button
                type="button"
                disabled={minYear !== null && currentYear <= minYear}
                onClick={() => {
                  if (minYear !== null && currentYear <= minYear) return;
                  setViewDate((prev) => ({ ...prev, year: prev.year - 1 }));
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: minYear !== null && currentYear <= minYear ? 'not-allowed' : 'pointer',
                  color: minYear !== null && currentYear <= minYear ? '#CBD5E1' : '#64748B',
                  opacity: minYear !== null && currentYear <= minYear ? 0.35 : 1,
                  padding: '4px 8px',
                  borderRadius: '6px',
                }}
              >
                <CaretLeft size={16} weight="bold" />
              </button>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#334155' }}>{currentYear}</span>
              <button
                type="button"
                onClick={() => setViewDate((prev) => ({ ...prev, year: prev.year + 1 }))}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748B',
                  padding: '4px 8px',
                  borderRadius: '6px',
                }}
              >
                <CaretRight size={16} weight="bold" />
              </button>
            </div>

            {/* 12 Months Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {shortMonths.map((mShort, idx) => {
                const isCurrentMonth = idx === currentMonth;
                const isPastMonth = minYear !== null && (currentYear < minYear || (currentYear === minYear && idx < minMonth));
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isPastMonth}
                    onClick={() => {
                      if (isPastMonth) return;
                      setViewDate((prev) => ({ ...prev, month: idx }));
                      setShowMonthYearPicker(false);
                    }}
                    style={{
                      padding: '8px 4px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: isCurrentMonth ? '#053079' : isPastMonth ? '#F8FAFC' : '#F8FAFC',
                      color: isCurrentMonth ? '#FFFFFF' : isPastMonth ? '#CBD5E1' : '#334155',
                      fontSize: '12px',
                      fontWeight: isCurrentMonth ? 700 : 500,
                      cursor: isPastMonth ? 'not-allowed' : 'pointer',
                      opacity: isPastMonth ? 0.5 : 1,
                      transition: 'all 0.15s',
                    }}
                  >
                    {mShort}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            {/* Weekday Row (M T W T F S S) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                textAlign: 'center',
                marginBottom: '10px',
              }}
            >
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                <div
                  key={idx}
                  style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#64748B',
                    lineHeight: 1,
                  }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '2px 0',
                textAlign: 'center',
              }}
            >
              {calendarDays.map((item) => {
                if (item.isBlank) {
                  return <div key={item.key} style={{ height: '34px' }} />;
                }

                const isSelected = item.isSelected;
                const isDisabled = item.isDisabled;

                return (
                  <div
                    key={item.key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '34px',
                    }}
                  >
                    <button
                      type="button"
                      disabled={isDisabled}
                      onClick={() => {
                        if (isDisabled) return;
                        onSelect(item.dateString);
                      }}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        border: 'none',
                        outline: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        // Primary color #053079 when selected
                        backgroundColor: isSelected ? '#053079' : 'transparent',
                        color: isSelected
                          ? '#FFFFFF'
                          : item.isCurrentMonth
                          ? isDisabled
                            ? '#CBD5E1'
                            : '#334155'
                          : '#CBD5E1', // Next month days in light grey matching screenshot
                        fontSize: '14px',
                        fontWeight: isSelected ? 700 : 400,
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? '0 2px 6px rgba(5, 48, 121, 0.35)' : 'none',
                        padding: 0,
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected && !isDisabled && item.isCurrentMonth) {
                          e.currentTarget.style.backgroundColor = '#F1F5F9';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      {item.dayNumber}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions Footer */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '12px',
                paddingTop: '10px',
                borderTop: '1px solid #F1F5F9',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                  if (minDate && todayStr < minDate) return;
                  onSelect(todayStr);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#053079',
                  cursor: 'pointer',
                  padding: '4px 6px',
                  borderRadius: '6px',
                }}
              >
                {language === 'id' ? 'Hari ini' : 'Today'}
              </button>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#64748B',
                  cursor: 'pointer',
                  padding: '4px 6px',
                  borderRadius: '6px',
                }}
              >
                {language === 'id' ? 'Tutup' : 'Close'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CustomDatePickerPopover;
