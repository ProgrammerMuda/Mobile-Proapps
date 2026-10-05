import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CaretLeft, CaretRight, CaretDown, CaretUp, X } from '@phosphor-icons/react';

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

export const CustomDatePickerModal = ({
  isOpen,
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

  const monthNames = language === 'id' ? MONTH_NAMES_ID : MONTH_NAMES_EN;
  const shortMonths = language === 'id' ? SHORT_MONTHS_ID : SHORT_MONTHS_EN;
  const monthName = monthNames[currentMonth];

  const handlePrevMonth = () => {
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

  const containerTarget =
    typeof document !== 'undefined'
      ? document.getElementById('phone-screen-container') ||
        document.querySelector('.android-device-screen') ||
        document.body
      : null;

  if (!containerTarget) return null;

  return createPortal(
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: document.getElementById('phone-screen-container') ? 'absolute' : 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backdropFilter: 'blur(3px)',
      }}
    >
      <style>{`
        @keyframes datePickerFadeInScale {
          from {
            opacity: 0;
            transform: scale(0.94);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
      <div
        role="dialog"
        aria-modal="true"
        style={{
          width: '100%',
          maxWidth: '324px',
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '20px 18px 18px',
          boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.2), 0 8px 16px -4px rgba(15, 23, 42, 0.1)',
          border: '1px solid #E2E8F0',
          boxSizing: 'border-box',
          animation: 'datePickerFadeInScale 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
          userSelect: 'none',
        }}
      >
        {/* Header: Month & Year + Chevrons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '18px',
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
            <span style={{ fontSize: '18px', fontWeight: 600, color: '#334155', letterSpacing: '-0.2px' }}>
              {monthName} {currentYear}
            </span>
            {showMonthYearPicker ? (
              <CaretUp size={14} weight="bold" color="#64748B" />
            ) : (
              <CaretDown size={14} weight="bold" color="#64748B" />
            )}
          </button>

          {/* Navigation Arrows */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              type="button"
              onClick={handlePrevMonth}
              aria-label="Previous Month"
              style={{
                width: '32px',
                height: '32px',
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
              <CaretLeft size={16} weight="bold" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="Next Month"
              style={{
                width: '32px',
                height: '32px',
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Year selector bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
              <button
                type="button"
                onClick={() => setViewDate((prev) => ({ ...prev, year: prev.year - 1 }))}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748B',
                  padding: '4px 8px',
                  borderRadius: '6px',
                }}
              >
                <CaretLeft size={16} weight="bold" />
              </button>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#334155' }}>{currentYear}</span>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {shortMonths.map((mShort, idx) => {
                const isCurrentMonth = idx === currentMonth;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setViewDate((prev) => ({ ...prev, month: idx }));
                      setShowMonthYearPicker(false);
                    }}
                    style={{
                      padding: '10px 4px',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: isCurrentMonth ? '#053079' : '#F8FAFC',
                      color: isCurrentMonth ? '#FFFFFF' : '#334155',
                      fontSize: '13px',
                      fontWeight: isCurrentMonth ? 700 : 500,
                      cursor: 'pointer',
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
                marginBottom: '12px',
              }}
            >
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                <div
                  key={idx}
                  style={{
                    fontSize: '13px',
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
                  return <div key={item.key} style={{ height: '38px' }} />;
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
                      height: '38px',
                    }}
                  >
                    <button
                      type="button"
                      disabled={isDisabled}
                      onClick={() => {
                        onSelect(item.dateString);
                      }}
                      style={{
                        width: '34px',
                        height: '34px',
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
                        fontSize: '15px',
                        fontWeight: isSelected ? 700 : 400,
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? '0 2px 8px rgba(5, 48, 121, 0.35)' : 'none',
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
                marginTop: '16px',
                paddingTop: '12px',
                borderTop: '1px solid #F1F5F9',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                  onSelect(todayStr);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '13px',
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
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#64748B',
                  cursor: 'pointer',
                  padding: '4px 6px',
                  borderRadius: '6px',
                }}
              >
                {language === 'id' ? 'Batal' : 'Cancel'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    containerTarget
  );
};

export default CustomDatePickerModal;
